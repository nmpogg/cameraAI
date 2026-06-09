# 🚗 CameraAI - Red Light Violation Detection System

A comprehensive AI-powered system for detecting and recording traffic violations, specifically designed to identify vehicles running red lights and extract their license plate information.

## 📋 Project Overview

This project combines multiple deep learning models to:
1. **Detect vehicles** in traffic camera feeds using YOLOv8
2. **Recognize license plates** in detected vehicles
3. **Extract license plate text** using CRNN (Convolutional Recurrent Neural Network) with OCR
4. **Detect traffic light states** to identify when vehicles cross the stop line during red lights
5. **Track violations** and save evidence (images) of traffic offenders

## 🎯 Key Features

- ✅ Real-time vehicle detection and tracking
- ✅ Automatic license plate recognition and OCR
- ✅ Traffic light state detection (red, green, yellow)
- ✅ Intelligent violation detection using dual stop lines (main + failsafe)
- ✅ Vehicle plate caching for optimization
- ✅ Batch OCR processing for efficiency
- ✅ Violation image capture and organization by timestamp
- ✅ Multi-model inference pipeline

## 📁 Project Structure

```
cameraAI/
├── main.py                 # 🚀 Main inference script
├── roi.py                  # Tool to select ROI for traffic light detection
├── app/                    # Web application interface
│   ├── index.html
│   └── script.js
├── ocr_crnn/               # OCR model for license plate text extraction
│   ├── models/
│   │   └── model.py        # CRNN model architecture
│   ├── infer.py            # Inference function for OCR
│   ├── train.py            # Training script
│   ├── test_model.py
│   ├── dataloader/
│   └── utils/
├── cv2_knn/                # KNN-based license plate recognition (alternative approach)
│   ├── btl_xla_knn.py
│   ├── BTL_XLA_KNN.ipynb
│   └── classifications.txt
├── stream-video/           # Video streaming utilities
├── utils/                  # Helper functions
│   └── utils.py            # Drawing and visualization utilities
└── demo_line.png           # Demo image for reference
```

## 🔧 Required Models

The system requires the following pre-trained models (must be placed in the project root):

1. **best_detect_ve.pt** - YOLOv8 vehicle detection model
2. **best_detect_license.pt** - YOLOv8 license plate detection model
3. **best_detect_light.pt** - YOLOv8 traffic light detection model
4. **ocr_crnn.pth** - CRNN model for license plate OCR

## 🚀 Quick Start

### Prerequisites

```bash
# Python 3.8+
# GPU support (CUDA) recommended for better performance

# Install dependencies:
pip install opencv-python
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install ultralytics
pip install numpy
```

### Basic Usage

1. **Place your video file** in the project directory
   ```python
   # Edit main.py - Line 19
   VIDEO_SOURCE = "your_video.mp4"  # or camera index (0, 1, etc.)
   ```

2. **Configure models** (Lines 16-18)
   ```python
   MODEL_DET_VEHICLE = "best_detect_ve.pt"
   MODEL_DET_LICENSE = "best_detect_license.pt"
   MODEL_DET_LIGHT = "best_detect_light.pt"
   ```

3. **Set up traffic light ROI** using the roi.py tool
   ```bash
   python roi.py
   # Follow on-screen instructions to draw ROI around traffic light
   # Copy the output coordinates to main.py (Line 79)
   ```

4. **Configure stop lines** (Lines 93-99)
   ```python
   # Main stop line
   STOP_LINE_Y = 850
   STOP_LINE_X1 = 1194
   STOP_LINE_X2 = 2502
   
   # Failsafe line (backup detection)
   FAILSAFE_LINE_Y = 620
   FAILSAFE_LINE_X1 = 1299
   FAILSAFE_LINE_X2 = 2610
   ```

5. **Run the detection**
   ```bash
   python main.py
   ```

6. **Violation data** will be saved in:
   ```
   run/violations_YYYY-MM-DD_HH-MM-SS/
   ├── id_1_plate_ABC123.jpg
   ├── id_2_plate_XYZ789.jpg
   └── ...
   ```

## 📊 Algorithm Details

### Vehicle Detection Flow

```
Video Frame
    ↓
YOLOv8 Vehicle Detection (conf=0.20)
    ↓
Track Vehicle (Multi-Object Tracking)
    ↓
Check Against Stop Lines
    ↓
Extract License Plate Region
    ↓
License Plate Detection (YOLOv8)
    ↓
OCR with CRNN Model
    ↓
Cache Plate Results
    ↓
Check Violation Conditions
    ↓
Save Violation Evidence
```

### Violation Detection Logic

A vehicle is flagged as a violator when:
1. **Traffic light is RED**
2. **Vehicle crosses STOP_LINE** (changes from BEHIND → PASSED)
3. **Vehicle has valid tracking ID** (not -1)
4. **Vehicle not already recorded as violator**

**Failsafe mechanism:** If vehicle passes failsafe line with significant depth change (y1 - first_frame > 250px), mark as violator even if stop line wasn't clear.

### License Plate Recognition

- Crops are processed in **batches** for efficiency
- Results are **cached** using tracking ID to avoid re-processing
- OCR results are "locked" when:
  - Vehicle is sufficiently within frame (y1 ≤ THRESHOLD_OCR)
  - OCR result is non-empty
  - Vehicle has valid tracking ID

## ⚙️ Configuration Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `IMG_SIZE` | 640 | Input size for YOLOv8 models |
| `DEVICE` | "cuda" | Device for inference (cuda/cpu) |
| `SHOW_WINDOW` | False | Display video in real-time |
| `THRESHOLD_OCR` | 1266 | Y-coordinate threshold for locking plates |
| `TRAFFIC_LIGHT_ROI` | (2904, 234, 2958, 390) | ROI for traffic light detection |
| `STOP_LINE_Y` | 850 | Y-coordinate of stop line |
| `STOP_LINE_X1/X2` | 1194/2502 | X-coordinate boundaries |

## 📦 Output

### Output Directory Structure
```
run/violations_YYYY-MM-DD_HH-MM-SS/
├── id_1_plate_ABC123.jpg        # Vehicle image with violation
├── id_2_plate_DEF456.jpg
└── ...
```

### Console Output
```
Frame 1
[VI PHẠM] ID: 24 (Biển số: ABC123) đã vượt đèn đỏ
[INFO] Đã LOCK biển số ABC123 cho ID 24
...
```

## 🛠️ Additional Tools

### ROI Selection Tool (`roi.py`)
Used to interactively select the Region of Interest (ROI) for traffic light detection:
- Run: `python roi.py`
- Click and drag to select area
- Press ENTER to confirm or 'c' to cancel
- Outputs coordinates in original image resolution

## 🌐 Web Interface

The `app/` directory contains a web interface for visualization and control. Access through `index.html` for real-time monitoring capabilities.

## 📝 Model Training

- **OCR Training**: See `ocr_crnn/train.py`
- **License Plate Detection**: Uses transfer learning with YOLOv8
- **Vehicle Detection**: Uses transfer learning with YOLOv8

## ⚡ Performance Tips

1. **Use GPU**: Set `DEVICE = "cuda"` for ~10x speedup
2. **Batch Processing**: OCR processes multiple plates together
3. **Plate Caching**: Avoids re-processing same vehicle
4. **Confidence Threshold**: Adjust `conf=0.20` in Line 157 based on accuracy needs
5. **Failsafe Lines**: Dual stop line detection catches near-misses

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Không mở được video" | Check VIDEO_SOURCE path, ensure file exists |
| Models not found | Verify model files in project root with correct names |
| CUDA/GPU errors | Check PyTorch installation: `pip install torch --index-url ...` |
| Low OCR accuracy | Adjust THRESHOLD_OCR or check license plate detection |
| Missing violations | Verify STOP_LINE coordinates match video ROI |

## 📚 Dependencies

- `OpenCV (cv2)` - Video processing and drawing
- `PyTorch` - Deep learning framework
- `Ultralytics (YOLO)` - Object detection models
- `NumPy` - Numerical operations
- `CUDA` (optional) - GPU acceleration

## 📄 License

This project is developed for traffic management and law enforcement purposes.

## 👥 Contributors

Project developed as part of XLA program (2025-2026)

---

**Last Updated**: June 2026  
**Status**: Active Development
