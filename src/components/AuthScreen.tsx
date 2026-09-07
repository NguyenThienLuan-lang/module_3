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
  Coffee,
  Leaf
} from 'lucide-react';
import { UserProfile } from '../types';
import { dbService } from '../services/dbService';

interface AuthScreenProps {
  onLoginSuccess: (profile: UserProfile, isNewAccount?: boolean) => void;
  isDarkMode?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  isDarkMode
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
          onLoginSuccess(res.profile!, false);
        }, 500);
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
        setSuccessMessage('Đăng ký tài khoản DailySip thành công! Dữ liệu mới tinh đã sẵn sàng.');
        setTimeout(() => {
          onLoginSuccess(res.profile!, true);
        }, 700);
      } else {
        setErrorMessage(res.message || 'Không thể tạo tài khoản lúc này.');
      }
    } catch (err: any) {
      setErrorMessage('Lỗi khi đăng ký tài khoản. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Login
  const handleQuickDemo = (user: string, pass: string) => {
    setLoginIdentifier(user);
    setLoginPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="w-full h-full min-h-full flex-1 flex flex-col justify-between bg-[#fdfbf7] dark:bg-[#141210] text-[#4a453e] dark:text-[#d4cdc5] px-4 py-3 sm:py-5 sm:px-6 animate-fade-in overflow-y-auto overflow-x-hidden">
      {/* 1. BRAND HERO HEADER */}
      <div className="text-center pt-1 pb-1 shrink-0">
        {/* DailySip App Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#5e7e66] via-[#7d9d85] to-[#a3c9ae] text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-[#7d9d85]/25 border-2 border-white/60 dark:border-[#383129]">
          <Coffee className="w-7 h-7 text-white drop-shadow-sm" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#eef4f0] dark:bg-[#1a281f] text-[#5e7e66] dark:text-[#a3c9ae] text-[11px] font-bold border border-[#7d9d85]/30 mb-1">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>AI Drink & Wellness Sommelier</span>
        </div>

        <h1 className="text-lg sm:text-2xl font-black text-[#2c2722] dark:text-[#fdfbf7] tracking-tight">
          Chào Mừng Đến DailySip
        </h1>
        <p className="text-[11px] text-[#8c827a] dark:text-[#9c9285] mt-0.5 max-w-xs mx-auto leading-relaxed">
          Đăng nhập hoặc tạo tài khoản để khám phá đồ uống chuẩn gu dinh dưỡng & thể trạng.
        </p>
      </div>

      {/* 2. AUTH CARD CONTAINER */}
      <div className="w-full max-w-md mx-auto bg-white dark:bg-[#201c18] rounded-3xl p-4 sm:p-5 shadow-xl shadow-black/5 border border-[#e5dfd5] dark:border-[#383129] my-auto shrink-0">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#f7f3ed] dark:bg-[#26211c] rounded-2xl border border-[#e5dfd5] dark:border-[#383129] mb-3.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-[#1d1a16] text-[#2c3a31] dark:text-[#fdfbf7] shadow-sm font-extrabold'
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
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white dark:bg-[#1d1a16] text-[#2c3a31] dark:text-[#fdfbf7] shadow-sm font-extrabold'
                : 'text-[#8c827a] dark:text-[#9c9285] hover:text-[#4a453e]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng Ký Mới</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-[#fdf3f0] dark:bg-[#331c19] border border-[#e8cfc8] dark:border-[#5a2c24] text-xs text-[#c45a4b] dark:text-[#fca5a5] flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="font-semibold">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-[#eef4f0] dark:bg-[#1b2b20] border border-[#7d9d85]/30 text-xs text-[#2c3a31] dark:text-[#a3c9ae] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#7d9d85]" />
            <div className="font-bold">{successMessage}</div>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1">
                Tài khoản hoặc Số điện thoại
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-[#fdfbf7] dark:bg-[#26211c] text-[16px] sm:text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1">
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
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-[#fdfbf7] dark:bg-[#26211c] text-[16px] sm:text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8c827a] hover:text-[#4a453e] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7d9d85] via-[#6c8c74] to-[#5e7e66] hover:from-[#6c8c74] hover:to-[#4e6c55] text-white font-bold text-xs shadow-md shadow-[#7d9d85]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-70 mt-1"
            >
              {isLoading ? (
                <span>Đang kiểm tra tài khoản...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập Vào Ứng Dụng</span>
                </>
              )}
            </button>

            {/* Quick Demo Fill */}
            <div className="pt-2.5 border-t border-[#f0eae1] dark:border-[#383129]">
              <div className="text-[11px] font-semibold text-[#8c827a] dark:text-[#9c9285] mb-1.5 text-center">
                💡 Tài khoản có sẵn (Bấm để điền nhanh):
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemo('thienluan', '123456')}
                className="w-full p-2 rounded-xl border border-[#7d9d85]/40 bg-[#eef4f0] dark:bg-[#1a281f] text-left hover:border-[#7d9d85] transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-[#2c3a31] dark:text-[#a3c9ae]">Tài Khoản: thienluan</div>
                  <div className="text-[10px] text-[#5e7e66] dark:text-[#7d9d85]">Mật khẩu: 123456 (VIP Bạc)</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7d9d85] text-white font-bold">Điền nhanh</span>
              </button>
            </div>
          </form>
        ) : (
          /* TAB 2: REGISTER */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
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
                  placeholder="VD: Trần Văn Bình"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-[#fdfbf7] dark:bg-[#26211c] text-[16px] sm:text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1">
                  Tên tài khoản
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  placeholder="VD: vanbinh"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-[#fdfbf7] dark:bg-[#26211c] text-[16px] sm:text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
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
                  placeholder="VD: 0912 345 678"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-[#fdfbf7] dark:bg-[#26211c] text-[16px] sm:text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
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
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-[#fdfbf7] dark:bg-[#26211c] text-[16px] sm:text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a453e] dark:text-[#d4cdc5] mb-1">
                  Nhập lại MK
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  placeholder="Khớp mật khẩu"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-[#fdfbf7] dark:bg-[#26211c] text-[16px] sm:text-xs text-[#2c2722] dark:text-[#fdfbf7] placeholder-[#a8a095] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7d9d85] via-[#6c8c74] to-[#5e7e66] hover:from-[#6c8c74] hover:to-[#4e6c55] text-white font-bold text-xs shadow-md shadow-[#7d9d85]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-70 mt-1"
            >
              {isLoading ? (
                <span>Đang tạo tài khoản mới...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Đăng Ký Tài Khoản Mới</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* 3. FOOTER BADGES */}
      <div className="text-center pt-2 pb-1 text-[11px] text-[#8c827a] dark:text-[#9c9285] flex items-center justify-center gap-3 shrink-0">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7d9d85]" />
          <span>Bảo mật Supabase</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Leaf className="w-3.5 h-3.5 text-[#7d9d85]" />
          <span>Khỏe đẹp tự nhiên</span>
        </div>
      </div>
    </div>
  );
};
