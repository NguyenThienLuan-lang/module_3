---
name: dailysip-sommelier-health
description: >-
  AI Nutritionist Sommelier chatbot, hydration tracking, and DIY home recipe generator for DailySip. Use when updating chatbot prompts, symptom triage fallback, hydration goals, or home drink recipes.
---

# DailySip Sommelier & Health Tracker

Manages conversational AI health triage, personalized DIY home recipes from pantry ingredients, and daily hydration progress tracking.

## 1. AI Sommelier Chatbot (`/api/nutritionist-chat`)

- **Role**: DailySip Sommelier & Beverage Nutritionist specializing in Vietnamese natural herbs, teas, and healthy lifestyle beverages.
- **Request**:
  ```typescript
  {
    message: string;
    chatHistory: { sender: 'user' | 'bot'; text: string }[];
    userContext: { mood?: string; bodyStatus?: string; allergies?: string[] };
  }
  ```
- **Gemini 3.7 Flash Model**: Generates warm, science-backed Vietnamese advice with bold key recommendations.
- **Offline Symptom Triage Matrix**:
  - `đau họng` / `khàn tiếng`: Khuyên dùng Trà Gừng Sả Tắc Mật Ong Ấm. Kiêng tuyệt đối đá lạnh và đồ có gas.
  - `buồn ngủ` / `cần tập trung`: Khuyên dùng Cold Brew Cam Sả hoặc Matcha Sữa Yến Mạch (L-Theanine tỉnh táo êm dịu, không ép tim).
  - `nóng trong` / `mụn`: Khuyên dùng Nước Ép Cần Tây Táo Xanh hoặc Rau Má Đậu Xanh Nước Dừa (ít đường 30%).
  - `đầy bụng` / `khó tiêu`: Khuyên dùng Kombucha Dứa Bạc Hà (men sống và enzym bromelain hỗ trợ đường ruột).

## 2. DIY Home Recipe Generator (`/api/home-recipe`)

Generates drink recipes tailored to whatever ingredients the user has in their kitchen:

- **Request**: `{ ingredients: string[], mood?: string, symptoms?: string }`
- **Output Schema**:
  ```json
  {
    "name": "Trà Gừng Táo Đỏ Mật Ong Tự Pha",
    "prepTime": "7 phút",
    "difficulty": "Dễ" | "Trung bình" | "Khá",
    "ingredientsUsed": ["Gừng tươi", "Mật ong", "Nước ấm"],
    "steps": [
      "Cắt 4 lát gừng già đập dập, hãm cùng 250ml nước sôi 90°C trong 5 phút.",
      "Để nguội bớt xuống 50°C rồi khuấy đều cùng 1 muỗng mật ong.",
      "Uống từng ngụm ấm chậm rãi."
    ],
    "wellnessBenefit": "Làm ấm cơ thể, kích thích tiêu hóa và làm dịu tinh thần."
  }
  ```

## 3. Hydration Tracker (`src/components/HydrationTracker.tsx`)

- **Daily Water Target**: Default `2000ml` (adjustable per body weight / activity).
- **Intake Logging**:
  - Quick buttons: `+150ml` (tách nhỏ), `+250ml` (ly tiêu chuẩn), `+500ml` (bình thể thao).
  - Custom beverage entry with calories, sugar, caffeine metadata.
- **Celebration**: Triggers `canvas-confetti` effect upon hitting 100% of daily target.
- **Data Persistence**: Calls `dbService.addHydrationLog(log)` to store entries in Supabase or local state.
