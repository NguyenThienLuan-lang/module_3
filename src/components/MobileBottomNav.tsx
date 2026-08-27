import React from 'react';
import { ClipboardList, Sparkles, MapPin, Droplets, Bot, MessageSquareText } from 'lucide-react';

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
          onClick={() => setActiveTab('checkin')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 ${
            activeTab === 'checkin'
              ? 'text-[#5e7e66] font-bold scale-105'
              : 'text-[#8c827a] hover:text-[#5e7e66]'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'checkin' ? 'bg-[#7d9d85]/15' : ''}`}>
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Khảo Sát</span>
        </button>

        {/* Tab 2: Recommendations */}
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 relative ${
            activeTab === 'recommendations'
              ? 'text-[#5e7e66] font-bold scale-105'
              : 'text-[#8c827a] hover:text-[#5e7e66]'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'recommendations' ? 'bg-[#7d9d85]/15' : ''}`}>
            <Sparkles className="w-5 h-5 text-[#d98b72]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Top 5 Gợi Ý</span>
          {recommendationsCount > 0 && (
            <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#d98b72] ring-2 ring-[#fdfbf7]" />
          )}
        </button>

        {/* Tab 3: Stores */}
        <button
          onClick={() => setActiveTab('stores')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 ${
            activeTab === 'stores'
              ? 'text-[#5e7e66] font-bold scale-105'
              : 'text-[#8c827a] hover:text-[#5e7e66]'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'stores' ? 'bg-[#7d9d85]/15' : ''}`}>
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Quán Gần</span>
        </button>

        {/* Tab 4: Hydration History */}
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 ${
            activeTab === 'history'
              ? 'text-[#5e7e66] font-bold scale-105'
              : 'text-[#8c827a] hover:text-[#5e7e66]'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${activeTab === 'history' ? 'bg-[#7d9d85]/15' : ''}`}>
            <Droplets className="w-5 h-5 text-[#7d9d85]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Nhật Ký</span>
        </button>

        {/* Tab 5: AI Sommelier */}
        <button
          onClick={onOpenSommelier}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[#b86e55] hover:text-[#d98b72] transition-all duration-200"
        >
          <div className="p-1.5 rounded-full bg-[#d98b72]/15 animate-bounce-short">
            <Bot className="w-5 h-5 text-[#d98b72]" />
          </div>
          <span className="text-[10px] mt-0.5 font-semibold text-[#b86e55] tracking-tight">Hỏi AI</span>
        </button>
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-[#4a453e]/25 rounded-full mx-auto mb-1.5" />
    </nav>
  );
};
