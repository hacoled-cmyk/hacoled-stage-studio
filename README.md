# HACOLED STAGE STUDIO 🎬✨
### Ứng Dụng Thiết Kế 3D Sân Khấu Sự Kiện & Bóc Tách Khối Lượng Màn Hình LED Chuyên Nghiệp

![HACOLED STAGE STUDIO](https://img.shields.io/badge/Platform-Next.js%2015-red?style=for-the-badge)
![3D Engine](https://img.shields.io/badge/3D%20Engine-Three.js%20r187-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-blue?style=for-the-badge)
![License](https://img.shields.io/badge/Brand-HACOLED%20Official-red?style=for-the-badge)

---

## 1. Giới thiệu dự án

**HACOLED STAGE STUDIO** là giải pháp phần mềm web độc lập do HACOLED phát triển, cho phép các đạo diễn sân khấu, kỹ sư sự kiện, nhà tổ chức và khách hàng:
1. Trực quan hóa không gian sân khấu sự kiện theo mô hình 3D tương tác thời gian thực.
2. Tùy biến và cấu hình toàn diện các dòng màn hình LED chủ lực của HACOLED (P1.53, P1.86, P2.0, P2.5, P3.0, P3.91, P4.0, P5.0) với đầy đủ dạng thức: màn phẳng, màn cong panorama, màn cánh gà, sàn LED tương tác.
3. Bố trí giàn khung nhôm truss chịu lực, hệ thống ánh sáng chuyên nghiệp (Beam moving head, Par LED wash, Profile spot) và hệ thống âm thanh Line Array.
4. Tự động bóc tách khối lượng vật tư (BOM), tính toán chi tiết công suất điện tiêu thụ (kW/kVA), quy cách aptomat 3 pha, tiết diện cáp đồng công nghiệp và bảng báo giá dự toán theo VNĐ.
5. Xuất ảnh phối cảnh 3D độ phân giải cao (2K) có đóng dấu watermark nhận diện thương hiệu HACOLED và thông số kỹ thuật dự án.

---

## 2. Kiến trúc Công nghệ (Tech Stack)

- **Frontend Core:** [Next.js 15+](https://nextjs.org/) (App Router), React 19, TypeScript.
- **3D Graphics Engine:** [Three.js r187](https://threejs.org/) (WebGL 2.0 Renderer, PCFShadowMap, OrbitControls, TransformControls).
- **Styling & UI:** Tailwind CSS v4, Glassmorphism, [Lucide React](https://lucide.dev/) Icons.
- **State Management:** Custom React Context Architecture với cơ chế Undo/Redo (25 bước) và tự động đồng bộ LocalStorage.
- **Math & Physics:** Parametric geometry generators (uốn cong màn LED, tính tọa độ truss, tính góc phủ âm).
- **Exporting Engine:** HTML5 Canvas Compositor xuất ảnh phối cảnh 2K chất lượng cao và xuất tệp CSV bảng dự toán.

---

## 3. Hướng dẫn cài đặt và chạy Local (Getting Started)

### 3.1. Yêu cầu môi trường
- **Node.js:** Phiên bản 18.x trở lên (Khuyến nghị Node.js 20 hoặc 24 LTS).
- **Trình duyệt:** Bất kỳ trình duyệt nào hỗ trợ WebGL (Google Chrome, Microsoft Edge, Safari, Firefox).

### 3.2. Cài đặt các gói phụ thuộc
```bash
cd /home/antigravity/hacoled-stage-studio
npm install
```

### 3.3. Chạy môi trường phát triển (Development Mode)
```bash
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:3000`

### 3.4. Build và Chạy Production
```bash
# Biên dịch mã nguồn tối ưu hóa
npm run build

# Khởi chạy máy chủ production
npm start -- -p 3000
```

---

## 4. Danh sách tính năng (Feature Matrix)

### 4.1. Đã hoàn thành và kiểm thử thành công (100% Verified)
- [x] **01. Kho mẫu sân khấu (Library Presets):**
  - Mẫu Gala Dinner & Year End Party (Màn chính cong P2.5 + 2 màn cánh gà P3.91, giàn truss hộp, đèn vàng).
  - Mẫu Hội nghị & Ra mắt Thương hiệu (Màn siêu nét P1.86 độ phân giải 4K, bục phát biểu, ghế theater).
  - Mẫu Đại nhạc hội / Festival Rock (Sân khấu lớn 16x10m, màn ngoài trời P3.91, giàn truss chịu tải 8 tấn, dàn Line Array).
- [x] **02. Dựng kết cấu (Stage & Structure):**
  - Tùy chỉnh chiều rộng, chiều sâu, độ cao bục sân khấu tỷ lệ mét thực tế.
  - Tùy chọn màu thảm sàn (Xám hiện đại, Đen tuyền, Đỏ gala, Xanh hội nghị).
  - Tùy chọn bậc thang lên xuống (2 bên cánh gà, chính diện, không bậc).
  - Viền đèn LED chân sân khấu và mặt che chân bục (skirt).
  - Hệ giàn khung nhôm truss (tùy chỉnh rộng, sâu, cao đỉnh, quy cách hộp 300x300 / 400x400, màu nhôm bạc/đen).
  - Bố trí khán phòng: Bàn tròn tiệc (Banquet), Ghế hội nghị (Theater), Đứng (Standing).
- [x] **03. Quản lý Layer & Outliner:**
  - Bật/tắt hiển thị 8 lớp không gian: Sàn, Truss, Màn LED, Đèn, Loa, Đạo cụ, Khán phòng, Lưới tọa độ.
  - Cây danh sách vật thể 3D (Scene Outliner) cho phép click để chọn và gắn Gizmo.
- [x] **04. Cấu hình Màn hình LED chuyên sâu (HACOLED Core):**
  - Đầy đủ catalogue module LED HACOLED: P1.53, P1.86, P2.0, P2.5, P3.0, P3.91, P4.0, P5.0.
  - Tự động tính kích thước, số module, số cabin rental, độ phân giải pixel chính xác.
  - Chức năng tạo màn hình LED cong (Curved screen) với thanh trượt bán kính cong linh hoạt.
  - Thêm/bớt màn hình LED cánh gà, màn hình phụ tùy ý.
  - Bộ visual trình diễn động (HACOLED Opening Đỏ Ánh Kim, Gala Luxury, Cyberpunk Tech, Corporate Blue, Live Music Wave).
  - Tùy chỉnh độ sáng màn hình (20% - 100%).
- [x] **05. Ánh sáng sân khấu (Stage Lighting):**
  - 5 Preset Look & Mood: Gala Hoàng Gia Vàng Ấm, Hội Nghị Sáng Rõ, Cyber Rock, Lãng Mạn Tím Hồng, Doanh Nghiệp Xanh.
  - Chùm tia sáng Moving Head Beam (Volumetric Cones) chuyển động và quét sàn chân thực.
  - Điều khiển cường độ chùm tia, đèn rọi tâm (Key Spot), ánh sáng tràn môi trường (Wash).
  - Tùy chỉnh số lượng đèn Beam 380W và Par LED 54 bóng.
- [x] **06. Kịch bản tiết mục (Show Timeline):**
  - Bảng quản lý tiết mục biểu diễn (thời lượng, ghi chú visual/âm thanh).
  - Biểu đồ dòng năng lượng show diễn trực quan theo thang điểm 1 - 10.
- [x] **07. Bóc tách vật tư & Dự toán (BOM):**
  - Thống kê diện tích màn LED ($m^2$), mét dài truss ($m$), diện tích sàn ($m^2$).
  - Tính toán kỹ thuật điện: Công suất điện đỉnh (kW), Aptomat 3 pha cần cấp (A), tiết diện cáp đồng nguồn ($mm^2$).
  - Hệ thống cảnh báo an toàn kỹ thuật (vượt tải trọng treo, quá tải công suất điện, lệch kích thước).
  - Bảng báo giá dự toán chi tiết từng hạng mục bằng VNĐ.
  - Xuất bảng kê ra file Excel `.csv` (UTF-8) và chức năng In bảng báo giá.
- [x] **Tương tác 3D & Camera:**
  - 5 Góc nhìn máy ảnh định sẵn: Phối cảnh, Chính diện, Mặt bằng, Khán giả, Bàn kỹ thuật FOH.
  - Bộ điều khiển 3D Gizmo (Dịch chuyển tọa độ X/Y/Z, Xoay góc đối tượng).
  - Điều khiển chuột OrbitControls (Xoay, Dịch chuyển, Phóng to/thu nhỏ).
- [x] **Quản lý Dự án & Xuất file:**
  - Hoàn tác / Làm lại (Undo / Redo) 25 bước lịch sử.
  - Lưu và Tải dự án từ tệp `.json` / `.hls`.
  - Tự động lưu trữ cục bộ vào trình duyệt (`localStorage`).
  - Xuất ảnh phối cảnh 3D 2K ($1920 \times 1080$) có watermark và thông số kỹ thuật.

### 4.2. Kế hoạch phát triển tương lai (Future Roadmap)
- [ ] Tích hợp phát video MP4 trực tiếp lên bề mặt màn hình LED 3D thông qua VideoTexture.
- [ ] Chế độ thực tế ảo tăng cường (WebXR / AR Quick Look) xem trực tiếp sân khấu tại hội trường thực tế qua camera điện thoại.
- [ ] Đồng bộ hóa dự án lên đám mây (Cloud Database) và chia sẻ link xem 3D tương tác cho khách hàng.

---

## 5. Hướng dẫn Triển khai Production (Deployment Guide)

### Cách 1: Triển khai trên Vercel (Khuyến nghị)
1. Đẩy mã nguồn lên kho lưu trữ GitHub của bạn.
2. Đăng nhập [Vercel](https://vercel.com/) $\rightarrow$ Chọn **Add New Project**.
3. Chọn repository `hacoled-stage-studio`, Vercel sẽ tự động nhận diện cấu hình Next.js.
4. Bấm **Deploy**.

### Cách 2: Triển khai bằng Docker
Tạo tệp `Dockerfile` tại thư mục gốc:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```
Khởi chạy container:
```bash
docker build -t hacoled-stage-studio .
docker run -p 3000:3000 hacoled-stage-studio
```

---
**HACOLED - Dẫn đầu công nghệ hiển thị LED & Sân khấu chuyên nghiệp tại Việt Nam.**
