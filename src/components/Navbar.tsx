import React from 'react';
import { ShoppingBag, Droplets, MapPin, Sparkles } from 'lucide-react';
import { CartItem, UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'checkin' | 'recommendations' | 'stores' | 'history' | 'sommelier';
  setActiveTab: (tab: 'checkin' | 'recommendations' | 'stores' | 'history' | 'sommelier') => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  setIsSommelierOpen: (open: boolean) => void;
  userProfile: UserProfile;
  setIsProfileOpen: (open: boolean) => void;
  dailyWaterMl: number;
  dailyCaffeineMg: number;
  userAddress: string;
  onChangeLocation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartItems,
  setIsCartOpen,
  setIsSommelierOpen,
  userProfile,
  setIsProfileOpen,
  dailyWaterMl,
  dailyCaffeineMg,
  userAddress,
  onChangeLocation
}) => {
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const rankEmoji =
    userProfile.rank === 'diamond'
      ? '💎'
      : userProfile.rank === 'gold'
      ? '🥇'
      : userProfile.rank === 'silver'
      ? '🥈'
      : '🥉';

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#e5dfd5]">
      {/* Top tier brand and action buttons */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setActiveTab('checkin')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7d9d85] to-[#5e7e66] flex items-center justify-center text-white shadow-md shadow-[#7d9d85]/20">
            <span className="text-xl">🍵</span>
          </div>
          <div>
            <h1 className="font-bold text-lg sm:text-xl text-[#2c2722]">
              Daily<span className="text-[#7d9d85]">Sip</span>
            </h1>
            <p className="text-xs text-[#8c827a] hidden sm:block">Gợi ý đồ uống cá nhân hóa & Đặt ship cho nhóm</p>
          </div>
        </div>

        {/* Location selector */}
        <button
          type="button"
          onClick={onChangeLocation}
          className="hidden md:flex items-center gap-1.5 text-xs text-[#4a453e] bg-[#f7f3ed] hover:bg-[#ede6dc] px-3 py-1.5 rounded-full transition-colors border border-[#e5dfd5] max-w-[200px] truncate cursor-pointer"
          title="Bấm để đổi vị trí của bạn"
        >
          <MapPin className="w-3.5 h-3.5 text-[#7d9d85] shrink-0" />
          <span className="truncate">{userAddress}</span>
        </button>

        {/* Action icons & stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick hydration widget */}
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className="hidden sm:flex items-center gap-2 bg-[#eef4f0] hover:bg-[#e2ede5] text-[#4a453e] px-3 py-1.5 rounded-full text-xs font-medium border border-[#7d9d85]/30 transition-colors cursor-pointer"
            title="Xem nhật ký uống nước & nạp cafein"
          >
            <div className="flex items-center gap-1 text-[#5e7e66] font-semibold">
              <Droplets className="w-3.5 h-3.5 text-[#7d9d85]" />
              <span>{dailyWaterMl}ml</span>
            </div>
            <span className="text-[#d8cfc4]">|</span>
            <div className="flex items-center gap-1 text-[#b86e55] font-semibold">
              <span>☕ {dailyCaffeineMg}mg</span>
            </div>
          </button>

          {/* AI Sommelier chat button */}
          <button
            type="button"
            onClick={() => setIsSommelierOpen(true)}
            className="flex items-center gap-1.5 bg-[#fdf5f0] hover:bg-[#faeae1] text-[#b86e55] border border-[#d98b72]/40 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d98b72]" />
            <span className="hidden sm:inline">Hỏi Chuyên Gia AI</span>
            <span className="sm:hidden">Hỏi AI</span>
          </button>

          {/* User Profile Button (Located to the LEFT of Cart) */}
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 bg-[#f7f3ed] hover:bg-[#ede6dc] px-3 py-1.5 rounded-full border border-[#e5dfd5] transition-all cursor-pointer shadow-xs active:scale-95"
            title="Xem hồ sơ người dùng & Hạng thành viên"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-[#2d3a31] border border-[#5e7e66]/50">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-bold text-[#2c2722]">{userProfile.name}</span>
            <span className="text-xs">{rankEmoji}</span>
          </button>

          {/* Prominent Cart button for Group Orders */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-[#5e7e66] hover:bg-[#4e6c55] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md shadow-[#5e7e66]/20 transition-all active:scale-95 cursor-pointer"
            title="Mở giỏ hàng đặt món cho nhóm bạn bè"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Giỏ Hàng</span>
            {totalCartCount > 0 && (
              <span className="bg-[#d98b72] text-white text-[11px] font-black px-2 py-0.2 rounded-full ring-2 ring-white">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="border-t border-[#e5dfd5] bg-[#f7f3ed]/90">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-2 sm:gap-6 overflow-x-auto py-2 scrollbar-none text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('checkin')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'checkin'
                ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
                : 'text-[#615a52] hover:text-[#2c2722] hover:bg-[#eaddcf]/60'
            }`}
          >
            <span>📝</span> Daily Check-in
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'recommendations'
                ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
                : 'text-[#615a52] hover:text-[#2c2722] hover:bg-[#eaddcf]/60'
            }`}
          >
            <span>✨</span> Top 5 Gợi Ý Hôm Nay
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stores')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'stores'
                ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
                : 'text-[#615a52] hover:text-[#2c2722] hover:bg-[#eaddcf]/60'
            }`}
          >
            <span>📍</span> Quán Gần Bạn & Đặt Ship
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
                : 'text-[#615a52] hover:text-[#2c2722] hover:bg-[#eaddcf]/60'
            }`}
          >
            <span>📊</span> Nhật Ký & Năng Lượng
          </button>
        </div>
      </nav>
    </header>
  );
};
