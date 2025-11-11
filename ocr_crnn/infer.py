import cv2
import torch
import numpy as np
import os
from models.model import CRNN
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
idx_to_char = {i+1: c for i, c in enumerate(alphabet)}

def ctc_decode(pred):
    pred = pred.argmax(2)           # [T, B]
    pred = pred[:, 0].cpu().numpy() # batch=1

    result = ""
    previous = -1

    for p in pred:
        if p != previous and p != 0:
            result += idx_to_char[p]
        previous = p
    return result

def ocr_plate(img, model):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img, (160, 32)).astype(np.float32) / 255.0
    img = torch.tensor(img).unsqueeze(0).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        preds = model(img)
    text = ctc_decode(preds)
    return text

# Sửa đổi ctc_decode để xử lý batch
def ctc_decode_batch(preds):
    preds = preds.permute(1, 0, 2).argmax(2) # [B, T]
    preds = preds.cpu().numpy()

    batch_results = []
    for p_sequence in preds:
        result = ""
        previous = -1
        for p in p_sequence:
            if p != previous and p != 0:
                result += idx_to_char[p]
            previous = p
        batch_results.append(result)
    return batch_results

# Hàm OCR batch mới
def ocr_plate_batch(image_list, ocr_model):
    batch_tensors = []

    # 1. Chuẩn bị từng ảnh và gộp thành list
    for img in image_list:
        img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img_resized = cv2.resize(img_gray, (160, 48)).astype(np.float32) / 255.0
        img_tensor = torch.tensor(img_resized).unsqueeze(0) # [1, 32, 160]
        batch_tensors.append(img_tensor)

    # 2. Stack thành 1 batch tensor duy nhất
    # [N, 1, 32, 160]
    batch = torch.stack(batch_tensors).to(DEVICE).half()

    # 3. Chạy model 1 lần duy nhất
    with torch.no_grad():
        preds = ocr_model(batch) # preds sẽ có shape [T, B, C]

    # 4. Decode batch results
    # Sửa lại hàm ctc_decode để nhận batch
    texts = ctc_decode_batch(preds)
    return texts

if __name__ == "__main__":
    model = CRNN(48, 1, len(alphabet) + 1)
    checkpoint = torch.load("models/best_model.pth", map_location="cpu")
    model_state_dict = checkpoint['model_state_dict']  # Lấy riêng trạng thái của model
    model.load_state_dict(model_state_dict)

    model.eval()
    image_path = "D:/cameraAI/ocr_crnn/dataset/val/images/type1_065_lp.jpg"
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read image {image_path}")
    text = ocr_plate(img)
    print(f"Image: {os.path.basename(image_path)}")
    print(f"Predicted Text: {text}")