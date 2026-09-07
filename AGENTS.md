# DailySip Vietnam — Master Project Context for AI Agents

> **File này tóm gọn 100% ngữ cảnh dự án DailySip Vietnam. AI chỉ cần đọc file này là nắm trọn toàn bộ kiến trúc, luồng dữ liệu, quy tắc nghiệp vụ và cách phát triển.**

---

## 1. Tổng quan Dự án (Project Overview)

**DailySip Vietnam** (`module_3`) là ứng dụng Web Fullstack đề xuất đồ uống và món ăn cá nhân hóa theo thời gian thực dựa trên:
- **Tâm trạng & Thể trạng**: Check-in triệu chứng (mệt mỏi, đau họng, nóng trong, buồn ngủ, đầy bụng...).
- **Lá chắn Dị ứng 100%**: Loại bỏ tuyệt đối các thành phần kiêng kỵ (Lactose, Cafein, Đậu phộng, Chế phẩm sữa, Gluten, Thuần chay).
- **Thị giác AI (Gemini Vision)**: Chụp/tải ảnh không gian (bàn làm việc, phòng gym, góc chill...) để tự động nhận diện vibe và điền khảo sát.
- **Tư vấn Dinh dưỡng Chuyên sâu**: Gemini 3.7 Flash giải thích lý do món uống phù hợp (`whyItFits`), lời khuyên giờ uống và lượng đường.
- **GPS & Cửa hàng Đối tác**: Tính khoảng cách Haversine đến quán gần nhất, thời gian giao ETA, xem menu quán và đặt món.
- **Tùy biến Ly nước & Giỏ hàng**: Chỉnh Size (S/M/L), % Đường, % Đá, Topping, Nhiệt độ (Nóng/Lạnh).
- **Mô phỏng Đơn hàng**: Pipeline 5 trạng thái (Chờ xác nhận -> Đã nhận -> Đang pha -> Đang giao -> Thành công).
- **Trợ lý Sommelier & Sức khỏe**: Chatbot chuyên gia đồ uống, gợi ý công thức tự pha tại nhà (DIY), theo dõi uống nước (Hydration Tracker).

---

## 2. Tech Stack & Lệnh Thực Thi

- **Backend**: Node.js + Express 4, `tsx` runtime, `@google/genai` (Google Gen AI SDK), `@supabase/supabase-js`.
- **Frontend**: React 19, Vite 6 (chạy dưới dạng middleware trong Express), Tailwind CSS v4, Lucide React, Framer Motion, Canvas Confetti.
- **Persistence (Dual-Mode)**: Supabase PostgreSQL (Cloud) <-> LocalStorage/Mock Data (Offline).

```bash
# Cài đặt thư viện
npm install

# Khởi chạy fullstack (Express + Vite HMR tại http://localhost:3000)
npm run dev

# Mở tunnel kiểm tra trên điện thoại thật
npm run tunnel

# Kiểm tra lỗi TypeScript (Bắt buộc chạy trước khi hoàn thành task)
npm run lint

# Build và chạy production
npm run build
npm start
```

### Biến môi trường (.env / .env.local)
- `GEMINI_API_KEY`: API key Google Gemini (nếu thiếu, hệ thống tự kích hoạt Heuristic Fallback thông minh).
- `VITE_SUPABASE_URL`: URL project Supabase.
- `VITE_SUPABASE_ANON_KEY`: Public Anon Key Supabase.
- `PORT`: Mặc định `3000`.

---

## 3. Bản đồ File & Trách nhiệm (Codebase Map)

```text
module_3/
├── agent.md                      # [BẠN ĐANG ĐỌC] Master context duy nhất cho AI
├── AGENTS.md                     # Bản sync cho Antigravity Agent Rules
├── server.ts                     # Backend Express: Tất cả API AI, Stores, Recommendations, Vite middleware
├── supabase_schema.sql           # Schema PostgreSQL: app_users, drinks, stores, orders, hydration_logs
├── index.html                    # Entry point HTML (meta viewport mobile, Google Fonts Inter)
├── package.json                  # Cấu hình scripts & dependencies
└── src/
    ├── main.tsx                  # Mount React DOM
    ├── App.tsx                   # State Coordinator toàn cục (tabs, user, cart, theme, modals)
    ├── types.ts                  # Toàn bộ Typescript interfaces & enums
    ├── index.css                 # Tailwind CSS v4 setup & dark mode rules
    ├── lib/supabase.ts           # Khởi tạo Supabase client & kiểm tra flag isSupabaseConfigured
    ├── services/dbService.ts     # Data access layer: Tự động chuyển đổi giữa Cloud Supabase và Local Mock
    ├── data/mockData.ts          # Catalog đồ uống (DRINKS_DATABASE), chuỗi quán (STORES_DATABASE), tài khoản demo
    └── components/               # Giao diện thành phần:
        ├── MobileDeviceFrame.tsx      # Khung viền giả lập iPhone / Chuyển chế độ Desktop
        ├── MobileHeader.tsx           # Header mobile: Avatar, Location, Dark mode toggle, Cart icon
        ├── MobileBottomNav.tsx        # Thanh 5 tab: Check-in, Gợi ý, Quán gần, Lịch sử, Sommelier
        ├── CheckInSurvey.tsx          # Form check-in: Mood, Body, Dị ứng, Sở thích, Gemini Vision upload
        ├── RecommendationView.tsx     # Top 5 đồ uống đề xuất, match score, lời khuyên AI
        ├── StoreMapView.tsx           # Danh sách quán, bản đồ, lọc quận, link Grab/Shopee/Google Maps
        ├── StoreDetailModal.tsx       # Xem chi tiết quán, thực đơn tại quán, chọn mua trực tiếp
        ├── CartDrawer.tsx             # Giỏ hàng: số lượng, nhập voucher, tính ship, nút thanh toán
        ├── DrinkCustomizationModal.tsx# Tùy biến ly: Size (S/M/L), Đường, Đá, Nóng/Lạnh, Toppings
        ├── OrderTrackingModal.tsx     # Giả lập tài xế & 5 bước giao hàng real-time
        ├── HydrationTracker.tsx       # Nhật ký uống nước, cộng nhanh 150/250/500ml, hiệu ứng pháo hoa
        ├── NutritionistChatModal.tsx  # Trợ lý AI Sommelier tư vấn đồ uống Việt Nam
        ├── HomeRecipeModal.tsx        # AI tạo công thức đồ uống từ nguyên liệu có sẵn tại nhà
        ├── UserProfileModal.tsx       # Xem hồ sơ, hạng thành viên, ngân hàng liên kết, lịch sử đơn
        └── AuthScreen.tsx             # Màn hình đăng nhập / đăng ký tài khoản (hỗ trợ cả Supabase & offline)
```

---

## 4. Các Luồng Nghiệp Vụ Cốt Lõi (Core Business Logic)

### A. Động cơ Đề xuất Đồ uống (`server.ts` -> `/api/recommendations`)
1. **Lá chắn Dị ứng Tuyệt đối (Hard Filter)**:
   - `lactose`: Loại đồ uống có `containsLactose` hoặc category `milk_nut`.
   - `caffeine`: Loại đồ uống có `containsCaffeine` hoặc `caffeineMg > 0`.
   - `peanuts`: Loại đồ uống có `containsNuts` hoặc nguyên liệu chứa hạt/đậu.
   - `dairy`: Loại đồ uống chứa sữa, cheese, foam, kem.
   - `gluten`: Loại đồ uống chứa lúa mạch, yến mạch.
   - `vegan`: Chỉ giữ món có `isVegan === true`.
   - `hot`: Chỉ giữ món có `isHotAvailable === true`.
2. **Ma trận Chấm điểm (Base: 50, Kẹp trong khoảng 70 - 99)**:
   - **Tâm trạng (Mood)**: `+25` điểm/tag khớp.
   - **Thể trạng (Body Status)**: `+35` điểm/tag khớp; thưởng `+50` điểm cho món đặc trị (ví dụ: đau họng + Trà gừng ấm; nóng trong + Nước ép cần tây / Rau má; đầy bụng + Kombucha dứa).
   - **Sở thích (Preferences)**: `+15` điểm; `low_sugar` + đường <= 9g: `+20`; `no_sugar` + đường <= 5g: `+25`.
   - **Mục tiêu (Goal)**: `+30` điểm nếu khớp.
3. **Phân tích Dinh dưỡng AI (Gemini 3.7 Flash)**:
   - Trả về JSON: `summary`, `wellnessTip`, `timingAdvice`, `sugarAdvice`, `allergyNotice`, `drinkReasons` (mô tả `whyItFits` cho từng món).
   - Nếu không có key / timeout -> Sử dụng Heuristic fallback.

### B. Phân tích Thị giác AI (`server.ts` -> `/api/analyze-vision`)
- Nhận ảnh base64 qua `gemini-2.5-flash` multimodal.
- Phân loại bối cảnh: `desk_work` (bàn làm việc), `workout_gym` (tập gym), `relax_scenery` (chill ngắm cảnh), `sick_bed` (ốm/mệt mỏi), `outdoor_hot` (ngoài trời nắng).
- Tự động tick sẵn các lựa chọn Mood, Body Condition, Preferences, Goal và Note vào form Check-in.

### C. Giỏ hàng & Tùy biến Ly nước (`src/components/`)
- **Size**: `S` (-5.000đ), `M` (+0đ), `L` (+8.000đ).
- **Đường / Đá**: 0%, 30%, 50%, 70%, 100%. (Nếu chọn Nóng -> Khóa Đá 0%).
- **Toppings**: Trân châu hoàng kim (+8k), Hạt chia (+5k), Sương sáo (+6k), Thạch nha đam (+6k).
- **Voucher**: `DAILYSIP50` (Giảm 50% tối đa 30k), `HEALTHY10` (Giảm 10k). Freeship cho đơn >= 150k (mặc định phí ship 15k).

### D. GPS & Quán gần nhất (`server.ts` -> `/api/stores`)
- Tọa độ mặc định: TP.HCM (Lat: `10.7725`, Lng: `106.6983`).
- Khoảng cách: Tính theo công thức Haversine (km, làm tròn 1 chữ số).
- Thời gian giao hàng ước tính: `ETA = Math.max(12, Math.round(distanceKm * 6 + 10))` phút.
- Hỗ trợ deep-link đặt qua GrabFood, ShopeeFood hoặc mở Google Maps.

### E. Dữ liệu & Đăng nhập Dual-Mode (`src/services/dbService.ts`)
- **Cloud Mode**: Khi có `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`, mọi thao tác (users, drinks, stores, orders, hydration) đồng bộ trực tiếp lên Cloud PostgreSQL.
- **Local Fallback**: Khi chưa cấu hình Supabase, hệ thống hoạt động 100% bình thường với mock data.
- **Tài khoản test offline**:
  - Tài khoản: `thienluan`
  - Mật khẩu: `123456`
  - Vai trò: Khách hàng thân thiết Hạng Bạc (Silver), có sẵn liên kết Ví MoMo và lịch sử đơn hàng.

---

## 5. Danh mục Skill Chi tiết trong `.agents/skills/`

Khi cần tìm hiểu sâu từng phân hệ chuyên biệt, đọc file tương ứng:
1. [dailysip-engine/SKILL.md](file:///d:/KADA_AI/module_3/.agents/skills/dailysip-engine/SKILL.md): SOP phát triển fullstack, kiến trúc `App.tsx`.
2. [dailysip-recommendation/SKILL.md](file:///d:/KADA_AI/module_3/.agents/skills/dailysip-recommendation/SKILL.md): Thuật toán đề xuất, lá chắn dị ứng, prompt Gemini 3.7.
3. [dailysip-vision/SKILL.md](file:///d:/KADA_AI/module_3/.agents/skills/dailysip-vision/SKILL.md): Xử lý ảnh Vision AI Gemini 2.5, mapping bối cảnh.
4. [dailysip-supabase/SKILL.md](file:///d:/KADA_AI/module_3/.agents/skills/dailysip-supabase/SKILL.md): Cấu trúc bảng SQL, xác thực tài khoản, persistence.
5. [dailysip-order-cart/SKILL.md](file:///d:/KADA_AI/module_3/.agents/skills/dailysip-order-cart/SKILL.md): Quản lý giỏ hàng, công thức tiền, vòng đời đơn hàng.
6. [dailysip-store-routing/SKILL.md](file:///d:/KADA_AI/module_3/.agents/skills/dailysip-store-routing/SKILL.md): Định vị GPS, công thức khoảng cách, menu cửa hàng.
7. [dailysip-sommelier-health/SKILL.md](file:///d:/KADA_AI/module_3/.agents/skills/dailysip-sommelier-health/SKILL.md): Chatbot dinh dưỡng, công thức DIY, theo dõi uống nước.

---

## 6. Quy Tắc Bất Di Bất Dịch Cho AI Khi Code (Golden Rules)

1. **Zero TypeScript Errors**: Sau bất kỳ chỉnh sửa nào, PHẢI chạy `npm run lint` (`tsc --noEmit`) và đảm bảo exit code = 0.
2. **Luôn bảo toàn Fallback**: Không bao giờ gọi trực tiếp Gemini hay Supabase mà không có khối `try/catch` cùng phương án dữ liệu fallback cục bộ. Ứng dụng phải luôn chạy trơn tru kể cả khi không có Internet hoặc không có API key.
3. **Mọi thao tác DB phải qua `dbService.ts`**: Không gọi trực tiếp `supabase.from(...)` rải rác trong UI components.
4. **Giữ nguyên định dạng dữ liệu trong `src/types.ts`**: Khi bổ sung thuộc tính mới, luôn đánh dấu optional (`?`) hoặc cung cấp giá trị mặc định để tránh phá vỡ mock data hiện có.
