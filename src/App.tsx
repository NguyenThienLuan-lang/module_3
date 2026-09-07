/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MobileDeviceFrame, DeviceMode } from './components/MobileDeviceFrame';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Navbar } from './components/Navbar';
import { CheckInSurvey } from './components/CheckInSurvey';
import { RecommendationView } from './components/RecommendationView';
import { StoreMapView } from './components/StoreMapView';
import { HydrationTracker } from './components/HydrationTracker';
import { CartDrawer } from './components/CartDrawer';
import { DrinkCustomizationModal } from './components/DrinkCustomizationModal';
import { HomeRecipeModal } from './components/HomeRecipeModal';
import { NutritionistChatModal } from './components/NutritionistChatModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { LocationModal } from './components/LocationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { StoreDetailModal } from './components/StoreDetailModal';
import { AuthScreen } from './components/AuthScreen';
import { DRINKS_DATABASE, STORES_DATABASE, SAMPLE_PAST_ORDERS } from './data/mockData';
import {
  Drink,
  Store,
  CartItem,
  CartCustomization,
  Order,
  HydrationLogItem,
  AIAdvice,
  CheckInFormData,
  UserProfile,
  MembershipRank,
  PastOrder,
  VisionAnalysisResult
} from './types';
import { dbService } from './services/dbService';
import { isSupabaseConfigured } from './lib/supabase';

export const DEFAULT_GUEST_PROFILE: UserProfile = {
  name: 'Khách Hàng Mới',
  phone: 'Chưa liên kết SĐT',
  email: 'guest@dailysip.vn',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  totalOrdersCount: 0,
  rank: 'bronze',
  linkedPayments: []
};

export default function App() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile_frame');
  const [activeTab, setActiveTab] = useState<'checkin' | 'recommendations' | 'stores' | 'history' | 'sommelier'>(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('dailysip_active_tab');
      if (savedTab && ['checkin', 'recommendations', 'stores', 'history', 'sommelier'].includes(savedTab)) {
        return savedTab as any;
      }
    }
    return 'checkin';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailysip_active_tab', activeTab);
    }
  }, [activeTab]);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('dailysip_theme') === 'dark' ||
        document.documentElement.classList.contains('dark')
      );
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('dailysip_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('dailysip_theme', 'light');
      }
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  const [drinks, setDrinks] = useState<Drink[]>(DRINKS_DATABASE);
  const [recommendedDrinks, setRecommendedDrinks] = useState<Drink[]>(() => {
    if (typeof window !== 'undefined') {
      const savedRecs = localStorage.getItem('dailysip_recommended_drinks');
      if (savedRecs) {
        try {
          return JSON.parse(savedRecs);
        } catch (e) {}
      }
    }
    return DRINKS_DATABASE.slice(0, 5);
  });
  const [stores, setStores] = useState<Store[]>(STORES_DATABASE);
  const [aiAnalysis, setAiAnalysis] = useState<AIAdvice | undefined>({
    summary: 'Chào mừng bạn đến với DailySip! Hãy thực hiện Daily Check-in để nhận 5 gợi ý đồ uống thiết kế riêng cho bạn hôm nay.',
    wellnessTip: 'Uống đủ nước và ưu tiên thảo mộc tự nhiên giúp tinh thần sảng khoái và cơ thể dẻo dai.',
    timingAdvice: 'Nên uống sau bữa ăn 30-45 phút hoặc trước 16h chiều để cơ thể chuyển hóa năng lượng tốt nhất.',
    sugarAdvice: 'Ưu tiên độ ngọt 30% - 50% từ đường tự nhiên hoặc mật ong hoa rừng.',
    allergyNotice: 'Lá chắn Dị ứng đa tầng: Tự động phát hiện và loại bỏ 100% các thành phần dị ứng & kiêng cữ bạn đã chọn.'
  });

  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [activeVisionAnalysis, setActiveVisionAnalysis] = useState<VisionAnalysisResult | null>(null);
  const [activeUploadedImage, setActiveUploadedImage] = useState<string | null>(null);

  // User location
  const [userAddress, setUserAddress] = useState('Quận 1, Bến Thành - TP. Hồ Chí Minh');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: 10.7725,
    lng: 106.6983
  });

  // Store filtering
  const [selectedDrinkForStore, setSelectedDrinkForStore] = useState<Drink | null>(null);

  // Cart & Orders
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Modals
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [selectedDrinkForCustomization, setSelectedDrinkForCustomization] = useState<Drink | null>(null);
  const [targetStoreForCustomization, setTargetStoreForCustomization] = useState<Store | null>(null);

  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [selectedDrinkForRecipe, setSelectedDrinkForRecipe] = useState<Drink | null>(null);

  const [isSommelierOpen, setIsSommelierOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStoreDetailOpen, setIsStoreDetailOpen] = useState(false);
  const [selectedStoreForDetail, setSelectedStoreForDetail] = useState<Store | null>(null);

  // Authentication State: Null when not logged in, requiring AuthScreen first
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('dailysip_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {}
      }
    }
    return null;
  });

  const userProfile: UserProfile = currentUser || DEFAULT_GUEST_PROFILE;

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const next = { ...currentUser, ...updated };
    if (updated.totalOrdersCount !== undefined) {
      if (next.totalOrdersCount >= 51) next.rank = 'diamond';
      else if (next.totalOrdersCount >= 21) next.rank = 'gold';
      else if (next.totalOrdersCount >= 6) next.rank = 'silver';
      else next.rank = 'bronze';
    }
    setCurrentUser(next);
    try {
      localStorage.setItem('dailysip_user', JSON.stringify(next));
    } catch (e) {}
  };

  const [pastOrders, setPastOrders] = useState<PastOrder[]>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('dailysip_user');
      if (savedUser) {
        try {
          const userObj = JSON.parse(savedUser);
          const userOrderKey = `dailysip_past_orders_${userObj.username || userObj.name}`;
          const userOrders = localStorage.getItem(userOrderKey) || localStorage.getItem('dailysip_past_orders');
          if (userOrders) {
            return JSON.parse(userOrders);
          }
          if (userObj.username === 'thienluan') {
            return SAMPLE_PAST_ORDERS;
          }
        } catch (e) {}
      }
    }
    return [];
  });

  // Daily Hydration Logs
  const [hydrationLogs, setHydrationLogs] = useState<HydrationLogItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('dailysip_user');
      if (savedUser) {
        try {
          const userObj = JSON.parse(savedUser);
          const userLogKey = `dailysip_hydration_logs_${userObj.username || userObj.name}`;
          const userLogs = localStorage.getItem(userLogKey) || localStorage.getItem('dailysip_hydration_logs');
          if (userLogs) {
            return JSON.parse(userLogs);
          }
        } catch (e) {}
      }
    }
    return [];
  });

  const handleLoginSuccess = (profile: UserProfile, isNewAccount: boolean = false) => {
    setCurrentUser(profile);
    try {
      localStorage.setItem('dailysip_user', JSON.stringify(profile));
    } catch (e) {}

    if (isNewAccount) {
      // Clean and pristine data for new accounts
      setPastOrders([]);
      setHydrationLogs([]);
      setCartItems([]);
      setActiveOrder(null);
      try {
        localStorage.setItem(`dailysip_past_orders_${profile.username}`, JSON.stringify([]));
        localStorage.setItem(`dailysip_hydration_logs_${profile.username}`, JSON.stringify([]));
      } catch (e) {}
    } else {
      // If logging into demo or existing account, load database records or cached records
      const userOrderKey = `dailysip_past_orders_${profile.username}`;
      const userLogKey = `dailysip_hydration_logs_${profile.username}`;
      const savedOrders = localStorage.getItem(userOrderKey);
      const savedLogs = localStorage.getItem(userLogKey);

      if (savedOrders) {
        try { setPastOrders(JSON.parse(savedOrders)); } catch (e) { setPastOrders([]); }
      } else if (profile.username === 'thienluan') {
        setPastOrders(SAMPLE_PAST_ORDERS);
      } else {
        setPastOrders([]);
        dbService.getPastOrders(profile.username).then(orders => {
          if (orders && orders.length > 0) setPastOrders(orders);
        });
      }

      if (savedLogs) {
        try { setHydrationLogs(JSON.parse(savedLogs)); } catch (e) { setHydrationLogs([]); }
      }
    }

    setActiveTab('checkin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser?.username) {
        localStorage.setItem(`dailysip_past_orders_${currentUser.username}`, JSON.stringify(pastOrders));
      }
      localStorage.setItem('dailysip_past_orders', JSON.stringify(pastOrders));
    }
  }, [pastOrders, currentUser]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser?.username) {
        localStorage.setItem(`dailysip_hydration_logs_${currentUser.username}`, JSON.stringify(hydrationLogs));
      }
      localStorage.setItem('dailysip_hydration_logs', JSON.stringify(hydrationLogs));
    }
  }, [hydrationLogs, currentUser]);

  // Logout: Clear current user and return to AuthScreen
  const handleLogout = () => {
    setCurrentUser(null);
    setPastOrders([]);
    setHydrationLogs([]);
    setCartItems([]);
    setActiveOrder(null);
    setActiveVisionAnalysis(null);
    setActiveUploadedImage(null);
    try {
      localStorage.removeItem('dailysip_user');
      localStorage.removeItem('dailysip_user_avatar');
      localStorage.removeItem('dailysip_user_profile');
      localStorage.removeItem('dailysip_past_orders');
      localStorage.removeItem('dailysip_hydration_logs');
      localStorage.removeItem('dailysip_cart');
      localStorage.removeItem('dailysip_active_tab');
      localStorage.removeItem('dailysip_recommended_drinks');
    } catch (e) {}
    setIsProfileOpen(false);
    setActiveTab('checkin');
  };

  const handleReviewOrder = (orderId: string, rating: number, comment: string) => {
    setPastOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              review: {
                rating,
                comment,
                createdAt: 'Hôm nay'
              }
            }
          : ord
      )
    );
  };

  const handleReorder = (order: PastOrder) => {
    setCartItems(prev => [...prev, ...order.items]);
    setIsCartOpen(true);
  };

  // Fetch initial stores with distance
  const refreshStores = async (lat: number, lng: number, drinkId?: string) => {
    try {
      let url = `/api/stores?lat=${lat}&lng=${lng}`;
      if (drinkId) url += `&drinkId=${drinkId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.stores) {
        setStores(data.stores);
      }
    } catch (e) {
      console.warn('Could not fetch server stores, using client-side calculation');
    }
  };

  useEffect(() => {
    // Initial catalog synchronization with Supabase Database (drinks & stores catalog only)
    const loadDatabaseData = async () => {
      try {
        const [fetchedDrinks, fetchedStores] = await Promise.all([
          dbService.getDrinks(),
          dbService.getStores()
        ]);
        if (fetchedDrinks && fetchedDrinks.length > 0) {
          setDrinks(fetchedDrinks);
        }
        if (fetchedStores && fetchedStores.length > 0) {
          setStores(fetchedStores);
        }
      } catch (err) {
        console.warn('Supabase catalog fetch skipped, using default data:', err);
      }
    };
    loadDatabaseData();
  }, []);

  useEffect(() => {
    refreshStores(userCoords.lat, userCoords.lng);
  }, [userCoords]);

  // Handle Check-in Survey Submission
  const handleCheckInSubmit = async (formData: CheckInFormData) => {
    setIsLoadingRecommendations(true);
    if (formData.visionAnalysis) {
      setActiveVisionAnalysis(formData.visionAnalysis);
    } else {
      setActiveVisionAnalysis(null);
    }
    if (formData.uploadedImage) {
      setActiveUploadedImage(formData.uploadedImage);
    } else {
      setActiveUploadedImage(null);
    }

    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userLocation: {
            latitude: userCoords.lat,
            longitude: userCoords.lng,
            address: userAddress
          }
        })
      });

      const data = await res.json();
      if (data.success && data.recommendations) {
        setRecommendedDrinks(data.recommendations);
        if (data.aiAnalysis) {
          setAiAnalysis(data.aiAnalysis);
        }
      }
    } catch (error) {
      console.error('Check-in error, falling back to client scoring:', error);
    } finally {
      setIsLoadingRecommendations(false);
      setActiveTab('recommendations');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open Store Detail Modal
  const handleOpenStoreDetail = (store: Store) => {
    setSelectedStoreForDetail(store);
    setIsStoreDetailOpen(true);
  };

  // Quick Order Trigger -> Open Customization Modal
  const handleOpenCustomization = (drink: Drink, store?: Store) => {
    setSelectedDrinkForCustomization(drink);
    setTargetStoreForCustomization(store || null);
    setIsCustomizationOpen(true);
  };

  // Add customized item to cart
  const handleAddCustomizedToCart = (
    customization: CartCustomization,
    quantity: number,
    chosenStore: Store
  ) => {
    if (!selectedDrinkForCustomization) return;

    const toppingExtra = customization.toppings.reduce((sum, t) => sum + t.price, 0);
    const sizeExtra = customization.size === 'L' ? 8000 : 0;
    const unitPrice = selectedDrinkForCustomization.priceVND + sizeExtra + toppingExtra;

    const newItem: CartItem = {
      id: `${selectedDrinkForCustomization.id}-${Date.now()}`,
      drinkId: selectedDrinkForCustomization.id,
      drinkName: selectedDrinkForCustomization.name,
      drinkImage: selectedDrinkForCustomization.image,
      storeId: chosenStore.id,
      storeName: chosenStore.name,
      storeAddress: chosenStore.address,
      unitPrice,
      quantity,
      customization,
      totalPrice: unitPrice
    };

    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  // Place Order
  const handlePlaceOrder = (order: Order) => {
    setActiveOrder(order);
    setCartItems([]);
    setIsCartOpen(false);
    setIsTrackingOpen(true);

    // Increment user orders count for rank progression
    handleUpdateProfile({
      totalOrdersCount: userProfile.totalOrdersCount + 1
    });

    // Add to past orders list
    const newPastOrder: PastOrder = {
      id: `ord-${Date.now()}`,
      orderCode: `DS-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Vừa xong',
      status: 'delivered',
      storeName: order.items[0]?.storeName || 'DailySip Store',
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod === 'momo' ? 'Ví MoMo' : order.paymentMethod === 'vnpay' ? 'VNPay' : 'Tiền mặt (COD)',
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      discount: order.discount,
      totalAmount: order.totalAmount,
      items: order.items
    };
    setPastOrders(prev => [newPastOrder, ...prev]);

    // Save order asynchronously to Supabase
    dbService.createOrder({
      ...order,
      id: newPastOrder.id,
      driver: {
        name: 'Nguyễn Văn Hùng',
        phone: '0912 345 678',
        vehiclePlate: '59-S2 889.92',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      }
    });

    // Also automatically log to hydration tracker
    order.items.forEach(item => {
      const matchDrink = drinks.find(d => d.id === item.drinkId);
      handleAddQuickDrink(
        item.drinkName,
        item.customization.size === 'L' ? 700 : 500,
        matchDrink?.calories || 120,
        matchDrink?.caffeineMg || 0,
        matchDrink?.sugarGrams || 10,
        matchDrink?.category || 'tea'
      );
    });
  };

  // Select drink to find stores
  const handleSelectDrinkForStores = (drink: Drink) => {
    setSelectedDrinkForStore(drink);
    refreshStores(userCoords.lat, userCoords.lng, drink.id);
    setActiveTab('stores');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear drink filter in store map
  const handleClearDrinkFilter = () => {
    setSelectedDrinkForStore(null);
    refreshStores(userCoords.lat, userCoords.lng);
  };

  // Open DIY recipe
  const handleOpenRecipe = (drink: Drink) => {
    setSelectedDrinkForRecipe(drink);
    setIsRecipeOpen(true);
  };

  // Quick log drink
  const handleLogDrink = (drink: Drink) => {
    handleAddQuickDrink(
      drink.name,
      500,
      drink.calories,
      drink.caffeineMg,
      drink.sugarGrams,
      drink.category
    );
  };

  const handleAddQuickDrink = (
    name: string,
    volumeMl: number,
    calories: number,
    caffeineMg: number,
    sugarGrams: number,
    drinkCategory: string
  ) => {
    const newLog: HydrationLogItem = {
      id: Date.now().toString(),
      drinkName: name,
      drinkCategory,
      volumeMl,
      calories,
      caffeineMg,
      sugarGrams,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      moodTag: 'good'
    };
    setHydrationLogs(prev => [newLog, ...prev]);
    dbService.addHydrationLog(newLog);
  };

  const handleClearLogs = () => {
    setHydrationLogs([]);
  };

  const handleRemoveLog = (id: string) => {
    setHydrationLogs(prev => prev.filter(l => l.id !== id));
  };

  // Location change
  const handleSelectLocation = (newAddress: string, lat: number, lng: number) => {
    setUserAddress(newAddress);
    setUserCoords({ lat, lng });
    refreshStores(lat, lng, selectedDrinkForStore?.id);
  };

  const totalWaterMl = hydrationLogs.reduce((sum, item) => sum + item.volumeMl, 0);
  const totalCaffeineMg = hydrationLogs.reduce((sum, item) => sum + item.caffeineMg, 0);

  return (
    <MobileDeviceFrame deviceMode={deviceMode} setDeviceMode={setDeviceMode}>
      {!currentUser ? (
        /* DEDICATED FULL SCREEN AUTHENTICATION (Not a popup modal) */
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          isDarkMode={isDarkMode}
        />
      ) : (
        /* MAIN APPLICATION (Only unlocked after login) */
        <>
          {deviceMode === 'desktop' ? (
            /* DESKTOP PC WEB VIEW */
            <>
              <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                cartItems={cartItems}
                setIsCartOpen={setIsCartOpen}
                setIsSommelierOpen={setIsSommelierOpen}
                userProfile={userProfile}
                setIsProfileOpen={setIsProfileOpen}
                dailyWaterMl={totalWaterMl}
                dailyCaffeineMg={totalCaffeineMg}
                userAddress={userAddress}
                onChangeLocation={() => setIsLocationOpen(true)}
              />

              <main className="flex-1 pb-16">
                {activeTab === 'checkin' && (
                  <CheckInSurvey
                    onSubmit={handleCheckInSubmit}
                    isLoading={isLoadingRecommendations}
                    userAddress={userAddress}
                  />
                )}

                {activeTab === 'recommendations' && (
                  <RecommendationView
                    drinks={recommendedDrinks}
                    stores={stores}
                    aiAnalysis={aiAnalysis}
                    visionAnalysis={activeVisionAnalysis || undefined}
                    uploadedImage={activeUploadedImage || undefined}
                    onSelectDrinkForStores={handleSelectDrinkForStores}
                    onOpenStoreDetail={handleOpenStoreDetail}
                    onQuickOrder={(drink, store) => handleOpenCustomization(drink, store)}
                    onOpenRecipe={handleOpenRecipe}
                    onLogDrink={handleLogDrink}
                    onRetakeCheckIn={() => {
                      setActiveTab('checkin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {activeTab === 'stores' && (
                  <StoreMapView
                    stores={stores}
                    selectedDrink={selectedDrinkForStore}
                    onClearDrinkFilter={handleClearDrinkFilter}
                    onOpenStoreDetail={handleOpenStoreDetail}
                    onAddToCart={(store, drink) => handleOpenCustomization(drink, store)}
                    userAddress={userAddress}
                    allDrinks={drinks}
                  />
                )}

                {activeTab === 'history' && (
                  <HydrationTracker
                    logs={hydrationLogs}
                    onAddQuickDrink={handleAddQuickDrink}
                    onClearLogs={handleClearLogs}
                    onRemoveLog={handleRemoveLog}
                  />
                )}
              </main>

              <footer className="bg-[#3e3933] text-[#cfc8bf] text-xs py-8 border-t border-[#4e4840] mt-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍵</span>
                    <span className="font-bold text-[#fdfbf7]">DailySip Vietnam</span>
                    <span>— Trợ Lý Đồ Uống & Sức Khỏe Cá Nhân Hóa</span>
                  </div>
                  <div className="flex items-center gap-4 text-[#a8a095]">
                    <span>Powered by Gemini 3.7 Flash AI</span>
                    <span>•</span>
                    <span>Giao Hàng Siêu Tốc</span>
                  </div>
                </div>
              </footer>
            </>
          ) : (
            /* MOBILE PHONE VIEW (iPhone 16 Pro Frame or Full Mobile) */
            <>
              <MobileHeader
                userAddress={userAddress}
                onChangeLocation={() => setIsLocationOpen(true)}
                cartItems={cartItems}
                setIsCartOpen={setIsCartOpen}
                userProfile={userProfile}
                setIsProfileOpen={setIsProfileOpen}
                dailyWaterMl={totalWaterMl}
                dailyCaffeineMg={totalCaffeineMg}
                onLogoClick={() => setActiveTab('checkin')}
              />

              <main className="flex-1 pb-24 px-3 py-3 overflow-y-auto">
                {activeTab === 'checkin' && (
                  <CheckInSurvey
                    onSubmit={handleCheckInSubmit}
                    isLoading={isLoadingRecommendations}
                    userAddress={userAddress}
                  />
                )}

                {activeTab === 'recommendations' && (
                  <RecommendationView
                    drinks={recommendedDrinks}
                    stores={stores}
                    aiAnalysis={aiAnalysis}
                    visionAnalysis={activeVisionAnalysis || undefined}
                    uploadedImage={activeUploadedImage || undefined}
                    onSelectDrinkForStores={handleSelectDrinkForStores}
                    onOpenStoreDetail={handleOpenStoreDetail}
                    onQuickOrder={(drink, store) => handleOpenCustomization(drink, store)}
                    onOpenRecipe={handleOpenRecipe}
                    onLogDrink={handleLogDrink}
                    onRetakeCheckIn={() => {
                      setActiveTab('checkin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {activeTab === 'stores' && (
                  <StoreMapView
                    stores={stores}
                    selectedDrink={selectedDrinkForStore}
                    onClearDrinkFilter={handleClearDrinkFilter}
                    onOpenStoreDetail={handleOpenStoreDetail}
                    onAddToCart={(store, drink) => handleOpenCustomization(drink, store)}
                    userAddress={userAddress}
                    allDrinks={drinks}
                  />
                )}

                {activeTab === 'history' && (
                  <HydrationTracker
                    logs={hydrationLogs}
                    onAddQuickDrink={handleAddQuickDrink}
                    onClearLogs={handleClearLogs}
                    onRemoveLog={handleRemoveLog}
                  />
                )}
              </main>

              <MobileBottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenSommelier={() => setIsSommelierOpen(true)}
                recommendationsCount={recommendedDrinks.length}
              />
            </>
          )}

          {/* Modals & Bottom Sheets (Accessible when logged in) */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={(id, qty) => {
              if (qty <= 0) {
                setCartItems(prev => prev.filter(i => i.id !== id));
              } else {
                setCartItems(prev => prev.map(i => (i.id === id ? { ...i, quantity: qty } : i)));
              }
            }}
            onRemoveItem={id => setCartItems(prev => prev.filter(i => i.id !== id))}
            onClearCart={() => setCartItems([])}
            onPlaceOrder={handlePlaceOrder}
            userAddress={userAddress}
          />

          <DrinkCustomizationModal
            isOpen={isCustomizationOpen}
            drink={selectedDrinkForCustomization}
            store={targetStoreForCustomization}
            onClose={() => {
              setIsCustomizationOpen(false);
              setSelectedDrinkForCustomization(null);
              setTargetStoreForCustomization(null);
            }}
            onAddToCart={handleAddCustomizedToCart}
            availableStores={stores}
          />

          <HomeRecipeModal
            isOpen={isRecipeOpen}
            drink={selectedDrinkForRecipe}
            onClose={() => {
              setIsRecipeOpen(false);
              setSelectedDrinkForRecipe(null);
            }}
          />

          <NutritionistChatModal
            isOpen={isSommelierOpen}
            onClose={() => setIsSommelierOpen(false)}
            onSelectDrink={drink => {
              setIsSommelierOpen(false);
              handleOpenCustomization(drink);
            }}
          />

          <OrderTrackingModal
            isOpen={isTrackingOpen}
            order={activeOrder}
            onClose={() => {
              setIsTrackingOpen(false);
              setActiveOrder(null);
            }}
          />

          <LocationModal
            isOpen={isLocationOpen}
            onClose={() => setIsLocationOpen(false)}
            currentAddress={userAddress}
            onSelectAddress={handleSelectLocation}
          />

          <UserProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            pastOrders={pastOrders}
            onReorder={handleReorder}
            onReviewOrder={handleReviewOrder}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            onLogout={handleLogout}
            onOpenSwitchAccount={() => {
              setIsProfileOpen(false);
              setCurrentUser(null);
              try {
                localStorage.removeItem('dailysip_user');
                localStorage.removeItem('dailysip_active_tab');
              } catch (e) {}
              setActiveTab('checkin');
            }}
          />

          <StoreDetailModal
            isOpen={isStoreDetailOpen}
            onClose={() => setIsStoreDetailOpen(false)}
            store={selectedStoreForDetail}
            allDrinks={drinks}
            onAddToCart={(drink, store) => {
              setIsStoreDetailOpen(false);
              handleOpenCustomization(drink, store);
            }}
          />
        </>
      )}
    </MobileDeviceFrame>
  );
}
