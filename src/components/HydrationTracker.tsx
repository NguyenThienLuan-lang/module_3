import React from 'react';
import { Droplets, Coffee, Flame, Plus, Trash2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { HydrationLogItem } from '../types';

interface HydrationTrackerProps {
  logs: HydrationLogItem[];
  onAddQuickDrink: (name: string, ml: number, cal: number, caf: number, sugar: number, category: string) => void;
  onClearLogs: () => void;
  onRemoveLog: (id: string) => void;
}

export const HydrationTracker: React.FC<HydrationTrackerProps> = ({
  logs,
  onAddQuickDrink,
  onClearLogs,
  onRemoveLog
}) => {
  const totalWaterMl = logs.reduce((sum, item) => sum + item.volumeMl, 0);
  const totalCalories = logs.reduce((sum, item) => sum + item.calories, 0);
  const totalCaffeine = logs.reduce((sum, item) => sum + item.caffeineMg, 0);
  const totalSugar = logs.reduce((sum, item) => sum + item.sugarGrams, 0);

  const waterGoalMl = 2000;
  const caffeineLimitMg = 300;
  const sugarLimitGrams = 35;

  const waterPercent = Math.min(100, Math.round((totalWaterMl / waterGoalMl) * 100));
  const caffeinePercent = Math.min(100, Math.round((totalCaffeine / caffeineLimitMg) * 100));
  const sugarPercent = Math.min(100, Math.round((totalSugar / sugarLimitGrams) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2c2722] flex items-center gap-2">
            <Droplets className="w-6 h-6 text-[#7d9d85]" />
            <span>Nhật Ký Uống Nước & Kiểm Soát Năng Lượng</span>
          </h2>
          <p className="text-xs text-[#8c827a] mt-0.5">Theo dõi chỉ số nước bù, cafein và đường nạp vào cơ thể hôm nay</p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="text-xs text-[#8c827a] hover:text-[#b86e55] flex items-center gap-1 font-medium self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa nhật ký hôm nay</span>
          </button>
        )}
      </div>

      {/* 3 Main Health Gauge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Water Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#e5dfd5] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#2c3a31] uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#7d9d85]" />
              Nước nạp hôm nay
            </span>
            <span className="text-xs font-bold text-[#5e7e66]">{waterPercent}%</span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-2xl font-extrabold text-[#2c2722]">{totalWaterMl}</span>
            <span className="text-xs text-[#8c827a]">/ {waterGoalMl} ml</span>
          </div>

          <div className="w-full h-2 bg-[#f7f3ed] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7d9d85] to-[#5e7e66] rounded-full transition-all duration-500"
              style={{ width: `${waterPercent}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-[#8c827a] mt-2 block">
            {waterPercent >= 100 ? '🎉 Đạt mục tiêu cấp ẩm!' : `Còn thiếu ${waterGoalMl - totalWaterMl}ml nữa`}
          </span>
        </div>

        {/* Caffeine Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#e5dfd5] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#4a2e24] uppercase tracking-wider flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-[#d98b72]" />
              Lượng Cafein
            </span>
            <span
              className={`text-xs font-bold ${
                caffeinePercent > 85 ? 'text-[#b86e55]' : 'text-[#d98b72]'
              }`}
            >
              {caffeinePercent}%
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-2xl font-extrabold text-[#2c2722]">{totalCaffeine}</span>
            <span className="text-xs text-[#8c827a]">/ {caffeineLimitMg} mg an toàn</span>
          </div>

          <div className="w-full h-2 bg-[#f7f3ed] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                caffeinePercent > 85 ? 'bg-[#b86e55]' : 'bg-gradient-to-r from-[#d98b72] to-[#b86e55]'
              }`}
              style={{ width: `${caffeinePercent}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-[#8c827a] mt-2 block">
            {caffeinePercent > 85 ? '⚠️ Sắp chạm trần an toàn' : 'Trạng thái êm dịu, không ép tim'}
          </span>
        </div>

        {/* Sugar Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#e5dfd5] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#2c3a31] uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#7d9d85]" />
              Đường & Calo
            </span>
            <span className="text-xs font-bold text-[#5e7e66]">{totalCalories} kcal</span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-2xl font-extrabold text-[#2c2722]">{totalSugar}</span>
            <span className="text-xs text-[#8c827a]">/ {sugarLimitGrams}g đường</span>
          </div>

          <div className="w-full h-2 bg-[#f7f3ed] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7d9d85] to-[#4a5f50] rounded-full transition-all duration-500"
              style={{ width: `${sugarPercent}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-[#8c827a] mt-2 block">
            Mức đường kiểm soát lành mạnh
          </span>
        </div>
      </div>

      {/* Quick Add Water / Beverages Action Bar */}
      <div className="bg-[#f7f3ed] rounded-2xl p-4 border border-[#e5dfd5] mb-8">
        <span className="text-xs font-bold text-[#2c2722] uppercase tracking-wider block mb-2.5">
          ⚡ Ghi nhanh thức uống vừa nạp:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => onAddQuickDrink('Nước lọc / Nước khoáng ấm', 250, 0, 0, 0, 'water')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#eef4f0] text-[#2c3a31] border border-[#e5dfd5] font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Droplets className="w-3.5 h-3.5 text-[#7d9d85]" />
            <span>+250ml Nước lọc</span>
          </button>
          <button
            onClick={() => onAddQuickDrink('Trà Thảo Mộc Ấm', 300, 15, 0, 2, 'herbal')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#eef4f0] text-[#2c3a31] border border-[#e5dfd5] font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>🍵</span>
            <span>+300ml Trà Thảo Mộc</span>
          </button>
          <button
            onClick={() => onAddQuickDrink('Cold Brew Cam Sả', 350, 85, 110, 9, 'coffee')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#fdf5f0] text-[#4a2e24] border border-[#e5dfd5] font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>☕</span>
            <span>+350ml Cold Brew Cam</span>
          </button>
          <button
            onClick={() => onAddQuickDrink('Nước Dừa Tươi Tắc', 350, 65, 0, 8, 'juice')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f7f3ed] text-[#4a453e] border border-[#e5dfd5] font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>🥥</span>
            <span>+350ml Nước Dừa Xiêm</span>
          </button>
        </div>
      </div>

      {/* History Log List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e5dfd5] shadow-xs">
        <h3 className="text-sm font-bold text-[#2c2722] uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Lịch sử hôm nay ({logs.length} lần uống)</span>
        </h3>

        {logs.length === 0 ? (
          <div className="text-center py-12 text-[#a8a095]">
            <Droplets className="w-10 h-10 mx-auto text-[#cfc8bf] stroke-1 mb-2" />
            <p className="text-xs">Chưa có bản ghi nào hôm nay. Hãy ghi lại mỗi lần bạn uống nhé!</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e5dfd5] text-xs">
            {logs.map(item => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f7f3ed] flex items-center justify-center text-[#4a453e] font-bold shrink-0">
                    {item.drinkCategory === 'coffee'
                      ? '☕'
                      : item.drinkCategory === 'tea' || item.drinkCategory === 'herbal'
                      ? '🍵'
                      : '💧'}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2c2722] leading-tight">{item.drinkName}</h4>
                    <div className="text-[11px] text-[#8c827a] mt-0.5 flex items-center gap-2">
                      <span>{item.volumeMl}ml</span>
                      <span>•</span>
                      <span>{item.calories} kcal</span>
                      {item.caffeineMg > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-[#b86e55] font-semibold">{item.caffeineMg}mg cafein</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#a8a095] font-medium">{item.timestamp}</span>
                  <button
                    onClick={() => onRemoveLog(item.id)}
                    className="text-[#cfc8bf] hover:text-[#b86e55] p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
