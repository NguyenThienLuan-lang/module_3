import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Lock,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Coffee,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { dbService } from '../services/dbService';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  isSwitchMode?: boolean; // When called from "Chuyển đổi tài khoản" in Profile
  canClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isSwitchMode = false,
  canClose = true
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await dbService.loginUser(loginIdentifier, loginPassword);
      if (res.success && res.profile) {
        setSuccessMessage(`Đăng nhập thành công! Chào mừng ${res.profile.name}`);
        setTimeout(() => {
          onLoginSuccess(res.profile!);
          if (onClose) onClose();
        }, 600);
      } else {
        setErrorMessage(res.message || 'Tài khoản hoặc mật khẩu không chính xác.');
      }
    } catch (err: any) {
      setErrorMessage('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regUsername.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ tất cả các trường thông tin.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự để bảo mật.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Xác nhận mật khẩu không trùng khớp.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await dbService.registerUser({
        name: regName,
        username: regUsername,
        phone: regPhone,
        password: regPassword
      });

      if (res.success && res.profile) {
        setSuccessMessage('Đăng ký tài khoản DailySip thành công!');
        setTimeout(() => {
          onLoginSuccess(res.profile!);
          if (onClose) onClose();
        }, 800);
      } else {
        setErrorMessage(res.message || 'Không thể tạo tài khoản lúc này.');
      }
    } catch (err: any) {
      setErrorMessage('Lỗi khi đăng ký tài khoản. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Login Helper
  const handleQuickLogin = (user: string, pass: string) => {
    setLoginIdentifier(user);
    setLoginPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#fdfbf7] dark:bg-[#1d1a16] rounded-3xl shadow-2xl border border-[#e5dfd5] dark:border-[#383129] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with DailySip Branding */}
        <div className="relative bg-gradient-to-r from-[#2c3a31] via-[#3d5043] to-[#2c3a31] text-white p-6 pb-7 text-center shrink-0">
          {canClose && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Coffee className="w-7 h-7 text-[#a3c9ae]" />
          </div>

          <h2 className="text-xl font-bold tracking-tight flex items-center justify-center gap-2">
            <span>DailySip Sommelier</span>
            <Sparkles className="w-4 h-4 text-[#eef4f0] animate-pulse" />
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-xs mx-auto">
            {isSwitchMode
              ? 'Đăng nhập tài khoản khác để đồng bộ lịch sử và voucher'
              : 'Khám phá đồ uống chuẩn gu dinh dưỡng & thể trạng của bạn'}
          </p>
        </div>

        {/* Tab Switcher (Đăng Nhập / Đăng Ký) */}
        <div className="p-4 pb-0 shrink-0">
          <div className="grid grid-cols-2 p-1 bg-[#f0ebe3] dark:bg-[#26211c] rounded-2xl border border-[#e5dfd5] dark:border-[#383129]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-[#1d1a16] text-[#2c3a31] dark:text-[#fdfbf7] shadow-sm'
                  : 'text-[#8c827a] dark:text-[#9c9285] hover:text-[#4a453e]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-[#1d1a16] text-[#2c3a31] dark:text-[#fdfbf7] shadow-sm'
                  : 'text-[#8c827a] dark:text-[#9c9285] hover:text-[#4a453e]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng Ký Mới</span>
            </button>
          </div>
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-5 pt-3 flex-1 overflow-y-auto scrollbar-none">
          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#fdf3f0] dark:bg-[#331c19] border border-[#e8cfc8] dark:border-[#5a2c24] text-xs text-[#c45a4b] dark:text-[#fca5a5] flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#eef4f0] dark:bg-[#1b2b20] border border-[#7d9d85]/30 text-xs text-[#2c3a31] dark:text-[#a3c9ae] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#7d9d85]" />
              <div className="font-bold">{successMessage}</div>
            </div>
          )}

          {activeTab === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1.5">
                  Tên tài khoản hoặc Số điện thoại
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c827a]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="VD: thienluan hoặc 0908123456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-white dark:bg-[#26211c] text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c827a]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-white dark:bg-[#26211c] text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8c827a] hover:text-[#4a453e] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7d9d85] via-[#6c8c74] to-[#5e7e66] hover:from-[#6c8c74] hover:to-[#4e6c55] text-white font-bold text-xs shadow-md shadow-[#7d9d85]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>Đang xác thực...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Đăng Nhập Vào DailySip</span>
                  </>
                )}
              </button>

              {/* Quick Demo Accounts Helper */}
              <div className="pt-2 border-t border-[#e5dfd5] dark:border-[#383129]/60">
                <div className="text-[11px] font-semibold text-[#8c827a] dark:text-[#9c9285] mb-2 text-center">
                  💡 Tài khoản mẫu sẵn có (Bấm để điền nhanh):
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('thienluan', '123456')}
                    className="p-2 rounded-xl border border-[#7d9d85]/30 bg-[#eef4f0] dark:bg-[#1a281f] text-left hover:border-[#7d9d85] transition-all cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-[#2c3a31] dark:text-[#a3c9ae]">Thành Viên Bạc</div>
                    <div className="text-[10px] text-[#5e7e66] dark:text-[#7d9d85]">thienluan / 123456</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('minhanh', '123456')}
                    className="p-2 rounded-xl border border-[#d98b72]/30 bg-[#fdf3f0] dark:bg-[#2d201a] text-left hover:border-[#d98b72] transition-all cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-[#8c2a1e] dark:text-[#fca5a5]">VIP Vàng (25 Đơn)</div>
                    <div className="text-[10px] text-[#b86e55] dark:text-[#e09680]">minhanh / 123456</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1">
                  Họ và Tên của bạn
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c827a]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-white dark:bg-[#26211c] text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1">
                    Tên tài khoản
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    placeholder="VD: nguyenvana"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-white dark:bg-[#26211c] text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="VD: 0908 123 456"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-white dark:bg-[#26211c] text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-white dark:bg-[#26211c] text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1">
                    Nhập lại mật khẩu
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="Khớp mật khẩu"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-white dark:bg-[#26211c] text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7d9d85] via-[#6c8c74] to-[#5e7e66] hover:from-[#6c8c74] hover:to-[#4e6c55] text-white font-bold text-xs shadow-md shadow-[#7d9d85]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-70 mt-3"
              >
                {isLoading ? (
                  <span>Đang tạo tài khoản...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Đăng Ký & Nhận Ưu Đãi Thành Viên</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info & Guest mode option */}
        <div className="p-4 bg-[#f7f3ed] dark:bg-[#141210] border-t border-[#e5dfd5] dark:border-[#383129] text-center shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#8c827a] dark:text-[#9c9285]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7d9d85]" />
            <span>Bảo mật Supabase Cloud</span>
          </div>

          {canClose && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-[#5e7e66] dark:text-[#a3c9ae] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Dùng thử chế độ Khách</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
