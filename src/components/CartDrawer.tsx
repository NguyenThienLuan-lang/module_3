import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MapPin, CreditCard, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem, Order, OrderStatus } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  userAddress: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  userAddress
}) => {
  const [customerName, setCustomerName] = useState('Nguyễn Văn Minh');
  const [customerPhone, setCustomerPhone] = useState('0909 123 456');
  const [deliveryAddress, setDeliveryAddress] = useState(userAddress);
  const [noteForDriver, setNoteForDriver] = useState('Giao tận cửa, gọi trước khi đến 5 phút');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'momo' | 'vnpay' | 'zalopay' | 'card'>('momo');
  const [promoCode, setPromoCode] = useState('DAILYSIPNEW');
  const [isPromoApplied, setIsPromoApplied] = useState(true);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 15000 : 0;
  const discount = isPromoApplied && subtotal > 0 ? 20000 : 0;
  const finalAmount = Math.max(0, subtotal + deliveryFee - discount);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const newOrder: Order = {
      id: 'DS-' + Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      subtotal,
      deliveryFee,
      discount,
      totalAmount: finalAmount,
      customerName,
      customerPhone,
      deliveryAddress,
      noteForDriver,
      paymentMethod,
      status: 'placed',
      placedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryAt: new Date(Date.now() + 20 * 60000).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      driver: {
        name: 'Trần Hoàng Long',
        phone: '0938 888 999',
        vehiclePlate: '59-B1 892.45',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    };

    onPlaceOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#e5dfd5] flex items-center justify-between bg-[#f7f3ed]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#eef4f0] text-[#5e7e66] flex items-center justify-center border border-[#7d9d85]/30">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#2c2722] text-base">Giỏ Hàng Của Bạn</h3>
                <span className="text-xs text-[#8c827a]">{cartItems.length} món đồ uống</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#8c827a] hover:text-[#2c2722] hover:bg-[#ede6dc] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-[#a8a095] space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-[#cfc8bf] stroke-1" />
                <p className="text-sm font-medium text-[#4a453e]">Giỏ hàng của bạn đang trống</p>
                <p className="text-xs text-[#8c827a]">Hãy chọn một món uống phù hợp từ mục Gợi Ý nhé!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-[#8c827a] pb-1">
                  <span>Chi tiết món</span>
                  <button
                    onClick={onClearCart}
                    className="text-[#b86e55] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Xóa tất cả
                  </button>
                </div>

                {cartItems.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#f7f3ed]/70 border border-[#e5dfd5] flex gap-3 relative"
                  >
                    <img
                      src={item.drinkImage}
                      alt={item.drinkName}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-[#2c2722] truncate">
                          {item.drinkName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#a8a095] hover:text-[#b86e55] p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#5e7e66] font-medium truncate">
                        Quán: {item.storeName}
                      </p>

                      <div className="text-[10px] text-[#4a453e] mt-1 flex flex-wrap gap-1">
                        <span className="bg-[#ede6dc] px-1.5 py-0.5 rounded">
                          Đường: {item.customization.sweetness}
                        </span>
                        <span className="bg-[#ede6dc] px-1.5 py-0.5 rounded">
                          Đá: {item.customization.ice}
                        </span>
                        {item.customization.toppings.map(t => (
                          <span key={t.name} className="bg-[#fdf5f0] text-[#b86e55] px-1.5 py-0.5 rounded font-semibold border border-[#d98b72]/30">
                            +{t.name}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#e5dfd5]">
                        <span className="text-xs font-extrabold text-[#2c2722]">
                          {(item.totalPrice * item.quantity).toLocaleString('vi-VN')} đ
                        </span>

                        <div className="flex items-center gap-2 bg-white rounded-lg border border-[#e5dfd5] px-1.5 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="text-[#8c827a] hover:text-[#2c2722] p-0.5 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#4a453e] px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-[#8c827a] hover:text-[#2c2722] p-0.5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Delivery Form */}
                <div className="pt-4 border-t border-[#e5dfd5] space-y-3">
                  <h4 className="text-xs font-bold text-[#2c2722] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7d9d85]" />
                    Thông tin giao hàng
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] text-[#4a453e] mb-1">Họ & Tên</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5dfd5] bg-[#fdfbf7] text-[#2c2722] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#4a453e] mb-1">Số điện thoại</label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5dfd5] bg-[#fdfbf7] text-[#2c2722] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#4a453e] mb-1">Địa chỉ nhận hàng</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5dfd5] bg-[#fdfbf7] text-[#2c2722] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#4a453e] mb-1">Ghi chú cho tài xế</label>
                    <input
                      type="text"
                      value={noteForDriver}
                      onChange={e => setNoteForDriver(e.target.value)}
                      placeholder="VD: Gửi lễ tân, gọi trước..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5dfd5] bg-[#fdfbf7] text-[#2c2722] text-xs placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-[#2c2722] mb-1.5">
                      Phương thức thanh toán
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'momo', label: 'Ví MoMo', icon: '🟣' },
                        { id: 'vnpay', label: 'VNPay QR', icon: '🔵' },
                        { id: 'cod', label: 'Tiền mặt (COD)', icon: '💵' },
                        { id: 'zalopay', label: 'ZaloPay', icon: '🟢' }
                      ].map(p => (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => setPaymentMethod(p.id as any)}
                          className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                            paymentMethod === p.id
                              ? 'bg-[#eef4f0] border-[#7d9d85] font-bold text-[#2c3a31] ring-1 ring-[#7d9d85]'
                              : 'bg-[#f7f3ed] border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc]'
                          }`}
                        >
                          <span>{p.icon}</span>
                          <span className="text-[11px]">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Promo code badge */}
                  <div className="p-2.5 rounded-xl bg-[#eef4f0] border border-[#7d9d85]/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#2c3a31] font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-[#7d9d85]" />
                      <span>Mã: <strong>{promoCode}</strong> (-20k)</span>
                    </div>
                    <span className="text-[10px] text-[#5e7e66] font-bold bg-[#7d9d85]/20 px-2 py-0.5 rounded-full">
                      Đã áp dụng
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-[#e5dfd5] bg-[#f7f3ed] space-y-3">
              <div className="space-y-1.5 text-xs text-[#4a453e]">
                <div className="flex justify-between">
                  <span>Tạm tính món:</span>
                  <span>{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng:</span>
                  <span>{deliveryFee.toLocaleString('vi-VN')} đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#5e7e66] font-semibold">
                    <span>Ưu đãi thành viên:</span>
                    <span>-{discount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-[#2c2722] pt-1.5 border-t border-[#e5dfd5]">
                  <span>Tổng thanh toán:</span>
                  <span className="text-[#5e7e66]">{finalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7d9d85] to-[#5e7e66] hover:from-[#6c8c74] hover:to-[#4e6c55] text-white font-bold text-sm shadow-md shadow-[#5e7e66]/20 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <span>Xác Nhận Đặt Hàng Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
