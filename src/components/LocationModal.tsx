import React, { useState } from 'react';
import { X, MapPin, Navigation, Check } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSelectAddress: (address: string, lat: number, lng: number) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress
}) => {
  const [customInput, setCustomInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const presetLocations = [
    {
      name: 'Quận 1, Bến Thành - TP. Hồ Chí Minh',
      lat: 10.7725,
      lng: 106.6983,
      desc: 'Trung tâm Quận 1, phố đi bộ Nguyễn Huệ, chợ Bến Thành'
    },
    {
      name: 'Quận 3, Võ Thị Sáu - TP. Hồ Chí Minh',
      lat: 10.7788,
      lng: 106.6922,
      desc: 'Khu vực Hồ Con Rùa, Trương Định, Pasteur'
    },
    {
      name: 'Bình Thạnh, Tòa Landmark 81 - TP. Hồ Chí Minh',
      lat: 10.7951,
      lng: 106.7218,
      desc: 'Vinhomes Central Park, Nguyễn Hữu Cảnh'
    },
    {
      name: 'Cầu Giấy, Duy Tân - TP. Hà Nội',
      lat: 21.0313,
      lng: 105.7834,
      desc: 'Khu công nghệ Duy Tân, Trần Thái Tông'
    },
    {
      name: 'Hoàn Kiếm, Phố Cổ - TP. Hà Nội',
      lat: 21.0285,
      lng: 105.8542,
      desc: 'Quanh hồ Hoàn Kiếm, Tràng Tiền'
    }
  ];

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ định vị GPS.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        onSelectAddress('Vị trí GPS hiện tại của bạn', pos.coords.latitude, pos.coords.longitude);
        onClose();
      },
      err => {
        setIsLocating(false);
        // Fallback gracefully
        onSelectAddress('Quận 1, Bến Thành - TP. Hồ Chí Minh', 10.7725, 106.6983);
        onClose();
      },
      { timeout: 8000 }
    );
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onSelectAddress(customInput, 10.7725, 106.6983);
    onClose();
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#e5dfd5] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-[#e5dfd5] flex items-center justify-between bg-[#f7f3ed]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#7d9d85]" />
            <h3 className="font-bold text-base text-[#2c2722]">Chọn Vị Trí Của Bạn</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8c827a] hover:text-[#2c2722] hover:bg-[#ede6dc] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* GPS Button */}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="w-full p-3 rounded-2xl bg-[#eef4f0] hover:bg-[#e4ede7] border border-[#7d9d85]/40 text-[#2c3a31] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Navigation className={`w-4 h-4 text-[#5e7e66] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Đang lấy tọa độ GPS...' : 'Dùng vị trí GPS hiện tại'}</span>
          </button>

          {/* Preset list */}
          <div>
            <span className="text-[11px] font-bold text-[#8c827a] uppercase tracking-wider block mb-2">
              Khu vực tiêu biểu:
            </span>
            <div className="space-y-2">
              {presetLocations.map((loc, i) => {
                const isSelected = currentAddress === loc.name;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectAddress(loc.name, loc.lat, loc.lng);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#eef4f0] border-[#7d9d85] text-[#2c3a31] font-semibold ring-1 ring-[#7d9d85]'
                        : 'bg-[#f7f3ed] border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-[#2c2722]">{loc.name}</div>
                      <div className="text-[10px] text-[#8c827a] mt-0.5">{loc.desc}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#7d9d85] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom address input */}
          <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-[#e5dfd5]">
            <label className="block text-[11px] font-bold text-[#2c2722] mb-1.5">
              Hoặc nhập địa chỉ cụ thể:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="VD: 15 Lê Duẩn, P. Bến Nghé, Q.1..."
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-[#e5dfd5] bg-[#fdfbf7] text-xs text-[#2c2722] placeholder-[#a8a095] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-[#7d9d85] hover:bg-[#6c8c74] text-white font-bold text-xs cursor-pointer transition-colors shadow-2xs"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
