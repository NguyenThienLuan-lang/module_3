-- ==============================================================================
-- DAILYSIP SUPABASE DATABASE INITIALIZATION SCHEMA
-- Project: https://supabase.com/dashboard/project/tsqupswcdlbisnzswsyv
-- Copy and run this script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tsqupswcdlbisnzswsyv/sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLES CREATION
-- ==============================================================================

-- Table: drinks (Danh mục đồ uống thông minh DailySip)
CREATE TABLE IF NOT EXISTS public.drinks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    vietnamese_name TEXT,
    category TEXT NOT NULL, -- 'coffee', 'tea', 'juice', 'smoothie', 'herbal'
    description TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,
    why_it_fits TEXT,
    calories INTEGER DEFAULT 0,
    sugar_grams NUMERIC DEFAULT 0,
    caffeine_mg INTEGER DEFAULT 0,
    ingredients JSONB DEFAULT '[]'::jsonb,
    price_vnd NUMERIC NOT NULL DEFAULT 35000,
    image TEXT,
    is_hot_available BOOLEAN DEFAULT false,
    is_cold_available BOOLEAN DEFAULT true,
    contains_lactose BOOLEAN DEFAULT false,
    contains_caffeine BOOLEAN DEFAULT false,
    contains_nuts BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT true,
    tags JSONB DEFAULT '[]'::jsonb,
    suggested_toppings JSONB DEFAULT '[]'::jsonb,
    home_recipe JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: stores (Danh sách quán đối tác & tọa độ GPS)
CREATE TABLE IF NOT EXISTS public.stores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    address TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    distance_km NUMERIC DEFAULT 1.0,
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    delivery_time_mins INTEGER DEFAULT 20,
    promo_badge TEXT,
    image TEXT,
    menu_items JSONB DEFAULT '[]'::jsonb,
    external_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: profiles (Hồ sơ người dùng & Hạng thành viên)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE,
    name TEXT NOT NULL DEFAULT 'Khách Hàng Mới',
    phone TEXT,
    email TEXT,
    avatar TEXT,
    total_orders_count INTEGER DEFAULT 0,
    rank TEXT DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'diamond'
    linked_payments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: orders (Đơn hàng đã đặt & Đang giao)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    delivery_fee NUMERIC DEFAULT 15000,
    discount NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'cod', -- 'cod', 'momo', 'vnpay', 'zalopay', 'card'
    status TEXT DEFAULT 'preparing', -- 'preparing', 'delivering', 'delivered', 'cancelled'
    driver JSONB,
    review JSONB,
    placed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    estimated_delivery_at TIMESTAMP WITH TIME ZONE
);

-- Table: hydration_logs (Nhật ký sức khỏe & Uống nước hàng ngày)
CREATE TABLE IF NOT EXISTS public.hydration_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    drink_name TEXT NOT NULL,
    drink_category TEXT,
    volume_ml INTEGER NOT NULL DEFAULT 250,
    calories INTEGER DEFAULT 0,
    caffeine_mg INTEGER DEFAULT 0,
    sugar_grams NUMERIC DEFAULT 0,
    mood_tag TEXT DEFAULT 'good',
    timestamp TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: vouchers (Voucher & Mã giảm giá hạng thành viên)
CREATE TABLE IF NOT EXISTS public.vouchers (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    discount_text TEXT NOT NULL,
    min_order_vnd NUMERIC DEFAULT 0,
    expiry_date TEXT NOT NULL,
    description TEXT,
    min_rank TEXT DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'diamond'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
-- ==============================================================================

ALTER TABLE public.drinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (DROP IF EXISTS ĐỂ TRÁNH LỖI TRÙNG LẶP)
DROP POLICY IF EXISTS "Public drinks are viewable by everyone" ON public.drinks;
CREATE POLICY "Public drinks are viewable by everyone" ON public.drinks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public stores are viewable by everyone" ON public.stores;
CREATE POLICY "Public stores are viewable by everyone" ON public.stores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public vouchers are viewable by everyone" ON public.vouchers;
CREATE POLICY "Public vouchers are viewable by everyone" ON public.vouchers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public profiles can be read/written" ON public.profiles;
CREATE POLICY "Public profiles can be read/written" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Public orders can be read/created" ON public.orders;
CREATE POLICY "Public orders can be read/created" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Public hydration logs can be read/created" ON public.hydration_logs;
CREATE POLICY "Public hydration logs can be read/created" ON public.hydration_logs FOR ALL USING (true);

-- ==============================================================================
-- 4. SEED SAMPLE DATA (Nạp dữ liệu mẫu ban đầu cho DailySip)
-- ==============================================================================

-- Inset Vouchers
INSERT INTO public.vouchers (id, code, title, discount_text, min_order_vnd, expiry_date, description, min_rank)
VALUES 
('v-bronze-1', 'DONG5K', 'Giảm 5.000đ Đơn Đầu Tiên', 'Giảm 5.000 đ', 35000, '30/09/2026', 'Áp dụng cho thành viên Hạng Đồng, đơn từ 35.000đ', 'bronze'),
('v-bronze-2', 'FREESHIP15K', 'Freeship Giảm 15.000đ', 'Freeship 15k', 50000, '30/09/2026', 'Giảm 15.000đ phí giao hàng cho đơn từ 50.000đ', 'bronze'),
('v-silver-1', 'BAC10PCT', 'Giảm 10% Tối Đa 25.000đ', 'Giảm 10%', 60000, '31/10/2026', 'Đặc quyền thành viên Hạng Bạc (đã tích lũy > 5 đơn)', 'silver'),
('v-silver-2', 'FREETOPPING', 'Tặng 1 Topping Dinh Dưỡng', 'Topping 0đ', 45000, '31/10/2026', 'Miễn phí 1 phần thạch sả, hạt chia hoặc nha đam', 'silver'),
('v-gold-1', 'VANG15PCT', 'Giảm 15% Mọi Đơn Hàng', 'Giảm 15%', 80000, '31/12/2026', 'Đặc quyền thành viên Hạng Vàng VIP (đã tích lũy > 20 đơn)', 'gold'),
('v-gold-2', 'FREESHIPGOLD', 'Freeship 0đ Không Giới Hạn', 'Freeship 0đ', 70000, '31/12/2026', 'Miễn phí giao hàng toàn bộ đơn từ 70.000đ', 'gold'),
('v-diamond-1', 'KIMCUONG25PCT', 'Giảm 25% Đẳng Cấp Kim Cương', 'Giảm 25%', 100000, '31/12/2026', 'Đặc quyền cao cấp nhất dành cho khách hàng thân thiết (> 50 đơn)', 'diamond'),
('v-diamond-2', 'VIPPRIORITY', 'Giao Siêu Tốc 15 Phút + Ưu Tiên Pha Chế', 'VIP Fast', 0, '31/12/2026', 'Đơn hàng được ưu tiên pha chế hàng đầu và shipper riêng', 'diamond')
ON CONFLICT (id) DO NOTHING;

-- Insert Drinks
INSERT INTO public.drinks (id, name, vietnamese_name, category, description, calories, sugar_grams, caffeine_mg, price_vnd, image, contains_lactose, contains_caffeine, contains_nuts, is_vegan, tags, why_it_fits)
VALUES
(
  'cold-brew-orange-lemongrass',
  'Cold Brew Cam Sả Vàng',
  'Cold Brew Cam Sả Tươi',
  'coffee',
  'Cà phê ủ lạnh 16 tiếng kết hợp nước cam tươi mọng nước và hương thơm thanh khiết từ sả tươi.',
  85, 9, 110, 49000,
  'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700&auto=format&fit=crop&q=80',
  false, true, false, true,
  '["sleepy", "focus", "refresh", "low_sugar", "caffeine", "fruity"]'::jsonb,
  'Rất thích hợp khi bạn đang buồn ngủ và thiếu tập trung trong giờ làm việc. Cung cấp caffeine êm dịu kết hợp vitamin C giúp lấy lại năng lượng tức thì.'
),
(
  'chamomile-honey-red-apple',
  'Trà Hoa Cúc Mật Ong Táo Đỏ',
  'Trà Hoa Cúc Mật Ong & Kỷ Tử Táo Đỏ',
  'herbal',
  'Thức trà thảo mộc ấm áp kết hợp hoa cúc trắng sấy lạnh, táo đỏ Tân Cương, kỷ tử đỏ và mật ong hoa nhãn.',
  60, 8, 0, 45000,
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80',
  false, false, false, false,
  '["stressed", "anxious", "stress_relief", "relax", "herbal", "no_caffeine", "hot"]'::jsonb,
  'Lựa chọn số 1 khi bạn đang chịu nhiều áp lực (stress), lo âu hoặc mệt mỏi tinh thần. Hoàn toàn không chứa caffeine nên rất êm dịu cho dạ dày.'
),
(
  'ginger-lemongrass-citrus-warm',
  'Trà Gừng Chanh Sả Mật Ong Nóng',
  'Trà Gừng Sả Tắc Mật Ong Ấm',
  'herbal',
  'Nước cốt gừng tươi già cay nồng ấm phối hợp tinh dầu sả, nước cốt tắc tươi và mật ong làm dịu thanh quản.',
  55, 10, 0, 42000,
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&auto=format&fit=crop&q=80',
  false, false, false, false,
  '["sore_throat", "cold_flu", "herbal", "hot", "immune_boost", "no_caffeine"]'::jsonb,
  'Cực kỳ phù hợp khi bạn bị đau họng, khàn tiếng hoặc cảm thấy cơ thể ớn lạnh. Giúp xoa dịu vòm họng và giữ ấm nội tạng.'
),
(
  'green-detox-celery-apple-kale',
  'Nước Ép Xanh Cần Tây Táo Kale',
  'Nước Ép Green Detox Mát Gan',
  'juice',
  'Ép chậm nguyên chất từ cần tây Đà Lạt, táo xanh Granny Smith, cải xoăn Kale và một lát chanh vàng tươi.',
  70, 7, 0, 52000,
  'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=700&auto=format&fit=crop&q=80',
  false, false, false, true,
  '["internal_heat", "bloated", "detox", "refresh", "low_sugar", "fruity", "no_caffeine"]'::jsonb,
  'Món thức uống thanh lọc cơ thể mạnh mẽ nhất. Rất tốt khi bạn cảm thấy nóng trong người, đầy bụng sau khi ăn dầu mỡ.'
),
(
  'avocado-spinach-protein-smoothie',
  'Sinh Tố Bơ Rau Bina Sữa Hạt Đạm Thực Vật',
  'Sinh Tố Bơ Spinach Sữa Hạt Tăng Cơ',
  'smoothie',
  'Bơ sáp Đắk Lắk béo mịn xay cùng rau chân vịt non (Spinach), sữa hạt điều hữu cơ và bột đạm đậu Hà Lan.',
  210, 5, 0, 58000,
  'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=700&auto=format&fit=crop&q=80',
  false, false, true, true,
  '["post_workout", "muscle_recovery", "creamy", "low_sugar", "no_caffeine"]'::jsonb,
  'Được các chuyên gia dinh dưỡng khuyên dùng sau buổi tập luyện thể thao (Gym, Yoga, Chạy bộ). Giúp bù đắp glycogen và tái tạo sợi cơ.'
)
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Stores
INSERT INTO public.stores (id, name, brand, address, lat, lng, distance_km, rating, review_count, delivery_time_mins, promo_badge, image, menu_items, external_links)
VALUES
(
  'store-katinoff-d1',
  'Katinat Saigon Kafe - Đồng Khởi',
  'Katinat Saigon Kafe',
  '91 Đồng Khởi, Bến Nghé, Quận 1, TP.HCM',
  10.7769, 106.7032, 0.6, 4.8, 412, 15, '⚡ Giao Siêu Tốc 15p',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=80',
  '[{"drinkId": "cold-brew-orange-lemongrass", "price": 49000, "isSignature": true}, {"drinkId": "chamomile-honey-red-apple", "price": 45000, "isSignature": false}]'::jsonb,
  '{"grabFoodUrl": "https://food.grab.com/vn/vi/", "shopeeFoodUrl": "https://shopeefood.vn/", "googleMapsUrl": "https://maps.google.com"}'::jsonb
),
(
  'store-phuclong-leloi',
  'Phúc Long Coffee & Tea - Lê Lợi',
  'Phúc Long',
  '122 Lê Lợi, Bến Thành, Quận 1, TP.HCM',
  10.7725, 106.6983, 0.8, 4.7, 520, 20, '🎟️ Voucher 15k',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
  '[{"drinkId": "ginger-lemongrass-citrus-warm", "price": 42000, "isSignature": true}, {"drinkId": "green-detox-celery-apple-kale", "price": 52000, "isSignature": false}]'::jsonb,
  '{"grabFoodUrl": "https://food.grab.com/vn/vi/", "shopeeFoodUrl": "https://shopeefood.vn/", "googleMapsUrl": "https://maps.google.com"}'::jsonb
),
(
  'store-the-coffee-house-nguyen-thi-minh-khai',
  'The Coffee House - Nguyễn Thị Minh Khai',
  'The Coffee House',
  '180 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
  10.7785, 106.6923, 1.4, 4.6, 380, 25, '🥤 Mua 1 Tặng 1',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500&auto=format&fit=crop&q=80',
  '[{"drinkId": "avocado-spinach-protein-smoothie", "price": 58000, "isSignature": true}]'::jsonb,
  '{"grabFoodUrl": "https://food.grab.com/vn/vi/", "shopeeFoodUrl": "https://shopeefood.vn/", "googleMapsUrl": "https://maps.google.com"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
