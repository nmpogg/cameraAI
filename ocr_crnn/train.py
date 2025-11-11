import torch
from torch.utils.data import DataLoader
from torch import nn
from tqdm import tqdm
from models.model import CRNN
from dataloader.dataloader import PlateDataset
from utils.plot import save_loss_plots

alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

    # Dataset với augmentation
train_data = PlateDataset(
    root="/kaggle/input/data-ocr-clean-v2/data_ocr_v2/train/images/",
    labels_path="/kaggle/input/data-ocr-clean-v2/data_ocr_v2/train/labels.csv",
    img_h=48,
    img_w=160,
        alphabet=alphabet,
        is_train=True  # Enable augmentation
    )

val_data = PlateDataset(
    root="/kaggle/input/data-ocr-clean-v2/data_ocr_v2/val/images/",
    labels_path="/kaggle/input/data-ocr-clean-v2/data_ocr_v2/val/labels.csv",
    img_h=48,
    img_w=160,
    alphabet=alphabet,
    is_train=False  # No augmentation for validation
)

def collate_fn(batch):
    batch.sort(key=lambda x: len(x[1]), reverse=True)

    imgs = []
    labels = []
    label_lengths = []

    for img, label_encoded, label_len, _ in batch:
        imgs.append(img)
        labels.append(label_encoded)
        label_lengths.append(label_len)

    imgs = torch.stack(imgs)
    labels = torch.cat(labels)
    label_lengths = torch.cat(label_lengths)

    # Tính đúng timesteps: width sau các maxpool
    # 160 / (2*2*1*1*1) = 40 timesteps
    max_width = imgs.size(3)  # 160
    timesteps = max_width // 4  # = 40
    pred_lengths = torch.full((len(batch),), timesteps, dtype=torch.long)

    return imgs, labels, label_lengths, pred_lengths

    # Dataloader - giảm num_workers cho Windows hoặc bỏ pin_memory nếu không dùng GPU
num_workers = 0 if device == "cpu" else 2  # Windows multiprocessing issue
pin_memory = device == "cuda"
    
train_loader = DataLoader(train_data, batch_size=64, shuffle=True, 
                              collate_fn=collate_fn, num_workers=num_workers, 
                              pin_memory=pin_memory)
val_loader = DataLoader(val_data, batch_size=64, shuffle=False, 
                            collate_fn=collate_fn, num_workers=num_workers, 
                            pin_memory=pin_memory)

    # Model
model = CRNN(img_h=48, n_channels=1, n_classes=len(alphabet) + 1).to(device)

    # Loss và Optimizer
criterion = nn.CTCLoss(blank=0, zero_infinity=True, reduction='mean')
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-4)

    # Learning rate scheduler
scheduler = torch.optim.lr_scheduler.OneCycleLR(
        optimizer,
        max_lr=1e-3,
        epochs=100,
        steps_per_epoch=len(train_loader),
        pct_start=0.1,
        anneal_strategy='cos',
        div_factor=25.0,
        final_div_factor=1000.0
    )

# Hoặc dùng ReduceLROnPlateau
# scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
#     optimizer, mode='max', factor=0.5, patience=5, verbose=True
# )

def decode_predictions(preds, alphabet):
    with torch.no_grad():
        probs = preds.softmax(2)
        best_paths = probs.argmax(2)  # [T, B]
        best_paths = best_paths.transpose(0, 1).cpu()
        decoded_preds = []

        for pred in best_paths:
            text = ""
            last_char = None

            for c in pred:
                c = c.item()
                if c != 0:  # not blank
                    if c != last_char:  # not repeated
                        if 0 <= c-1 < len(alphabet):
                            text += alphabet[c-1]
                last_char = c

            decoded_preds.append(text)

        return decoded_preds

def calculate_accuracy(preds, targets, target_lengths):
    decoded_preds = decode_predictions(preds, alphabet)
    correct_chars = 0
    total_chars = 0
    exact_match = 0
    total_samples = 0
    
    if torch.is_tensor(target_lengths):
        target_lengths = target_lengths.tolist()
    if torch.is_tensor(targets):
        targets = targets.cpu().tolist()
    
    pos = 0
    for pred, length in zip(decoded_preds, target_lengths):
        target_seq = targets[pos:pos+length]
        true_text = "".join([alphabet[i-1] for i in target_seq])

        # Character accuracy
        min_len = min(len(pred), len(true_text))
        for p_char, t_char in zip(pred[:min_len], true_text[:min_len]):
            if p_char == t_char:
                correct_chars += 1
        total_chars += max(len(pred), len(true_text))
        
        # Exact match accuracy
        if pred == true_text:
            exact_match += 1
        total_samples += 1

        pos += length

    char_acc = correct_chars / total_chars if total_chars > 0 else 0
    exact_acc = exact_match / total_samples if total_samples > 0 else 0
    return char_acc, exact_acc

def evaluate(model, loader, criterion):
    model.eval()
    total_loss = 0.0
    total_char_acc = 0.0
    total_exact_acc = 0.0
    n_batches = 0

    with torch.no_grad():
        val_bar = tqdm(loader, total=len(loader), desc="Val", leave=False)
        for imgs, labels, label_lengths, _ in val_bar:
            imgs = imgs.to(device)
            labels = labels.to(device)
            label_lengths = label_lengths.to(device)

            preds = model(imgs)
            T, B, C = preds.size()
            preds_log = preds.log_softmax(2)
            pred_lengths = torch.full((B,), T, dtype=torch.long, device=device)

            loss = criterion(preds_log, labels, pred_lengths, label_lengths)
            char_acc, exact_acc = calculate_accuracy(preds, labels, label_lengths)

            total_loss += loss.item()
            total_char_acc += char_acc
            total_exact_acc += exact_acc
            n_batches += 1
            
            val_bar.set_postfix(
                loss=f"{total_loss/n_batches:.4f}",
                char_acc=f"{total_char_acc/n_batches:.2%}",
                exact_acc=f"{total_exact_acc/n_batches:.2%}"
            )

    avg_loss = total_loss / n_batches if n_batches > 0 else 0.0
    avg_char_acc = total_char_acc / n_batches if n_batches > 0 else 0.0
    avg_exact_acc = total_exact_acc / n_batches if n_batches > 0 else 0.0
    return avg_loss, avg_char_acc, avg_exact_acc

# Training
best_accuracy = 0
best_exact_accuracy = 0
patience = 30
patience_counter = 0

epochs = 100
train_losses = []
val_losses = []
for epoch in range(epochs):
    model.train()
    total_loss = 0
    n_batches = 0
    
    train_bar = tqdm(train_loader, total=len(train_loader), 
                     desc=f"Epoch {epoch+1}/{epochs}", unit="batch")
    
    for imgs, labels, label_lengths, _ in train_bar:
        imgs = imgs.to(device)
        labels = labels.to(device)
        label_lengths = label_lengths.to(device)

        # Forward
        preds = model(imgs)
        T, B, C = preds.size()
        preds_log = preds.log_softmax(2)
        pred_lengths = torch.full((B,), T, dtype=torch.long, device=device)
        loss = criterion(preds_log, labels, pred_lengths, label_lengths)

        # Backward
        optimizer.zero_grad()
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 5.0)
        optimizer.step()
        scheduler.step()  # Update learning rate

        total_loss += loss.item()
        n_batches += 1
        
        train_bar.set_postfix({
            'loss': f"{total_loss/n_batches:.4f}",
            'lr': f"{scheduler.get_last_lr()[0]:.2e}"
        })

    # Validation
    avg_train_loss = total_loss / n_batches
    val_loss, val_char_acc, val_exact_acc = evaluate(model, val_loader, criterion)
    
    print(f"\nEpoch {epoch+1}/{epochs}")
    print(f"Train Loss: {avg_train_loss:.4f}")
    print(f"Val Loss: {val_loss:.4f} | Char Acc: {val_char_acc:.2%} | Exact Acc: {val_exact_acc:.2%}")
    # Save history for plotting
    train_losses.append(avg_train_loss)
    val_losses.append(val_loss)

    # Save plots after each epoch into ./plots
    try:
        saved = save_loss_plots(train_losses, val_losses, out_dir="plots", prefix="loss")
    except Exception as e:
        print(f"Warning: could not save plots: {e}")
    
    # Save best model theo character-level accuracy (thường ổn định hơn exact match)
    if val_char_acc > best_accuracy:
        best_accuracy = val_char_acc
        best_exact_accuracy = val_exact_acc
        patience_counter = 0

        torch.save({
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'scheduler_state_dict': scheduler.state_dict(),
            'val_loss': val_loss,
            'val_char_acc': val_char_acc,
            'val_exact_acc': val_exact_acc,
        }, "best_model.pth")
        print(f"✓ Saved best_model.pth - Char Acc: {best_accuracy:.2%}")
    else:
        patience_counter += 1
        print(f"No improvement. Patience: {patience_counter}/{patience}")
    
    # Early stopping
    if patience_counter >= patience:
        print(f"\nEarly stopping at epoch {epoch+1}")
        break

print(f"\nTraining complete!")
print(f"Best Char Accuracy: {best_accuracy:.2%}")
print(f"Best Exact Accuracy: {best_exact_accuracy:.2%}")