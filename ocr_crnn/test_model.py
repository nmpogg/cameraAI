import cv2
import os
import numpy as np
import torch
from models.model import CRNN

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

def ocr_plate(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img, (160, 32)).astype(np.float32) / 255.0
    img = torch.tensor(img).unsqueeze(0).unsqueeze(0)

    with torch.no_grad():
        preds = model(img)
    text = ctc_decode(preds)
    return text

def test_single_image(image_path):
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read image {image_path}")
        return
    text = ocr_plate(img)
    print(f"Image: {os.path.basename(image_path)}")
    print(f"Predicted Text: {text}")

def test_validation_set():
    val_dir = "dataset/val/images"
    if not os.path.exists(val_dir):
        print(f"Validation directory not found: {val_dir}")
        return

    print("\nTesting on validation set...")
    print("-" * 50)
    
    total = 0
    for img_name in os.listdir(val_dir):
        if img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
            img_path = os.path.join(val_dir, img_name)
            img = cv2.imread(img_path)
            if img is None:
                print(f"Could not read image: {img_path}")
                continue
                
            text = ocr_plate(img)
            print(f"Image: {img_name}")
            print(f"Predicted: {text}")
            print("-" * 30)
            
            total += 1
            if total >= 5:  # Test first 5 images by default
                break

if __name__ == "__main__":
    # First test validation set
    model = CRNN(32, 1, len(alphabet) + 1)
    checkpoint = torch.load("models/best_model.pth", map_location="cpu")
    model_state_dict = checkpoint['model_state_dict']  # Lấy riêng trạng thái của model
    model.load_state_dict(model_state_dict)

    model.eval()

    test_validation_set()
    
    # You can also test a specific image by uncommenting below:
    # test_single_image("path/to/your/image.jpg")