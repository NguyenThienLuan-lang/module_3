import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Truck, X, Sparkles, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, OrderStatus } from '../types';

interface OrderTrackingModalProps {
  isOpen?: boolean;
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen = true, order, onClose }) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('placed');
  const [progressPercent, setProgressPercent] = useState<number>(20);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!order) return;

    setCurrentStatus('placed');
    setProgressPercent(20);

    // Simulate order progress
    const timer1 = setTimeout(() => {
      setCurrentStatus('preparing');
      setProgressPercent(50);
    }, 2500);

    const timer2 = setTimeout(() => {
      setCurrentStatus('delivering');
      setProgressPercent(85);
    }, 6000);

    const timer3 = setTimeout(() => {
      setCurrentStatus('completed');
      setProgressPercent(100);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore confetti errors if canvas unavailable
      }
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [order]);

  if (!isOpen || !order) return null;

  const steps = [
    { id: 'placed', label: 'Đã nhận đơn', time: order.placedAt },
    { id: 'preparing', label: 'Đang pha chế', time: 'Quán đang làm' },
    { id: 'delivering', label: 'Đang giao hàng', time: 'Shipper đang tới' },
    { id: 'completed', label: 'Đã nhận', time: order.estimatedDeliveryAt }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'preparing':
        return 1;
      case 'delivering':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e5dfd5] animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-[#5e7e66] to-[#4a6350] text-[#fdfbf7] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#fdfbf7] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#fdfbf7] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d98b72]" />
            <span>Mã Đơn Hàng: #{order.id}</span>
          </div>

          <h3 className="text-xl font-bold leading-tight text-white">
            {currentStatus === 'completed'
              ? '🎉 Giao Hàng Thành Công! Chúc Bạn Ngon Miệng!'
              : 'Đang Chuẩn Bị & Giao Đến Bạn'}
          </h3>
          <p className="text-xs text-[#eaddcf] mt-1">
            Dự kiến nhận lúc: <strong>{order.estimatedDeliveryAt}</strong> (~15-20 phút)
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Animated Stepper */}
          <div>
            <div className="relative flex items-center justify-between mb-2">
              {/* Background bar */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-[#ede6dc] rounded-full"></div>
              {/* Active bar */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-[#7d9d85] rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              ></div>

              {steps.map((s, i) => {
                const isPassed = i <= activeIndex;
                const isCurrent = i === activeIndex;

                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isPassed
                          ? 'bg-[#7d9d85] text-white ring-4 ring-[#eef4f0] shadow-sm'
                          : 'bg-[#ede6dc] text-[#8c827a]'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 font-medium text-center whitespace-nowrap ${
                        isCurrent ? 'text-[#5e7e66] font-bold' : 'text-[#8c827a]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulated Driver Card */}
          {order.driver && (
            <div className="p-4 rounded-2xl bg-[#f7f3ed] border border-[#e5dfd5] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#ede6dc] shrink-0 border border-[#e5dfd5]">
                  <img
                    src={order.driver.avatar}
                    alt={order.driver.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5e7e66] block">Tài xế DailySip Express</span>
                  <h4 className="text-xs font-bold text-[#2c2722]">{order.driver.name}</h4>
                  <p className="text-[11px] text-[#8c827a]">Biển số xe: {order.driver.vehiclePlate}</p>
                </div>
              </div>

              <a
                href={`tel:${order.driver.phone}`}
                className="px-3 py-2 rounded-xl bg-[#7d9d85] hover:bg-[#6c8c74] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi</span>
              </a>
            </div>
          )}

          {/* Delivery Location review */}
          <div className="text-xs text-[#4a453e] space-y-1.5 p-3.5 rounded-2xl bg-[#f7f3ed] border border-[#e5dfd5]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#7d9d85] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#2c2722]">Giao đến: </span>
                <span>{order.deliveryAddress}</span>
              </div>
            </div>
            <div className="text-[11px] text-[#8c827a] pl-6">
              Người nhận: <strong className="text-[#2c2722]">{order.customerName}</strong> ({order.customerPhone})
            </div>
          </div>

          {/* Order items summary */}
          <div>
            <span className="text-xs font-bold text-[#2c2722] uppercase tracking-wider block mb-2">
              Danh sách món ({order.items.length}):
            </span>
            <div className="space-y-1.5 text-xs text-[#4a453e] max-h-36 overflow-y-auto pr-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-[#e5dfd5]">
                  <span>
                    {item.quantity}x <strong className="text-[#2c2722]">{item.drinkName}</strong> ({item.customization.sweetness} đường, {item.customization.ice})
                  </span>
                  <span className="font-bold text-[#2c2722]">
                    {(item.totalPrice * item.quantity).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#7d9d85] hover:bg-[#6c8c74] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            Đóng màn hình theo dõi
          </button>
        </div>
      </div>
    </div>
  );
};
