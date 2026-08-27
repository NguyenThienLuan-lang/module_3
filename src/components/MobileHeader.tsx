import React, { useState, useEffect } from 'react';
import { MapPin, ShoppingBag, Dices, Wifi, BatteryMedium, Sparkles, Droplets } from 'lucide-react';
import { CartItem } from '../types';

interface MobileHeaderProps {
  userAddress: string;
  onChangeLocation: () => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  setIsSurpriseOpen: (open: boolean) => void;
  dailyWaterMl: number;
  dailyCaffeineMg: number;
  onLogoClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  userAddress,
  onChangeLocation,
  cartItems,
  setIsCartOpen,
  setIsSurpriseOpen,
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

      {/* 2. Main Mobile Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={onLogoClick}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7d9d85] to-[#5e7e66] flex items-center justify-center text-white shadow-xs">
            <span className="text-base">🍵</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-bold text-base text-[#2c2722]">
                Daily<span className="text-[#5e7e66]">Sip</span>
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded-full bg-[#eef4f0] text-[#5e7e66] border border-[#7d9d85]/30">
                AI
              </span>
            </div>
          </div>
        </div>

        {/* Address Chip */}
        <button
          onClick={onChangeLocation}
          className="flex-1 mx-1 flex items-center gap-1 text-[11px] text-[#4a453e] bg-[#f2ece2] hover:bg-[#ede5d8] px-2.5 py-1.5 rounded-full transition-colors border border-[#ded5c7] truncate"
          title="Chạm để đổi địa chỉ nhận hàng"
        >
          <MapPin className="w-3 h-3 text-[#5e7e66] shrink-0" />
          <span className="truncate max-w-[120px] font-medium">{userAddress}</span>
        </button>

        {/* Actions (Surprise Wheel & Cart) */}
        <div className="flex items-center gap-1.5">
          {/* Surprise spin */}
          <button
            onClick={() => setIsSurpriseOpen(true)}
            className="p-1.5 text-[#b86e55] bg-[#fdf5f0] hover:bg-[#faeae1] border border-[#d98b72]/40 rounded-full transition-transform active:scale-95 shadow-2xs"
            title="Quay ngẫu nhiên đồ uống"
          >
            <Dices className="w-4 h-4 text-[#d98b72]" />
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 text-[#3e3933] bg-[#f2ece2] hover:bg-[#ede5d8] border border-[#ded5c7] rounded-full transition-transform active:scale-95 shadow-2xs"
            title="Giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4 text-[#4a453e]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#5e7e66] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
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
