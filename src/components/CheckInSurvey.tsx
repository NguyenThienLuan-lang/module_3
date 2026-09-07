import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ShieldAlert,
  HeartHandshake,
  Compass,
  Check,
  AlertCircle,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  Scan,
  X,
  Zap,
  CheckCircle2,
  ArrowRight,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import {
  CheckInFormData,
  MoodType,
  BodyStatusType,
  PreferenceType,
  AllergyType,
  GoalType,
  TimeSlot,
  VisionAnalysisResult
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

interface PresetVisionScene {
  id: string;
  name: string;
  icon: string;
  hint: string;
  image: string;
  desc: string;
}

const SAMPLE_VISION_SCENES: PresetVisionScene[] = [
  {
    id: 'desk',
    name: 'Bàn Làm Việc & Laptop',
    icon: '💻',
    hint: 'desk_work',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
    desc: 'Tăng tập trung cao độ, tỉnh táo êm dịu'
  },
  {
    id: 'scenery',
    name: 'Hoàng Hôn & Góc Ban Công',
    icon: '🌅',
    hint: 'relax_scenery',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    desc: 'Thư giãn tâm trí, giải tỏa stress êm đềm'
  },
  {
    id: 'gym',
    name: 'Phòng Gym & Vận Động',
    icon: '🏋️',
    hint: 'workout_gym',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    desc: 'Phục hồi cơ bắp & nạp đạm thực vật'
  },
  {
    id: 'outdoor',
    name: 'Ngoài Trời Nắng Nóng',
    icon: '☀️',
    hint: 'outdoor_hot',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    desc: 'Giải nhiệt cấp tốc, bù khoáng điện giải'
  },
  {
    id: 'sick',
    name: 'Nghỉ Ngơi & Giữ Ấm',
    icon: '🧣',
    hint: 'sick_bed',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80',
    desc: 'Làm ấm cổ họng, tăng cường đề kháng'
  }
];

export const CheckInSurvey: React.FC<CheckInSurveyProps> = ({ onSubmit, isLoading, userAddress }) => {
  const [moods, setMoods] = useState<MoodType[]>(['sleepy']);
  const [bodyConditions, setBodyConditions] = useState<BodyStatusType[]>([]);
  const [preferences, setPreferences] = useState<PreferenceType[]>(['low_sugar']);
  const [allergies, setAllergies] = useState<AllergyType[]>([]);
  const [goal, setGoal] = useState<GoalType>('focus');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning');
  const [customNote, setCustomNote] = useState<string>('');

  // AI Vision state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);
  const [visionAnalysis, setVisionAnalysis] = useState<VisionAnalysisResult | null>(null);
  const [visionFeedbackMsg, setVisionFeedbackMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  // Process and analyze image via AI Vision endpoint
  const analyzeImagePayload = async (base64Data: string, sceneHint?: string) => {
    setIsAnalyzingVision(true);
    setVisionFeedbackMsg('AI Vision đang quét không gian, đồ vật & ánh sáng...');

    try {
      const res = await fetch('/api/analyze-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          sceneHint
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const analysis: VisionAnalysisResult = data.analysis;
        setVisionAnalysis(analysis);

        // Auto-apply detected properties into the survey
        if (analysis.suggestedMoods && analysis.suggestedMoods.length > 0) {
          setMoods(analysis.suggestedMoods);
        }
        if (analysis.suggestedBodyConditions) {
          setBodyConditions(analysis.suggestedBodyConditions);
        }
        if (analysis.suggestedPreferences && analysis.suggestedPreferences.length > 0) {
          setPreferences(analysis.suggestedPreferences);
        }
        if (analysis.suggestedGoal) {
          setGoal(analysis.suggestedGoal);
        }
        if (analysis.autoCustomNote) {
          setCustomNote(analysis.autoCustomNote);
        }

        setVisionFeedbackMsg(null);
      } else {
        setVisionFeedbackMsg('Không thể nhận diện hình ảnh, vui lòng thử lại.');
      }
    } catch (err) {
      console.error('AI Vision error:', err);
      setVisionFeedbackMsg('Đã có lỗi phân tích hình ảnh, hệ thống đang dùng khảo sát tiêu chuẩn.');
    } finally {
      setIsAnalyzingVision(false);
    }
  };

  // Handle image file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedImage(reader.result);
        analyzeImagePayload(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply sample preset scene
  const handleSelectSampleScene = (scene: PresetVisionScene) => {
    setUploadedImage(scene.image);
    analyzeImagePayload(scene.image, scene.hint);
  };

  // Reset vision photo
  const handleClearVision = () => {
    setUploadedImage(null);
    setVisionAnalysis(null);
    setVisionFeedbackMsg(null);
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
      customNote,
      uploadedImage: uploadedImage || undefined,
      visionAnalysis: visionAnalysis || undefined
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Hidden file & camera inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* 1. Intro Header */}
      <div className="bg-gradient-to-br from-[#4a5f50] via-[#3e5244] to-[#2d3a31] text-[#fdfbf7] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-6 border border-[#5e7e66]/40">
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
            Khảo sát 30 giây hoặc <strong className="text-white">chụp ảnh không gian làm việc / góc thư giãn</strong> để AI tự động nhận diện và phối 5 thức uống hoàn hảo nhất!
          </p>

          {/* Quick preset buttons */}
          <div className="pt-2">
            <span className="text-xs text-[#eef4f0] font-semibold block mb-2">✨ Chọn nhanh mẫu tình huống:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyPreset('deadline')}
                className="bg-white/10 hover:bg-white/20 text-[#fdfbf7] px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors border border-white/15 active:scale-95 cursor-pointer"
              >
                ⚡ Chạy Deadline Buồn Ngủ
              </button>
              <button
                type="button"
                onClick={() => applyPreset('sore_throat')}
                className="bg-white/10 hover:bg-white/20 text-[#fdfbf7] px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors border border-white/15 active:scale-95 cursor-pointer"
              >
                🧣 Đau Họng & Cảm Cúm
              </button>
              <button
                type="button"
                onClick={() => applyPreset('gym')}
                className="bg-white/10 hover:bg-white/20 text-[#fdfbf7] px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors border border-white/15 active:scale-95 cursor-pointer"
              >
                💪 Vừa Tập Gym Xong
              </button>
              <button
                type="button"
                onClick={() => applyPreset('stress')}
                className="bg-white/10 hover:bg-white/20 text-[#fdfbf7] px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors border border-white/15 active:scale-95 cursor-pointer"
              >
                🧘 Giảm Căng Thẳng & Lo Âu
              </button>
              <button
                type="button"
                onClick={() => applyPreset('detox')}
                className="bg-white/10 hover:bg-white/20 text-[#fdfbf7] px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors border border-white/15 active:scale-95 cursor-pointer"
              >
                🍋 Thanh Lọc & Mát Gan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI VISION SCANNER SECTION (MỚI: Chụp hình nhận diện bối cảnh) */}
      <div className="bg-gradient-to-br from-[#f8f5ee] via-[#f3ede3] to-[#ebe3d7] dark:from-[#211d19] dark:via-[#28221c] dark:to-[#1c1815] rounded-3xl p-5 sm:p-7 shadow-md border-2 border-[#7d9d85]/40 dark:border-[#7d9d85]/30 mb-8 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5e7e66] to-[#7d9d85] text-white flex items-center justify-center shadow-md shrink-0 mt-0.5">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-serif text-[#2c2722] dark:text-[#fdfbf7] tracking-tight">
                  Một ly đồ uống hợp trọn tâm trạng & khung cảnh của bạn
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#d98b72] to-[#b86e55] text-white shadow-2xs">
                  AI Vision
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#6b6257] dark:text-[#cfc8bf] mt-1 leading-relaxed">
                Bạn đang ở đâu? DailySip sẽ "đọc vị" không gian & gợi ý món uống hoàn hảo nhất dành riêng cho bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Upload / Capture Buttons */}
        {!uploadedImage && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Button 1: Camera Snapshot */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="p-4 rounded-2xl bg-white dark:bg-[#201c18] hover:bg-[#eef4f0] dark:hover:bg-[#253328] border-2 border-dashed border-[#7d9d85] flex items-center gap-3.5 transition-all cursor-pointer shadow-xs group active:scale-98 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-[#eef4f0] dark:bg-[#2a3a2e] group-hover:bg-[#7d9d85] group-hover:text-white text-[#5e7e66] dark:text-[#a3c9ae] flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#2c2722] dark:text-[#fdfbf7] flex items-center gap-1.5">
                    <span>Mở Camera Chụp Không Gian</span>
                    <span className="text-[10px] text-[#5e7e66] dark:text-[#7d9d85] font-medium">⚡ Siêu tốc</span>
                  </div>
                  <div className="text-[11px] text-[#8c827a] dark:text-[#9c9285] mt-0.5 truncate">
                    Chụp bàn làm việc, góc học tập, quán cafe, phòng gym...
                  </div>
                </div>
              </button>

              {/* Button 2: Upload from Device */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl bg-white dark:bg-[#201c18] hover:bg-[#fdf5f0] dark:hover:bg-[#35251f] border-2 border-dashed border-[#d98b72]/60 flex items-center gap-3.5 transition-all cursor-pointer shadow-xs group active:scale-98 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-[#fdf5f0] dark:bg-[#382620] group-hover:bg-[#d98b72] group-hover:text-white text-[#b86e55] dark:text-[#e09680] flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#2c2722] dark:text-[#fdfbf7]">Tải Ảnh Từ Thư Viện Máy</div>
                  <div className="text-[11px] text-[#8c827a] dark:text-[#9c9285] mt-0.5 truncate">
                    Chọn bức ảnh góc chill bạn vừa chụp
                  </div>
                </div>
              </button>
            </div>

            {/* Preset Sample Scenes for Quick 1-Click Testing */}
            <div className="pt-1.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#6b6257] dark:text-[#cfc8bf] flex items-center gap-1.5">
                  <span>✨</span> Hoặc chạm thử nhanh với các không gian mẫu:
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {SAMPLE_VISION_SCENES.map(scene => (
                  <button
                    type="button"
                    key={scene.id}
                    onClick={() => handleSelectSampleScene(scene)}
                    className="p-2 rounded-2xl bg-white dark:bg-[#201c18] hover:bg-[#eef4f0] dark:hover:bg-[#253328] border border-[#e5dfd5] dark:border-[#383129] text-left transition-all cursor-pointer shadow-2xs hover:border-[#7d9d85] dark:hover:border-[#7d9d85] group active:scale-95 hover:shadow-xs"
                  >
                    <div className="w-full h-16 rounded-xl overflow-hidden mb-1.5 relative bg-stone-200 dark:bg-stone-800">
                      <img
                        src={scene.image}
                        alt={scene.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 text-sm bg-black/50 backdrop-blur-xs p-0.5 rounded-md leading-none">
                        {scene.icon}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-[#2c2722] dark:text-[#fdfbf7] truncate">{scene.name}</div>
                    <div className="text-[9px] text-[#8c827a] dark:text-[#9c9285] line-clamp-1 mt-0.5">{scene.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Image Preview & AI Scanner Laser Animation */}
        {uploadedImage && (
          <div className="space-y-3 animate-in fade-in">
            <div className="relative rounded-2xl overflow-hidden max-h-64 sm:max-h-80 bg-[#1e1c19] border-2 border-[#5e7e66] shadow-lg">
              <img
                src={uploadedImage}
                alt="Không gian nhận diện"
                className="w-full h-full object-cover max-h-64 sm:max-h-80"
              />

              {/* Laser scanning animation while analyzing */}
              {isAnalyzingVision && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
                  {/* Glowing sweeping laser line */}
                  <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#10b981] to-transparent shadow-lg shadow-[#10b981] animate-bounce" />
                  <div className="bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-500/50 flex items-center gap-2.5 text-white text-xs font-bold shadow-xl">
                    <Scan className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>AI Vision đang quét vật thể, bối cảnh & ánh sáng...</span>
                  </div>
                </div>
              )}

              {/* Close / Retake button */}
              <button
                type="button"
                onClick={handleClearVision}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-md transition-all cursor-pointer active:scale-90"
                title="Chụp ảnh khác"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Vision Insights Result Box */}
            {visionAnalysis && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#201c18] border border-[#7d9d85]/50 shadow-sm space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between gap-2 border-b border-[#f0eae1] dark:border-[#383129] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">✨</span>
                    <span className="font-bold text-xs text-[#2c2722] dark:text-[#fdfbf7]">
                      Kết Quả Nhận Diện AI Vision:
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#eef4f0] dark:bg-[#1a2d21] text-[#5e7e66] dark:text-[#a3c9ae] font-bold text-[10px] border border-[#7d9d85]/30">
                      Độ khớp: {visionAnalysis.confidenceScore || 95}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-[#5e7e66] dark:text-[#7d9d85] hover:underline font-semibold cursor-pointer"
                  >
                    Đổi ảnh khác
                  </button>
                </div>

                <p className="text-xs text-[#3e3933] dark:text-[#cfc8bf] font-medium leading-relaxed">
                  {visionAnalysis.vibeDescription}
                </p>

                {/* Detected Objects Badges */}
                {visionAnalysis.detectedObjects && visionAnalysis.detectedObjects.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-[#8c827a] dark:text-[#9c9285]">Vật thể phát hiện:</span>
                    {visionAnalysis.detectedObjects.map((obj, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#f7f3ed] dark:bg-[#2a2520] border border-[#e5dfd5] dark:border-[#383129] text-[10px] text-[#4a453e] dark:text-[#d4cdc5] font-semibold"
                      >
                        🔍 {obj}
                      </span>
                    ))}
                  </div>
                )}

                {/* Auto-filled Notification Banner */}
                <div className="p-2.5 rounded-xl bg-[#eef4f0]/80 dark:bg-[#1a2d21] border border-[#7d9d85]/30 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[#2c3a31] dark:text-[#eef4f0]">
                    <CheckCircle2 className="w-4 h-4 text-[#5e7e66] dark:text-[#7d9d85] shrink-0" />
                    <span>
                      Đã <strong>tự động cấu hình</strong> tâm trạng, triệu chứng & đồ uống tối ưu ở bên dưới!
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. STANDARD SURVEY QUESTIONS */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Moods */}
        <div className="bg-white dark:bg-[#201c18] rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e5dfd5] dark:border-[#383129]">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#2c2722] dark:text-[#fdfbf7] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#eef4f0] dark:bg-[#1a2d21] text-[#5e7e66] dark:text-[#a3c9ae] text-xs font-bold flex items-center justify-center border border-[#7d9d85]/30">1</span>
              Tâm trạng hiện tại của bạn
            </h3>
            <p className="text-xs text-[#8c827a] dark:text-[#9c9285] mt-0.5">Có thể chọn nhiều cảm xúc cùng lúc</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {MOOD_OPTIONS.map(item => {
              const isSelected = moods.includes(item.id as MoodType);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleMood(item.id as MoodType)}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-[#eef4f0] dark:bg-[#1a2d21] border-[#7d9d85] text-[#2c3a31] dark:text-[#eef4f0] font-bold shadow-xs ring-2 ring-[#7d9d85]/20'
                      : 'bg-[#f7f3ed] dark:bg-[#26211c] border-[#e5dfd5] dark:border-[#383129] text-[#4a453e] dark:text-[#d4cdc5] hover:bg-[#ede6dc] dark:hover:bg-[#2f2923]'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-white/80 dark:bg-black/40 shadow-2xs flex items-center justify-center text-3xl">
                    {item.emoji}
                  </div>
                  <div className="text-xs font-semibold leading-tight mt-0.5">{item.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Physical State & Symptoms */}
        <div className="bg-white dark:bg-[#201c18] rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e5dfd5] dark:border-[#383129]">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#2c2722] dark:text-[#fdfbf7] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#eef4f0] dark:bg-[#1a2d21] text-[#5e7e66] dark:text-[#a3c9ae] text-xs font-bold flex items-center justify-center border border-[#7d9d85]/30">2</span>
              Trạng thái thể chất & Triệu chứng
            </h3>
            <p className="text-xs text-[#8c827a] dark:text-[#9c9285] mt-0.5">DailySip sẽ lọc bỏ thành phần gây kích ứng và tăng cường thảo dược hỗ trợ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BODY_STATUS_OPTIONS.map(item => {
              const isSelected = bodyConditions.includes(item.id as BodyStatusType);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleBodyCondition(item.id as BodyStatusType)}
                  className={`p-3 rounded-xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#eef4f0] dark:bg-[#1a2d21] border-[#7d9d85] text-[#2c3a31] dark:text-[#eef4f0] font-bold ring-2 ring-[#7d9d85]/20 shadow-xs'
                      : 'bg-[#f7f3ed] dark:bg-[#26211c] border-[#e5dfd5] dark:border-[#383129] text-[#4a453e] dark:text-[#d4cdc5] hover:bg-[#ede6dc] dark:hover:bg-[#2f2923]'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[11px] text-[#8c827a] dark:text-[#9c9285] mt-0.5">{item.desc}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#5e7e66] dark:text-[#7d9d85] shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Hard Allergy Filters (Loại bỏ tuyệt đối) */}
        <div className="bg-gradient-to-r from-[#fdf3f0] to-[#fbf0ec] dark:from-[#2e1c19] dark:to-[#241715] rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e8cfc8] dark:border-[#522b25]">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#c45a4b] dark:text-[#f87171]" />
              <h3 className="text-base font-bold text-[#4a231f] dark:text-[#fca5a5]">
                Bộ lọc Dị ứng & Kiêng cữ (Hard Filter)
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#c45a4b]/15 dark:bg-[#c45a4b]/30 text-[#8c2a1e] dark:text-[#fca5a5] border border-[#c45a4b]/30 dark:border-[#c45a4b]/50">
              {allergies.length > 0 ? `Đã chọn: ${allergies.length} dị ứng / kiêng cữ` : 'Có thể chọn nhiều mục'}
            </span>
          </div>
          <p className="text-xs text-[#8c4c43] dark:text-[#fca5a5]/80 mb-4">
            Được kiểm tra nghiêm ngặt: Bạn có thể chọn nhiều loại dị ứng cùng lúc. Hệ thống AI tự động loại bỏ 100% thức uống chứa bất kỳ thành phần nào bạn đã đánh dấu.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ALLERGY_OPTIONS.map(item => {
              const isSelected = allergies.includes(item.id as AllergyType);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleAllergy(item.id as AllergyType)}
                  className={`p-3.5 rounded-xl text-left border transition-all flex items-start gap-2.5 cursor-pointer active:scale-98 ${
                    isSelected
                      ? 'bg-[#c45a4b] dark:bg-[#b93b2d] border-[#ad4d3f] text-white shadow-sm ring-2 ring-[#c45a4b]/30'
                      : 'bg-white dark:bg-[#201816] border-[#e8cfc8] dark:border-[#4d2824] text-[#4a453e] dark:text-[#f2d5cf] hover:bg-[#fbf0ec] dark:hover:bg-[#2c1d1a]'
                  }`}
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-[#fdf3f0]' : 'text-[#8c827a] dark:text-[#b89590]'}`}>
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
        <div className="bg-white dark:bg-[#201c18] rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e5dfd5] dark:border-[#383129]">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#2c2722] dark:text-[#fdfbf7] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#eef4f0] dark:bg-[#1a2d21] text-[#5e7e66] dark:text-[#a3c9ae] text-xs font-bold flex items-center justify-center border border-[#7d9d85]/30">3</span>
              Khẩu vị & Độ ngọt yêu thích
            </h3>
            <p className="text-xs text-[#8c827a] dark:text-[#9c9285] mt-0.5">Tùy chỉnh phong cách đồ uống mong muốn</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PREFERENCE_OPTIONS.map(item => {
              const isSelected = preferences.includes(item.id as PreferenceType);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => togglePreference(item.id as PreferenceType)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#7d9d85] border-[#7d9d85] text-white shadow-xs font-semibold'
                      : 'bg-[#f7f3ed] dark:bg-[#26211c] border-[#e5dfd5] dark:border-[#383129] text-[#4a453e] dark:text-[#d4cdc5] hover:bg-[#ede6dc] dark:hover:bg-[#2f2923]'
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
        <div className="bg-white dark:bg-[#201c18] rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e5dfd5] dark:border-[#383129]">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#2c2722] dark:text-[#fdfbf7] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#eef4f0] dark:bg-[#1a2d21] text-[#5e7e66] dark:text-[#a3c9ae] text-xs font-bold flex items-center justify-center border border-[#7d9d85]/30">4</span>
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
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#eef4f0] dark:bg-[#1a2d21] border-[#7d9d85] text-[#2c3a31] dark:text-[#eef4f0] font-bold ring-2 ring-[#7d9d85]/20'
                      : 'bg-[#f7f3ed] dark:bg-[#26211c] border-[#e5dfd5] dark:border-[#383129] text-[#4a453e] dark:text-[#d4cdc5] hover:bg-[#ede6dc] dark:hover:bg-[#2f2923]'
                  }`}
                >
                  <div className="text-xs">{item.label}</div>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4a453e] dark:text-[#cfc8bf] mb-1.5">
              Ghi chú thêm cho Chuyên gia AI (Tùy chọn):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              placeholder="VD: 'Muốn đồ uống thanh mát, không quá chua, uống lúc 3h chiều...'"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#e5dfd5] dark:border-[#383129] bg-[#f7f3ed] dark:bg-[#1a1714] text-[#4a453e] dark:text-[#fdfbf7] placeholder-[#a8a095] dark:placeholder-[#7d756b] focus:bg-white dark:focus:bg-[#201c18] focus:outline-hidden focus:ring-2 focus:ring-[#7d9d85]"
            />
          </div>
        </div>

        {/* Submit CTA */}
        <div className="sticky bottom-4 z-30 pt-2">
          <button
            type="submit"
            disabled={isLoading || isAnalyzingVision}
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
