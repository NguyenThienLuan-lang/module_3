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
import { SurpriseWheel } from './components/SurpriseWheel';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { LocationModal } from './components/LocationModal';
import { DRINKS_DATABASE, STORES_DATABASE } from './data/mockData';
import {
  Drink,
  Store,
  CartItem,
  CartCustomization,
  Order,
  HydrationLogItem,
  AIAdvice,
  CheckInFormData
} from './types';

export default function App() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile_frame');
  const [activeTab, setActiveTab] = useState<'checkin' | 'recommendations' | 'stores' | 'history' | 'sommelier'>('checkin');
  const [drinks, setDrinks] = useState<Drink[]>(DRINKS_DATABASE);
  const [recommendedDrinks, setRecommendedDrinks] = useState<Drink[]>(DRINKS_DATABASE.slice(0, 5));
  const [stores, setStores] = useState<Store[]>(STORES_DATABASE);
  const [aiAnalysis, setAiAnalysis] = useState<AIAdvice | undefined>({
    summary: 'Chào mừng bạn đến với DailySip! Hãy thực hiện Daily Check-in để nhận 5 gợi ý đồ uống thiết kế riêng cho bạn hôm nay.',
    wellnessTip: 'Uống đủ nước và ưu tiên thảo mộc tự nhiên giúp tinh thần sảng khoái và cơ thể dẻo dai.',
    caffeineAdvice: 'Giữ mức nạp cafein dưới 300mg/ngày để tránh ép tim và duy trì giấc ngủ ngon.',
    sugarAdvice: 'Ưu tiên độ ngọt 30% - 50% từ đường tự nhiên hoặc mật ong hoa rừng.'
  });

  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

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
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Daily Hydration Logs
  const [hydrationLogs, setHydrationLogs] = useState<HydrationLogItem[]>([
    {
      id: '1',
      drinkName: 'Nước lọc buổi sáng',
      drinkCategory: 'water',
      volumeMl: 350,
      calories: 0,
      caffeineMg: 0,
      sugarGrams: 0,
      timestamp: '07:30',
      moodTag: 'fresh'
    },
    {
      id: '2',
      drinkName: 'Trà Lài Hạt Sen Vàng',
      drinkCategory: 'tea',
      volumeMl: 400,
      calories: 110,
      caffeineMg: 25,
      sugarGrams: 12,
      timestamp: '09:45',
      moodTag: 'focus'
    }
  ]);

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
    refreshStores(userCoords.lat, userCoords.lng);
  }, [userCoords]);

  // Handle Check-in Survey Submission
  const handleCheckInSubmit = async (formData: CheckInFormData) => {
    setIsLoadingRecommendations(true);
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
      {deviceMode === 'desktop' ? (
        /* DESKTOP PC WEB VIEW */
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cartItems={cartItems}
            setIsCartOpen={setIsCartOpen}
            setIsSommelierOpen={setIsSommelierOpen}
            setIsSurpriseOpen={setIsSurpriseOpen}
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
                aiAnalysis={aiAnalysis}
                onSelectDrinkForStores={handleSelectDrinkForStores}
                onQuickOrder={drink => handleOpenCustomization(drink)}
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
            setIsSurpriseOpen={setIsSurpriseOpen}
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
                aiAnalysis={aiAnalysis}
                onSelectDrinkForStores={handleSelectDrinkForStores}
                onQuickOrder={drink => handleOpenCustomization(drink)}
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

      {/* Modals & Bottom Sheets (Shared across both modes) */}
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

      <SurpriseWheel
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        drinks={drinks}
        onSelectDrink={drink => {
          setIsSurpriseOpen(false);
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
    </MobileDeviceFrame>
  );
}
