import React from 'react';
import { ClipboardList, Sparkles, MapPin, Droplets, Bot, Sparkle } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'checkin' | 'recommendations' | 'stores' | 'history' | 'sommelier';
  setActiveTab: (tab: 'checkin' | 'recommendations' | 'stores' | 'history' | 'sommelier') => void;
  onOpenSommelier: () => void;
  recommendationsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSommelier,
  recommendationsCount = 5
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#fdfbf7]/95 backdrop-blur-lg border-t border-[#e5dfd5] shadow-lg max-w-md mx-auto">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* Tab 1: Check-in */}
        <button
          type="button"
          onClick={() => setActiveTab('checkin')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'checkin'
              ? 'text-[#5e7e66] font-bold scale-105'
              : 'text-[#8c827a] hover:text-[#5e7e66]'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'checkin' ? 'bg-[#7d9d85]/15' : ''}`}>
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Khảo Sát</span>
        </button>

        {/* Tab 2: Recommendations */}
        <button
          type="button"
          onClick={() => setActiveTab('recommendations')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 relative cursor-pointer ${
            activeTab === 'recommendations'
              ? 'text-[#5e7e66] font-bold scale-105'
              : 'text-[#8c827a] hover:text-[#5e7e66]'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'recommendations' ? 'bg-[#7d9d85]/15' : ''}`}>
            <Sparkles className="w-5 h-5 text-[#d98b72]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Top 5 Gợi Ý</span>
          {recommendationsCount > 0 && (
            <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#d98b72] ring-2 ring-[#fdfbf7]" />
          )}
        </button>

        {/* Tab 3: CHÍNH GIỮA - HỎI AI (VIBRANT & PROMINENT CENTER ACTION) */}
        <div className="flex flex-col items-center justify-center relative -top-3">
          <button
            type="button"
            onClick={onOpenSommelier}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#d98b72] via-[#e27e5f] to-[#7d9d85] text-white flex items-center justify-center shadow-lg shadow-[#d98b72]/45 ring-4 ring-[#fdfbf7] active:scale-90 hover:scale-105 transition-all duration-200 cursor-pointer relative group"
            title="Hỏi Chuyên Gia Dinh Dưỡng & Sommelier AI"
          >
            {/* Radiant glow pulse effect */}
            <div className="absolute inset-0 rounded-full bg-[#d98b72] opacity-30 animate-ping pointer-events-none" />
            <div className="relative flex items-center justify-center">
              <Bot className="w-6 h-6 text-white group-hover:rotate-6 transition-transform" />
              <Sparkle className="w-3 h-3 text-[#fdfbf7] absolute -top-1 -right-1 fill-white animate-pulse" />
            </div>
          </button>
          <span className="text-[10px] font-extrabold text-[#b86e55] tracking-tight mt-0.5">
            Hỏi AI ✨
          </span>
        </div>

        {/* Tab 4: Hydration History */}
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'history'
              ? 'text-[#5e7e66] font-bold scale-105'
              : 'text-[#8c827a] hover:text-[#5e7e66]'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'history' ? 'bg-[#7d9d85]/15' : ''}`}>
            <Droplets className="w-5 h-5 text-[#7d9d85]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Nhật Ký</span>
        </button>

        {/* Tab 5: Stores (Quán Gần) */}
        <button
          type="button"
          onClick={() => setActiveTab('stores')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === 'stores'
              ? 'text-[#5e7e66] font-bold scale-105'
              : 'text-[#8c827a] hover:text-[#5e7e66]'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'stores' ? 'bg-[#7d9d85]/15' : ''}`}>
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Quán Gần</span>
        </button>
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-[#4a453e]/25 rounded-full mx-auto mb-1.5" />
    </nav>
  );
};
