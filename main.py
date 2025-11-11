import cv2
import torch
import os
from datetime import datetime
from ocr_crnn.models.model import CRNN
from ultralytics import YOLO
from ocr_crnn.infer import ocr_plate_batch
from utils.utils import draw_box, get_traffic_light_state_manual

alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
idx_to_char = {i+1: c for i, c in enumerate(alphabet)}

# ==========================
# CẤU HÌNH
# ==========================
MODEL_DET_VEHICLE = "best_detect_ve.pt"
MODEL_DET_LICENSE = "best_detect_license.pt"
MODEL_DET_LIGHT = "best_detect_light.pt"
VIDEO_SOURCE = "demo2p.mp4"
OUTPUT_PATH = "/content/drive/MyDrive/output_demo.mp4"
IMG_SIZE = 640
DEVICE = "cuda"
SHOW_WINDOW = False

print(torch.cuda.is_available())
print(torch.version.cuda)


def main():
    # Tạo thư mục lưu vi phạm
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    folder_path = os.path.join("run", f"violations_{timestamp}")
    os.makedirs(folder_path, exist_ok=True) 

    source = int(VIDEO_SOURCE) if VIDEO_SOURCE.isdigit() else VIDEO_SOURCE

    model_det_veh = YOLO(MODEL_DET_VEHICLE)
    if DEVICE:
        model_det_veh.to(DEVICE)
        print("Đã tải xong model DETECT phương tiện...")

    model_det_license = YOLO(MODEL_DET_LICENSE)
    if DEVICE:
        model_det_license.to(DEVICE)
        print("Đã tải xong model DETECT biển số xe...")

    ocr_model = CRNN(48, 1, len(alphabet) + 1)
    checkpoint = torch.load("ocr_crnn.pth", map_location=DEVICE)
    model_state_dict = checkpoint.get('model_state_dict', checkpoint)
    ocr_model.load_state_dict(model_state_dict)
    ocr_model.to(DEVICE)
    ocr_model.eval()
    print("Đã tải xong model OCR...")

    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        print("Không mở được video.")
        return


    writer = None
    if OUTPUT_PATH:
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        fps = cap.get(cv2.CAP_PROP_FPS)
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        print(h, w)
        writer = cv2.VideoWriter(OUTPUT_PATH, fourcc, fps, (w, h))


    #ngưỡng dừng OCR
    THRESHOLD_OCR = 1266

    # ==========================
    # THIẾT LẬP LOGIC ĐÈN ĐỎ
    # ==========================
    # vị trí đèn giao thông
    # TRAFFIC_LIGHT_ROI = (2436, 231, 2486, 396) # cut
    TRAFFIC_LIGHT_ROI = (2904, 234, 2958, 390) # full screen

    # Trạng thái đèn cuối cùng (để dự phòng nếu mờ)
    last_light_state = "green"

    #cut
    # STOP_LINE_Y = 850
    # STOP_LINE_X1 = 736
    # STOP_LINE_X2 = 2016

    # FAILSAFE_LINE_Y = 620  # Ví dụ: Sâu hơn vạch 1 (858)
    # FAILSAFE_LINE_X1 = 838 # Ví dụ: Rộng hơn vạch 1 (736)
    # FAILSAFE_LINE_X2 = 2121 # Ví dụ: Rộng hơn vạch 1 (2016)
    #full frame
    STOP_LINE_Y = 850
    STOP_LINE_X1 = 1194
    STOP_LINE_X2 = 2502

    FAILSAFE_LINE_Y = 620  # Ví dụ: Sâu hơn vạch 1 (858)
    FAILSAFE_LINE_X1 = 1299 # Ví dụ: Rộng hơn vạch 1 (736)
    FAILSAFE_LINE_X2 = 2610 # Ví dụ: Rộng hơn vạch 1 (2016)

    # Set để lưu các ID đã vi phạm
    violators = set()

    # Lưu vị trí của xe so với vạch
    # Key: track_id, Value: "BEHIND" hoặc "PASSED"
    vehicle_positions = {}
    vehicle_positions_2 = {}


    frame_count = 0
    #biển số đã ocr thành công
    locked_plates = {}
    names = model_det_veh.model.names

    #duyệt từng frame
    first_frame = {}
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        frame_count += 1
        frame_to_draw = frame.copy()
        print(f'Frame {frame_count}')

        # trạng thái đèn
        state = get_traffic_light_state_manual(frame, TRAFFIC_LIGHT_ROI)

        if state != 'off':
            current_light_state = state
            last_light_state = state # Cập nhật trạng thái cuối cùng
        else:
            # Nếu không nhận diện được (bị chói, mờ), dùng trạng thái cuối
            current_light_state = last_light_state

        # Xác định trạng thái True/False
        IS_LIGHT_RED = (current_light_state == 'red')

        # Vẽ vạch dừng và trạng thái
        if IS_LIGHT_RED:
            line_color = (0, 0, 255)
        elif current_light_state == 'green':
            line_color = (0, 255, 0)
        else: line_color = (0, 255, 255)

        # cv2.line(frame_to_draw, (STOP_LINE_X1, STOP_LINE_Y), (STOP_LINE_X2, STOP_LINE_Y), line_color, 2) # (độ dày 3)

        failsafe_color = (0, 255, 255) # Màu vàng
        # cv2.line(frame_to_draw, (FAILSAFE_LINE_X1, FAILSAFE_LINE_Y), (FAILSAFE_LINE_X2, FAILSAFE_LINE_Y), failsafe_color, 2)

        # Vẽ ROI đèn
        x1, y1, x2, y2 = TRAFFIC_LIGHT_ROI
        cv2.rectangle(frame_to_draw, (x1, y1), (x2, y2), line_color, 2)
        cv2.putText(frame_to_draw, f"{current_light_state.upper()}", (x1, y1 - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.75, line_color, 2)

        # gọi model nhận diện phương tiện
        results = model_det_veh.track(frame, imgsz=IMG_SIZE, persist=True, verbose=False, conf=0.20)[0]

        boxes = results.boxes.xyxy.cpu().numpy()
        scores = results.boxes.conf.cpu().numpy()
        classes = results.boxes.cls.cpu().numpy()

        tracker_ids = results.boxes.id
        if tracker_ids is not None:
            ids = tracker_ids.cpu().numpy()
        else:
            ids = [-1] * len(boxes)

        # CHIA XE THÀNH 2 NHÓM
        plate_crops_batch = []
        vehicle_data_pending_ocr = [] # Xe chờ OCR

        for i, (x1, y1, x2, y2) in enumerate(boxes):
            x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
            track_id = int(ids[i])
            cls_id = int(classes[i])
            cls_name = names[int(classes[i])]
            conf = scores[i]
            if track_id not in first_frame:
                first_frame[track_id] = y1
            # Dữ liệu cơ bản của xe
            vehicle_data = {
                "box": (x1, y1, x2, y2),
                "cls_name": cls_name,
                "cls_id": cls_id,
                "track_id": track_id
            }

            # KIỂM TRA VI PHẠM
            y_center_bottom = (y1 + y2) // 2
            x_center_bottom = (x1 + x2) // 2
            # có gần vạch Y ko
            is_crossing_y = 0 <= STOP_LINE_Y - y_center_bottom < 15
            # có nằm trong đoạn X ko
            is_within_x_segment = (x_center_bottom >= STOP_LINE_X1) and (x_center_bottom <= STOP_LINE_X2)

            # nếu xe có trạng thái trước là chưa vượt, frame sau đi qua vạch thì tính là vượt đèn đỏ
            current_pos_status = "PASSED" if (is_crossing_y and is_within_x_segment) else "BEHIND"
            previous_pos_status = vehicle_positions.get(track_id, "NONE") # Mặc định là BEHIND

            is_crossing_y_2 = 0 <= FAILSAFE_LINE_Y - y_center_bottom < 20
            is_within_x_2 = (x_center_bottom >= FAILSAFE_LINE_X1) and (x_center_bottom <= FAILSAFE_LINE_X2)
            current_pos_status_2 = "PASSED_2" if (is_crossing_y_2 and is_within_x_2) else "BEHIND_2"
            previous_pos_status_2 = vehicle_positions_2.get(track_id, "BEHIND_2")

            # if(track_id == 24):
            #   print('vị trí hiện tại x, y:', x_center_bottom, y_center_bottom)
            #   print('vạch 1: x1, x2, y', STOP_LINE_Y, STOP_LINE_X1, STOP_LINE_X2)
            #   print('vạch 2: x1, x2, y', FAILSAFE_LINE_Y, FAILSAFE_LINE_X1, FAILSAFE_LINE_X2)
            #   print('kc firrst frame' ,y1-first_frame.get(track_id))
            #   print(current_pos_status, previous_pos_status, current_pos_status_2, previous_pos_status_2)



            # Kiểm tra vi phạm
            if (IS_LIGHT_RED and
                current_pos_status == "PASSED" and
                previous_pos_status == "BEHIND" and
                track_id != -1 and
                track_id not in violators):

                # -> Đây là VI PHẠM, Xe vừa vượt vạch khi đèn đỏ
                violators.add(track_id)
                plate = locked_plates.get(track_id, "Chua_doc_duoc")
                print(f"[VI PHẠM] ID: {track_id} (Biển số: {plate}) đã vượt đèn đỏ")

                # Lưu ảnh xe vi phạm
                violation_crop = frame[y1:y2, x1:x2]
                cv2.imwrite(os.path.join(folder_path, f"id_{track_id}_plate_{plate}.jpg"), violation_crop)

            elif (IS_LIGHT_RED and
                current_pos_status_2 == "PASSED_2" and
                previous_pos_status_2 == "BEHIND_2" and
                track_id != -1 and
                first_frame.get(track_id) - y1 > 250 and
                track_id not in violators):
                
                violators.add(track_id)
                violation_found = True # Đã tìm thấy vi phạm
                plate = locked_plates.get(track_id, "Chua_doc_duoc")
                print(f"[VI PHẠM - VẠCH 2] ID: {track_id} (Biển số: {plate}) đã VƯỢT VẠCH (bắt lọt)")
                violation_crop = frame[y1:y2, x1:x2]
                cv2.imwrite(os.path.join(folder_path, f"id_{track_id}_plate_{plate}.jpg"), violation_crop)

            
            if track_id != -1:
                vehicle_positions[track_id] = current_pos_status
                vehicle_positions_2[track_id] = current_pos_status_2
            # KIỂM TRA CACHE TRƯỚC
            if track_id != -1 and track_id in locked_plates:
                # Nếu đã có trong cache -> Lấy kết quả và thêm vào list "locked"
                vehicle_data["plate_text"] = locked_plates[track_id]
                draw_box(frame_to_draw, vehicle_data["box"], vehicle_data["cls_name"], vehicle_data["track_id"], vehicle_data["plate_text"], violators_set=violators)

                # Đây chính là bước tối ưu: Bỏ qua seg và OCR
                continue

            # Nếu không có trong cache, chạy detect biển
            vehicle_crop = frame[y1:y2, x1:x2]
            results_license = model_det_license(vehicle_crop, imgsz=640, verbose=False)[0]

            lp_boxes = results_license.boxes.xyxy.cpu().numpy()
            if len(lp_boxes) == 0:
                # Không có biển số -> Vẽ luôn với biển = None
                vehicle_data["plate_text"] = None
                draw_box(frame_to_draw, vehicle_data["box"], vehicle_data["cls_name"], vehicle_data["track_id"], vehicle_data["plate_text"], violators_set=violators)
            else:
                # Có biển số -> Thêm vào list chờ OCR
                px1, py1, px2, py2 = map(int, lp_boxes[0])
                px1 += x1; px2 += x1
                py1 += y1; py2 += y1

                plate_crop = frame[py1:py2, px1:px2]

                # Kiểm tra xem ảnh crop có bị rỗng không
                # if plate_crop.size == 0:
                #     # Nếu rỗng, coi như không tìm thấy biển
                #     vehicle_data["plate_text"] = None
                #     draw_box(frame, vehicle_data["box"], vehicle_data["cls_name"], vehicle_data["track_id"], vehicle_data["plate_text"])
                # else:
                #     # Nếu không rỗng, thêm vào batch để xử lý
                #     plate_crops_batch.append(plate_crop)
                #     vehicle_data_pending_ocr.append(vehicle_data)

                # Thêm vào danh sách batch
                plate_crops_batch.append(plate_crop)
                vehicle_data_pending_ocr.append(vehicle_data)


        # CHẠY BATCH OCR (CHỈ TRÊN XE CHƯA LOCK BIỂN)
        if plate_crops_batch:
            texts = ocr_plate_batch(plate_crops_batch, ocr_model)

            # Lặp qua kết quả OCR
            for data, text in zip(vehicle_data_pending_ocr, texts):
                track_id = data["track_id"]
                cls_id = data["cls_id"]

                # KIỂM TRA ĐIỀU KIỆN "LOCK"
                x1, y1, x2, y2 = data["box"]

                # Nếu cạnh dưới (y2) của box vượt qua 1/3 bên dưới VÀ có text VÀ có track_id
                if y1 <= THRESHOLD_OCR and text and track_id != -1:
                    # Kiểm tra xem có đang LOCK 1 biển số rỗng hay không
                    if not locked_plates.get(track_id): # Chỉ in/lưu nếu chưa bị lock
                        locked_plates[track_id] = text
                        print(f"[INFO] Đã LOCK biển số {text} cho ID {track_id}")

                # Vẽ kết quả những xe chưa LOCK
                draw_box(frame_to_draw, data["box"], data["cls_name"], track_id, text, violators_set=violators)



        # Save video
        if writer:
            writer.write(frame_to_draw)

        # Show
        if SHOW_WINDOW:
            cv2.imshow("YOLOv8 Detection", frame_to_draw)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
    if writer:
        writer.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()