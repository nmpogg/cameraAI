#!/bin/bash

# Thư mục chứa các video gốc
INPUT_DIR="videos_input" 
# Thư mục chứa các file HLS đã xử lý
OUTPUT_DIR="hls-output" 

# Đảm bảo thư mục output tồn tại
mkdir -p "$OUTPUT_DIR"

# Lặp qua tất cả các file .mp4 trong thư mục input
for video_file in "$INPUT_DIR"/*.mp4; do
    # Lấy tên file không có đuôi mở rộng (ví dụ: output_demo2p)
    base_name=$(basename "$video_file" .mp4)
    
    # Tạo thư mục con riêng biệt cho mỗi video HLS
    HLS_OUTPUT_PATH="$OUTPUT_DIR/$base_name"
    mkdir -p "$HLS_OUTPUT_PATH"
    
    echo "--- Bắt đầu xử lý video: $base_name ---"
    
    # Lệnh FFmpeg chính (lệnh của bạn đã được điều chỉnh)
    ffmpeg -i "$video_file" \
     -vf "scale=w=1280:h=720:force_original_aspect_ratio=decrease" \
     -c:a aac -ar 48000 -b:a 128k \
     -c:v h264 -profile:v main -crf 20 -sc_threshold 0 \
     -g 48 -keyint_min 48 \
     -hls_time 10 -hls_playlist_type vod \
     -hls_segment_filename "$HLS_OUTPUT_PATH/segment_%03d.ts" \
     "$HLS_OUTPUT_PATH/playlist.m3u8"
     
    # Sau khi xử lý xong, bạn có thể chuyển file gốc đi nơi khác (ví dụ: thư mục 'processed')
    # mv "$video_file" processed/

done

echo "--- Hoàn tất xử lý tất cả video ---"