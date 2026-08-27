import React from 'react';
import { Sparkles, MapPin, Droplets, ShoppingBag, MessageSquareText, Compass, Dices } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  activeTab: 'checkin' | 'recommendations' | 'stores' | 'history' | 'sommelier';
  setActiveTab: (tab: 'checkin' | 'recommendations' | 'stores' | 'history' | 'sommelier') => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  setIsSommelierOpen: (open: boolean) => void;
  setIsSurpriseOpen: (open: boolean) => void;
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
  setIsSurpriseOpen,
  dailyWaterMl,
  dailyCaffeineMg,
  userAddress,
  onChangeLocation
}) => {
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#e5dfd5] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand logo & tagline */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('checkin')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7d9d85] to-[#5e7e66] flex items-center justify-center text-white shadow-md shadow-[#7d9d85]/20">
            <span className="text-xl">🍵</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-lg sm:text-xl text-[#2c2722]">
                Daily<span className="text-[#7d9d85]">Sip</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#eef4f0] text-[#5e7e66] border border-[#7d9d85]/30">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-[#8c827a] hidden sm:block">Gợi ý đồ uống cá nhân hóa & Đặt ship</p>
          </div>
        </div>

        {/* Location selector */}
        <button
          onClick={onChangeLocation}
          className="hidden md:flex items-center gap-1.5 text-xs text-[#4a453e] bg-[#f7f3ed] hover:bg-[#ede6dc] px-3 py-1.5 rounded-full transition-colors border border-[#e5dfd5] max-w-[200px] truncate"
          title="Bấm để đổi vị trí của bạn"
        >
          <MapPin className="w-3.5 h-3.5 text-[#7d9d85] shrink-0" />
          <span className="truncate">{userAddress}</span>
        </button>

        {/* Action icons & stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick hydration widget */}
          <button
            onClick={() => setActiveTab('history')}
            className="hidden sm:flex items-center gap-2 bg-[#eef4f0] hover:bg-[#e2ede5] text-[#4a453e] px-3 py-1.5 rounded-full text-xs font-medium border border-[#7d9d85]/30 transition-colors"
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

          {/* Surprise spin wheel button */}
          <button
            onClick={() => setIsSurpriseOpen(true)}
            className="flex items-center gap-1.5 bg-[#fdf5f0] hover:bg-[#faeae1] text-[#b86e55] border border-[#d98b72]/40 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-transform active:scale-95"
            title="Quay ngẫu nhiên đồ uống hôm nay"
          >
            <Dices className="w-3.5 h-3.5 text-[#d98b72] animate-spin-slow" />
            <span className="hidden sm:inline">Vòng quay</span>
          </button>

          {/* AI Sommelier chat button */}
          <button
            onClick={() => setIsSommelierOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#7d9d85] to-[#5e7e66] hover:from-[#6c8c74] hover:to-[#4e6c55] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fdfbf7]" />
            <span className="hidden sm:inline">Hỏi Chuyên Gia AI</span>
            <span className="sm:hidden">Hỏi AI</span>
          </button>

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#4a453e] hover:text-[#5e7e66] hover:bg-[#f7f3ed] rounded-full transition-colors"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#7d9d85] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-pulse">
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
            onClick={() => setActiveTab('checkin')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'checkin'
                ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
                : 'text-[#615a52] hover:text-[#2c2722] hover:bg-[#eaddcf]/60'
            }`}
          >
            <span>📝</span> Daily Check-in
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'recommendations'
                ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
                : 'text-[#615a52] hover:text-[#2c2722] hover:bg-[#eaddcf]/60'
            }`}
          >
            <span>✨</span> Top 5 Gợi Ý Hôm Nay
          </button>

          <button
            onClick={() => setActiveTab('stores')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'stores'
                ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
                : 'text-[#615a52] hover:text-[#2c2722] hover:bg-[#eaddcf]/60'
            }`}
          >
            <span>📍</span> Quán Gần Bạn & Đặt Ship
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
                : 'text-[#615a52] hover:text-[#2c2722] hover:bg-[#eaddcf]/60'
            }`}
          >
            <span>📊</span> Nhật Ký Uống & Sức Khỏe
          </button>
        </div>
      </nav>
    </header>
  );
};
