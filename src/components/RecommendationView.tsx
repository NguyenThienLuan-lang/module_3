import React from 'react';
import { Sparkles, MapPin, ShoppingBag, BookOpen, Plus, Heart, Flame, Coffee, Droplets, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { Drink, AIAdvice } from '../types';

interface RecommendationViewProps {
  drinks: Drink[];
  aiAnalysis?: AIAdvice;
  onSelectDrinkForStores: (drink: Drink) => void;
  onQuickOrder: (drink: Drink) => void;
  onOpenRecipe: (drink: Drink) => void;
  onLogDrink: (drink: Drink) => void;
  onRetakeCheckIn: () => void;
}

export const RecommendationView: React.FC<RecommendationViewProps> = ({
  drinks,
  aiAnalysis,
  onSelectDrinkForStores,
  onQuickOrder,
  onOpenRecipe,
  onLogDrink,
  onRetakeCheckIn
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* AI Doctor / Sommelier Summary Card */}
      {aiAnalysis && (
        <div className="bg-gradient-to-br from-[#4a5f50] via-[#3e5244] to-[#2d3a31] text-[#fdfbf7] rounded-3xl p-6 sm:p-7 shadow-xl border border-[#5e7e66]/40 mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#7d9d85]/15 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7d9d85]/20 text-[#eef4f0] text-xs font-semibold backdrop-blur-sm border border-[#7d9d85]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#eaddcf]" />
                <span>Nhận Định Từ AI Dinh Dưỡng DailySip</span>
              </div>
              <button
                onClick={onRetakeCheckIn}
                className="text-xs text-[#cfc8bf] hover:text-white underline underline-offset-2 cursor-pointer"
              >
                Khảo sát lại
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-2 text-[#fdfbf7]">
              {aiAnalysis.summary}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <span className="text-[#eef4f0] font-semibold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7d9d85]" /> Lời khuyên thể trạng:
                </span>
                <p className="text-[#cfc8bf] leading-relaxed">{aiAnalysis.wellnessTip}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <span className="text-[#f5d0c5] font-semibold flex items-center gap-1.5 mb-1">
                  <Coffee className="w-3.5 h-3.5 text-[#d98b72]" /> Kiểm soát Cafein:
                </span>
                <p className="text-[#cfc8bf] leading-relaxed">{aiAnalysis.caffeineAdvice}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <span className="text-[#eaddcf] font-semibold flex items-center gap-1.5 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-[#7d9d85]" /> Độ ngọt & Năng lượng:
                </span>
                <p className="text-[#cfc8bf] leading-relaxed">{aiAnalysis.sugarAdvice}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#2c2722] flex items-center gap-2">
            <span>✨</span> Top 5 Đồ Uống Khuyên Dùng Cho Bạn
          </h3>
          <p className="text-xs text-[#8c827a] mt-0.5">Xếp hạng theo độ tương thích với thể trạng và mục tiêu hôm nay</p>
        </div>
      </div>

      {/* Drink list */}
      <div className="space-y-6">
        {drinks.map((drink, index) => {
          return (
            <div
              key={drink.id}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#e5dfd5] hover:border-[#7d9d85]/60 transition-all group overflow-hidden relative"
            >
              {/* Ranking Badge */}
              <div className="absolute top-0 left-0 bg-gradient-to-r from-[#7d9d85] to-[#5e7e66] text-white text-xs font-bold px-3.5 py-1.5 rounded-br-2xl shadow-xs flex items-center gap-1">
                <span>Top #{index + 1}</span>
                <span className="text-[#eef4f0]/80">|</span>
                <span>{drink.matchScore || 95}% Phù hợp</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4 sm:mt-2">
                {/* Image */}
                <div className="md:col-span-4 relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square bg-[#f7f3ed]">
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                    {drink.isHotAvailable && (
                      <span className="bg-[#4a2e24]/85 backdrop-blur-xs text-[#fdf5f0] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        ♨️ Có Nóng
                      </span>
                    )}
                    {drink.isColdAvailable && (
                      <span className="bg-[#2d3a31]/85 backdrop-blur-xs text-[#eef4f0] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        🧊 Có Đá
                      </span>
                    )}
                    {drink.isVegan && (
                      <span className="bg-[#5e7e66]/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        🌱 Vegan
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="md:col-span-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#2c2722] leading-tight">
                          {drink.name}
                        </h4>
                        <p className="text-xs text-[#5e7e66] font-semibold mt-0.5">
                          {drink.vietnameseName}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base sm:text-lg font-extrabold text-[#2c2722]">
                          {drink.priceVND.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="text-[10px] text-[#8c827a] block">giá tham khảo</span>
                      </div>
                    </div>

                    {/* Nutrition pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                      <div className="flex items-center gap-1 bg-[#fdf5f0] text-[#8c4c43] px-2.5 py-1 rounded-lg border border-[#e8cfc8] font-medium">
                        <Flame className="w-3.5 h-3.5 text-[#d98b72]" />
                        <span>{drink.calories} kcal</span>
                      </div>
                      <div className="flex items-center gap-1 bg-[#f7f3ed] text-[#4a453e] px-2.5 py-1 rounded-lg border border-[#e5dfd5] font-medium">
                        <Droplets className="w-3.5 h-3.5 text-[#7d9d85]" />
                        <span>{drink.sugarGrams}g đường</span>
                      </div>
                      <div className="flex items-center gap-1 bg-[#f7ece6] text-[#b86e55] px-2.5 py-1 rounded-lg border border-[#d98b72]/40 font-medium">
                        <Coffee className="w-3.5 h-3.5 text-[#d98b72]" />
                        <span>{drink.caffeineMg === 0 ? '0mg Cafein' : `${drink.caffeineMg}mg Cafein`}</span>
                      </div>
                    </div>

                    {/* Why it fits explanation */}
                    <div className="mt-3.5 bg-[#eef4f0]/80 border border-[#7d9d85]/30 rounded-2xl p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2c3a31] mb-1">
                        <CheckCircle2 className="w-4 h-4 text-[#5e7e66] shrink-0" />
                        <span>Vì sao món này tốt cho bạn hôm nay:</span>
                      </div>
                      <p className="text-xs text-[#4a453e] leading-relaxed">
                        {drink.whyItFits || drink.description}
                      </p>
                    </div>

                    {/* Health benefits */}
                    <div className="mt-3">
                      <span className="text-[11px] font-semibold text-[#8c827a] uppercase tracking-wider block mb-1">
                        Lợi ích sinh học chính:
                      </span>
                      <ul className="text-xs text-[#4a453e] space-y-1">
                        {drink.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#7d9d85] font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-4 border-t border-[#e5dfd5] flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onOpenRecipe(drink)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-[#4a453e] bg-[#f7f3ed] hover:bg-[#ede6dc] transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Xem công thức tự pha tại nhà"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#7d9d85]" />
                        <span>Công thức DIY</span>
                      </button>

                      <button
                        onClick={() => onLogDrink(drink)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-[#4a453e] bg-[#f7f3ed] hover:bg-[#ede6dc] transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Đã uống món này và ghi vào nhật ký"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#5e7e66]" />
                        <span>Đã uống món này</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onSelectDrinkForStores(drink)}
                        className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold text-[#5e7e66] bg-[#eef4f0] hover:bg-[#e2ede5] border border-[#7d9d85]/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#5e7e66]" />
                        <span>Xem Quán Gần Đây</span>
                      </button>

                      <button
                        onClick={() => onQuickOrder(drink)}
                        className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7d9d85] to-[#5e7e66] hover:from-[#6c8c74] hover:to-[#4e6c55] transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Đặt Ship Ngay</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
