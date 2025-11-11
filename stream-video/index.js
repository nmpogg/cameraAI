// server.js
const express = require("express");
const path = require("path");
const cors = require("cors"); // Thư viện để xử lý lỗi CORS

const app = express();
const port = 3000;

// 1. Kích hoạt CORS
// Cần thiết để HLS.js (từ client) có thể gọi video từ server
app.use(cors());

// 2. Phục vụ các file HLS (.m3u8, .ts)
// Khi client gọi '/hls/playlist.m3u8', server sẽ vào thư mục 'hls-output'
const hlsPath = path.join(__dirname, "hls-output");
app.use("/hls", express.static(hlsPath));

// 3. Phục vụ file HTML (và các file khác trong thư mục 'public')
// Đây là file index.html để người dùng xem
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// 4. Khởi động server
app.listen(port, () => {
    console.log(`Server HLS đang chạy!`);
    console.log(`  - Trang xem video: http://localhost:${port}`);
    console.log(
        `  - File manifest HLS: http://localhost:${port}/hls/playlist.m3u8`
    );
});
