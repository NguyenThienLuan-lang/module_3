# Changelog — DailySip Vietnam

Toàn bộ lịch sử các thay đổi, bổ sung tính năng, cập nhật kiến trúc và tài liệu trong dự án **DailySip Vietnam**.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/).

---

## [Chưa phát hành / Bản cập nhật mới nhất] - 2026-09-07

### Thêm mới (Added)
- **Tài liệu Context duy nhất cho AI (`agent.md` & `AGENTS.md`)**:
  - Tạo tài liệu tổng quan toàn diện về kiến trúc, tech stack, luồng nghiệp vụ cốt lõi, bảng ánh xạ file, và 4 nguyên tắc vàng bắt buộc cho AI.
  - Tự động kích hoạt thông qua cơ chế rule discovery của Antigravity (`AGENTS.md`).
- **Hệ thống 7 Skill chuyên biệt tối ưu cho AI (`.agents/skills/`)**:
  - Đóng gói mỗi skill thành duy nhất 1 file `SKILL.md` tự chứa (không thư mục con dư thừa):
    1. `dailysip-engine`: SOP kiến trúc fullstack, Express + Vite + TSX, lệnh dev/lint/build, biến môi trường.
    2. `dailysip-recommendation`: Thuật toán Hard Filter an toàn dị ứng 100%, ma trận chấm điểm Mood/Body/Goal, prompt Gemini 3.7 Flash JSON.
    3. `dailysip-vision`: Multimodal Vision AI (`gemini-2.5-flash`), phân tích bối cảnh ảnh (bàn làm việc, phòng gym, góc chill, giường ốm...), tự động tick form khảo sát.
    4. `dailysip-supabase`: Database schema (`supabase_schema.sql`), service tầng dữ liệu (`dbService.ts`), chế độ Dual-Mode Cloud <-> Offline Mock, tài khoản test.
    5. `dailysip-order-cart`: Tùy biến ly nước (Size, Đường, Đá, Nóng/Lạnh, Topping), giỏ hàng, voucher giảm giá, pipeline mô phỏng giao hàng 5 bước.
    6. `dailysip-store-routing`: Danh mục quán đối tác, công thức khoảng cách Haversine, tính ETA giao hàng, menu đồ uống tại quán, bản đồ và deep-link Grab/Shopee/Google Maps.
    7. `dailysip-sommelier-health`: Trợ lý AI Sommelier tư vấn dinh dưỡng, ma trận triage triệu chứng khẩn cấp, tạo công thức DIY tại nhà (`/api/home-recipe`), theo dõi uống nước (Hydration Tracker).
- **File nhật ký thay đổi (`CHANGELOG.md`)**:
  - Ghi nhận chi tiết mọi thay đổi trong dự án để tiện theo dõi và bàn giao.

### Tối ưu & Dọn dẹp (Refactored & Removed)
- Xóa bỏ thư mục phụ thừa `.agents/skills/dailysip-engine/references/` để tuân thủ quy chuẩn "mỗi skill một file gọn gàng nhất".
- Đồng bộ mã nguồn mới nhất từ remote `origin/main` (commit `4851daa`).

---

## [Commit 4851daa] - 2026-09-07

### Thêm mới (Added)
- **Tích hợp Cloud Database Supabase PostgreSQL**:
  - Bổ sung thư viện `@supabase/supabase-js`.
  - Tạo file khởi tạo client Supabase (`src/lib/supabase.ts`) với cờ kiểm tra `isSupabaseConfigured`.
  - Viết file schema cơ sở dữ liệu `supabase_schema.sql` gồm các bảng: `app_users`, `drinks`, `stores`, `orders`, `hydration_logs`.
  - Triển khai tầng dữ liệu `src/services/dbService.ts` hỗ trợ kiến trúc Dual-Mode (tự động chuyển đổi giữa Cloud Supabase và Local Mock).
- **Màn hình Đăng nhập & Đăng ký Dual-Mode (`AuthScreen.tsx` & `AuthModal.tsx`)**:
  - Hỗ trợ đăng ký/đăng nhập tài khoản thật lên Supabase Cloud hoặc sử dụng tài khoản demo offline (`thienluan` / `123456`).
- **Modal Chi tiết Quán & Thực đơn tại quán (`StoreDetailModal.tsx`)**:
  - Hiển thị thông tin quán, giờ mở cửa, menu thức uống sẵn có kèm giá cụ thể và nút thêm trực tiếp vào giỏ hàng.
- **Thị giác AI Gemini Vision tích hợp vào CheckInSurvey**:
  - Hỗ trợ chụp camera trực tiếp hoặc tải ảnh không gian làm việc/chill/gym lên để Gemini phân tích và điền tự động form khảo sát.
- **Lưu trữ trạng thái qua LocalStorage**:
  - Giữ lại tab đang xem (`dailysip_active_tab`), chủ đề giao diện (`dailysip_theme`), và danh sách gợi ý đồ uống (`dailysip_recommended_drinks`).
- **Hỗ trợ Dark Mode toàn diện**:
  - Bổ sung class `.dark` và biến màu tối trong `src/index.css`.

---

## [Commit bca4aa7 & e2f4420] - 2026-08-29

### Thêm mới (Added)
- **Hồ sơ Người dùng & Liên kết Ngân hàng (`UserProfileModal.tsx`)**:
  - Xem thông tin tài khoản, hạng thành viên (Bronze, Silver, Gold), quản lý thẻ ngân hàng và ví điện tử liên kết (MoMo, VNPay).
  - Hiển thị lịch sử các đơn hàng đã đặt kèm chi tiết món và trạng thái.
- **Giỏ hàng Tùy chỉnh (`CartDrawer.tsx`)**:
  - Tăng giảm số lượng món, áp dụng mã voucher (`DAILYSIP50`, `HEALTHY10`), tính phí vận chuyển và miễn phí giao hàng từ 150k.
- **Cân bằng & Tinh chỉnh UI Mobile**:
  - Tối ưu thanh điều hướng dưới đáy (`MobileBottomNav.tsx`), thanh tiêu đề trên (`MobileHeader.tsx`), và giao diện web đáp ứng (`MobileDeviceFrame.tsx`).

---

## [Commit 6410d58] - 2026-08-28

### Thêm mới (Initial Release)
- **Khởi tạo kiến trúc nền tảng DailySip Vietnam**:
  - Express server kết hợp Vite middleware chạy song song trên cổng 3000.
  - Danh mục đồ uống khởi tạo (`DRINKS_DATABASE`) và chuỗi cửa hàng đối tác (`STORES_DATABASE`).
  - Động cơ đề xuất đồ uống đa yếu tố với bộ lọc dị ứng tuyệt đối và mô hình Gemini 3.7 Flash dinh dưỡng.
  - Trợ lý AI Sommelier tư vấn sức khỏe (`NutritionistChatModal.tsx`).
  - Bộ theo dõi uống nước (`HydrationTracker.tsx`) với hiệu ứng pháo hoa confetti.
  - Vòng quay may mắn chọn món ngẫu nhiên (`SurpriseWheel.tsx`).
  - Bộ tùy biến ly nước (`DrinkCustomizationModal.tsx`) và mô phỏng giao hàng (`OrderTrackingModal.tsx`).
