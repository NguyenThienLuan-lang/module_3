# 🍵 DailySip - AI Personal Drink Sommelier & Wellness Delivery System

> **DailySip** là ứng dụng gợi ý đồ uống cá nhân hóa và đặt giao hàng theo tâm trạng, thể trạng cơ thể, dị ứng dinh dưỡng — cứu cánh cho những ai đang loay hoay không biết nên uống gì hôm nay! Ứng dụng tích hợp AI Sommelier (Google Gemini 3.7 Flash & Gemini Vision) và cơ sở dữ liệu thời gian thực **Supabase Cloud Database**.

---

## 🌟 Tính Năng Nổi Bật

1. **Menu Đăng Nhập / Đăng Ký Tài Khoản Độc Lập**:
   - Giao diện đăng nhập/đăng ký chuyên biệt, tối ưu tỷ lệ hiển thị trên mọi thiết bị di động và máy tính.
   - Cơ chế bảo mật dữ liệu riêng tư: Tài khoản mới tạo có dữ liệu mới tinh 100% (0 đơn hàng, hạng Đồng).
   - Duy trì trạng thái đăng nhập và tab làm việc khi tải lại trang (F5/Reload).
2. **AI Daily Check-in & Khảo Sát Thể Trạng**:
   - Gợi ý Top 5 đồ uống tối ưu dựa trên Tâm trạng (Mood), Trạng thái cơ thể (Sore throat, heat, bloated,...), Sở thích (Ít đường, không đường,...), và Lá chắn Dị ứng đa tầng.
3. **AI Vision Sommelier**:
   - Chụp ảnh hoặc tải ảnh không gian làm việc, tập gym, nghỉ ngơi để AI phân tích bối cảnh và đề xuất đồ uống phù hợp tức thì.
4. **Bản Đồ Quán & Định Vị GPS (Store Map View)**:
   - Tự động quét và định vị các quán đối tác gần nhất (*Phúc Long, The Coffee House, Katinat, Rau Má Mix, Detox Lành, Nutty Lab*), tính khoảng cách km và thời gian giao hàng.
   - Menu từng quán đầy đủ món, giá bán, món Signature ⭐ và ưu đãi khuyến mãi.
5. **Giỏ Hàng & Tùy Biến Đồ Uống**:
   - Tùy chỉnh kích cỡ (Size M/L), độ ngọt (0%, 30%, 50%, 70%, 100%), mức đá, nhiệt độ (Nóng/Đá) và topping dinh dưỡng (Thạch sả, Hạt chia, Nha đam, Hạt sen,...).
6. **Theo Dõi Đơn Hàng & Shipper (Live Order Tracking)**:
   - Bản đồ theo dõi lộ trình shipper di chuyển trực tiếp với tài xế và biển số xe.
7. **Nhật Ký Sức Khỏe & Uống Nước (Hydration Tracker)**:
   - Tự động cộng dồn lượng nước (ml) và lượng caffeine (mg) tiêu thụ trong ngày.
8. **Hồ Sơ Thành Viên & Kho Voucher (Loyalty Tier)**:
   - 4 hạng thành viên: Hạng Đồng 🥉, Hạng Bạc 🥈, Hạng Vàng 🥇, Hạng Kim Cương 💎 với mã voucher giảm giá tương ứng.

---

## 🗄️ Kiến Trúc Cơ Sở Dữ Liệu Supabase

Dự án kết nối trực tiếp với **Supabase Cloud Database** thông qua REST API & RLS Policies:
- `drinks`: Danh mục đồ uống thông minh, thành phần dinh dưỡng, calo, đường, cafein, công thức pha chế.
- `stores`: Danh sách quán đối tác, tọa độ GPS (lat/lng), thời gian giao hàng, menu món quán phục vụ.
- `app_users`: Tài khoản khách hàng, mật khẩu bảo mật, số điện thoại, hạng thành viên.
- `orders`: Đơn hàng khách đặt, địa chỉ, phương thức thanh toán, đánh giá món.
- `hydration_logs`: Nhật ký dinh dưỡng & uống nước hàng ngày.
- `vouchers`: Kho voucher khuyến mãi theo hạng thành viên.

File khởi tạo SQL đầy đủ: [`supabase_schema.sql`](./supabase_schema.sql).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Cài đặt thư viện dependencies:
```bash
npm install
```

### 2. Cấu hình biến môi trường:
Tạo file `.env` (hoặc sử dụng cấu hình mặc định đã tích hợp sẵn trong code):
```env
VITE_SUPABASE_URL=https://tsqupswcdlbisnzswsyv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_6ZyeR3LQ907q-k4pPF_FUw_nYQ4vCwN
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Khởi chạy máy chủ:
```bash
# Chạy cả Backend Server và Frontend Vite
npm run dev
```

Truy cập trên trình duyệt: [http://localhost:3000](http://localhost:3000)

### 4. Tài khoản demo có sẵn:
- **Tài khoản:** `thienluan`
- **Mật khẩu:** `123456`
- **Hoặc:** Bạn có thể tự do bấm nút **Đăng Ký Mới** để tạo tài khoản mới tinh bất kỳ lúc nào!
