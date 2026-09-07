import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  Bike,
  Tag,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Flame,
  Droplets,
  Coffee,
  CheckCircle2,
  Copy,
  Check,
  Phone,
  Info,
  Sparkles,
  Share2,
  SlidersHorizontal,
  Search
} from 'lucide-react';
import { Store, Drink } from '../types';

interface StoreDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
  allDrinks: Drink[];
  onAddToCart: (drink: Drink, store: Store) => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({
  isOpen,
  onClose,
  store,
  allDrinks,
  onAddToCart
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'bestsellers' | 'vouchers' | 'reviews' | 'info'>('menu');
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen || !store) return null;

  // Find drinks available at this store
  let storeMenuDrinks = allDrinks
    .map(drink => {
      const match = (store.menuItems || []).find(m => m.drinkId === drink.id && m.isAvailable !== false);
      if (!match) return null;
      return {
        drink,
        storePrice: match.price || drink.priceVND,
        isSignature: match.isSignature || false
      };
    })
    .filter(Boolean) as { drink: Drink; storePrice: number; isSignature: boolean }[];

  // Fallback if no specific matches: show drinks so the store menu is always available
  if (storeMenuDrinks.length === 0 && allDrinks.length > 0) {
    storeMenuDrinks = allDrinks.slice(0, 4).map((drink, idx) => ({
      drink,
      storePrice: drink.priceVND,
      isSignature: idx === 0
    }));
  }

  // Filter categories
  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'tea', label: 'Trà & Thảo Mộc' },
    { id: 'coffee', label: 'Cà Phê' },
    { id: 'juice', label: 'Nước Ép & Detox' },
    { id: 'smoothie', label: 'Sinh Tố' }
  ];

  // Filtered menu based on search and category
  const filteredDrinks = storeMenuDrinks.filter(item => {
    const matchesSearch =
      item.drink.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.drink.vietnameseName.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.drink.category.toLowerCase().includes(menuSearch.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || item.drink.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Bestsellers (Signature or top items)
  const bestsellers = storeMenuDrinks.slice(0, 4);

  // Store vouchers
  const storeVouchers = [
    {
      code: 'DAILY20K',
      title: 'Giảm 20.000đ',
      desc: 'Áp dụng cho đơn từ 99.000đ tại quán',
      minSpend: 99000,
      discount: 20000,
      expiry: 'Hết hạn sau 3 ngày'
    },
    {
      code: 'FREESHIP',
      title: 'Miễn Phí Giao Hàng',
      desc: 'Giảm tối đa 16.000đ phí ship đơn từ 120.000đ',
      minSpend: 120000,
      discount: 16000,
      expiry: 'Hôm nay'
    },
    {
      code: 'TOPPINGFREE',
      title: 'Tặng Topping Tươi',
      desc: 'Tặng 1 phần thạch sả hoặc hạt chia cho đơn từ 60.000đ',
      minSpend: 60000,
      discount: 8000,
      expiry: 'Hết hạn cuối tuần'
    }
  ];

  // Store reviews
  const storeReviews = [
    {
      id: 'rev-1',
      name: 'Trần Bảo Ngọc',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      date: 'Hôm qua, 15:20',
      comment: 'Quán pha rất đúng chuẩn ít ngọt, hương cam sả thơm lừng và shipper giao siêu nhanh chỉ 12 phút!',
      orderedItems: ['Cold Brew Cam Sả Vàng']
    },
    {
      id: 'rev-2',
      name: 'Lê Hoàng Nam',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      date: '2 ngày trước',
      comment: 'Trà hoa cúc táo đỏ ấm nóng đóng gói kỹ càng trong ly giữ nhiệt, uống vào dịu họng hẳn. 10/10!',
      orderedItems: ['Trà Hoa Cúc Mật Ong Táo Đỏ']
    },
    {
      id: 'rev-3',
      name: 'Nguyễn Thị Mai Phương',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      date: '4 ngày trước',
      comment: 'Không gian quán sạch sẽ, nước ép cần tây táo xanh tươi mới ép ngay tại chỗ, không bị tách nước.',
      orderedItems: ['Nước Ép Cần Tây Táo Xanh Detox']
    }
  ];

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#fcfaf7] w-full max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#e5dfd5] flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] animate-in slide-in-from-bottom sm:slide-in-from-none fade-in duration-200">
        {/* Cover Banner & Image Header */}
        <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-stone-800 shrink-0">
          <img
            src={store.image}
            alt={store.name}
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer active:scale-90 z-10"
            title="Đóng"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Promo Badge */}
          {store.promoBadge && (
            <div className="absolute top-3.5 left-3.5 bg-gradient-to-r from-[#d98b72] to-[#b86e55] text-white text-[11px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md flex items-center gap-1 z-10">
              <Tag className="w-3 h-3" />
              <span>{store.promoBadge}</span>
            </div>
          )}

          {/* Store Info on Cover */}
          <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-[#5e7e66] text-[10px] sm:text-[11px] font-bold">
                {store.brand}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {store.rating} ({store.reviewCount})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold flex items-center gap-1">
                <Bike className="w-3 h-3 text-emerald-400" />
                ~{store.deliveryTimeMins}p • {store.distanceKm || 0.8} km
              </span>
            </div>

            <h2 className="text-base sm:text-xl font-bold font-serif leading-tight text-white drop-shadow-md truncate">
              {store.name}
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-200 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3 h-3 text-[#eaddcf] shrink-0" />
              <span className="truncate">{store.address}</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Horizontal scroll on mobile) */}
        <div className="flex border-b border-[#e5dfd5] bg-white px-2 sm:px-4 shrink-0 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`py-2.5 sm:py-3 px-3 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'menu'
                ? 'border-[#5e7e66] text-[#2c3a31]'
                : 'border-transparent text-[#8c827a] hover:text-[#4a453e]'
            }`}
          >
            📋 Menu ({storeMenuDrinks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bestsellers')}
            className={`py-2.5 sm:py-3 px-3 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'bestsellers'
                ? 'border-[#5e7e66] text-[#2c3a31]'
                : 'border-transparent text-[#8c827a] hover:text-[#4a453e]'
            }`}
          >
            🔥 Đặt Nhiều
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`py-2.5 sm:py-3 px-3 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'vouchers'
                ? 'border-[#5e7e66] text-[#2c3a31]'
                : 'border-transparent text-[#8c827a] hover:text-[#4a453e]'
            }`}
          >
            🎟️ Voucher ({storeVouchers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-2.5 sm:py-3 px-3 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'reviews'
                ? 'border-[#5e7e66] text-[#2c3a31]'
                : 'border-transparent text-[#8c827a] hover:text-[#4a453e]'
            }`}
          >
            ⭐ Đánh Giá
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-2.5 sm:py-3 px-3 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'info'
                ? 'border-[#5e7e66] text-[#2c3a31]'
                : 'border-transparent text-[#8c827a] hover:text-[#4a453e]'
            }`}
          >
            📍 Địa Chỉ
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5">
          {/* TAB 1: MENU */}
          {activeTab === 'menu' && (
            <div className="space-y-3">
              {/* Search & Category filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c827a]" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={e => setMenuSearch(e.target.value)}
                    placeholder="Tìm món uống trong menu quán..."
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-[#e5dfd5] bg-white text-[#2c2722] placeholder-[#8c827a] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#5e7e66] text-white shadow-2xs'
                          : 'bg-white text-[#6b6257] border border-[#e5dfd5] hover:bg-[#f7f3ed]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredDrinks.length === 0 ? (
                <div className="text-center py-10 text-[#8c827a] text-xs">
                  Không tìm thấy món uống phù hợp trong menu của quán.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredDrinks.map(({ drink, storePrice, isSignature }) => (
                    <div
                      key={drink.id}
                      className="p-3 rounded-2xl bg-white border border-[#e5dfd5] hover:border-[#7d9d85]/50 shadow-2xs transition-all flex gap-3 relative"
                    >
                      <img
                        src={drink.image}
                        alt={drink.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#e5dfd5] shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-xs text-[#2c2722] truncate">
                              {drink.name}
                            </h4>
                            {isSignature && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-bold">
                                Bán chạy
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#8c827a] line-clamp-1 mt-0.5">
                            {drink.benefits?.[0] || drink.vietnameseName}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#5e7e66] font-medium">
                            <span>🔥 {drink.calories} kcal</span>
                            <span>•</span>
                            <span>{drink.sugarGrams}g đường</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#f7f3ed]">
                          <span className="font-extrabold text-xs text-[#2c2722]">
                            {storePrice.toLocaleString('vi-VN')} đ
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddToCart(drink, store)}
                            className="px-2.5 py-1 rounded-lg bg-[#eef4f0] hover:bg-[#5e7e66] text-[#5e7e66] hover:text-white font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>+ Thêm</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BESTSELLERS */}
          {activeTab === 'bestsellers' && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-[#eef4f0] border border-[#7d9d85]/30 text-xs text-[#2c3a31] flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-[#5e7e66] shrink-0" />
                <span>Các món được thực khách đặt nhiều nhất tại quán:</span>
              </div>

              <div className="space-y-2">
                {bestsellers.map(({ drink, storePrice }, idx) => (
                  <div
                    key={drink.id}
                    className="p-3 rounded-2xl bg-white border border-[#e5dfd5] shadow-2xs flex items-center gap-3 relative"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#d98b72] to-[#b86e55] text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                      #{idx + 1}
                    </div>
                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="w-13 h-13 rounded-xl object-cover border border-[#e5dfd5] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-xs text-[#2c2722] truncate">
                          {drink.name}
                        </h4>
                        <span className="text-[9px] text-[#d98b72] font-semibold bg-[#fdf5f0] px-1 py-0.2 rounded shrink-0">
                          🔥 500+ đặt
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8c827a] truncate mt-0.5">
                        {drink.vietnameseName}
                      </div>
                      <div className="font-extrabold text-xs text-[#2c2722] mt-0.5">
                        {storePrice.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddToCart(drink, store)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7d9d85] to-[#5e7e66] text-white font-bold text-xs shadow-xs hover:from-[#6c8c74] hover:to-[#4e6c55] transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Đặt</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VOUCHERS */}
          {activeTab === 'vouchers' && (
            <div className="space-y-2.5">
              <p className="text-xs text-[#6b6257]">
                Mã ưu đãi áp dụng khi đặt món từ <strong>{store.name}</strong>:
              </p>

              <div className="space-y-2">
                {storeVouchers.map(v => (
                  <div
                    key={v.code}
                    className="p-3 rounded-2xl bg-white border border-[#e5dfd5] shadow-2xs flex items-center justify-between gap-2.5 relative"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#fdf5f0] text-[#b86e55] flex items-center justify-center font-black text-xs shrink-0 border border-[#e8cfc8]">
                        %
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#2c2722] flex items-center gap-1.5 flex-wrap">
                          <span>{v.title}</span>
                          <span className="text-[10px] font-mono bg-[#f7f3ed] px-1.5 py-0.2 rounded border border-[#e5dfd5] text-[#4a453e]">
                            {v.code}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#6b6257] mt-0.5 truncate">{v.desc}</div>
                        <div className="text-[9px] text-[#8c827a] mt-0.5">⏳ {v.expiry}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyVoucher(v.code)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                        copiedVoucher === v.code
                          ? 'bg-[#5e7e66] text-white'
                          : 'bg-[#f7f3ed] hover:bg-[#ede6dc] text-[#4a453e]'
                      }`}
                    >
                      {copiedVoucher === v.code ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Đã lưu</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Lưu mã</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {/* Rating summary */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#e5dfd5] shadow-2xs flex items-center justify-between gap-3">
                <div>
                  <div className="text-2xl font-extrabold text-[#2c2722] flex items-center gap-1">
                    <span>{store.rating}</span>
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="text-[10px] text-[#8c827a] mt-0.5">
                    {store.reviewCount} đánh giá từ thực khách
                  </div>
                </div>
                <div className="text-right text-[11px] space-y-0.5">
                  <div className="text-[#5e7e66] font-bold">⭐⭐⭐⭐⭐ (88% hài lòng)</div>
                  <div className="text-[#8c827a]">Tốc độ pha chế: ⚡ Siêu nhanh</div>
                </div>
              </div>

              {/* Reviews list */}
              <div className="space-y-2">
                {storeReviews.map(r => (
                  <div key={r.id} className="p-3 rounded-2xl bg-white border border-[#e5dfd5] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#e5dfd5]"
                        />
                        <div>
                          <span className="font-bold text-[#2c2722] block text-[11px]">{r.name}</span>
                          <span className="text-[9px] text-[#8c827a]">{r.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-[#4a453e] leading-relaxed text-[11px]">{r.comment}</p>

                    {r.orderedItems && (
                      <div className="flex items-center gap-1 flex-wrap pt-0.5 text-[9px] text-[#8c827a]">
                        <span>Đã mua:</span>
                        {r.orderedItems.map((item, idx) => (
                          <span key={idx} className="px-1.5 py-0.2 rounded bg-[#f7f3ed] text-[#5e7e66] font-medium">
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INFO & LOCATION */}
          {activeTab === 'info' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-[#e5dfd5] shadow-2xs space-y-2.5 text-xs">
                <div>
                  <span className="font-bold text-[#2c2722] block mb-0.5">📍 Địa Chỉ:</span>
                  <p className="text-[#4a453e] leading-relaxed text-[11px]">{store.address}, {store.district}, {store.city}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0eae1] text-[11px]">
                  <div>
                    <span className="text-[#8c827a] block text-[10px]">Giờ Hoạt Động:</span>
                    <span className="font-bold text-[#2c2722]">{store.openHours}</span>
                  </div>
                  <div>
                    <span className="text-[#8c827a] block text-[10px]">Trạng Thái:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Đang mở cửa
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0eae1] text-[11px]">
                  <div>
                    <span className="text-[#8c827a] block text-[10px]">Phí Giao Dự Kiến:</span>
                    <span className="font-bold text-[#2c2722]">{store.deliveryFeeVND.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div>
                    <span className="text-[#8c827a] block text-[10px]">Thời Gian Giao:</span>
                    <span className="font-bold text-[#2c2722]">~{store.deliveryTimeMins}p ({store.distanceKm || 0.8} km)</span>
                  </div>
                </div>
              </div>

              {/* External App Links */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#6b6257] block">Bản đồ & Ứng dụng liên kết:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {store.externalLinks.googleMapsUrl && (
                    <a
                      href={store.externalLinks.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white hover:bg-[#eef4f0] border border-[#e5dfd5] font-bold text-[#5e7e66] flex items-center justify-between transition-colors shadow-2xs text-[11px]"
                    >
                      <span>🗺️ Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {store.externalLinks.grabFoodUrl && (
                    <a
                      href={store.externalLinks.grabFoodUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold text-emerald-800 flex items-center justify-between transition-colors shadow-2xs text-[11px]"
                    >
                      <span>🟢 GrabFood</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#e5dfd5] flex items-center justify-between shrink-0">
          <div className="text-xs min-w-0 pr-2">
            <span className="text-[#8c827a] text-[10px] block">Giao từ:</span>
            <span className="font-bold text-[#2c2722] truncate block max-w-[160px] sm:max-w-[220px]">
              {store.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (storeMenuDrinks[0]) {
                onAddToCart(storeMenuDrinks[0].drink, store);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7d9d85] to-[#5e7e66] text-white font-bold text-xs shadow-md shadow-[#5e7e66]/20 hover:from-[#6c8c74] hover:to-[#4e6c55] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Chọn Món Nhanh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
