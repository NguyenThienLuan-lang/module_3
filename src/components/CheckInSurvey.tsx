import React, { useState } from 'react';
import { Sparkles, ShieldAlert, HeartHandshake, Compass, Check, AlertCircle, RefreshCw } from 'lucide-react';
import {
  CheckInFormData,
  MoodType,
  BodyStatusType,
  PreferenceType,
  AllergyType,
  GoalType,
  TimeSlot
} from '../types';
import {
  MOOD_OPTIONS,
  BODY_STATUS_OPTIONS,
  PREFERENCE_OPTIONS,
  ALLERGY_OPTIONS,
  GOAL_OPTIONS
} from '../data/mockData';

interface CheckInSurveyProps {
  onSubmit: (formData: CheckInFormData) => void;
  isLoading: boolean;
  userAddress: string;
}

export const CheckInSurvey: React.FC<CheckInSurveyProps> = ({ onSubmit, isLoading, userAddress }) => {
  const [moods, setMoods] = useState<MoodType[]>(['sleepy']);
  const [bodyConditions, setBodyConditions] = useState<BodyStatusType[]>([]);
  const [preferences, setPreferences] = useState<PreferenceType[]>(['low_sugar']);
  const [allergies, setAllergies] = useState<AllergyType[]>([]);
  const [goal, setGoal] = useState<GoalType>('focus');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning');
  const [customNote, setCustomNote] = useState<string>('');

  const toggleMood = (id: MoodType) => {
    setMoods(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(m => m !== id) : prev) : [...prev, id]
    );
  };

  const toggleBodyCondition = (id: BodyStatusType) => {
    setBodyConditions(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const togglePreference = (id: PreferenceType) => {
    setPreferences(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleAllergy = (id: AllergyType) => {
    setAllergies(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // Quick preset templates for rapid check-in
  const applyPreset = (type: 'deadline' | 'sore_throat' | 'gym' | 'stress' | 'detox') => {
    if (type === 'deadline') {
      setMoods(['sleepy', 'tired']);
      setBodyConditions([]);
      setPreferences(['low_sugar', 'bold_rich']);
      setGoal('focus');
      setCustomNote('Cần tỉnh táo làm việc tập trung cao độ, êm dạ dày');
    } else if (type === 'sore_throat') {
      setMoods(['tired']);
      setBodyConditions(['sore_throat', 'cold_flu']);
      setPreferences(['herbal', 'hot', 'low_sugar']);
      setGoal('stress_relief');
      setCustomNote('Cổ họng đang rát, cần thức uống làm ấm phổi và kháng khuẩn');
    } else if (type === 'gym') {
      setMoods(['tired', 'happy']);
      setBodyConditions(['post_workout', 'dehydrated']);
      setPreferences(['creamy', 'low_sugar']);
      setGoal('muscle_recovery');
      setCustomNote('Vừa tập luyện thể thao xong, cần bù điện giải và protein');
    } else if (type === 'stress') {
      setMoods(['stressed', 'anxious']);
      setBodyConditions(['stomach_sensitive']);
      setPreferences(['herbal', 'low_sugar']);
      setGoal('stress_relief');
      setCustomNote('Áp lực công việc, cần đồ uống an thần thư giãn tinh thần');
    } else if (type === 'detox') {
      setMoods(['tired']);
      setBodyConditions(['internal_heat', 'bloated']);
      setPreferences(['sour', 'low_sugar', 'fruity']);
      setGoal('detox');
      setCustomNote('Nóng trong người do ăn cay nóng, cần mát gan tiêu hóa');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      moods,
      bodyConditions,
      preferences,
      allergies,
      timeSlot,
      goal,
      customNote
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-[#4a5f50] via-[#3e5244] to-[#2d3a31] text-[#fdfbf7] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8 border border-[#5e7e66]/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7d9d85]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7d9d85]/20 text-[#eef4f0] text-xs font-semibold backdrop-blur-sm border border-[#7d9d85]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#eaddcf]" />
            <span>AI Beverage & Health Sommelier</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight leading-snug mb-2 text-[#fdfbf7]">
            Hôm nay cơ thể bạn đang muốn nói điều gì?
          </h2>
          <p className="text-[#eaddcf] text-sm leading-relaxed mb-4">
            Khảo sát nhanh 30 giây về tâm trạng, triệu chứng cơ thể và sở thích. Hệ thống AI DailySip sẽ chọn lọc <strong className="text-white">Top 5 đồ uống hoàn hảo nhất</strong> kèm lý giải sức khỏe và quán gần bạn!
          </p>

          {/* Quick preset buttons */}
          <div className="pt-2">
            <span className="text-xs text-[#eef4f0] font-semibold block mb-2">✨ Chọn nhanh mẫu tình huống:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyPreset('deadline')}
                className="bg-white/10 hover:bg-white/20 text-[#fdfbf7] px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors border border-white/15 active:scale-95"
              >
                ⚡ Chạy Deadline Buồn Ngủ
              </button>
              <button
                type="button"
                onClick={() => applyPreset('sore_throat')}
                className="bg-white/10 hover:bg-white/20 text-[#fdfbf7] px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors border border-white/15 active:scale-95"
              >
                🧣 Đau Họng & Cảm Cúm
              </button>
              <button
                type="button"
                onClick={() => applyPreset('stress')}
                className="bg-white/10 hover:bg-white/20 text-[#fdfbf7] px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors border border-white/15 active:scale-95"
              >
                🧘 Xả Stress & Căng Thẳng
              </button>
              <button
                type="button"
                onClick={() => applyPreset('detox')}
                className="bg-white/10 hover:bg-white/20 text-[#fdfbf7] px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors border border-white/15 active:scale-95"
              >
                🔥 Nóng Trong & Đầy Bụng
              </button>
              <button
                type="button"
                onClick={() => applyPreset('gym')}
                className="bg-white/10 hover:bg-white/20 text-[#fdfbf7] px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors border border-white/15 active:scale-95"
              >
                💪 Vừa Tập Gym Xong
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Moods */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e5dfd5]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#2c2722] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#eef4f0] text-[#5e7e66] text-xs font-bold flex items-center justify-center border border-[#7d9d85]/30">1</span>
                Tâm trạng hiện tại của bạn
              </h3>
              <p className="text-xs text-[#8c827a] mt-0.5">Có thể chọn nhiều trạng thái cùng lúc</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {MOOD_OPTIONS.map(item => {
              const isSelected = moods.includes(item.id as MoodType);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleMood(item.id as MoodType)}
                  className={`w-full min-h-[92px] p-3 rounded-2xl flex flex-col items-center justify-center text-center border transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-[#eef4f0] border-[#5e7e66] text-[#2c3a31] font-bold ring-2 ring-[#7d9d85]/30 shadow-xs'
                      : 'bg-[#f7f3ed]/80 border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc] hover:border-[#d8cfc4]'
                  }`}
                >
                  <span className="text-3xl w-11 h-11 rounded-2xl bg-white/90 flex items-center justify-center shadow-2xs mb-1.5 shrink-0">
                    {item.emoji}
                  </span>
                  <span className="text-xs font-semibold leading-tight text-[#2c2722] block px-1">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Body conditions */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e5dfd5]">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#2c2722] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#eef4f0] text-[#5e7e66] text-xs font-bold flex items-center justify-center border border-[#7d9d85]/30">2</span>
              Trạng thái & Triệu chứng cơ thể hôm nay
            </h3>
            <p className="text-xs text-[#8c827a] mt-0.5">Chọn tình trạng cơ thể để hệ thống lọc đồ uống an toàn & có tác dụng dược tính nhẹ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BODY_STATUS_OPTIONS.map(item => {
              const isSelected = bodyConditions.includes(item.id as BodyStatusType);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleBodyCondition(item.id as BodyStatusType)}
                  className={`p-3.5 rounded-xl text-left border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#fdf5f0] border-[#d98b72] text-[#4a2e24] ring-2 ring-[#d98b72]/20 shadow-xs'
                      : 'bg-[#f7f3ed]/70 border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc] hover:border-[#d8cfc4]'
                  }`}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold leading-tight">{item.label}</div>
                    <div className="text-[11px] text-[#8c827a] mt-0.5">{item.desc}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#d98b72] shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Hard Allergy Filters (Loại bỏ tuyệt đối) */}
        <div className="bg-gradient-to-r from-[#fdf3f0] to-[#fbf0ec] rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e8cfc8]">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-[#c45a4b]" />
            <h3 className="text-base font-bold text-[#4a231f]">
              Bộ lọc Dị ứng & Kiêng cữ (Hard Filter)
            </h3>
          </div>
          <p className="text-xs text-[#8c4c43] mb-4">
            Được kiểm tra nghiêm ngặt: Hệ thống tự động loại bỏ 100% thức uống có thành phần gây dị ứng cho bạn.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ALLERGY_OPTIONS.map(item => {
              const isSelected = allergies.includes(item.id as AllergyType);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleAllergy(item.id as AllergyType)}
                  className={`p-3 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-[#c45a4b] border-[#ad4d3f] text-white shadow-sm'
                      : 'bg-white border-[#e8cfc8] text-[#4a453e] hover:bg-[#fbf0ec]'
                  }`}
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-[#fdf3f0]' : 'text-[#8c827a]'}`}>
                      {item.warning}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Taste & Temperature Preferences */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e5dfd5]">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#2c2722] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#eef4f0] text-[#5e7e66] text-xs font-bold flex items-center justify-center border border-[#7d9d85]/30">3</span>
              Khẩu vị & Độ ngọt yêu thích
            </h3>
            <p className="text-xs text-[#8c827a] mt-0.5">Tùy chỉnh phong cách đồ uống mong muốn</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PREFERENCE_OPTIONS.map(item => {
              const isSelected = preferences.includes(item.id as PreferenceType);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => togglePreference(item.id as PreferenceType)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#7d9d85] border-[#7d9d85] text-white shadow-xs font-semibold'
                      : 'bg-[#f7f3ed] border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc]'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Goal and Extra notes */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e5dfd5]">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#2c2722] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#eef4f0] text-[#5e7e66] text-xs font-bold flex items-center justify-center border border-[#7d9d85]/30">4</span>
              Mục tiêu sức khỏe chính
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
            {GOAL_OPTIONS.map(item => {
              const isSelected = goal === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setGoal(item.id as GoalType)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-[#eef4f0] border-[#7d9d85] text-[#2c3a31] font-bold ring-2 ring-[#7d9d85]/20'
                      : 'bg-[#f7f3ed] border-[#e5dfd5] text-[#4a453e] hover:bg-[#ede6dc]'
                  }`}
                >
                  <div className="text-xs">{item.label}</div>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4a453e] mb-1.5">
              Ghi chú thêm cho Chuyên gia AI (Tùy chọn):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              placeholder="VD: 'Muốn đồ uống thanh mát, không quá chua, uống lúc 3h chiều...'"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#e5dfd5] bg-[#f7f3ed] text-[#4a453e] placeholder-[#a8a095] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
            />
          </div>
        </div>

        {/* Submit CTA */}
        <div className="sticky bottom-4 z-30 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#7d9d85] via-[#6c8c74] to-[#5e7e66] hover:from-[#6c8c74] hover:to-[#4e6c55] text-white font-bold text-base py-4 px-6 rounded-2xl shadow-lg shadow-[#7d9d85]/25 transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI đang phân tích thể trạng & tìm quán tốt nhất...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#fdfbf7] animate-pulse" />
                <span>Khám Phá Top 5 Đồ Uống Phù Hợp Nhất Hôm Nay</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
