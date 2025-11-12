console.log("Script.js loading...");

// ========================================
// HỆ THỐNG PHÁT HIỆN VƯỢT ĐÈN ĐỎ - JAVASCRIPT
// ========================================

class TrafficViolationSystem {
    constructor(videoPath = "video.mp4") {
        console.log("🚀 Initializing TrafficViolationSystem...");
        console.log("📊 Generating sample data...");
        this.violations = this.generateSampleData();
        console.log(`✅ Generated ${this.violations.length} violations`);
        this.filteredViolations = [...this.violations];
        this.currentVideoTime = 0;
        this.isVideoPlaying = false;
        this.videoPath = videoPath;

        console.log("🔧 Starting initialization...");
        this.init();
    }

    // Khởi tạo hệ thống
    init() {
        console.log("Setting up system...");
        // Bỏ thiết lập điều khiển video và mô phỏng

        try {
            this.setupSearchAndFilter();
        } catch (error) {
            console.error("Error setting up search and filter:", error);
        }

        try {
            this.setupModal();
        } catch (error) {
            console.error("Error setting up modal:", error);
        }

        try {
            this.updateCurrentTime();
        } catch (error) {
            console.error("Error updating time:", error);
        }

        // Đảm bảo renderViolations luôn được gọi
        try {
            this.renderViolations();
        } catch (error) {
            console.error("Error rendering violations:", error);
        }

        console.log("System initialized successfully!");
        console.log("Violations data:", this.violations);

        // Cập nhật thời gian mỗi giây
        setInterval(() => {
            try {
                this.updateCurrentTime();
            } catch (error) {
                console.error("Error updating time:", error);
            }
        }, 1000);
    }

    // Tạo dữ liệu mẫu cho demo
    generateSampleData() {
        return [
            {
                id: 1837,
                licensePlate: "20RD-03920",
                time: "2025-11-10T08:15:22",
                location: "Ngã tư Võ Chí Công - Hoàng Quốc Việt",
                speed: "48 km/h",
                vehicle: {
                    brand: "Honda",
                    model: "Vision",
                    color: "Xám",
                    type: "Xe máy",
                    year: "2021",
                    engine: "110cc",
                    seats: 2,
                    fuel: "Xăng",
                    power: "8.8 HP",
                    chassis: "RLHJF921XMY012345",
                    engineNumber: "JF921E-1012345",
                    regNumber: "20RD-03920",
                    certNumber: "TG/2021/008765",
                    regOffice: "Phòng CSGT Thái Nguyên",
                    regDate: "10/05/2021",
                    expDate: "10/05/2026",
                    purpose: "Cá nhân",
                    condition: "Bình thường",
                    insurance: "Bảo hiểm Bảo Việt",
                    insuranceExp: "10/05/2026",
                },
                owner: {
                    name: "Lê Minh Tuấn",
                    dob: "20/04/1990",
                    gender: "Nam",
                    cccd: "017090001234",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "12/03/2021",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address:
                        "Số 15, Đường Z115, Phường Tân Thịnh, TP. Thái Nguyên",
                    currentAddress:
                        "Số 15, Đường Z115, Phường Tân Thịnh, TP. Thái Nguyên",
                    phone: "0912345678",
                    email: "leminhtuan@email.com",
                    photo: 'this.generateAvatarSVG("LMT")',
                    license: "017090001234",
                    licenseClass: "A1",
                    licenseDate: "05/10/2010",
                    licensePlace: "Sở GT-VT Thái Nguyên",
                },
                image: "./run/20251111_164500/violation_id_1837_plate_20RD03920.jpg",
                status: "Chưa xử lý",
            },
            {
                id: 1898,
                licensePlate: "29G2-76162",
                time: "2025-11-10T08:18:05",
                location: "Đường Láng (đoạn gần Cầu Giấy)",
                speed: "51 km/h",
                vehicle: {
                    brand: "Honda",
                    model: "Vision",
                    color: "Đen",
                    type: "Xe máy",
                    year: "2022",
                    engine: "110cc",
                    seats: 2,
                    fuel: "Xăng",
                    power: "8.8 HP",
                    chassis: "RLHJF921XNY056789",
                    engineNumber: "JF921E-1056789",
                    regNumber: "29G2-76162",
                    certNumber: "TG/2022/019876",
                    regOffice: "Phòng CSGT Hà Nội",
                    regDate: "22/07/2022",
                    expDate: "22/07/2027",
                    purpose: "Cá nhân",
                    condition: "Bình thường",
                    insurance: "Bảo hiểm PVI",
                    insuranceExp: "22/07/2027",
                },
                owner: {
                    name: "Trần Thị Ngọc",
                    dob: "15/08/1995",
                    gender: "Nữ",
                    cccd: "001195002345",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "01/09/2021",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address: "Số 18, Ngõ 120 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
                    currentAddress:
                        "Số 18, Ngõ 120 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
                    phone: "0987654321",
                    email: "tranthungoc@email.com",
                    photo: 'this.generateAvatarSVG("TTN")',
                    license: "001195002345",
                    licenseClass: "A1",
                    licenseDate: "19/02/2015",
                    licensePlace: "Sở GT-VT Hà Nội",
                },
                image: "./run/20251111_164500/violation_id_1898_plate_29G276162.jpg",
                status: "Đã xử lý",
            },
            {
                id: 1909,
                licensePlate: "29B1-67018",
                time: "2025-11-10T08:20:11",
                location: "Ngã tư Nguyễn Trãi - Khuất Duy Tiến",
                speed: "50 km/h",
                vehicle: {
                    brand: "Honda",
                    model: "Wave",
                    color: "Trắng",
                    type: "Xe máy",
                    year: "2018",
                    engine: "110cc",
                    seats: 2,
                    fuel: "Xăng",
                    power: "8.5 HP",
                    chassis: "RLHJC601VJY123456",
                    engineNumber: "JC601E-2123456",
                    regNumber: "29B1-67018",
                    certNumber: "TG/2018/005432",
                    regOffice: "Phòng CSGT Hà Nội",
                    regDate: "01/03/2018",
                    expDate: "01/03/2023",
                    purpose: "Cá nhân",
                    condition: "Bình thường",
                    insurance: "Bảo hiểm PTI",
                    insuranceExp: "01/03/2023",
                },
                owner: {
                    name: "Nguyễn Văn Hùng",
                    dob: "10/11/1988",
                    gender: "Nam",
                    cccd: "001088003456",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "03/04/2020",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address: "Số 50, Phố Vọng, Hai Bà Trưng, Hà Nội",
                    currentAddress: "Số 50, Phố Vọng, Hai Bà Trưng, Hà Nội",
                    phone: "0905123456",
                    email: "nguyenvanhung@email.com",
                    photo: 'this.generateAvatarSVG("NVH")',
                    license: "001088003456",
                    licenseClass: "A1",
                    licenseDate: "11/07/2009",
                    licensePlace: "Sở GT-VT Hà Nội",
                },
                image: "./run/20251111_164500/violation_id_1909_plate_29B167018.jpg",
                status: "Chưa xử lý",
            },
            {
                id: 2219,
                licensePlate: "20A1-69678",
                time: "2025-11-10T08:22:45",
                location: "Đường Cách Mạng Tháng 8, TP. Thái Nguyên",
                speed: "53 km/h",
                vehicle: {
                    brand: "Honda",
                    model: "Air Blade",
                    color: "Xanh đen",
                    type: "Xe máy",
                    year: "2020",
                    engine: "125cc",
                    seats: 2,
                    fuel: "Xăng",
                    power: "11.3 HP",
                    chassis: "RLHJK821XKY234567",
                    engineNumber: "JK821E-3234567",
                    regNumber: "20A1-69678",
                    certNumber: "TG/2020/007654",
                    regOffice: "Phòng CSGT Thái Nguyên",
                    regDate: "15/09/2020",
                    expDate: "15/09/2025",
                    purpose: "Cá nhân",
                    condition: "Bình thường",
                    insurance: "Bảo hiểm Bảo Việt",
                    insuranceExp: "15/09/2025",
                },
                owner: {
                    name: "Phạm Hoài An",
                    dob: "02/01/1992",
                    gender: "Nữ",
                    cccd: "017192004567",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "20/08/2021",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address: "Số 200, Lương Ngọc Quyến, TP. Thái Nguyên",
                    currentAddress: "Số 200, Lương Ngọc Quyến, TP. Thái Nguyên",
                    phone: "0978901234",
                    email: "phamhoaian@email.com",
                    photo: 'this.generateAvatarSVG("PHA")',
                    license: "017192004567",
                    licenseClass: "A1",
                    licenseDate: "25/03/2012",
                    licensePlace: "Sở GT-VT Thái Nguyên",
                },
                image: "./run/20251111_164500/violation_id_2219_plate_20A159678.jpg",
                status: "Đã xử lý",
            },
            {
                id: 2172,
                licensePlate: "60MD-06754",
                time: "2025-11-10T08:25:10",
                location: "Ngã tư Amata, TP. Biên Hòa",
                speed: "47 km/h",
                vehicle: {
                    brand: "Vinfast",
                    model: "Fliz 5",
                    color: "Trắng",
                    type: "Xe máy điện",
                    year: "2022",
                    engine: "1.2 kW",
                    seats: 2,
                    fuel: "Điện",
                    power: "1.6 HP",
                    chassis: "VFEFLZ50XNY345678",
                    engineNumber: "VFE-E1-4345678",
                    regNumber: "60MD-06754",
                    certNumber: "TG/2022/011223",
                    regOffice: "Phòng CSGT Đồng Nai",
                    regDate: "05/11/2022",
                    expDate: "05/11/2027",
                    purpose: "Cá nhân",
                    condition: "Bình thường",
                    insurance: "Bảo hiểm MIC",
                    insuranceExp: "05/11/2027",
                },
                owner: {
                    name: "Vũ Đức Thắng",
                    dob: "12/06/1985",
                    gender: "Nam",
                    cccd: "038085005678",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "10/10/2019",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address:
                        "123/45 Đường Đồng Khởi, Phường Tân Hiệp, TP. Biên Hòa, Đồng Nai",
                    currentAddress:
                        "123/45 Đường Đồng Khởi, Phường Tân Hiệp, TP. Biên Hòa, Đồng Nai",
                    phone: "0934567890",
                    email: "vuducthang@email.com",
                    photo: 'this.generateAvatarSVG("VDT")',
                    license: "038085005678",
                    licenseClass: "A1",
                    licenseDate: "30/08/2005",
                    licensePlace: "Sở GT-VT Đồng Nai",
                },
                image: "./run/20251111_164500/violation_id_2172_plate_60MD06754.jpg",
                status: "Chưa xử lý",
            },
            {
                id: 2137,
                licensePlate: "19N1-04944",
                time: "2025-11-10T08:27:33",
                location: "Đường Hùng Vương, TP. Việt Trì",
                speed: "49 km/h",
                vehicle: {
                    brand: "Honda",
                    model: "Wave",
                    color: "Trắng",
                    type: "Xe máy",
                    year: "2019",
                    engine: "110cc",
                    seats: 2,
                    fuel: "Xăng",
                    power: "8.5 HP",
                    chassis: "RLHJC601VKZ456789",
                    engineNumber: "JC601E-2456789",
                    regNumber: "19N1-04944",
                    certNumber: "TG/2019/006543",
                    regOffice: "Phòng CSGT Phú Thọ",
                    regDate: "18/04/2019",
                    expDate: "18/04/2024",
                    purpose: "Cá nhân",
                    condition: "Bình thường",
                    insurance: "Bảo hiểm PVI",
                    insuranceExp: "18/04/2024",
                },
                owner: {
                    name: "Đặng Thị Lan",
                    dob: "25/09/1993",
                    gender: "Nữ",
                    cccd: "019193006789",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "02/07/2021",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address:
                        "Số 30, Đường Nguyễn Tất Thành, Phường Tiên Cát, TP. Việt Trì, Phú Thọ",
                    currentAddress:
                        "Số 30, Đường Nguyễn Tất Thành, Phường Tiên Cát, TP. Việt Trì, Phú Thọ",
                    phone: "0967890123",
                    email: "dangthilan@email.com",
                    photo: 'this.generateAvatarSVG("DTL")',
                    license: "019193006789",
                    licenseClass: "A1",
                    licenseDate: "10/12/2013",
                    licensePlace: "Sở GT-VT Phú Thọ",
                },
                image: "./run/20251111_164500/violation_id_2137_plate_19N104944.jpg",
                status: "Đã xử lý",
            },
            {
                id: 2350,
                licensePlate: "29MA-4604",
                time: "2025-11-10T08:30:01",
                location: "Phố Huế, Quận Hai Bà Trưng",
                speed: "52 km/h",
                vehicle: {
                    brand: "Honda",
                    model: "Spacy",
                    color: "Trắng",
                    type: "Xe máy",
                    year: "2008",
                    engine: "125cc",
                    seats: 2,
                    fuel: "Xăng",
                    power: "10 HP",
                    chassis: "RLHSD15088Y567890",
                    engineNumber: "SD150E-1567890",
                    regNumber: "29MA-4604",
                    certNumber: "TG/2008/001111",
                    regOffice: "Phòng CSGT Hà Nội",
                    regDate: "03/03/2008",
                    expDate: "03/03/2013",
                    purpose: "Cá nhân",
                    condition: "Cũ",
                    insurance: "Bảo hiểm Bảo Minh",
                    insuranceExp: "03/03/2013",
                },
                owner: {
                    name: "Hoàng Minh Quân",
                    dob: "11/02/1975",
                    gender: "Nam",
                    cccd: "001075007890",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "14/06/2018",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address: "Số 10, Phố Hàng Bài, Hoàn Kiếm, Hà Nội",
                    currentAddress: "Số 10, Phố Hàng Bài, Hoàn Kiếm, Hà Nội",
                    phone: "0903456789",
                    email: "hoangminhquan@email.com",
                    photo: 'this.generateAvatarSVG("HMQ")',
                    license: "001075007890",
                    licenseClass: "A1",
                    licenseDate: "20/05/1995",
                    licensePlace: "Sở GT-VT Hà Nội",
                },
                image: "./run/20251111_164500/violation_id_2350_plate_29MA4604.jpg",
                status: "Chưa xử lý",
            },
            {
                id: 2569,
                licensePlate: "30N8-0619",
                time: "2025-11-10T08:32:19",
                location: "Đường Xuân Thủy, Cầu Giấy",
                speed: "46 km/h",
                vehicle: {
                    brand: "Honda",
                    model: "Lead",
                    color: "Trắng",
                    type: "Xe máy",
                    year: "2017",
                    engine: "125cc",
                    seats: 2,
                    fuel: "Xăng",
                    power: "11 HP",
                    chassis: "RLHJK121VHY678901",
                    engineNumber: "JK121E-2678901",
                    regNumber: "30N8-0619",
                    certNumber: "TG/2017/004455",
                    regOffice: "Phòng CSGT Hà Nội",
                    regDate: "28/10/2017",
                    expDate: "28/10/2022",
                    purpose: "Cá nhân",
                    condition: "Bình thường",
                    insurance: "Bảo hiểm PTI",
                    insuranceExp: "28/10/2022",
                },
                owner: {
                    name: "Bùi Thu Huệ",
                    dob: "30/12/1998",
                    gender: "Nữ",
                    cccd: "001198008901",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "09/11/2022",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address:
                        "Ký túc xá Đại học Quốc Gia, 144 Xuân Thủy, Cầu Giấy, Hà Nội",
                    currentAddress:
                        "Ký túc xá Đại học Quốc Gia, 144 Xuân Thủy, Cầu Giấy, Hà Nội",
                    phone: "0945678901",
                    email: "buithuhue@email.com",
                    photo: 'this.generateAvatarSVG("BTH")',
                    license: "001198008901",
                    licenseClass: "A1",
                    licenseDate: "14/02/2018",
                    licensePlace: "Sở GT-VT Hà Nội",
                },
                image: "./run/20251111_164500/violation_id_2569_plate_30N80619.jpg",
                status: "Đã xử lý",
            },
            {
                id: 2620,
                licensePlate: "29AA-08954",
                time: "2025-11-10T08:35:00",
                location: "Hầm Kim Liên",
                speed: "48 km/h",
                vehicle: {
                    brand: "Honda",
                    model: "Wave",
                    color: "Đen",
                    type: "Xe máy",
                    year: "2020",
                    engine: "110cc",
                    seats: 2,
                    fuel: "Xăng",
                    power: "8.5 HP",
                    chassis: "RLHJC601VKY789012",
                    engineNumber: "JC601E-2789012",
                    regNumber: "29AA-08954",
                    certNumber: "TG/2020/003322",
                    regOffice: "Phòng CSGT Hà Nội",
                    regDate: "11/06/2020",
                    expDate: "11/06/2025",
                    purpose: "Cá nhân",
                    condition: "Bình thường",
                    insurance: "Bảo hiểm Bảo Việt",
                    insuranceExp: "11/06/2025",
                },
                owner: {
                    name: "Dương Văn Khải",
                    dob: "19/05/1991",
                    gender: "Nam",
                    cccd: "001091009012",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "25/07/2021",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address:
                        "Số 21, Ngõ 40 Tạ Quang Bửu, Bách Khoa, Hai Bà Trưng, Hà Nội",
                    currentAddress:
                        "Số 21, Ngõ 40 Tạ Quang Bửu, Bách Khoa, Hai Bà Trưng, Hà Nội",
                    phone: "0923456789",
                    email: "duongvankhai@email.com",
                    photo: 'this.generateAvatarSVG("DVK")',
                    license: "001091009012",
                    licenseClass: "A1",
                    licenseDate: "01/08/2011",
                    licensePlace: "Sở GT-VT Hà Nội",
                },
                image: "./run/20251111_164500/violation_id_2620_plate_29AA08954_L2.jpg",
                status: "Chưa xử lý",
            },
            {
                id: 2549,
                licensePlate: "18F1-02528",
                time: "2025-11-10T08:37:14",
                location: "Đường Trần Hưng Đạo, TP. Nam Định",
                speed: "51 km/h",
                vehicle: {
                    brand: "Honda",
                    model: "Spacy",
                    color: "Trắng",
                    type: "Xe máy",
                    year: "2007",
                    engine: "125cc",
                    seats: 2,
                    fuel: "Xăng",
                    power: "10 HP",
                    chassis: "RLHSD15087Y890123",
                    engineNumber: "SD150E-1890123",
                    regNumber: "18F1-02528",
                    certNumber: "TG/2007/002211",
                    regOffice: "Phòng CSGT Nam Định",
                    regDate: "09/09/2007",
                    expDate: "09/09/2012",
                    purpose: "Cá nhân",
                    condition: "Cũ",
                    insurance: "Bảo hiểm PVI",
                    insuranceExp: "09/09/2012",
                },
                owner: {
                    name: "Ngô Thanh Tâm",
                    dob: "08/03/1980",
                    gender: "Nữ",
                    cccd: "036180001234",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "16/04/2017",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address:
                        "Số 300, Đường Hàng Tiện, Phường Quang Trung, TP. Nam Định",
                    currentAddress:
                        "Số 300, Đường Hàng Tiện, Phường Quang Trung, TP. Nam Định",
                    phone: "0904567890",
                    email: "ngothanhtam@email.com",
                    photo: 'this.generateAvatarSVG("NTT")',
                    license: "036180001234",
                    licenseClass: "A1",
                    licenseDate: "12/10/2000",
                    licensePlace: "Sở GT-VT Nam Định",
                },
                image: "./run/20251111_164500/violation_id_2549_plate_18F102528.jpg",
                status: "Đã xử lý",
            },
            {
                id: 2861,
                licensePlate: "29C1-63811",
                time: "2025-11-10T08:40:00",
                location: "Khu đô thị Times City, Minh Khai",
                speed: "45 km/h",
                vehicle: {
                    brand: "Vinfast",
                    model: "Evo200",
                    color: "Xanh dương",
                    type: "Xe điện",
                    year: "2023",
                    engine: "2.5 kW",
                    seats: 2,
                    fuel: "Điện",
                    power: "3.3 HP",
                    chassis: "VFEVO200XPZ901234",
                    engineNumber: "VFE-E2-5901234",
                    regNumber: "29C1-63811",
                    certNumber: "TG/2023/023456",
                    regOffice: "Phòng CSGT Hà Nội",
                    regDate: "01/02/2023",
                    expDate: "01/02/2028",
                    purpose: "Cá nhân",
                    condition: "Mới",
                    insurance: "Bảo hiểm MIC",
                    insuranceExp: "01/02/2028",
                },
                owner: {
                    name: "Đỗ Gia Huy",
                    dob: "07/07/2001",
                    gender: "Nam",
                    cccd: "001201012345",
                    cccdPlace: "Cục CSQLHC về TTXH",
                    cccdDate: "15/05/2023",
                    ethnicity: "Kinh",
                    nationality: "Việt Nam",
                    address:
                        "Tòa Park 1, Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội",
                    currentAddress:
                        "Tòa Park 1, Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội",
                    phone: "0977889900",
                    email: "dogiahuy@email.com",
                    photo: 'this.generateAvatarSVG("DGH")',
                    license: "001201012345",
                    licenseClass: "A1",
                    licenseDate: "10/08/2019",
                    licensePlace: "Sở GT-VT Hà Nội",
                },
                image: "./run/20251111_164500/violation_id_2861_plate_29C163811.jpg",
                status: "Chưa xử lý",
            },
        ];
    }

    // Tạo SVG avatar cho chủ sở hữu
    generateAvatarSVG(initials) {
        const colors = [
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#FFEAA7",
            "#DDA0DD",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const svgString = `<svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="250" fill="${color}" rx="8"/>
                <text x="100" y="140" text-anchor="middle" 
                      font-family="Arial, sans-serif" 
                      font-size="48" 
                      font-weight="bold" 
                      fill="white">${initials}</text>
            </svg>`;

        // Encode Unicode đúng cách
        return `data:image/svg+xml;base64,${btoa(
            unescape(encodeURIComponent(svgString))
        )}`;
    }

    // Tạo ảnh vi phạm mẫu
    generateViolationImage(licensePlate) {
        const svgString = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#f0f0f0" rx="8"/>
                <rect x="50" y="50" width="300" height="150" fill="#333" rx="4"/>
                <text x="200" y="110" text-anchor="middle" 
                      font-family="Arial, sans-serif" 
                      font-size="32" 
                      font-weight="bold" 
                      fill="white">${licensePlate}</text>
                <text x="200" y="240" text-anchor="middle" 
                      font-family="Arial, sans-serif" 
                      font-size="16" 
                      fill="#666">Vượt đèn đỏ</text>
            </svg>`;

        // Encode Unicode đúng cách
        return `data:image/svg+xml;base64,${btoa(
            unescape(encodeURIComponent(svgString))
        )}`;
    }

    // Thiết lập điều khiển video
    setupVideoControls() {
        const video = document.getElementById("surveillance-video");
        const playPauseBtn = document.getElementById("play-pause-btn");
        const playPauseIcon = document.getElementById("play-pause-icon");
        const mainPlayPause = document.getElementById("main-play-pause");
        const mainPlayIcon = document.getElementById("main-play-icon");
        const progressBar = document.getElementById("progress-bar");
        const videoTime = document.getElementById("video-time");
        const videoOverlay = document.getElementById("video-overlay");
        const volumeBtn = document.getElementById("volume-btn");
        const volumeIcon = document.getElementById("volume-icon");
        const fullscreenBtn = document.getElementById("fullscreen-btn");
        const fullscreenIcon = document.getElementById("fullscreen-icon");
        const videoContainer = document.querySelector(".video-container");

        // Load video từ đường dẫn
        this.loadVideo(video);

        // Khởi tạo volume
        this.isMuted = video.muted;
        this.volume = video.volume;

        // Nút play/pause chính
        const togglePlayPause = () => {
            if (this.isVideoPlaying) {
                video.pause();
                playPauseIcon.className = "fas fa-play text-2xl";
                mainPlayIcon.className = "fas fa-play text-lg";
                this.isVideoPlaying = false;
            } else {
                video.play();
                playPauseIcon.className = "fas fa-pause text-2xl";
                mainPlayIcon.className = "fas fa-pause text-lg";
                this.isVideoPlaying = true;
            }
        };

        // Toggle volume (mute/unmute)
        const toggleVolume = () => {
            if (video.muted) {
                video.muted = false;
                volumeIcon.className = "fas fa-volume-up text-sm";
            } else {
                video.muted = true;
                volumeIcon.className = "fas fa-volume-mute text-sm";
            }
            this.isMuted = video.muted;
        };

        // Toggle fullscreen
        const toggleFullscreen = () => {
            if (
                !document.fullscreenElement &&
                !document.webkitFullscreenElement &&
                !document.mozFullScreenElement &&
                !document.msFullscreenElement
            ) {
                // Vào fullscreen
                if (videoContainer.requestFullscreen) {
                    videoContainer.requestFullscreen();
                } else if (videoContainer.webkitRequestFullscreen) {
                    videoContainer.webkitRequestFullscreen();
                } else if (videoContainer.mozRequestFullScreen) {
                    videoContainer.mozRequestFullScreen();
                } else if (videoContainer.msRequestFullscreen) {
                    videoContainer.msRequestFullscreen();
                } else if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.mozRequestFullScreen) {
                    video.mozRequestFullScreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                }
            } else {
                // Thoát fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        };

        // Cập nhật icon fullscreen
        const updateFullscreenIcon = () => {
            if (fullscreenIcon) {
                if (
                    document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement
                ) {
                    fullscreenIcon.className = "fas fa-compress text-sm";
                } else {
                    fullscreenIcon.className = "fas fa-expand text-sm";
                }
            }
        };

        // Sự kiện click
        playPauseBtn.addEventListener("click", togglePlayPause);
        mainPlayPause.addEventListener("click", togglePlayPause);
        videoOverlay.addEventListener("click", togglePlayPause);

        if (volumeBtn) {
            volumeBtn.addEventListener("click", toggleVolume);
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener("click", toggleFullscreen);
        }

        // Double click để vào fullscreen
        video.addEventListener("dblclick", toggleFullscreen);
        if (videoContainer) {
            videoContainer.addEventListener("dblclick", (e) => {
                if (e.target !== video) {
                    toggleFullscreen();
                }
            });
        }

        // Phím tắt: F11 hoặc F để vào fullscreen, Space để play/pause, M để mute
        document.addEventListener("keydown", (e) => {
            // Không xử lý nếu đang focus vào input
            if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA"
            ) {
                return;
            }

            if (e.key === "f" || e.key === "F" || e.key === "F11") {
                e.preventDefault();
                toggleFullscreen();
            } else if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                togglePlayPause();
            } else if (e.key === "m" || e.key === "M") {
                e.preventDefault();
                toggleVolume();
            }
        });

        // Video events
        video.addEventListener("timeupdate", () => {
            this.currentVideoTime = video.currentTime;
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = progress + "%";

            // Cập nhật thời gian hiển thị
            const current = this.formatTime(video.currentTime);
            const duration = this.formatTime(video.duration);
            videoTime.textContent = `${current} / ${duration}`;
        });

        video.addEventListener("play", () => {
            this.isVideoPlaying = true;
            playPauseIcon.className = "fas fa-pause text-2xl";
            mainPlayIcon.className = "fas fa-pause text-lg";
        });

        video.addEventListener("pause", () => {
            this.isVideoPlaying = false;
            playPauseIcon.className = "fas fa-play text-2xl";
            mainPlayIcon.className = "fas fa-play text-lg";
        });

        // Ẩn overlay khi video bắt đầu phát
        video.addEventListener("play", () => {
            if (videoOverlay) {
                videoOverlay.style.opacity = "0";
            }
        });

        // Hiển thị overlay khi video dừng
        video.addEventListener("pause", () => {
            if (videoOverlay) {
                videoOverlay.style.opacity = "1";
            }
        });

        // Cập nhật volume icon khi volume thay đổi
        const updateVolumeIcon = () => {
            if (!volumeIcon) return;
            if (video.muted || video.volume === 0) {
                volumeIcon.className = "fas fa-volume-mute text-sm";
            } else if (video.volume < 0.5) {
                volumeIcon.className = "fas fa-volume-down text-sm";
            } else {
                volumeIcon.className = "fas fa-volume-up text-sm";
            }
        };

        video.addEventListener("volumechange", updateVolumeIcon);

        // Cập nhật icon volume khi trang load
        updateVolumeIcon();

        // Xử lý thay đổi fullscreen (cập nhật icon và ẩn/hiện overlay)
        const handleFullscreenChange = () => {
            updateFullscreenIcon();
            if (videoOverlay) {
                const isFullscreen = !!(
                    document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement
                );
                if (isFullscreen) {
                    videoOverlay.style.display = "none";
                } else {
                    videoOverlay.style.display = "flex";
                }
            }
        };

        // Fullscreen change events (hỗ trợ đa trình duyệt)
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener(
            "webkitfullscreenchange",
            handleFullscreenChange
        );
        document.addEventListener(
            "mozfullscreenchange",
            handleFullscreenChange
        );
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    }

    // Load video từ đường dẫn
    loadVideo(video) {
        if (!video) {
            console.error("Video element not found");
            return;
        }

        // Đặt đường dẫn video
        const source = video.querySelector("source");
        if (source) {
            source.src = this.videoPath;
            video.load(); // Tải lại video với đường dẫn mới
            console.log(`✅ Video loaded from: ${this.videoPath}`);
        } else {
            // Nếu không có thẻ source, tạo mới
            const newSource = document.createElement("source");
            newSource.src = this.videoPath;
            newSource.type = "video/mp4";
            video.appendChild(newSource);
            video.load();
            console.log(
                `✅ Video source created and loaded from: ${this.videoPath}`
            );
        }

        // Xử lý lỗi khi không tải được video
        const errorHandler = (e) => {
            console.error("Error loading video:", e);
            console.error(`Video path: ${this.videoPath}`);

            const error = video.error;
            if (error) {
                let errorMessage = "Không thể tải video";
                switch (error.code) {
                    case error.MEDIA_ERR_ABORTED:
                        errorMessage = "Video bị hủy tải";
                        break;
                    case error.MEDIA_ERR_NETWORK:
                        errorMessage = "Lỗi mạng khi tải video";
                        break;
                    case error.MEDIA_ERR_DECODE:
                        errorMessage = "Lỗi giải mã video";
                        break;
                    case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMessage = "Định dạng video không được hỗ trợ";
                        break;
                }
                console.error(`Error message: ${errorMessage}`);

                // Hiển thị thông báo lỗi trong video container
                this.showVideoError(errorMessage);
            }
        };

        // Chỉ thêm event listener một lần
        video.removeEventListener("error", errorHandler);
        video.addEventListener("error", errorHandler);

        // Kiểm tra khi video đã sẵn sàng
        video.addEventListener("loadedmetadata", () => {
            console.log("Video metadata loaded");
            console.log(`Video duration: ${video.duration} seconds`);
            console.log(
                `Video dimensions: ${video.videoWidth}x${video.videoHeight}`
            );

            // Ẩn thông báo lỗi nếu có
            this.hideVideoError();
        });

        // Kiểm tra khi video có thể phát được
        video.addEventListener("canplay", () => {
            console.log("Video can play");
            this.hideVideoError();
        });
    }

    // Hiển thị thông báo lỗi video
    showVideoError(message) {
        const container = document.querySelector(".video-container");
        if (!container) return;

        // Kiểm tra xem đã có thông báo lỗi chưa
        let errorDiv = container.querySelector(".video-error-message");
        if (!errorDiv) {
            errorDiv = document.createElement("div");
            errorDiv.className =
                "video-error-message absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10";
            container.appendChild(errorDiv);
        }

        errorDiv.innerHTML = `
            <div class="text-center text-white p-6">
                <i class="fas fa-exclamation-triangle text-4xl mb-4 text-yellow-400"></i>
                <p class="text-lg font-semibold mb-2">${message}</p>
                <p class="text-sm text-gray-300 mb-4">Đường dẫn: ${this.videoPath}</p>
                <button onclick="window.trafficSystem && window.trafficSystem.createCanvasAnimation()" 
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i class="fas fa-play mr-2"></i>
                    Sử dụng demo animation
                </button>
            </div>
        `;
    }

    // Ẩn thông báo lỗi video
    hideVideoError() {
        const container = document.querySelector(".video-container");
        if (container) {
            const errorDiv = container.querySelector(".video-error-message");
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    }

    // Phương thức để thay đổi đường dẫn video
    setVideoPath(videoPath) {
        this.videoPath = videoPath;
        const video = document.getElementById("surveillance-video");
        if (video) {
            this.loadVideo(video);
        }
    }

    // Tạo video demo (fallback nếu video không tải được)
    createDemoVideo() {
        const video = document.getElementById("surveillance-video");
        // Tạo canvas animation cho demo
        this.createCanvasAnimation();
    }

    // Tạo animation canvas thay thế video
    createCanvasAnimation() {
        try {
            const container = document.querySelector(".video-container");
            if (!container) {
                console.warn(
                    "Video container not found, skipping canvas animation"
                );
                return;
            }

            const video = document.getElementById("surveillance-video");
            if (!video) {
                console.warn(
                    "Video element not found, skipping canvas animation"
                );
                return;
            }

            const canvas = document.createElement("canvas");
            canvas.width = 800;
            canvas.height = 600;
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.objectFit = "cover";

            // Thay thế video bằng canvas để demo
            video.parentNode.replaceChild(canvas, video);

            this.startCanvasAnimation(canvas);
        } catch (error) {
            console.error("Error creating canvas animation:", error);
        }
    }

    // Animation canvas
    startCanvasAnimation(canvas) {
        const ctx = canvas.getContext("2d");
        let frame = 0;

        const animate = () => {
            frame++;

            // Xóa canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Tạo hiệu ứng giao thông demo
            this.drawTrafficScene(ctx, frame, canvas.width, canvas.height);

            // Vẽ thời gian và thông tin
            this.drawVideoInfo(ctx, frame, canvas.width, canvas.height);

            requestAnimationFrame(animate);
        };

        animate();
    }

    // Vẽ cảnh giao thông demo
    drawTrafficScene(ctx, frame, width, height) {
        // Nền đường
        ctx.fillStyle = "#2C3E50";
        ctx.fillRect(0, height * 0.7, width, height * 0.3);

        // Vạch kẻ đường
        ctx.strokeStyle = "#F39C12";
        ctx.lineWidth = 4;
        ctx.setLineDash([20, 20]);
        ctx.beginPath();
        ctx.moveTo(0, height * 0.85);
        ctx.lineTo(width, height * 0.85);
        ctx.stroke();
        ctx.setLineDash([]);

        // Xe di chuyển
        const carX = ((frame * 2) % (width + 200)) - 100;
        const carY = height * 0.75;

        // Xe 1
        ctx.fillStyle = "#E74C3C";
        ctx.fillRect(carX, carY, 60, 30);
        ctx.fillStyle = "#ECF0F1";
        ctx.fillRect(carX + 5, carY + 5, 50, 20);

        // Xe 2
        const car2X = ((frame * 1.5) % (width + 300)) - 150;
        ctx.fillStyle = "#3498DB";
        ctx.fillRect(car2X, carY + 40, 50, 25);
        ctx.fillStyle = "#ECF0F1";
        ctx.fillRect(car2X + 3, carY + 43, 44, 19);

        // Đèn giao thông
        ctx.fillStyle = "#34495E";
        ctx.fillRect(width - 60, height * 0.2, 20, 80);

        // Đèn đỏ
        ctx.fillStyle = frame % 120 < 60 ? "#E74C3C" : "#7F8C8D";
        ctx.beginPath();
        ctx.arc(width - 50, height * 0.25, 10, 0, 2 * Math.PI);
        ctx.fill();

        // Đèn xanh
        ctx.fillStyle = frame % 120 >= 60 ? "#27AE60" : "#7F8C8D";
        ctx.beginPath();
        ctx.arc(width - 50, height * 0.35, 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Vẽ thông tin video
    drawVideoInfo(ctx, frame, width, height) {
        ctx.font = "24px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText("CAM 001 - Ngã tư Nguyễn Huệ", 20, 40);

        const time = this.formatTime(frame / 30);
        ctx.textAlign = "right";
        ctx.fillText(time, width - 20, 40);

        // Trạng thái
        ctx.textAlign = "center";
        ctx.fillStyle = frame % 120 < 60 ? "#E74C3C" : "#27AE60";
        ctx.font = "18px Arial";
        ctx.fillText(
            frame % 120 < 60 ? "ĐÈN ĐỎ" : "ĐÈN XANH",
            width / 2,
            height - 30
        );
    }

    // Thiết lập tìm kiếm và lọc
    setupSearchAndFilter() {
        const searchInput = document.getElementById("search-input");
        const timeFilter = document.getElementById("time-filter");

        searchInput.addEventListener("input", () => this.filterViolations());
        timeFilter.addEventListener("change", () => this.filterViolations());
    }

    // Lọc danh sách vi phạm
    filterViolations() {
        const searchTerm = document
            .getElementById("search-input")
            .value.toLowerCase();
        const timeFilter = document.getElementById("time-filter").value;

        this.filteredViolations = this.violations.filter((violation) => {
            // Lọc theo biển số
            const matchesSearch = violation.licensePlate
                .toLowerCase()
                .includes(searchTerm);

            // Lọc theo thời gian
            let matchesTime = true;
            const violationDate = new Date(violation.time);
            const now = new Date();

            switch (timeFilter) {
                case "today":
                    matchesTime =
                        violationDate.toDateString() === now.toDateString();
                    break;
                case "week":
                    const weekAgo = new Date(
                        now.getTime() - 7 * 24 * 60 * 60 * 1000
                    );
                    matchesTime = violationDate >= weekAgo;
                    break;
                case "month":
                    const monthAgo = new Date(
                        now.getTime() - 30 * 24 * 60 * 60 * 1000
                    );
                    matchesTime = violationDate >= monthAgo;
                    break;
            }

            return matchesSearch && matchesTime;
        });

        this.renderViolations();
    }

    // Hiển thị danh sách vi phạm
    renderViolations() {
        console.log("=== renderViolations START ===");
        console.log("Total violations:", this.violations.length);
        console.log("Filtered violations:", this.filteredViolations.length);

        const container = document.getElementById("violations-list");
        console.log("Container element:", container);

        if (!container) {
            console.error(
                "❌ Violations list container not found! ID: violations-list"
            );
            // Thử tìm lại sau một chút
            setTimeout(() => {
                const retryContainer =
                    document.getElementById("violations-list");
                if (retryContainer) {
                    console.log(
                        "✅ Container found on retry, rendering now..."
                    );
                    this.renderViolations();
                } else {
                    console.error("❌ Container still not found after retry");
                }
            }, 100);
            return;
        }

        console.log("✅ Container found, clearing content...");
        container.innerHTML = "";

        if (this.filteredViolations.length === 0) {
            console.log("⚠️ No violations to display");
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-search text-4xl mb-4"></i>
                    <p>Không tìm thấy vi phạm nào</p>
                </div>
            `;
            return;
        }

        console.log(
            `✅ Creating ${this.filteredViolations.length} violation cards...`
        );
        this.filteredViolations.forEach((violation, index) => {
            try {
                console.log(
                    `Creating card ${index + 1}/${
                        this.filteredViolations.length
                    }: ${violation.licensePlate}`
                );
                const violationCard = this.createViolationCard(violation);
                container.appendChild(violationCard);
                console.log(`✅ Card ${index + 1} added successfully`);
            } catch (error) {
                console.error(
                    `❌ Error creating card for ${violation.licensePlate}:`,
                    error
                );
            }
        });
        console.log("=== renderViolations END ===");
        console.log(
            `✅ Successfully rendered ${container.children.length} cards`
        );
    }

    // Tạo card vi phạm
    createViolationCard(violation) {
        const card = document.createElement("div");
        card.className =
            "violation-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer";
        card.setAttribute("data-violation-id", violation.id);

        const time = new Date(violation.time);
        const timeStr = time.toLocaleString("vi-VN");

        card.innerHTML = `
            <div class="grid grid-cols-4">

            <div class="col-span-2 flex mb-3">
            <div>
                <h3 class="font-semibold text-lg text-gray-900">${violation.licensePlate}</h3>
            </div>
          
            
            </div>

            <div class="col-span-2">
                <span class="px-2 py-1 rounded-full text-xs font-small text-red-500 bg-red-100 ">
                    VƯỢT ĐÈN ĐỎ
                </span>
            </div>

            <div class="col-span-2 ">
            <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-map-marker-alt w-4 mr-2"></i>
                <span class="font-medium text-gray-700">ID: ${violation.id}</span>
            </div>

            <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-clock w-4 mr-2"></i>
                <span>${timeStr}</span>
            </div>


             <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-car w-4 mr-2"></i>
                <span>${violation.vehicle.type}</span>
            </div>   
            </div>

            </div>
            

            
            <div class="flex space-x-2">
                <button class="flex-1 rounded-md text-sm font-medium transition-colors view-details-btn" 
                        data-violation-id="${violation.id}">
                    <i class="fas fa-play-circle mr-1"></i>
                </button>
            </div>
        `;

        // Thêm sự kiện click cho toàn bộ card
        card.addEventListener("click", (e) => {
            // Ngăn chặn sự kiện bubble nếu click vào nút
            if (!e.target.closest(".view-details-btn")) {
                this.showViolationDetails(violation);
            }
        });

        // Thêm sự kiện click cho nút xem chi tiết
        const detailsBtn = card.querySelector(".view-details-btn");
        detailsBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện bubble
            this.showViolationDetails(violation);
        });

        return card;
    }

    // Thiết lập modal
    setupModal() {
        const modal = document.getElementById("detail-modal");
        const closeBtn = document.getElementById("close-modal");

        // Đóng modal khi click nút đóng
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("show");
        });

        // Đóng modal khi click outside
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("show");
            }
        });

        // Đóng modal khi nhấn phím ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("show")) {
                modal.classList.remove("show");
            }
        });
    }

    // Hiển thị chi tiết vi phạm
    showViolationDetails(violation) {
        const modal = document.getElementById("detail-modal");

        // Cập nhật thông tin trong modal
        document.getElementById(
            "modal-license-plate"
        ).textContent = `Biển số: ${violation.licensePlate}`;
        document.getElementById("violation-image").src = violation.image;
        document.getElementById("violation-time").textContent = new Date(
            violation.time
        ).toLocaleString("vi-VN");
        document.getElementById("violation-location").textContent =
            violation.location;
        document.getElementById("violation-speed").textContent =
            violation.speed;

        // Thông tin phương tiện
        document.getElementById("vehicle-brand").textContent =
            violation.vehicle.brand;
        document.getElementById("vehicle-model").textContent =
            violation.vehicle.model;
        document.getElementById("vehicle-color").textContent =
            violation.vehicle.color;
        document.getElementById("vehicle-type").textContent =
            violation.vehicle.type;
        document.getElementById("vehicle-year").textContent =
            violation.vehicle.year;
        document.getElementById("vehicle-engine").textContent =
            violation.vehicle.engine;
        document.getElementById("vehicle-seats").textContent =
            violation.vehicle.seats;
        document.getElementById("vehicle-fuel").textContent =
            violation.vehicle.fuel;
        document.getElementById("vehicle-power").textContent =
            violation.vehicle.power;
        document.getElementById("vehicle-chassis").textContent =
            violation.vehicle.chassis;
        document.getElementById("vehicle-engine-number").textContent =
            violation.vehicle.engineNumber;
        document.getElementById("vehicle-reg-number").textContent =
            violation.vehicle.regNumber;
        document.getElementById("vehicle-cert-number").textContent =
            violation.vehicle.certNumber;
        document.getElementById("vehicle-reg-office").textContent =
            violation.vehicle.regOffice;
        document.getElementById("vehicle-reg-date").textContent =
            violation.vehicle.regDate;
        document.getElementById("vehicle-exp-date").textContent =
            violation.vehicle.expDate;
        document.getElementById("vehicle-purpose").textContent =
            violation.vehicle.purpose;
        document.getElementById("vehicle-condition").textContent =
            violation.vehicle.condition;
        document.getElementById("vehicle-insurance").textContent =
            violation.vehicle.insurance;
        document.getElementById("vehicle-insurance-exp").textContent =
            violation.vehicle.insuranceExp;

        // Thông tin chủ sở hữu
        document.getElementById("owner-name").textContent =
            violation.owner.name;
        document.getElementById("owner-dob").textContent = violation.owner.dob;
        document.getElementById("owner-gender").textContent =
            violation.owner.gender;
        document.getElementById("owner-cccd").textContent =
            violation.owner.cccd;
        document.getElementById("owner-cccd-place").textContent =
            violation.owner.cccdPlace;
        document.getElementById("owner-cccd-date").textContent =
            violation.owner.cccdDate;
        document.getElementById("owner-ethnicity").textContent =
            violation.owner.ethnicity;
        document.getElementById("owner-nationality").textContent =
            violation.owner.nationality;
        document.getElementById("owner-address").textContent =
            violation.owner.address;
        document.getElementById("owner-current-address").textContent =
            violation.owner.currentAddress;
        document.getElementById("owner-phone").textContent =
            violation.owner.phone;
        document.getElementById("owner-email").textContent =
            violation.owner.email;
        document.getElementById("owner-photo").src = "./run/nhat.jpeg";
        document.getElementById("owner-license").textContent =
            violation.owner.license;
        document.getElementById("owner-license-class").textContent =
            violation.owner.licenseClass;
        document.getElementById("owner-license-date").textContent =
            violation.owner.licenseDate;
        document.getElementById("owner-license-place").textContent =
            violation.owner.licensePlace;

        // Hiển thị modal
        modal.classList.add("show");
    }

    // Cập nhật thời gian hiện tại
    updateCurrentTime() {
        const now = new Date();
        const timeElement = document.getElementById("current-time");
        const dateElement = document.getElementById("current-date");

        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString("vi-VN");
        }

        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
    }

    // Định dạng thời gian
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }
}

// Khởi tạo hệ thống khi trang được tải
let systemInitialized = false;
let trafficSystem = null;

function initializeSystem(videoPath) {
    if (systemInitialized) {
        console.log("System already initialized, skipping...");
        return;
    }

    systemInitialized = true;
    console.log("Starting system initialization");

    try {
        // Cho phép truyền đường dẫn video từ URL parameter hoặc sử dụng giá trị mặc định
        const urlParams = new URLSearchParams(window.location.search);
        const videoPathFromUrl =
            urlParams.get("video") || videoPath || "video.mp4";

        trafficSystem = new TrafficViolationSystem(videoPathFromUrl);

        // Cho phép truy cập hệ thống từ global scope để có thể thay đổi video path
        window.trafficSystem = trafficSystem;
    } catch (error) {
        console.error("Error initializing TrafficViolationSystem:", error);
        // Vẫn cố gắng hiển thị danh sách vi phạm ngay cả khi có lỗi
        const container = document.getElementById("violations-list");
        if (container) {
            container.innerHTML = `
                <div class="text-center py-8 text-red-500">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <p>Có lỗi xảy ra khi tải hệ thống. Vui lòng kiểm tra console.</p>
                    <p class="text-sm mt-2">${error.message}</p>
                </div>
            `;
        }
    }
}

// Khởi tạo khi DOM ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded");
    initializeSystem();
});

// Fallback: initialize immediately if DOM is already loaded
if (document.readyState !== "loading") {
    console.log("Document is already loaded, initializing immediately");
    initializeSystem();
}

document.addEventListener("DOMContentLoaded", async () => {
    const video = document.getElementById("surveillance-video");

    if (!video) {
        console.error("Không tìm thấy video element!");
        return;
    }

    // Đây là đường dẫn mà server Express cung cấp ở bước 2
    const hlsUrl = "http://localhost:3000/hls/playlist.m3u8";

    if (Hls.isSupported()) {
        // Nếu trình duyệt hỗ trợ HLS.js
        console.log("Sử dụng HLS.js");
        const hls = new Hls({
            debug: true,
            enableWorker: true,
        });
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log("HLS manifest đã được parse thành công");
            // Đảm bảo video tự động phát và replay
            video.muted = true; // Cần thiết cho autoplay
            video.loop = true;
            video.play().catch((err) => {
                console.error("Lỗi khi phát video:", err);
            });
        });

        // Đảm bảo video tự động replay khi kết thúc
        video.addEventListener("ended", () => {
            console.log("Video kết thúc, tự động replay...");
            video.currentTime = 0;
            video.play().catch((err) => {
                console.error("Lỗi khi replay video:", err);
            });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS Error:", data);
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error("Lỗi mạng, đang thử lại...");
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error("Lỗi media, đang phục hồi...");
                        hls.recoverMediaError();
                        break;
                    default:
                        console.error("Lỗi không thể phục hồi");
                        hls.destroy();
                        break;
                }
            }
        });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Nếu trình duyệt hỗ trợ HLS gốc (ví dụ: Safari)
        console.log("Sử dụng HLS gốc (Safari)");
        video.src = hlsUrl;
        video.muted = true; // Cần thiết cho autoplay
        video.loop = true;
        video.addEventListener("loadedmetadata", () => {
            video.play().catch((err) => {
                console.error("Lỗi khi phát video:", err);
            });
        });
        // Đảm bảo video tự động replay khi kết thúc
        video.addEventListener("ended", () => {
            console.log("Video kết thúc, tự động replay...");
            video.currentTime = 0;
            video.play().catch((err) => {
                console.error("Lỗi khi replay video:", err);
            });
        });
        video.addEventListener("error", (e) => {
            console.error("Lỗi video element:", e);
        });
    } else {
        console.error("Trình duyệt không hỗ trợ HLS!");
    }
});
