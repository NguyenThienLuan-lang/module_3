import React, { useState } from 'react';
import { X, Dices, Sparkles, ShoppingBag, MapPin, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Drink } from '../types';

interface SurpriseWheelProps {
  isOpen: boolean;
  onClose: () => void;
  drinks: Drink[];
  onSelectDrink: (drink: Drink) => void;
}

export const SurpriseWheel: React.FC<SurpriseWheelProps> = ({
  isOpen,
  onClose,
  drinks,
  onSelectDrink
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [rotationDeg, setRotationDeg] = useState(0);

  if (!isOpen) return null;

  const wheelItems = drinks.slice(0, 6);

  const handleSpin = () => {
    if (isSpinning || wheelItems.length === 0) return;

    setIsSpinning(true);
    setSelectedDrink(null);

    const randomIndex = Math.floor(Math.random() * wheelItems.length);
    const chosen = wheelItems[randomIndex];

    // Calculate rotation: multiple full rounds + target slice angle
    const extraRounds = 5 * 360;
    const sliceAngle = 360 / wheelItems.length;
    const targetAngle = extraRounds + (360 - randomIndex * sliceAngle - sliceAngle / 2);

    setRotationDeg(prev => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedDrink(chosen);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 3000);
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#e5dfd5] animate-in fade-in zoom-in-95 duration-200 text-center relative">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#d98b72] to-[#b86e55] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
            <Dices className="w-3.5 h-3.5 text-[#fdfbf7]" />
            <span>Chưa biết uống gì?</span>
          </div>
          <h3 className="text-xl font-bold leading-tight text-white">Vòng Quay May Mắn DailySip</h3>
          <p className="text-xs text-[#fdfbf7]/85 mt-0.5">Để AI & Vận may chọn món uống chân ái cho bạn!</p>
        </div>

        <div className="p-6 space-y-6 flex flex-col items-center">
          {/* Wheel Graphic */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Pointer */}
            <div className="absolute top-0 z-20 -mt-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-[#d98b72] drop-shadow-md"></div>

            {/* Rotating Wheel container */}
            <div
              className="w-full h-full rounded-full border-4 border-[#d98b72] shadow-xl overflow-hidden relative transition-all ease-out"
              style={{
                transform: `rotate(${rotationDeg}deg)`,
                transitionDuration: isSpinning ? '3000ms' : '0ms'
              }}
            >
              {wheelItems.map((item, idx) => {
                const colors = [
                  'bg-[#7d9d85] text-white',
                  'bg-[#d98b72] text-white',
                  'bg-[#5e7e66] text-white',
                  'bg-[#b86e55] text-white',
                  'bg-[#8c827a] text-white',
                  'bg-[#6c8c74] text-white'
                ];
                const angle = (360 / wheelItems.length) * idx;

                return (
                  <div
                    key={item.id}
                    className={`absolute inset-0 flex items-start justify-center pt-3 text-[11px] font-bold ${
                      colors[idx % colors.length]
                    }`}
                    style={{
                      clipPath: 'polygon(50% 50%, 0 0, 100% 0)',
                      transform: `rotate(${angle}deg)`
                    }}
                  >
                    <span className="truncate max-w-[80px] drop-shadow-xs">{item.name.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>

            {/* Wheel Center Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="absolute z-10 w-14 h-14 rounded-full bg-[#2c2722] text-[#fdfbf7] font-bold text-xs flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-75 cursor-pointer border-2 border-[#eaddcf]"
            >
              <Sparkles className="w-4 h-4 text-[#d98b72] mb-0.5" />
              <span>QUAY</span>
            </button>
          </div>

          {/* Winner Result Card */}
          {selectedDrink && (
            <div className="w-full p-4 rounded-2xl bg-[#eef4f0] border border-[#7d9d85]/40 text-left animate-in zoom-in-95 duration-300">
              <div className="flex items-start gap-3">
                <img
                  src={selectedDrink.image}
                  alt={selectedDrink.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#5e7e66] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Chân ái hôm nay của bạn:
                  </span>
                  <h4 className="font-bold text-sm text-[#2c2722] truncate">{selectedDrink.name}</h4>
                  <p className="text-xs text-[#4a453e] mt-0.5 line-clamp-1">{selectedDrink.whyItFits}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#7d9d85]/20 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    onSelectDrink(selectedDrink);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#7d9d85] hover:bg-[#6c8c74] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Chọn món này & Đặt hàng</span>
                </button>
              </div>
            </div>
          )}

          {!selectedDrink && !isSpinning && (
            <p className="text-xs text-[#8c827a]">
              Bấm nút <strong>QUAY</strong> để hệ thống tự động chọn ngẫu nhiên món uống bổ dưỡng cho bạn!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
