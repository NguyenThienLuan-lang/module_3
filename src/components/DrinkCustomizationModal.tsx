import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Flame, Droplets, Coffee, Check, Sparkles } from 'lucide-react';
import { Drink, Store, CartCustomization } from '../types';

interface DrinkCustomizationModalProps {
  isOpen?: boolean;
  drink: Drink | null;
  store?: Store | null;
  onClose: () => void;
  onAddToCart: (customization: CartCustomization, quantity: number, targetStore: Store) => void;
  availableStores: Store[];
}

export const DrinkCustomizationModal: React.FC<DrinkCustomizationModalProps> = ({
  isOpen = true,
  drink,
  store,
  onClose,
  onAddToCart,
  availableStores
}) => {
  // Selected store serving this drink
  const defaultStore = store || (drink ? availableStores.find(s => s.menuItems.some(m => m.drinkId === drink.id)) : null) || availableStores[0];
  const [selectedStore, setSelectedStore] = useState<Store>(defaultStore);

  const [sweetness, setSweetness] = useState<'0%' | '30%' | '50%' | '70%' | '100%'>('50%');
  const [ice, setIce] = useState<'Nóng' | 'Không đá' | '30% đá' | '50% đá' | '100% đá'>('50% đá');
  const [size, setSize] = useState<'M' | 'L'>('M');
  const [selectedToppings, setSelectedToppings] = useState<{ name: string; price: number }[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialNote, setSpecialNote] = useState<string>('');

  useEffect(() => {
    if (drink) {
      setIce(drink.isColdAvailable ? '50% đá' : 'Nóng');
      if (store) {
        setSelectedStore(store);
      } else {
        const found = availableStores.find(s => s.menuItems.some(m => m.drinkId === drink.id)) || availableStores[0];
        setSelectedStore(found);
      }
    }
  }, [drink, store, availableStores]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !drink) return null;

  const toggleTopping = (topping: { name: string; price: number; benefit: string }) => {
    setSelectedToppings(prev => {
      const exists = prev.some(t => t.name === topping.name);
      if (exists) {
        return prev.filter(t => t.name !== topping.name);
      } else {
        return [...prev, { name: topping.name, price: topping.price }];
      }
    });
  };

  const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const sizeExtra = size === 'L' ? 8000 : 0;
  const unitPrice = drink.priceVND + sizeExtra + toppingTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(
      {
        sweetness,
        ice,
        size,
        toppings: selectedToppings,
        specialNote
      },
      quantity,
      selectedStore
    );
    onClose();
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e5dfd5] animate-in fade-in zoom-in-95 duration-200 relative flex flex-col max-h-[90vh]">
        {/* Header with image */}
        <div className="relative aspect-16/9 bg-[#f7f3ed] overflow-hidden shrink-0">
          <img
            src={drink.image}
            alt={drink.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Top-right prominent close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-90"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent p-4 text-white">
            <h3 className="text-lg sm:text-xl font-bold leading-tight text-[#fdfbf7]">{drink.name}</h3>
            <p className="text-xs text-[#eaddcf] font-semibold">{drink.vietnameseName}</p>
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Store selector */}
          <div>
            <label className="block text-xs font-bold text-[#2c2722] uppercase tracking-wider mb-1.5">
              📍 Chọn quán pha chế:
            </label>
            <select
              value={selectedStore?.id}
              onChange={e => {
                const found = availableStores.find(s => s.id === e.target.value);
                if (found) setSelectedStore(found);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e5dfd5] bg-[#f7f3ed] text-xs font-semibold text-[#2c2722] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
            >
              {availableStores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.distanceKm || 1.2} km) - {s.deliveryTimeMins} phút
                </option>
              ))}
            </select>
          </div>

          {/* Size selection */}
          <div>
            <label className="block text-xs font-bold text-[#2c2722] uppercase tracking-wider mb-2">
              Kích thước ly:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSize('M')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  size === 'M'
                    ? 'bg-[#eef4f0] border-[#5e7e66] text-[#2c3a31] ring-2 ring-[#7d9d85]/30'
                    : 'bg-[#f7f3ed] border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc]'
                }`}
              >
                Size M (Tiêu chuẩn 500ml)
              </button>
              <button
                type="button"
                onClick={() => setSize('L')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  size === 'L'
                    ? 'bg-[#eef4f0] border-[#5e7e66] text-[#2c3a31] ring-2 ring-[#7d9d85]/30'
                    : 'bg-[#f7f3ed] border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc]'
                }`}
              >
                Size L (Lớn 700ml) +8.000 đ
              </button>
            </div>
          </div>

          {/* Sweetness */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#2c2722] uppercase tracking-wider">
                Mức độ ngọt (Đường):
              </label>
              <span className="text-xs font-bold text-[#5e7e66]">{sweetness}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {(['0%', '30%', '50%', '70%', '100%'] as const).map(lvl => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSweetness(lvl)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    sweetness === lvl
                      ? 'bg-[#5e7e66] text-white border-[#5e7e66] shadow-xs'
                      : 'bg-[#f7f3ed] border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Ice / Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#2c2722] uppercase tracking-wider">
                Lượng đá / Nhiệt độ:
              </label>
              <span className="text-xs font-bold text-[#d98b72]">{ice}</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {(['Nóng', 'Không đá', '30% đá', '50% đá', '100% đá'] as const).map(iceOption => {
                if (iceOption === 'Nóng' && !drink.isHotAvailable) return null;
                if (iceOption !== 'Nóng' && !drink.isColdAvailable) return null;

                return (
                  <button
                    type="button"
                    key={iceOption}
                    onClick={() => setIce(iceOption)}
                    className={`py-2 px-1 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      ice === iceOption
                        ? 'bg-[#d98b72] text-white border-[#d98b72] shadow-xs'
                        : 'bg-[#f7f3ed] border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc]'
                    }`}
                  >
                    {iceOption}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toppings */}
          {drink.suggestedToppings && drink.suggestedToppings.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-[#2c2722] uppercase tracking-wider mb-2">
                ✨ Topping dinh dưỡng khuyên dùng:
              </label>
              <div className="space-y-1.5">
                {drink.suggestedToppings.map(t => {
                  const isChecked = selectedToppings.some(item => item.name === t.name);
                  return (
                    <button
                      type="button"
                      key={t.name}
                      onClick={() => toggleTopping(t)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#fdf5f0] border-[#d98b72] text-[#4a2e24] font-semibold'
                          : 'bg-[#f7f3ed] border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc]'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-left">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? 'bg-[#b86e55] border-[#b86e55] text-white' : 'border-[#cfc8bf]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <span className="font-bold">{t.name}</span>
                          <span className="text-[10px] text-[#8c827a] block">{t.benefit}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#2c2722]">+{t.price.toLocaleString('vi-VN')} đ</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special note */}
          <div>
            <label className="block text-xs font-bold text-[#2c2722] uppercase tracking-wider mb-1">
              Ghi chú riêng cho quán:
            </label>
            <input
              type="text"
              placeholder="VD: Không lấy ống hút nhựa, cho nhiều đá riêng..."
              value={specialNote}
              onChange={e => setSpecialNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#e5dfd5] bg-[#f7f3ed] text-xs text-[#2c2722] placeholder-[#a8a095] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
            />
          </div>
        </div>

        {/* Footer actions with prominent Close and Add buttons */}
        <div className="p-4 border-t border-[#e5dfd5] bg-[#f7f3ed] flex items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-3 rounded-xl border border-[#d8cfc4] bg-white hover:bg-[#ede6dc] text-[#4a453e] font-bold text-xs cursor-pointer transition-colors"
          >
            Đóng
          </button>

          <div className="flex items-center gap-1.5 bg-white rounded-xl border border-[#e5dfd5] px-2 py-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 text-[#8c827a] hover:text-[#2c2722] cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-xs px-1 text-[#2c2722]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-[#8c827a] hover:text-[#2c2722] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#7d9d85] to-[#5e7e66] hover:from-[#6c8c74] hover:to-[#4e6c55] text-white font-bold text-xs shadow-md shadow-[#5e7e66]/20 flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer truncate"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="truncate">Thêm • {totalPrice.toLocaleString('vi-VN')} đ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
