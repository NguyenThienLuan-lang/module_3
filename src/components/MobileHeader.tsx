import React, { useState, useEffect } from 'react';
import { MapPin, ShoppingBag, Wifi, BatteryMedium, Droplets } from 'lucide-react';
import { CartItem, UserProfile } from '../types';

interface MobileHeaderProps {
  userAddress: string;
  onChangeLocation: () => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  userProfile: UserProfile;
  setIsProfileOpen: (open: boolean) => void;
  dailyWaterMl: number;
  dailyCaffeineMg: number;
  onLogoClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  userAddress,
  onChangeLocation,
  cartItems,
  setIsCartOpen,
  userProfile,
  setIsProfileOpen,
  dailyWaterMl,
  dailyCaffeineMg,
  onLogoClick
}) => {
  const [timeString, setTimeString] = useState('09:41');
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const rankEmoji =
    userProfile.rank === 'diamond'
      ? '💎'
      : userProfile.rank === 'gold'
      ? '🥇'
      : userProfile.rank === 'silver'
      ? '🥈'
      : '🥉';

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#e5dfd5] text-[#2c2722]">
      {/* 1. iOS / Android Status Bar */}
      <div className="px-5 pt-2.5 pb-1 flex items-center justify-between text-xs font-semibold select-none">
        <span className="tracking-tight text-xs text-[#3e3933] font-mono">{timeString}</span>

        {/* Dynamic Island pill */}
        <div className="w-24 h-4 bg-[#1f1d1a] rounded-full flex items-center justify-center px-2 shadow-xs">
          <div className="w-2 h-2 rounded-full bg-[#34312c] mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
        </div>

        {/* Status Icons */}
        <div className="flex items-center gap-1.5 text-[#3e3933]">
          <span className="text-[10px] font-bold">5G</span>
          <Wifi className="w-3.5 h-3.5" />
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>

      {/* 2. Main Mobile Navigation Bar (Balanced with Logo, Compact Address, Profile & Cart) */}
      <div className="px-3 py-2 flex items-center justify-between gap-1.5">
        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 cursor-pointer select-none shrink-0" onClick={onLogoClick}>
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7d9d85] to-[#5e7e66] flex items-center justify-center text-white shadow-xs">
            <span className="text-sm">🍵</span>
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base text-[#2c2722] leading-none">
              Daily<span className="text-[#5e7e66]">Sip</span>
            </h1>
          </div>
        </div>

        {/* Compact Address Chip */}
        <button
          onClick={onChangeLocation}
          className="flex-1 mx-0.5 flex items-center gap-1 text-[10px] sm:text-[11px] text-[#4a453e] bg-[#f2ece2] hover:bg-[#ede5d8] px-2 py-1.5 rounded-full transition-colors border border-[#ded5c7] truncate cursor-pointer"
          title="Chạm để đổi địa chỉ nhận hàng"
        >
          <MapPin className="w-3 h-3 text-[#5e7e66] shrink-0" />
          <span className="truncate max-w-[85px] sm:max-w-[120px] font-medium">{userAddress}</span>
        </button>

        {/* Actions: Profile (LEFT) & Cart (RIGHT) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* User Profile Avatar Button (To the left of Cart) */}
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="relative p-0.5 rounded-full border-2 border-[#5e7e66]/40 hover:border-[#5e7e66] transition-transform active:scale-90 cursor-pointer shadow-xs"
            title="Xem hồ sơ, hạng thành viên & voucher"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-[#2d3a31]">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 text-[9px] leading-none bg-white rounded-full p-0.2 shadow-xs">
              {rankEmoji}
            </span>
          </button>

          {/* Prominent Shopping Cart */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#5e7e66] hover:bg-[#4e6c55] text-white text-xs font-bold transition-all active:scale-95 shadow-md shadow-[#5e7e66]/25 cursor-pointer"
            title="Giỏ hàng đặt món"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">Giỏ</span>
            {totalCartCount > 0 && (
              <span className="bg-[#d98b72] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full ring-1 ring-white">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Quick Stats Mini-Ticker */}
      <div className="px-4 py-1 bg-[#f5efe6] border-t border-[#ded5c7]/50 flex items-center justify-between text-[11px] text-[#6b6257]">
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3 h-3 text-[#5e7e66]" />
          <span>Hôm nay: <strong className="text-[#3e3933]">{dailyWaterMl} ml</strong> nước</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>☕ Cafein: <strong className="text-[#b86e55]">{dailyCaffeineMg} mg</strong></span>
        </div>
      </div>
    </header>
  );
};
