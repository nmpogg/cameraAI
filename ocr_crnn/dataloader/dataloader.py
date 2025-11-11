import os
import cv2
import torch
import pandas as pd
from torch.utils.data import Dataset
import numpy as np
import albumentations as A
from albumentations.pytorch import ToTensorV2

class PlateDataset(Dataset):
    def __init__(self, root, labels_path, img_h=48, img_w=160, 
                 alphabet="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", is_train=True):
        self.root = root
        self.img_h = img_h
        self.img_w = img_w
        self.alphabet = alphabet
        self.is_train = is_train

        self.char_to_idx = {c: i+1 for i, c in enumerate(alphabet)}

        # Read CSV
        df = pd.read_csv(labels_path)
        self.samples = []
        for _, row in df.iterrows():
            self.samples.append((row['Name'], row['Label'].strip()))

        # Data Augmentation cho training
        if is_train:
            self.transform = A.Compose([
                A.OneOf([
                    A.MotionBlur(blur_limit=3, p=1.0),
                    A.GaussianBlur(blur_limit=3, p=1.0),
                    A.MedianBlur(blur_limit=3, p=1.0),
                ], p=0.3),
                
                A.OneOf([
                    A.GaussNoise(var_limit=(10.0, 50.0), mean=0, p=1.0),
                    A.ISONoise(p=1.0),
                ], p=0.3),
                
                A.RandomBrightnessContrast(
                    brightness_limit=0.2,
                    contrast_limit=0.2,
                    p=0.5
                ),
                
                A.OneOf([
                    A.Sharpen(alpha=(0.2, 0.5), lightness=(0.5, 1.0), p=1.0),
                    A.Emboss(alpha=(0.2, 0.5), strength=(0.2, 0.7), p=1.0),
                ], p=0.2),
                
                A.Perspective(scale=(0.05, 0.1), p=0.3),
                
                A.Affine(
                    scale=(0.9, 1.1),
                    translate_percent={"x": (-0.1, 0.1), "y": (-0.05, 0.05)},
                    rotate=(-3, 3),
                    shear=(-5, 5),
                    p=0.5
                ),
                
                A.CoarseDropout(
                    min_holes=1,
                    max_holes=3,
                    min_height=2,
                    max_height=4,
                    min_width=2,
                    max_width=4,
                    fill_value=0,
                    p=0.5,
                ),
            ])
        else:
            self.transform = None

    def encode_label(self, text):
        text = text.replace(" ", "").upper().replace("Đ", "D")
        return [self.char_to_idx[c] for c in text]

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        filename, label = self.samples[idx]
        img_path = os.path.join(self.root, filename)

        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError(f"Image not found: {img_path}")

        # Resize
        img = cv2.resize(img, (self.img_w, self.img_h))

        # Some albumentations transforms expect 3-channel RGB/BGR images.
        # Our dataset is grayscale, so convert to BGR before augmentation,
        # then convert back to grayscale after augmentation.
        if self.transform is not None:
            img_bgr = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
            augmented = self.transform(image=img_bgr)
            img = augmented['image']
            # If augmentation returned a 3-channel image, convert back to gray
            if img.ndim == 3 and img.shape[2] == 3:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Normalize
        img = img.astype(np.float32) / 255.0
        
        # To tensor
        img = torch.tensor(img).unsqueeze(0)

        # Process label
        processed_label = label.replace(" ", "").upper().replace("Đ", "D")
        # Use long (int64) for labels and lengths to be compatible with PyTorch losses
        label_encoded = torch.tensor(self.encode_label(processed_label), dtype=torch.long)
        label_length = torch.tensor([len(label_encoded)], dtype=torch.long)

        return img, label_encoded, label_length, processed_label