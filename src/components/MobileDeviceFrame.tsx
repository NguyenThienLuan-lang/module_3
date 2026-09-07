import React from 'react';
import { Smartphone, Monitor, Laptop, Sparkles } from 'lucide-react';

export type DeviceMode = 'mobile_frame' | 'mobile_full' | 'desktop';

interface MobileDeviceFrameProps {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  deviceMode,
  setDeviceMode,
  children
}) => {
  if (deviceMode === 'desktop') {
    return (
      <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#141210] flex flex-col selection:bg-[#7d9d85]/30">
        {/* Floating Switcher Toolbar on Desktop */}
        <div className="sticky top-2 z-50 flex justify-center pointer-events-none mb-2">
          <div className="pointer-events-auto bg-[#1e1b18]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs text-[#cfc8bf] shadow-xl flex items-center gap-2">
            <span className="text-[#10b981] text-base">●</span>
            <span className="font-medium mr-1">Chế độ xem:</span>

            <button
              onClick={() => setDeviceMode('desktop')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7d9d85] text-white font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Máy Tính (PC Web)</span>
            </button>

            <button
              onClick={() => setDeviceMode('mobile_frame')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[#a8a095] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Khung iPhone 16 Pro</span>
            </button>

            <button
              onClick={() => setDeviceMode('mobile_full')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[#a8a095] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Mobile</span>
            </button>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] bg-[#fdfbf7] dark:bg-[#141210] md:bg-[#2d2824] md:dark:bg-[#0f0e0c] text-[#4a453e] dark:text-[#d4cdc5] flex flex-col items-center justify-start md:py-6 selection:bg-[#7d9d85]/30">
      {/* Floating Desktop Toolbar to toggle device simulation */}
      <div className="hidden md:flex items-center gap-2 mb-4 bg-[#1e1b18]/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs text-[#cfc8bf] shadow-xl z-50">
        <div className="flex items-center gap-2 font-medium mr-1">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span>Chuyển đổi giao diện:</span>
        </div>

        <button
          onClick={() => setDeviceMode('mobile_frame')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            deviceMode === 'mobile_frame'
              ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
              : 'text-[#a8a095] hover:text-white hover:bg-white/10'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Khung iPhone 16 Pro</span>
        </button>

        <button
          onClick={() => setDeviceMode('mobile_full')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            deviceMode === 'mobile_full'
              ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
              : 'text-[#a8a095] hover:text-white hover:bg-white/10'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Mobile</span>
        </button>

        <button
          onClick={() => setDeviceMode('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            deviceMode === 'desktop'
              ? 'bg-[#7d9d85] text-white font-semibold shadow-xs'
              : 'text-[#a8a095] hover:text-white hover:bg-white/10'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Giao Diện PC (Web)</span>
        </button>
      </div>

      {/* Main Container */}
      {deviceMode === 'mobile_frame' ? (
        /* iPhone 16 Pro Realistic Frame on Desktop, Seamless View on Mobile */
        <div className="relative w-full h-[100dvh] md:h-[900px] md:max-w-[430px] md:max-h-[92vh] md:rounded-[52px] bg-[#fdfbf7] dark:bg-[#141210] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] md:border-[10px] md:border-[#38332d] md:ring-4 md:ring-[#524b42]/40 overflow-hidden flex flex-col">
          {/* Hardware buttons */}
          <div className="hidden md:block absolute -left-[14px] top-28 w-[4px] h-10 bg-[#524b42] rounded-l-md"></div>
          <div className="hidden md:block absolute -left-[14px] top-42 w-[4px] h-14 bg-[#524b42] rounded-l-md"></div>
          <div className="hidden md:block absolute -left-[14px] top-60 w-[4px] h-14 bg-[#524b42] rounded-l-md"></div>
          <div className="hidden md:block absolute -right-[14px] top-36 w-[4px] h-20 bg-[#524b42] rounded-r-md"></div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative scrollbar-none h-full bg-[#fdfbf7] dark:bg-[#141210]">
            {children}
          </div>
        </div>
      ) : (
        /* Full Width Centered Mobile View */
        <div className="w-full max-w-md h-[100dvh] min-h-[100dvh] md:min-h-screen bg-[#fdfbf7] dark:bg-[#141210] shadow-2xl flex flex-col relative overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};
