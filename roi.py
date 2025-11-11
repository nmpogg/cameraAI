import cv2
import sys

# ==========================
# CẤU HÌNH
# ==========================
# ⭐️ THAY ĐƯỜNG DẪN VIDEO CỦA BẠN VÀO ĐÂY
VIDEO_PATH = "video/camera.mp4"

# Chiều rộng tối đa của cửa sổ (để vừa màn hình)
MAX_WINDOW_WIDTH = 1280
# ==========================


# Mở video
cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print(f"Lỗi: Không thể mở video tại: {VIDEO_PATH}")
    sys.exit()

# Đọc frame đầu tiên
ok, frame = cap.read()
if not ok:
    print("Lỗi: Không thể đọc frame từ video.")
    sys.exit()

# Đóng video, chúng ta chỉ cần 1 frame
cap.release()

# Lấy kích thước gốc
(orig_h, orig_w) = frame.shape[:2]

# Tính toán tỷ lệ resize để cửa sổ vừa màn hình
if orig_w > MAX_WINDOW_WIDTH:
    scale = MAX_WINDOW_WIDTH / float(orig_w)
    width = MAX_WINDOW_WIDTH
    height = int(orig_h * scale)
    frame_resized = cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA)
else:
    scale = 1.0
    frame_resized = frame

print("====================================================================")
print("               HƯỚNG DẪN CHỌN VÙNG ROI (ĐÈN GIAO THÔNG)")
print("====================================================================")
print(" 1. Một cửa sổ video ('Chon ROI') sẽ hiện lên.")
print(" 2. Dùng chuột CLICK và KÉO để vẽ một hình chữ nhật bao quanh đèn.")
print(" 3. Sau khi vẽ xong, nhấn phím ENTER hoặc SPACE để xác nhận.")
print(" 4. Nhấn phím 'c' để hủy bỏ và vẽ lại.")
print(" 5. Tọa độ (x1, y1, x2, y2) sẽ được in ra ở terminal này.")
print("--------------------------------------------------------------------")

# Mở cửa sổ chọn ROI (Region of Interest)
# Cửa sổ này sẽ hiển thị frame đã resize
roi = cv2.selectROI("Chon ROI (Nhan ENTER de xac nhan, 'c' de ve lai)", 
                    frame_resized, 
                    fromCenter=False, 
                    showCrosshair=True)

# Đóng cửa sổ sau khi chọn
cv2.destroyAllWindows()

# Kiểm tra nếu người dùng hủy
if roi == (0, 0, 0, 0):
    print("Bạn đã hủy chọn ROI. Thoát.")
    sys.exit()

# Lấy tọa độ (x, y, w, h) từ ROI
(x, y, w, h) = roi

# ⭐️ QUAN TRỌNG: Scale tọa độ về kích thước ảnh GỐC
orig_x = int(x / scale)
orig_y = int(y / scale)
orig_w = int(w / scale)
orig_h = int(h / scale)

# Chuyển đổi sang (x1, y1, x2, y2)
x1 = orig_x
y1 = orig_y
x2 = orig_x + orig_w
y2 = orig_y + orig_h

print("\n--- KẾT QUẢ ---")
print(f"Tọa độ đã chọn (trên ảnh resize): (x={x}, y={y}, w={w}, h={h})")
print(f"Tỷ lệ scale áp dụng: {scale:.4f}")
print(f"Tọa độ GỐC (x1, y1, x2, y2): ({x1}, {y1}, {x2}, {y2})")
print("\n====================================================================")
print("⭐️ Hãy copy dòng sau vào code chính của bạn (file main):")
print(f"TRAFFIC_LIGHT_ROI = ({x1}, {y1}, {x2}, {y2})")
print("====================================================================")