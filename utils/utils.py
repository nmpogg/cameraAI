import cv2
import numpy as np

def draw_box(frame, box, cls_name, track_id, plate_text=None, violators_set=None):
    x1, y1, x2, y2 = map(int, box)

    # ⭐️ KIỂM TRA VI PHẠM ⭐️
    is_violator = (violators_set is not None) and (track_id in violators_set)
    
    # ⭐️ CHỌN MÀU SẮC ⭐️
    color_dot = (80, 80, 80)       # Xám
    color_label_bg = (80, 80, 80) # Xám
    
    if is_violator:
        color_dot = (0, 0, 255)       # Đỏ
        color_label_bg = (0, 0, 200)  # Đỏ đậm

    # === Tâm ===
    cx = int((x1 + x2) / 2)
    cy = int((y1 + y2) / 2)
    cv2.circle(frame, (cx, cy), 4, color_dot, -1)
    cv2.circle(frame, (cx, cy), 2, (255, 255, 255), -1)

    # label
    lines = []
    if track_id != -1:
      lines.append(f"id:{int(track_id)}")
    lines.append(cls_name)
    if plate_text:
      lines.append(f"BKS:{plate_text}")
    # ⭐️ Thêm nhãn vi phạm
    if is_violator:
        lines.append("!!! VI PHAM !!!")

    # vị trí nhãn
    label_x = cx + 15
    label_y = cy - 15

    # leader line
    cv2.line(frame, (cx, cy), (label_x, label_y), (80, 80, 80), 1)

    # === tính kích thước text ===
    max_w = 0
    line_height = 0
    for line in lines:
        (w, h), baseline = cv2.getTextSize(line, cv2.FONT_HERSHEY_DUPLEX, 0.75, 1)
        max_w = max(max_w, w)
        line_height = max(line_height, h + baseline)

    total_h = line_height * len(lines) + 6

    rect_x1 = label_x - 4
    rect_y2 = label_y + 4
    rect_x2 = label_x + max_w + 4
    rect_y1 = label_y - total_h

    cv2.rectangle(frame, (rect_x1, rect_y1), (rect_x2, rect_y2), color_label_bg, -1)

    # === Vẽ từng dòng ===
    y_offset = rect_y1 + line_height
    for line in lines:
        cv2.putText(frame, line, (rect_x1 + 4, y_offset),
                    cv2.FONT_HERSHEY_DUPLEX, 0.75, (255,255,255), 1, cv2.LINE_AA)
        y_offset += line_height


def get_traffic_light_state_manual(frame, roi):
    """
    Phân tích ROI đèn giao thông thủ công bằng CV2
    Trả về: 'red', 'yellow', 'green', hoặc 'off'
    """
    x1, y1, x2, y2 = roi
    
    # 1. Crop ROI
    light_roi = frame[y1:y2, x1:x2]
    if light_roi.size == 0:
        return 'off' # ROI nằm ngoài khung hình
        
    # 2. Chuyển sang HSV
    hsv = cv2.cvtColor(light_roi, cv2.COLOR_BGR2HSV)
    
    # 3. Định nghĩa dải màu HSV
    # ⭐️ BẠN CÓ THỂ CẦN TÙY CHỈNH CÁC DẢI MÀU NÀY ⭐️
    
    # Đỏ (màu đỏ thường wrap-around 0 và 180)
    lower_red1 = np.array([0, 70, 70])
    upper_red1 = np.array([10, 255, 255])
    lower_red2 = np.array([170, 70, 70])
    upper_red2 = np.array([180, 255, 255])
    
    # Vàng
    lower_yellow = np.array([20, 70, 70])
    upper_yellow = np.array([35, 255, 255])
    
    # Xanh
    lower_green = np.array([40, 70, 70])
    upper_green = np.array([90, 255, 255]) # Mở rộng dải màu xanh
    
    # 4. Tạo mặt nạ (mask)
    red_mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    red_mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    red_mask = red_mask1 + red_mask2
    
    yellow_mask = cv2.inRange(hsv, lower_yellow, upper_yellow)
    green_mask = cv2.inRange(hsv, lower_green, upper_green)
    
    # 5. Đếm số pixel sáng
    red_pixels = cv2.countNonZero(red_mask)
    yellow_pixels = cv2.countNonZero(yellow_mask)
    green_pixels = cv2.countNonZero(green_mask)

    MIN_PIXEL_THRESHOLD = 50 
    
    pixel_counts = {
        "red": red_pixels,
        "yellow": yellow_pixels,
        "green": green_pixels
    }
    
    # Tìm màu có nhiều pixel nhất
    max_color = max(pixel_counts, key=pixel_counts.get)
    
    if pixel_counts[max_color] > MIN_PIXEL_THRESHOLD:
        return max_color
    else:
        return 'off' # Không có đèn nào sáng rõ