import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Phone,
  User,
  ShieldCheck,
  CreditCard,
  History,
  Gift,
  ChevronRight,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  Sparkles,
  Edit2,
  Check,
  Award,
  Wallet,
  Star,
  RotateCcw,
  ShoppingBag,
  Clock,
  MapPin,
  MessageSquare,
  AlertCircle,
  XCircle,
  CornerDownLeft
} from 'lucide-react';
import { UserProfile, MembershipRank, UserVoucher, LinkedPayment, PastOrder, OrderHistoryStatus } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  pastOrders: PastOrder[];
  onReorder: (order: PastOrder) => void;
  onReviewOrder: (orderId: string, rating: number, comment: string) => void;
}

export const ALL_RANK_VOUCHERS: UserVoucher[] = [
  // Hạng Đồng (0 - 5 đơn)
  {
    id: 'v-bronze-1',
    code: 'DONG5K',
    title: 'Giảm 5.000đ Đơn Đầu Tiên',
    discountText: 'Giảm 5.000 đ',
    minOrderVND: 35000,
    expiryDate: '30/09/2026',
    description: 'Áp dụng cho thành viên Hạng Đồng, đơn từ 35.000đ',
    minRank: 'bronze',
    isUnlocked: true
  },
  {
    id: 'v-bronze-2',
    code: 'FREESHIP15K',
    title: 'Freeship Giảm 15.000đ',
    discountText: 'Freeship 15k',
    minOrderVND: 50000,
    expiryDate: '30/09/2026',
    description: 'Giảm 15.000đ phí giao hàng cho đơn từ 50.000đ',
    minRank: 'bronze',
    isUnlocked: true
  },
  // Hạng Bạc (6 - 20 đơn)
  {
    id: 'v-silver-1',
    code: 'BAC10PCT',
    title: 'Giảm 10% Tối Đa 25.000đ',
    discountText: 'Giảm 10%',
    minOrderVND: 60000,
    expiryDate: '31/10/2026',
    description: 'Đặc quyền thành viên Hạng Bạc (đã tích lũy > 5 đơn)',
    minRank: 'silver',
    isUnlocked: false
  },
  {
    id: 'v-silver-2',
    code: 'FREETOPPING',
    title: 'Tặng 1 Topping Dinh Dưỡng',
    discountText: 'Topping 0đ',
    minOrderVND: 45000,
    expiryDate: '31/10/2026',
    description: 'Miễn phí 1 phần thạch sả, hạt chia hoặc nha đam',
    minRank: 'silver',
    isUnlocked: false
  },
  // Hạng Vàng (21 - 50 đơn)
  {
    id: 'v-gold-1',
    code: 'VANG15PCT',
    title: 'Giảm 15% Mọi Đơn Hàng',
    discountText: 'Giảm 15%',
    minOrderVND: 80000,
    expiryDate: '31/12/2026',
    description: 'Đặc quyền thành viên Hạng Vàng VIP (đã tích lũy > 20 đơn)',
    minRank: 'gold',
    isUnlocked: false
  },
  {
    id: 'v-gold-2',
    code: 'FREESHIPGOLD',
    title: 'Freeship 0đ Không Giới Hạn',
    discountText: 'Freeship 0đ',
    minOrderVND: 70000,
    expiryDate: '31/12/2026',
    description: 'Miễn phí giao hàng toàn bộ đơn từ 70.000đ',
    minRank: 'gold',
    isUnlocked: false
  },
  // Hạng Kim Cương (>= 51 - 100 đơn)
  {
    id: 'v-diamond-1',
    code: 'KIMCUONG25PCT',
    title: 'Giảm 25% Đẳng Cấp Kim Cương',
    discountText: 'Giảm 25%',
    minOrderVND: 100000,
    expiryDate: '31/12/2026',
    description: 'Đặc quyền cao cấp nhất dành cho khách hàng thân thiết (> 50 đơn)',
    minRank: 'diamond',
    isUnlocked: false
  },
  {
    id: 'v-diamond-2',
    code: 'VIPPRIORITY',
    title: 'Giao Siêu Tốc 15 Phút + Ưu Tiên Pha Chế',
    discountText: 'VIP Fast',
    minOrderVND: 0,
    expiryDate: '31/12/2026',
    description: 'Đơn hàng được ưu tiên pha chế hàng đầu và shipper riêng',
    minRank: 'diamond',
    isUnlocked: false
  }
];

export const getRankInfo = (ordersCount: number) => {
  if (ordersCount >= 100 || ordersCount >= 51) {
    return {
      rank: 'diamond' as MembershipRank,
      name: 'Hạng Kim Cương',
      emoji: '💎',
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-600',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      nextTierName: 'Tối Đa (Max Rank)',
      neededOrders: 0,
      currentProgress: 100
    };
  }
  if (ordersCount >= 21) {
    return {
      rank: 'gold' as MembershipRank,
      name: 'Hạng Vàng',
      emoji: '🥇',
      color: 'from-amber-400 to-yellow-600',
      textColor: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      nextTierName: 'Hạng Kim Cương (100 đơn)',
      neededOrders: 100 - ordersCount,
      currentProgress: Math.min(100, Math.round(((ordersCount - 20) / (100 - 20)) * 100))
    };
  }
  if (ordersCount >= 6) {
    return {
      rank: 'silver' as MembershipRank,
      name: 'Hạng Bạc',
      emoji: '🥈',
      color: 'from-slate-300 to-slate-500',
      textColor: 'text-slate-600',
      badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
      nextTierName: 'Hạng Vàng (50 đơn)',
      neededOrders: 50 - ordersCount,
      currentProgress: Math.min(100, Math.round(((ordersCount - 5) / (50 - 5)) * 100))
    };
  }
  return {
    rank: 'bronze' as MembershipRank,
    name: 'Hạng Đồng',
    emoji: '🥉',
    color: 'from-amber-700 to-orange-800',
    textColor: 'text-amber-800',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-300',
    nextTierName: 'Hạng Bạc (20 đơn)',
    neededOrders: 20 - ordersCount,
    currentProgress: Math.min(100, Math.round((ordersCount / 20) * 100))
  };
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  pastOrders,
  onReorder,
  onReviewOrder
}) => {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'payments' | 'history'>('vouchers');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [phoneInput, setPhoneInput] = useState(userProfile.phone);
  const [showAddPayment, setShowAddPayment] = useState(false);

  // New payment form
  const [newPayType, setNewPayType] = useState<'momo' | 'bank'>('momo');
  const [newPayName, setNewPayName] = useState('Ví MoMo Chính');
  const [newPayNumber, setNewPayNumber] = useState('');

  // History Tab Filter
  const [historyFilter, setHistoryFilter] = useState<'all' | 'delivered' | 'returned' | 'cancelled'>('all');

  // Review Sub-Modal state
  const [reviewingOrder, setReviewingOrder] = useState<PastOrder | null>(null);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNameInput(userProfile.name);
    setPhoneInput(userProfile.phone);
  }, [userProfile]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (reviewingOrder) {
          setReviewingOrder(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, reviewingOrder]);

  if (!isOpen) return null;

  const rankInfo = getRankInfo(userProfile.totalOrdersCount);

  // Handle image upload from local machine/device library
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa 5MB. Vui lòng chọn ảnh khác.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateProfile({ avatar: reader.result });
        try {
          localStorage.setItem('dailysip_user_avatar', reader.result);
        } catch (err) {
          // ignore localstorage overflow
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateProfile({ name: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  const handleSavePhone = () => {
    if (phoneInput.trim()) {
      onUpdateProfile({ phone: phoneInput.trim() });
    }
    setIsEditingPhone(false);
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayNumber.trim()) return;

    const newPayment: LinkedPayment = {
      id: `pay-${Date.now()}`,
      type: newPayType,
      name: newPayName,
      accountNumber: newPayNumber,
      isDefault: userProfile.linkedPayments.length === 0,
      logo:
        newPayType === 'momo'
          ? 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png'
          : 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80'
    };

    onUpdateProfile({
      linkedPayments: [...userProfile.linkedPayments, newPayment]
    });
    setNewPayNumber('');
    setShowAddPayment(false);
  };

  const handleDeletePayment = (id: string) => {
    onUpdateProfile({
      linkedPayments: userProfile.linkedPayments.filter(p => p.id !== id)
    });
  };

  const handleSetDefaultPayment = (id: string) => {
    onUpdateProfile({
      linkedPayments: userProfile.linkedPayments.map(p => ({
        ...p,
        isDefault: p.id === id
      }))
    });
  };

  // Rank unlocked vouchers calculation
  const isVoucherUnlocked = (minRank: MembershipRank) => {
    const rankPriority: Record<MembershipRank, number> = {
      bronze: 1,
      silver: 2,
      gold: 3,
      diamond: 4
    };
    return rankPriority[rankInfo.rank] >= rankPriority[minRank];
  };

  // Filter past orders
  const filteredOrders = pastOrders.filter(ord => {
    if (historyFilter === 'all') return true;
    return ord.status === historyFilter;
  });

  // Handle open review modal
  const handleOpenReview = (order: PastOrder) => {
    setReviewingOrder(order);
    setRatingStars(order.review?.rating || 5);
    setReviewComment(order.review?.comment || '');
  };

  // Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingOrder) return;
    onReviewOrder(reviewingOrder.id, ratingStars, reviewComment.trim());
    setReviewingOrder(null);
  };

  // Quick feedback tag insert
  const addQuickTag = (tag: string) => {
    setReviewComment(prev => (prev ? `${prev}, ${tag}` : tag));
  };

  const getStatusBadge = (status: OrderHistoryStatus) => {
    if (status === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          <span>Đã giao</span>
        </span>
      );
    }
    if (status === 'returned') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <CornerDownLeft className="w-3 h-3" />
          <span>Trả hàng</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle className="w-3 h-3" />
        <span>Hủy đơn</span>
      </span>
    );
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e5dfd5] animate-in fade-in zoom-in-95 duration-200 relative flex flex-col max-h-[92vh]">
        {/* Hidden file input for avatar upload from device */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="hidden"
        />

        {/* 1. Header Profile Banner */}
        <div className="bg-gradient-to-br from-[#4a5f50] via-[#3a4d3f] to-[#253329] text-white p-5 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all cursor-pointer shadow-md active:scale-90"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar with Camera upload button */}
            <div className="relative group">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow-lg bg-[#2d3a31]">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#d98b72] hover:bg-[#b86e55] text-white shadow-md transition-transform active:scale-90 cursor-pointer"
                title="Thay đổi ảnh từ thư viện máy"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name & Phone Info */}
            <div className="flex-1 min-w-0">
              {/* Name */}
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      className="px-2 py-0.5 rounded-lg bg-white/20 text-white text-sm font-bold border border-white/30 focus:outline-hidden focus:bg-white/30"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="p-1 rounded-lg bg-[#7d9d85] hover:bg-[#6b8c73] text-white cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 truncate">
                    <h3 className="font-bold text-base sm:text-lg text-white truncate">
                      {userProfile.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-white/70 hover:text-white cursor-pointer"
                      title="Chỉnh sửa tên"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#cfc8bf]">
                <Phone className="w-3 h-3 text-[#7d9d85] shrink-0" />
                {isEditingPhone ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      className="px-2 py-0.5 rounded-lg bg-white/20 text-white text-xs font-semibold border border-white/30 focus:outline-hidden focus:bg-white/30"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSavePhone}
                      className="p-1 rounded-lg bg-[#7d9d85] hover:bg-[#6b8c73] text-white cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span>{userProfile.phone}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingPhone(true)}
                      className="p-0.5 text-white/70 hover:text-white cursor-pointer"
                      title="Chỉnh sửa số điện thoại"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Rank Chip */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-bold border border-white/20 backdrop-blur-xs">
                <span>{rankInfo.emoji}</span>
                <span>{rankInfo.name}</span>
                <span className="text-white/60">•</span>
                <span className="text-[#eaddcf]">{userProfile.totalOrdersCount} đơn đã đặt</span>
              </div>
            </div>
          </div>

          {/* Rank Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/15">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-[#cfc8bf]">Tiến trình nâng hạng:</span>
              <span className="font-bold text-white">
                {rankInfo.neededOrders > 0
                  ? `Còn ${rankInfo.neededOrders} đơn nữa lên ${rankInfo.nextTierName}`
                  : 'Đã đạt cấp bậc cao nhất 💎'}
              </span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${rankInfo.color} rounded-full transition-all duration-500`}
                style={{ width: `${Math.max(8, rankInfo.currentProgress)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Modal Navigation Tabs */}
        <div className="grid grid-cols-3 border-b border-[#e5dfd5] bg-[#f7f3ed] text-xs font-bold text-[#4a453e] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`py-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'vouchers'
                ? 'border-[#5e7e66] text-[#2c3a31] bg-white font-extrabold shadow-2xs'
                : 'border-transparent text-[#8c827a] hover:text-[#2c3a31]'
            }`}
          >
            <Gift className="w-4 h-4 text-[#d98b72]" />
            <span>Voucher Hạng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`py-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'payments'
                ? 'border-[#5e7e66] text-[#2c3a31] bg-white font-extrabold shadow-2xs'
                : 'border-transparent text-[#8c827a] hover:text-[#2c3a31]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#5e7e66]" />
            <span>Ngân Hàng / MoMo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#5e7e66] text-[#2c3a31] bg-white font-extrabold shadow-2xs'
                : 'border-transparent text-[#8c827a] hover:text-[#2c3a31]'
            }`}
          >
            <History className="w-4 h-4 text-[#7d9d85]" />
            <span>Lịch Sử Đơn ({pastOrders.length})</span>
          </button>
        </div>

        {/* 3. Tab Contents */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* TAB 1: Adaptive Rank Vouchers */}
          {activeTab === 'vouchers' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#2c2722]">
                    Ưu Đãi Đặc Quyền Của Bạn ({rankInfo.name})
                  </h4>
                  <p className="text-[11px] text-[#8c827a]">
                    Tích lũy thêm đơn hàng để mở khóa các voucher hạng cao hơn
                  </p>
                </div>
              </div>

              {/* Voucher list */}
              <div className="space-y-2.5">
                {ALL_RANK_VOUCHERS.map(v => {
                  const isUnlocked = isVoucherUnlocked(v.minRank);
                  const rankTierName =
                    v.minRank === 'diamond'
                      ? 'Hạng Kim Cương (>= 50 đơn)'
                      : v.minRank === 'gold'
                      ? 'Hạng Vàng (>= 20 đơn)'
                      : v.minRank === 'silver'
                      ? 'Hạng Bạc (>= 6 đơn)'
                      : 'Hạng Đồng (Mọi thành viên)';

                  return (
                    <div
                      key={v.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isUnlocked
                          ? 'bg-[#fdfbf7] border-[#7d9d85]/40 shadow-xs'
                          : 'bg-[#f5efe6]/60 border-[#e5dfd5] opacity-65'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xs font-black shadow-2xs ${
                            isUnlocked
                              ? 'bg-gradient-to-br from-[#d98b72] to-[#b86e55] text-white'
                              : 'bg-stone-300 text-stone-600'
                          }`}
                        >
                          {v.discountText}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-[#2c2722] truncate">{v.title}</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                isUnlocked
                                  ? 'bg-[#eef4f0] text-[#5e7e66] border border-[#7d9d85]/30'
                                  : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              Mã: {v.code}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#8c827a] mt-0.5 leading-snug">
                            {v.description}
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-[10px]">
                            <span className="text-[#5e7e66] font-medium">HSD: {v.expiryDate}</span>
                            <span>•</span>
                            <span className={isUnlocked ? 'text-[#b86e55] font-semibold' : 'text-stone-500'}>
                              {rankTierName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status / Apply button */}
                      <div className="shrink-0">
                        {isUnlocked ? (
                          <span className="px-2.5 py-1 rounded-lg bg-[#eef4f0] text-[#5e7e66] font-bold text-[11px] flex items-center gap-1 border border-[#7d9d85]/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Khả dụng</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-600 font-bold text-[10px] flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Chưa mở</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Bank & MoMo Linking */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#2c2722]">Phương Thức Thanh Toán Liên Kết</h4>
                  <p className="text-[11px] text-[#8c827a]">
                    Thanh toán 1 chạm siêu tốc khi đặt ship đồ uống
                  </p>
                </div>

                {!showAddPayment && (
                  <button
                    type="button"
                    onClick={() => setShowAddPayment(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#5e7e66] hover:bg-[#4e6c55] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm</span>
                  </button>
                )}
              </div>

              {/* Add payment form */}
              {showAddPayment && (
                <form
                  onSubmit={handleAddPaymentSubmit}
                  className="p-4 rounded-2xl bg-[#f7f3ed] border border-[#e5dfd5] space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#2c2722]">Liên Kết Mới</span>
                    <button
                      type="button"
                      onClick={() => setShowAddPayment(false)}
                      className="text-[#8c827a] hover:text-[#2c2722] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewPayType('momo');
                        setNewPayName('Ví MoMo');
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        newPayType === 'momo'
                          ? 'bg-[#fdf5f0] border-[#d98b72] text-[#4a2e24] ring-2 ring-[#d98b72]/30'
                          : 'bg-white border-[#e5dfd5] text-[#4a453e]'
                      }`}
                    >
                      Ví MoMo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPayType('bank');
                        setNewPayName('Vietcombank / MBBank');
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        newPayType === 'bank'
                          ? 'bg-[#eef4f0] border-[#5e7e66] text-[#2c3a31] ring-2 ring-[#7d9d85]/30'
                          : 'bg-white border-[#e5dfd5] text-[#4a453e]'
                      }`}
                    >
                      Tài Khoản Ngân Hàng
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#4a453e] mb-1">
                      {newPayType === 'momo' ? 'Số điện thoại Ví MoMo:' : 'Số tài khoản / Thẻ ngân hàng:'}
                    </label>
                    <input
                      type="text"
                      placeholder={newPayType === 'momo' ? 'VD: 0909 123 456' : 'VD: 1029 3847 5612'}
                      value={newPayNumber}
                      onChange={e => setNewPayNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#e5dfd5] bg-white text-xs text-[#2c2722] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddPayment(false)}
                      className="px-3 py-1.5 rounded-xl border border-[#d8cfc4] bg-white text-xs font-semibold text-[#4a453e] cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#5e7e66] hover:bg-[#4e6c55] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Xác nhận liên kết
                    </button>
                  </div>
                </form>
              )}

              {/* Linked payments list */}
              <div className="space-y-2">
                {userProfile.linkedPayments.map(p => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-[#fdfbf7] border border-[#e5dfd5] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f7f3ed] border border-[#e5dfd5] flex items-center justify-center font-bold text-base shrink-0">
                        {p.type === 'momo' ? '👛' : '🏦'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#2c2722]">{p.name}</span>
                          {p.isDefault && (
                            <span className="text-[9px] bg-[#eef4f0] text-[#5e7e66] font-bold px-1.5 py-0.2 rounded-md border border-[#7d9d85]/30">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#8c827a] block mt-0.5">
                          {p.accountNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!p.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultPayment(p.id)}
                          className="px-2 py-1 text-[10px] text-[#5e7e66] hover:bg-[#eef4f0] rounded-lg font-semibold border border-[#7d9d85]/30 transition-colors cursor-pointer"
                        >
                          Chọn mặc định
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeletePayment(p.id)}
                        className="p-1.5 text-[#a8a095] hover:text-[#b86e55] hover:bg-[#fdf5f0] rounded-lg transition-colors cursor-pointer"
                        title="Xóa liên kết"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Order History with Items, Status, Review, and Reorder */}
          {activeTab === 'history' && (
            <div className="space-y-3.5">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setHistoryFilter('all')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    historyFilter === 'all'
                      ? 'bg-[#5e7e66] text-white shadow-xs'
                      : 'bg-[#f2ece2] text-[#6b6257] hover:bg-[#ede5d8]'
                  }`}
                >
                  Tất cả ({pastOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('delivered')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    historyFilter === 'delivered'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Đã giao ({pastOrders.filter(o => o.status === 'delivered').length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('returned')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    historyFilter === 'returned'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  Trả hàng ({pastOrders.filter(o => o.status === 'returned').length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('cancelled')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    historyFilter === 'cancelled'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  Hủy đơn ({pastOrders.filter(o => o.status === 'cancelled').length})
                </button>
              </div>

              {/* Order List */}
              {filteredOrders.length === 0 ? (
                <div className="py-10 text-center text-[#8c827a]">
                  <p>Không có đơn hàng nào trong mục này.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map(order => {
                    const isDelivered = order.status === 'delivered';
                    const hasReview = Boolean(order.review);

                    return (
                      <div
                        key={order.id}
                        className="p-3.5 sm:p-4 rounded-2xl bg-[#fdfbf7] border border-[#e5dfd5] shadow-xs space-y-3 transition-all hover:border-[#ded5c7]"
                      >
                        {/* Order Header: Store & Status */}
                        <div className="flex items-center justify-between gap-2 border-b border-[#f0eae1] pb-2.5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-[#2c2722]">
                                #{order.orderCode}
                              </span>
                              <span className="text-[#a8a095] text-[10px]">•</span>
                              <span className="text-[11px] text-[#6b6257] truncate font-medium">
                                {order.storeName}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#8c827a] block mt-0.5">
                              {order.createdAt}
                            </span>
                          </div>

                          {getStatusBadge(order.status)}
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <img
                                src={item.drinkImage}
                                alt={item.drinkName}
                                className="w-12 h-12 rounded-xl object-cover border border-[#e5dfd5] shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-xs text-[#2c2722] truncate">
                                  {item.drinkName}
                                </h5>
                                <div className="text-[10px] text-[#8c827a] truncate mt-0.5">
                                  Size {item.customization.size} • Đá {item.customization.ice} • Đường {item.customization.sweetness}
                                  {item.customization.toppings.length > 0 &&
                                    ` • +${item.customization.toppings.map(t => (typeof t === 'string' ? t : t.name)).join(', ')}`}
                                </div>
                                <div className="flex items-center justify-between mt-1 text-[11px]">
                                  <span className="text-[#6b6257]">Số lượng: x{item.quantity}</span>
                                  <span className="font-bold text-[#b86e55]">
                                    {(item.totalPrice || item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Total Amount & Delivery Info */}
                        <div className="pt-2 border-t border-[#f0eae1] flex items-center justify-between text-xs">
                          <span className="text-[#6b6257]">
                            Tổng thanh toán ({order.items.reduce((s, i) => s + i.quantity, 0)} món):
                          </span>
                          <span className="font-black text-sm text-[#2c2722]">
                            {order.totalAmount.toLocaleString('vi-VN')} đ
                          </span>
                        </div>

                        {/* User's Submitted Review (if any) */}
                        {hasReview && order.review && (
                          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-[#4a3518] space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-amber-500">
                                {[...Array(order.review.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                ))}
                                <span className="font-bold text-xs text-amber-800 ml-1">
                                  {order.review.rating}/5 sao
                                </span>
                              </div>
                              <span className="text-[10px] text-amber-700/70">
                                {order.review.createdAt}
                              </span>
                            </div>
                            {order.review.comment && (
                              <p className="italic text-[#5e4320]">
                                &ldquo;{order.review.comment}&rdquo;
                              </p>
                            )}
                          </div>
                        )}

                        {/* Action Buttons: Đánh giá & Đặt lại */}
                        <div className="pt-2 flex items-center justify-end gap-2">
                          {/* Nút Đánh Giá */}
                          {isDelivered && (
                            <button
                              type="button"
                              onClick={() => handleOpenReview(order)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                hasReview
                                  ? 'bg-stone-100 text-stone-400 border border-stone-200 opacity-60 hover:opacity-80'
                                  : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs active:scale-95'
                              }`}
                              title={hasReview ? 'Bấm để chỉnh sửa đánh giá' : 'Đánh giá chất lượng đơn hàng'}
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  hasReview ? 'text-stone-400 fill-stone-400' : 'text-amber-500 fill-amber-400'
                                }`}
                              />
                              <span>{hasReview ? 'Đã đánh giá' : 'Đánh giá'}</span>
                            </button>
                          )}

                          {/* Nút Đặt Lại */}
                          <button
                            type="button"
                            onClick={() => {
                              onReorder(order);
                              onClose();
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#5e7e66] hover:bg-[#4e6c55] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                            title="Thêm các món trong đơn này vào giỏ hàng để đặt lại"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Đặt lại</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Footer */}
        <div className="p-4 border-t border-[#e5dfd5] bg-[#f7f3ed] flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#5e7e66] hover:bg-[#4e6c55] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-98"
          >
            Đóng hồ sơ
          </button>
        </div>

        {/* 5. Review Sub-Modal (Popup nhỏ khi bấm Đánh Giá) */}
        {reviewingOrder && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#e5dfd5] space-y-4 animate-in zoom-in-95">
              {/* Review Header */}
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2c2722]">Đánh Giá Đơn Hàng</h4>
                    <span className="text-[11px] text-[#8c827a]">Mã đơn #{reviewingOrder.orderCode}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setReviewingOrder(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Star Rating Selector (1 to 5 stars) */}
              <div className="text-center py-1">
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(starNum => {
                    const active = (hoverStars || ratingStars) >= starNum;
                    return (
                      <button
                        type="button"
                        key={starNum}
                        onClick={() => setRatingStars(starNum)}
                        onMouseEnter={() => setHoverStars(starNum)}
                        onMouseLeave={() => setHoverStars(0)}
                        className="p-1 transition-transform hover:scale-125 active:scale-95 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            active
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-stone-300 fill-stone-100'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-1.5 text-xs font-bold text-amber-800">
                  {ratingStars === 5 && '🌟 Tuyệt vời - Rất hài lòng'}
                  {ratingStars === 4 && '👍 Rất ngon & chuẩn vị'}
                  {ratingStars === 3 && '👌 Bình thường / Tạm ổn'}
                  {ratingStars === 2 && '👎 Chưa hài lòng'}
                  {ratingStars === 1 && '⚠️ Cần cải thiện chất lượng'}
                </div>
              </div>

              {/* Quick feedback tags */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#6b6257] block">Gợi ý nhanh:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Giao siêu tốc ⚡', 'Đúng nhiệt độ ♨️', 'Vị ngon thanh mát 🍃', 'Đóng gói đẹp 📦', 'Ít đường chuẩn vị 🥤'].map(
                    tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => addQuickTag(tag)}
                        className="px-2 py-0.5 rounded-lg bg-[#f7f3ed] hover:bg-[#ede5d8] text-[10px] text-[#4a453e] border border-[#ded5c7] transition-colors cursor-pointer"
                      >
                        +{tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Comment Text Area */}
              <div>
                <label className="block text-[11px] font-semibold text-[#4a453e] mb-1">
                  Nhận xét & góp ý chi tiết:
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Hãy chia sẻ cảm nhận của bạn về hương vị đồ uống, nhiệt độ và chất lượng phục vụ..."
                  className="w-full px-3 py-2 rounded-xl border border-[#e5dfd5] bg-[#fdfbf7] text-xs text-[#2c2722] focus:outline-hidden focus:ring-2 focus:ring-amber-400 placeholder:text-stone-400 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#f0eae1]">
                <button
                  type="button"
                  onClick={() => setReviewingOrder(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#ded5c7] bg-white text-xs font-bold text-[#4a453e] hover:bg-stone-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
                >
                  Gửi Đánh Giá
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
