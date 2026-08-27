import React, { useEffect } from 'react';
import { X, Clock, ChefHat, CheckCircle2, Lightbulb, Sparkles, BookOpen } from 'lucide-react';
import { Drink } from '../types';

interface HomeRecipeModalProps {
  isOpen?: boolean;
  drink: Drink | null;
  onClose: () => void;
}

export const HomeRecipeModal: React.FC<HomeRecipeModalProps> = ({ isOpen = true, drink, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !drink) return null;

  const recipe = drink.homeRecipe || {
    prepTime: '5-10 phút',
    difficulty: 'Dễ',
    steps: [
      `Chuẩn bị đầy đủ các nguyên liệu tươi: ${drink.ingredients.join(', ')}.`,
      'Rửa sạch nguyên liệu và thái mỏng hoặc hãm với nước sôi 90°C trong 5-7 phút.',
      'Thêm mật ong hoặc đường thốt nốt tùy chỉnh theo khẩu vị.',
      'Thêm đá viên hoặc dùng ấm tùy theo sở thích của bạn.'
    ],
    tips: 'Nên dùng nguyên liệu tươi hữu cơ để đảm bảo trọn vẹn dược tính và enzym tốt cho cơ thể.'
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e5dfd5] animate-in fade-in zoom-in-95 duration-200 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5e7e66] to-[#4a6350] text-[#fdfbf7] p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-[#fdfbf7] transition-all cursor-pointer shadow-md active:scale-90"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#fdfbf7] text-xs font-bold mb-2">
            <ChefHat className="w-3.5 h-3.5 text-[#eaddcf]" />
            <span>Công Thức Pha Chế Tại Nhà (DIY)</span>
          </div>

          <h3 className="text-xl font-bold leading-tight text-white pr-8">{drink.name}</h3>
          <p className="text-xs text-[#eaddcf] mt-0.5">{drink.vietnameseName}</p>

          <div className="flex items-center gap-3 mt-3 text-xs text-[#eaddcf]">
            <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-[#fdfbf7]" />
              {recipe.prepTime}
            </span>
            <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#d98b72]" />
              Độ khó: {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-[#4a453e] overflow-y-auto flex-1">
          {/* Ingredients list */}
          <div>
            <h4 className="font-bold text-[#2c2722] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#7d9d85]" />
              Nguyên liệu chuẩn bị:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {drink.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-[#f7f3ed] border border-[#e5dfd5] flex items-center gap-2 text-[#2c2722]"
                >
                  <span className="text-[#7d9d85] font-bold">•</span>
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h4 className="font-bold text-[#2c2722] uppercase tracking-wider text-[11px] mb-2">
              Các bước thực hiện:
            </h4>
            <div className="space-y-2.5">
              {recipe.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f7f3ed]/60 border border-[#e5dfd5]">
                  <span className="w-5 h-5 rounded-full bg-[#eef4f0] text-[#5e7e66] border border-[#7d9d85]/30 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed text-[#4a453e]">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sommelier Pro Tip */}
          {recipe.tips && (
            <div className="p-3.5 rounded-2xl bg-[#fdf5f0] border border-[#d98b72]/40 text-[#4a2e24] flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-[#b86e55] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-xs text-[#2c2722]">Bí quyết từ Sommelier:</span>
                <p className="text-[11px] text-[#4a2e24] mt-0.5 leading-relaxed">{recipe.tips}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#e5dfd5] bg-[#f7f3ed] flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#5e7e66] hover:bg-[#4e6c55] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-98"
          >
            Đã hiểu, đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
