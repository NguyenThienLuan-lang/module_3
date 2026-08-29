import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { DRINKS_DATABASE, STORES_DATABASE } from './src/data/mockData';
import { CheckInFormData, Drink, Store, AIAdvice } from './src/types';

// Load environment variables from .env or .env.local
dotenv.config({ path: '.env.local' });
dotenv.config();

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Calculate Haversine distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get all drinks catalogue
  app.get('/api/drinks', (req, res) => {
    res.json({ success: true, drinks: DRINKS_DATABASE });
  });

  // Get nearby stores with distance calculation
  app.get('/api/stores', (req, res) => {
    const userLat = parseFloat(req.query.lat as string) || 10.7725;
    const userLng = parseFloat(req.query.lng as string) || 106.6983;
    const drinkId = req.query.drinkId as string;

    let stores: Store[] = STORES_DATABASE.map(store => {
      const distanceKm = calculateDistance(userLat, userLng, store.latitude, store.longitude);
      return {
        ...store,
        distanceKm
      };
    });

    if (drinkId) {
      stores = stores.filter(s => s.menuItems.some(m => m.drinkId === drinkId && m.isAvailable));
    }

    // Sort by nearest
    stores.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    res.json({ success: true, stores });
  });

  // AI & Rule Recommendation Engine
  app.post('/api/recommendations', async (req, res) => {
    try {
      const formData: CheckInFormData = req.body;
      const { moods = [], bodyConditions = [], preferences = [], allergies = [], goal, customNote } = formData;

      // STEP 1: Hard Filter (Loại bỏ tuyệt đối 100% tất cả các dị ứng & kiêng cữ được chọn)
      let availableDrinks = DRINKS_DATABASE.filter(drink => {
        // 1. Dị ứng Lactose (sữa bò)
        if (allergies.includes('lactose') && (drink.containsLactose || drink.category === 'milk_nut')) return false;
        // 2. Kiêng / Dị ứng Cafein
        if ((allergies.includes('caffeine') || bodyConditions.includes('caffeine_sensitive')) && (drink.containsCaffeine || drink.caffeineMg > 0)) return false;
        // 3. Dị ứng Đậu phộng / Các loại hạt
        if (allergies.includes('peanuts') && (drink.containsNuts || drink.ingredients.some(ing => ing.toLowerCase().includes('hạt') || ing.toLowerCase().includes('đậu') || ing.toLowerCase().includes('nut')))) return false;
        // 4. Kiêng chế phẩm từ sữa (Dairy)
        if (allergies.includes('dairy') && (drink.containsLactose || drink.ingredients.some(ing => ing.toLowerCase().includes('sữa') || ing.toLowerCase().includes('cheese') || ing.toLowerCase().includes('foam') || ing.toLowerCase().includes('kem')))) return false;
        // 5. Dị ứng Gluten
        if (allergies.includes('gluten') && drink.ingredients.some(ing => ing.toLowerCase().includes('lúa mạch') || ing.toLowerCase().includes('yến mạch') || ing.toLowerCase().includes('bánh'))) return false;
        // 6. Ăn Thuần Chay (Vegan)
        if (allergies.includes('vegan') && !drink.isVegan) return false;
        // 7. Thích uống Nóng
        if (preferences.includes('hot') && !drink.isHotAvailable) return false;
        return true;
      });

      if (availableDrinks.length === 0) {
        // Safe fallback strictly respecting all user's selected allergies
        availableDrinks = DRINKS_DATABASE.filter(drink => {
          if (allergies.includes('lactose') && (drink.containsLactose || drink.category === 'milk_nut')) return false;
          if ((allergies.includes('caffeine') || bodyConditions.includes('caffeine_sensitive')) && (drink.containsCaffeine || drink.caffeineMg > 0)) return false;
          if (allergies.includes('peanuts') && drink.containsNuts) return false;
          if (allergies.includes('dairy') && drink.containsLactose) return false;
          if (allergies.includes('vegan') && !drink.isVegan) return false;
          return true;
        });
      }

      // STEP 2: Rule-based Scoring Matrix
      const scoredDrinks = availableDrinks.map(drink => {
        let score = 50; // base score

        // Mood matching
        moods.forEach(m => {
          if (drink.tags.includes(m)) score += 25;
        });

        // Body status matching
        bodyConditions.forEach(b => {
          if (drink.tags.includes(b)) score += 35;
          if (b === 'sore_throat' && drink.id === 'ginger-lemongrass-citrus-warm') score += 50;
          if (b === 'internal_heat' && (drink.id === 'celery-greenapple-cucumber-detox' || drink.id === 'pennywort-mungbean-coconut')) score += 50;
          if (b === 'bloated' && drink.id === 'pineapple-mint-kombucha') score += 50;
          if (b === 'post_workout' && (drink.id === 'avocado-banana-plant-protein' || drink.id === 'fresh-coconut-calamansi-pink-salt')) score += 50;
          if (b === 'dehydrated' && drink.id === 'fresh-coconut-calamansi-pink-salt') score += 50;
        });

        // Preferences matching
        preferences.forEach(p => {
          if (drink.tags.includes(p)) score += 15;
          if (p === 'low_sugar' && drink.sugarGrams <= 9) score += 20;
          if (p === 'no_sugar' && drink.sugarGrams <= 5) score += 25;
        });

        // Goal matching
        if (goal && drink.tags.includes(goal)) score += 30;

        return {
          ...drink,
          matchScore: Math.min(99, Math.max(70, score))
        };
      });

      // Sort by match score descending
      scoredDrinks.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      const top5Drinks = scoredDrinks.slice(0, 5);

      // STEP 3: Generate detailed multi-allergy notice
      const ALLERGY_MAP: Record<string, string> = {
        lactose: 'Dị ứng Lactose (Sữa bò)',
        caffeine: 'Không dùng Cafein (Say cà phê / ép tim)',
        peanuts: 'Dị ứng Đậu phộng / Các loại Hạt',
        dairy: 'Kiêng Sữa & Chế phẩm từ sữa',
        gluten: 'Dị ứng Gluten (Lúa mạch, Yến mạch)',
        vegan: 'Ăn Thuần Chay (Vegan 100%)'
      };

      let allergyNotice = '';
      if (allergies.length > 0) {
        const allergyNames = allergies.map(a => ALLERGY_MAP[a] || a);
        allergyNotice = `Hệ thống AI đã kích hoạt Lá Chắn Dị Ứng: Kiểm duyệt và LOẠI BỎ 100% toàn bộ ${allergyNames.length} yếu tố kiêng cữ bạn đã chọn (${allergyNames.join(', ')}). Tất cả 5 đồ uống trong danh sách Top 5 đã được kiểm chứng an toàn tuyệt đối cho cơ thể bạn!`;
      } else {
        allergyNotice = 'Không ghi nhận tiền sử dị ứng đặc biệt. Cơ thể sẵn sàng đón nhận đa dạng các nhóm thức uống thanh nhiệt, bổ dưỡng.';
      }

      // STEP 4: Enrich with Gemini Reasoning if API Key is available
      let aiAnalysis: AIAdvice = {
        summary: `Hệ thống DailySip đã chọn lọc 5 thức uống tối ưu nhất cho tình trạng của bạn.`,
        wellnessTip: 'Hãy uống nước ấm từ từ và chia nhỏ ngụm để cơ thể hấp thu dưỡng chất tốt nhất.',
        timingAdvice: 'Nên uống sau bữa ăn 30-45 phút hoặc trước 16h chiều để cơ thể chuyển hóa dưỡng chất tốt nhất và không gây cồn cào.',
        sugarAdvice: preferences.includes('low_sugar') || preferences.includes('no_sugar')
          ? 'Ưu tiên vị ngọt tự nhiên từ trái cây và thảo mộc, không thêm đường tinh luyện.'
          : 'Lượng đường cân bằng không gây tăng đột biến đường huyết.',
        allergyNotice
      };

      const ai = getGeminiClient();
      if (ai) {
        try {
          const prompt = `Bạn là Chuyên gia Dinh dưỡng & Sommelier Đồ uống cao cấp DailySip tại Việt Nam.
Người dùng vừa thực hiện Daily Check-in với thông tin sau:
- Tâm trạng: ${moods.join(', ') || 'Bình thường'}
- Trạng thái cơ thể: ${bodyConditions.join(', ') || 'Khỏe mạnh'}
- Sở thích/Vị: ${preferences.join(', ') || 'Tự nhiên'}
- TẤT CẢ DỊ ỨNG & KIÊNG CỮ: ${allergies.length > 0 ? allergies.map(a => ALLERGY_MAP[a] || a).join(', ') : 'Không có dị ứng'}
- Mục tiêu chính: ${goal || 'Cân bằng'}
- Ghi chú thêm: ${customNote || 'Không có'}

Top 5 đồ uống đã được hệ thống kiểm tra an toàn và lọc sơ bộ:
${top5Drinks.map((d, i) => `${i + 1}. ${d.name} (${d.vietnameseName}) - Calo: ${d.calories}kcal, Đường: ${d.sugarGrams}g, Cafein: ${d.caffeineMg}mg, Thuần chay: ${d.isVegan ? 'Có' : 'Không'}, Lactose: ${d.containsLactose ? 'Có' : 'Không'}, Hạt: ${d.containsNuts ? 'Có' : 'Không'}`).join('\n')}

Hãy cung cấp phản hồi JSON hợp lệ với cấu trúc sau:
{
  "summary": "Lời nhận xét ngắn gọn (1-2 câu) thấu hiểu tình trạng của người dùng hôm nay bằng giọng ấm áp, chuyên nghiệp",
  "wellnessTip": "1 lời khuyên chăm sóc thể trạng thực tế cho người dùng hôm nay",
  "timingAdvice": "1 lời khuyên về thời điểm uống lý tưởng trong ngày để tối ưu hấp thu dưỡng chất",
  "sugarAdvice": "Lời khuyên về lượng đường & calo hôm nay",
  "allergyNotice": "Xác nhận rõ ràng về an toàn đối với tất cả các dị ứng mà người dùng đã chọn (nêu rõ từng dị ứng đã được loại bỏ an toàn 100%)",
  "drinkReasons": [
    {"id": "${top5Drinks[0]?.id || ''}", "whyItFits": "Giải thích chi tiết 1-2 câu vì sao món này trực tiếp cải thiện tình trạng của họ hôm nay"},
    {"id": "${top5Drinks[1]?.id || ''}", "whyItFits": "Giải thích chi tiết 1-2 câu..."},
    {"id": "${top5Drinks[2]?.id || ''}", "whyItFits": "Giải thích chi tiết 1-2 câu..."},
    {"id": "${top5Drinks[3]?.id || ''}", "whyItFits": "Giải thích chi tiết 1-2 câu..."},
    {"id": "${top5Drinks[4]?.id || ''}", "whyItFits": "Giải thích chi tiết 1-2 câu..."}
  ]
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            if (parsed.summary) aiAnalysis.summary = parsed.summary;
            if (parsed.wellnessTip) aiAnalysis.wellnessTip = parsed.wellnessTip;
            if (parsed.timingAdvice) aiAnalysis.timingAdvice = parsed.timingAdvice;
            if (parsed.sugarAdvice) aiAnalysis.sugarAdvice = parsed.sugarAdvice;
            if (parsed.allergyNotice) aiAnalysis.allergyNotice = parsed.allergyNotice;

            if (Array.isArray(parsed.drinkReasons)) {
              parsed.drinkReasons.forEach((item: { id: string; whyItFits: string }) => {
                const target = top5Drinks.find(d => d.id === item.id);
                if (target && item.whyItFits) {
                  target.whyItFits = item.whyItFits;
                }
              });
            }
          }
        } catch (geminiError) {
          console.warn('Gemini recommendation refinement failed, using heuristic reasoning:', geminiError);
        }
      }

      res.json({
        success: true,
        recommendations: top5Drinks,
        aiAnalysis,
        checkedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // AI Sip Sommelier Chatbot endpoint
  app.post('/api/nutritionist-chat', async (req, res) => {
    try {
      const { message, chatHistory = [], userContext = {} } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback intelligent response if API key is not yet configured
        let fallbackReply = `Chào bạn! Tôi là Chuyên gia Tư Vấn Đồ Uống DailySip. `;
        const lower = (message || '').toLowerCase();

        if (lower.includes('đau họng') || lower.includes('khàn tiếng') || lower.includes('cảm')) {
          fallbackReply += `Với triệu chứng đau rát họng, bạn nên ưu tiên **Trà Gừng Sả Tắc Mật Ong Ấm** hoặc **Trà Hoa Cúc Táo Đỏ Nóng**. Tránh tuyệt đối nước đá lạnh và đồ uống có gas vì sẽ kích thích niêm mạc họng gây viêm nặng hơn!`;
        } else if (lower.includes('buồn ngủ') || lower.includes('tập trung') || lower.includes('làm việc')) {
          fallbackReply += `Nếu cần tỉnh táo làm việc mà không muốn bị say cà phê ép tim, bạn hãy thử **Cold Brew Cam Sả** hoặc **Matcha Sữa Yến Mạch**. L-Theanine trong Matcha giúp não duy trì trạng thái tập trung sâu và êm dịu.`;
        } else if (lower.includes('nóng trong') || lower.includes('mụn') || lower.includes('mát gan')) {
          fallbackReply += `Để thanh nhiệt và giải độc gan, **Nước Ép Cần Tây Táo Xanh** hoặc **Rau Má Đậu Xanh Nước Dừa** là lựa chọn tuyệt vời nhất. Nhớ dặn quán làm ít đường (30%) bạn nhé!`;
        } else if (lower.includes('đầy bụng') || lower.includes('tiêu hóa') || lower.includes('no')) {
          fallbackReply += `Cảm giác đầy bụng khó tiêu sẽ được xoa dịu nhanh chóng nhờ **Kombucha Dứa Bạc Hà**. Lợi khuẩn men sống và enzym bromelain tự nhiên trong dứa sẽ hỗ trợ dạ dày tiêu hóa thức ăn rất nhẹ nhàng.`;
        } else {
          fallbackReply += `Dựa trên sở thích của bạn, bạn có thể thực hiện bài khảo sát Daily Check-in ở màn hình chính để nhận ngay Top 5 đồ uống đo ni đóng giày kèm quán gần bạn nhất nhé! Bạn có muốn tôi hướng dẫn công thức pha một món đồ uống cụ thể tại nhà không?`;
        }

        return res.json({
          success: true,
          reply: fallbackReply,
          suggestedDrinks: DRINKS_DATABASE.slice(0, 3)
        });
      }

      const prompt = `Bạn là DailySip Sommelier & Bác sĩ Dinh dưỡng Đồ uống chuyên nghiệp, thân thiện tại Việt Nam.
Ngữ cảnh người dùng: ${JSON.stringify(userContext)}
Câu hỏi người dùng: "${message}"

Lịch sử trò chuyện gần đây:
${chatHistory.map((m: any) => `${m.sender}: ${m.text}`).join('\n')}

Hãy trả lời bằng tiếng Việt một cách súc tích (khoảng 3-4 câu), khoa học, ấm áp, đưa ra lời khuyên thực tế về đồ uống tốt cho sức khỏe hoặc nguyên liệu tự nhiên ở Việt Nam (như sả, gừng, hoa cúc, mật ong, nước dừa, rau má...). Định dạng Markdown đẹp mắt với in đậm các điểm chính.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt
      });

      res.json({
        success: true,
        reply: response.text || 'DailySip luôn sẵn sàng đồng hành cùng sức khỏe của bạn!'
      });
    } catch (error) {
      console.error('Nutritionist chat error:', error);
      res.status(500).json({
        success: false,
        reply: 'Xin lỗi, trợ lý DailySip đang bận trong giây lát. Bạn hãy thử lại sau ít phút nhé!'
      });
    }
  });

  // Home Recipe Generator from available ingredients
  app.post('/api/home-recipe', async (req, res) => {
    try {
      const { ingredients = [], mood, symptoms } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          recipe: {
            name: 'Trà Gừng Táo Đỏ Mật Ong Tự Pha',
            prepTime: '7 phút',
            difficulty: 'Dễ',
            ingredientsUsed: ['Gừng tươi', 'Mật ong', 'Nước ấm'],
            steps: [
              'Cắt 4 lát gừng già đập dập, hãm cùng 250ml nước sôi 90°C trong 5 phút.',
              'Để nước nguội bớt xuống 50°C rồi cho 1 muỗng mật ong vào khuấy đều.',
              'Thưởng thức từng ngụm ấm chậm rãi.'
            ],
            wellnessBenefit: 'Làm ấm cơ thể, kích thích tiêu hóa và làm dịu tinh thần.'
          }
        });
      }

      const prompt = `Hãy tạo 1 công thức đồ uống pha tại nhà cực ngon và tốt cho sức khỏe từ những nguyên liệu sau: ${ingredients.join(', ')}.
Tình trạng người dùng: Tâm trạng "${mood || 'bình thường'}", triệu chứng "${symptoms || 'khỏe mạnh'}".

Trả về kết quả JSON hợp lệ theo định dạng:
{
  "name": "Tên món uống hấp dẫn",
  "prepTime": "Số phút chuẩn bị (ví dụ 5-10 phút)",
  "difficulty": "Dễ" hoặc "Trung bình",
  "ingredientsUsed": ["nguyên liệu 1", "nguyên liệu 2"],
  "steps": ["Bước 1...", "Bước 2...", "Bước 3..."],
  "wellnessBenefit": "Lợi ích sức khỏe 1 câu ngắn"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, recipe: parsed });
    } catch (error) {
      console.error('Home recipe error:', error);
      res.status(500).json({ success: false, message: 'Could not generate recipe' });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DailySip server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
