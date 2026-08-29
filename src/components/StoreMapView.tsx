import React, { useState } from 'react';
import { MapPin, Navigation, Star, Clock, ShoppingBag, ExternalLink, Filter, Search, Phone, ChevronRight, Check } from 'lucide-react';
import { Store, Drink } from '../types';

interface StoreMapViewProps {
  stores: Store[];
  selectedDrink?: Drink | null;
  onClearDrinkFilter: () => void;
  onAddToCart: (store: Store, drink: Drink) => void;
  userAddress: string;
  allDrinks: Drink[];
}

export const StoreMapView: React.FC<StoreMapViewProps> = ({
  stores,
  selectedDrink,
  onClearDrinkFilter,
  onAddToCart,
  userAddress,
  allDrinks
}) => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(stores[0] || null);
  const [radiusFilter, setRadiusFilter] = useState<number>(5); // km
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStores = stores.filter(store => {
    const matchesDistance = (store.distanceKm || 0) <= radiusFilter;
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistance && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      {/* 1. Header with title & location */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2c2722] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#5e7e66] shrink-0" />
            <span>Quán Gần Bạn & Đặt Ship</span>
          </h2>
          <p className="text-xs text-[#8c827a] mt-0.5 flex items-center gap-1">
            <span>Vị trí giao hàng:</span>
            <span className="font-semibold text-[#4a453e] truncate max-w-[250px]">{userAddress}</span>
          </p>
        </div>

        {selectedDrink && (
          <div className="inline-flex items-center gap-2 bg-[#eef4f0] text-[#2c3a31] border border-[#7d9d85]/40 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto">
            <span>Món đang tìm:</span>
            <span className="font-bold text-[#5e7e66] truncate max-w-[140px]">{selectedDrink.name}</span>
            <button
              onClick={onClearDrinkFilter}
              className="text-[#5e7e66] hover:text-[#2c3a31] font-bold ml-1 cursor-pointer"
              title="Xóa bộ lọc món"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 2. Control bar: Radius filter & search */}
      <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#e5dfd5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Radius selector */}
        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-semibold text-[#4a453e]">
          <div className="flex items-center gap-1 text-[#5e7e66]">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bán kính:</span>
          </div>
          <div className="flex items-center gap-1 bg-[#f7f3ed] p-1 rounded-xl">
            {[1, 3, 5, 10].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRadiusFilter(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  radiusFilter === r
                    ? 'bg-[#5e7e66] text-white shadow-xs'
                    : 'text-[#4a453e] hover:bg-[#ede6dc]'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-[#a8a095] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tên quán, thương hiệu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e5dfd5] bg-[#f7f3ed] text-[#4a453e] placeholder-[#a8a095] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
          />
        </div>
      </div>

      {/* 3. GOOGLE MAP SIMULATION (Ở ĐẦU) */}
      <div className="w-full bg-[#253329] rounded-3xl overflow-hidden shadow-md border border-[#3e5244] relative h-[220px] sm:h-[290px] flex flex-col">
        {/* Map styling canvas / visual GPS simulation */}
        <div className="absolute inset-0 bg-[#212b23] opacity-90 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#314236_1px,transparent_1px),linear-gradient(to_bottom,#314236_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
          {/* Road simulations */}
          <div className="absolute top-1/3 left-0 right-0 h-3 bg-[#4a5f50]/40 transform -rotate-6"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-[#4a5f50]/40 transform rotate-12"></div>
          <div className="absolute top-2/3 left-0 right-0 h-2 bg-[#7d9d85]/20"></div>
        </div>

        {/* Top map info */}
        <div className="relative z-10 px-3.5 py-2.5 flex items-center justify-between bg-[#2d3a31]/90 backdrop-blur-md border-b border-[#3e5244]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping"></div>
            <span className="text-xs font-bold text-[#eef4f0]">Bản Đồ GPS Vị Trí Các Quán Gần Bạn</span>
          </div>
          <span className="text-[11px] text-[#cfc8bf]">
            {filteredStores.length} quán trong {radiusFilter}km
          </span>
        </div>

        {/* Pins layer */}
        <div className="relative z-10 flex-1 p-4">
          {/* User location pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="w-7 h-7 rounded-full bg-[#7d9d85]/30 ring-4 ring-[#7d9d85]/20 flex items-center justify-center animate-pulse">
              <div className="w-3.5 h-3.5 rounded-full bg-[#7d9d85] border-2 border-white shadow-md"></div>
            </div>
            <span className="text-[9px] font-bold text-white bg-[#5e7e66] px-1.5 py-0.2 rounded-full mt-0.5 shadow-xs">
              Bạn
            </span>
          </div>

          {/* Dynamic store pins distributed on map */}
          {filteredStores.map((store, index) => {
            const isSelected = selectedStore?.id === store.id;
            const positions = [
              { top: '25%', left: '26%' },
              { top: '32%', left: '74%' },
              { top: '68%', left: '30%' },
              { top: '72%', left: '70%' },
              { top: '20%', left: '52%' },
              { top: '60%', left: '16%' }
            ];
            const pos = positions[index % positions.length];

            return (
              <button
                key={store.id}
                type="button"
                onClick={() => setSelectedStore(store)}
                style={{ top: pos.top, left: pos.left }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all transform hover:scale-110 ${
                  isSelected ? 'scale-115 z-20' : 'z-10'
                }`}
              >
                <div
                  className={`px-2 py-1 rounded-xl shadow-lg flex items-center gap-1 border ${
                    isSelected
                      ? 'bg-[#5e7e66] border-white text-white ring-2 ring-[#7d9d85]'
                      : 'bg-[#1e2a22]/95 border-[#3e5244] text-[#eef4f0] hover:bg-[#2d3a31]'
                  }`}
                >
                  <span className="text-xs">🍵</span>
                  <div className="text-left">
                    <div className="text-[10px] font-bold leading-tight max-w-[75px] truncate">
                      {store.brand}
                    </div>
                    <div className="text-[9px] text-[#eaddcf]">
                      {store.distanceKm} km
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom active store quick badge */}
        {selectedStore && (
          <div className="relative z-10 px-3.5 py-2 bg-[#253329]/95 backdrop-blur-md border-t border-[#3e5244] flex items-center justify-between text-xs">
            <div className="truncate mr-2">
              <span className="font-bold text-white block truncate">{selectedStore.name}</span>
              <span className="text-[#a8a095] text-[10px] block truncate">{selectedStore.address}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#7d9d85]/30 text-[#eef4f0] text-[11px] font-bold shrink-0 border border-[#7d9d85]/40">
              {selectedStore.distanceKm} km • ~{selectedStore.deliveryTimeMins}p
            </span>
          </div>
        )}
      </div>

      {/* 4. DANH SÁCH CÁC QUÁN & ĐỒ UỐNG (Ở DƯỚI BẢN ĐỒ) */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm sm:text-base font-bold text-[#2c2722] flex items-center gap-1.5">
            <span>🥤</span> Danh Sách Quán & Menu Đồ Uống Phục Vụ
          </h3>
          <span className="text-xs text-[#8c827a]">
            {filteredStores.length} địa điểm
          </span>
        </div>

        {filteredStores.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-[#e5dfd5] text-[#8c827a]">
            <p className="text-xs">Không tìm thấy quán nào trong bán kính {radiusFilter}km.</p>
            <button
              type="button"
              onClick={() => setRadiusFilter(10)}
              className="mt-2 text-xs text-[#5e7e66] font-bold underline cursor-pointer"
            >
              Mở rộng bán kính lên 10km
            </button>
          </div>
        ) : (
          filteredStores.map(store => {
            const isSelected = selectedStore?.id === store.id;

            return (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#5e7e66] ring-2 ring-[#7d9d85]/20 shadow-sm'
                    : 'border-[#e5dfd5] hover:border-[#d8cfc4] shadow-2xs'
                }`}
              >
                {/* Store Header */}
                <div className="flex items-start gap-3.5">
                  <div className="w-13 h-13 rounded-xl overflow-hidden bg-[#f7f3ed] shrink-0 border border-[#e5dfd5]">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-[#2c2722] text-sm sm:text-base leading-tight truncate">
                        {store.name}
                      </h4>
                      {store.promoBadge && (
                        <span className="text-[10px] bg-[#fdf5f0] text-[#b86e55] font-bold px-2 py-0.2 rounded-md border border-[#d98b72]/30">
                          {store.promoBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8c827a] mt-0.5 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#5e7e66] shrink-0" />
                      <span className="truncate">{store.address}</span>
                    </p>

                    {/* Store Meta Badges */}
                    <div className="flex items-center gap-2.5 text-xs text-[#4a453e] mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[#b86e55] font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#d98b72] text-[#d98b72]" />
                        {store.rating} ({store.reviewCount})
                      </span>
                      <span className="text-[#d8cfc4]">•</span>
                      <span className="text-[#5e7e66] font-bold text-xs flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        Cách bạn {store.distanceKm} km
                      </span>
                      <span className="text-[#d8cfc4]">•</span>
                      <span className="text-[#8c827a] text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Giao ~{store.deliveryTimeMins} phút
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items at this store (Danh sách đồ uống) */}
                <div className="mt-3.5 pt-3 border-t border-[#e5dfd5]/80">
                  <span className="text-[11px] font-bold text-[#4a453e] uppercase tracking-wider block mb-2">
                    🍹 Đồ uống phục vụ tại quán ({store.menuItems.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {store.menuItems.map(item => {
                      const drinkDetail = allDrinks.find(d => d.id === item.drinkId);
                      if (!drinkDetail) return null;

                      const isTarget = selectedDrink?.id === item.drinkId;

                      return (
                        <div
                          key={item.drinkId}
                          className={`p-2.5 rounded-xl flex items-center justify-between gap-2 border transition-all ${
                            isTarget
                              ? 'bg-[#eef4f0] border-[#7d9d85] font-semibold ring-1 ring-[#7d9d85]/30'
                              : 'bg-[#f7f3ed]/70 border-[#e5dfd5] hover:bg-[#ede6dc]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-base shrink-0">🍵</span>
                            <div className="truncate">
                              <span className="text-xs text-[#2c2722] block truncate font-medium">
                                {drinkDetail.name}
                              </span>
                              <span className="text-[10px] text-[#5e7e66] block font-medium">
                                {item.isSignature ? '⭐ Signature' : `${drinkDetail.calories} kcal`}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-[#2c2722]">
                              {item.price.toLocaleString('vi-VN')} đ
                            </span>
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                onAddToCart(store, drinkDetail);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#5e7e66] hover:bg-[#4e6c55] text-white text-xs font-bold shadow-2xs flex items-center gap-1 active:scale-95 cursor-pointer"
                              title="Tùy chỉnh và thêm vào giỏ hàng"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>+ Thêm</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* External Deeplink Options (GrabFood / ShopeeFood / Maps) */}
                <div className="mt-3.5 pt-2.5 border-t border-[#e5dfd5]/60 flex items-center justify-between gap-1.5 flex-wrap text-xs">
                  <span className="text-[11px] text-[#8c827a] font-medium">Hoặc đặt qua:</span>
                  <div className="flex items-center gap-1.5">
                    {store.externalLinks.grabFoodUrl && (
                      <a
                        href={store.externalLinks.grabFoodUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="px-2.5 py-1 rounded-lg bg-[#eef4f0] text-[#5e7e66] hover:bg-[#e2ede5] border border-[#7d9d85]/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>GrabFood</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {store.externalLinks.shopeeFoodUrl && (
                      <a
                        href={store.externalLinks.shopeeFoodUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="px-2.5 py-1 rounded-lg bg-[#fdf5f0] text-[#b86e55] hover:bg-[#faeae1] border border-[#d98b72]/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>ShopeeFood</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {store.externalLinks.googleMapsUrl && (
                      <a
                        href={store.externalLinks.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="px-2.5 py-1 rounded-lg bg-[#f7f3ed] text-[#4a453e] hover:bg-[#ede6dc] border border-[#e5dfd5] text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Bản đồ</span>
                        <Navigation className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
