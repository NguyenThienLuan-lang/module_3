---
name: dailysip-recommendation
description: >-
  Recommendation engine for DailySip. Use when modifying drink recommendation scoring algorithms, 100% strict allergy filters, Gemini 3.7 Flash nutritional reasoning prompts, or fallback logic.
---

# DailySip Recommendation & Safety Engine

Handles personalized beverage ranking, medical/allergy safety barriers, and Gemini AI nutritional reasoning.

## 1. API Contract

- **Endpoint**: `POST /api/recommendations`
- **Request Body**: `CheckInFormData`
  ```typescript
  {
    moods: MoodType[];            // 'tired' | 'stressed' | 'sleepy' | 'happy' | 'bloated' | 'relax' | 'excited'
    bodyConditions: BodyStatusType[]; // 'sore_throat' | 'internal_heat' | 'bloated' | 'dehydrated' | 'cold_flu' | 'post_workout' | 'caffeine_sensitive'
    preferences: PreferenceType[]; // 'low_sugar' | 'no_sugar' | 'herbal' | 'fruity' | 'bold_rich' | 'creamy' | 'hot' | 'iced'
    allergies: AllergyType[];     // 'lactose' | 'caffeine' | 'peanuts' | 'dairy' | 'gluten' | 'vegan'
    goal?: GoalType;              // 'energy' | 'detox' | 'weight_loss' | 'stress_relief' | 'hydration' | 'muscle_recovery' | 'focus'
    visionAnalysis?: VisionAnalysisResult;
    customNote?: string;
  }
  ```
- **Response**: `{ success: boolean, recommendations: Drink[], aiAnalysis: AIAdvice, checkedAt: string }`

## 2. Recommendation Algorithm (4-Step Pipeline)

### Step 1: Hard Safety Barrier (100% Strict Exclusion)
Any drink violating the user's constraints is immediately eliminated from consideration:
- `allergies.includes('lactose')` -> Exclude if `containsLactose || category === 'milk_nut'`
- `allergies.includes('caffeine') || bodyConditions.includes('caffeine_sensitive')` -> Exclude if `containsCaffeine || caffeineMg > 0`
- `allergies.includes('peanuts')` -> Exclude if `containsNuts || ingredients` match peanut/nut terms
- `allergies.includes('dairy')` -> Exclude if `containsLactose || ingredients` match dairy/milk/foam/cheese terms
- `allergies.includes('gluten')` -> Exclude if ingredients match gluten/wheat/oats
- `allergies.includes('vegan')` -> Exclude if `!isVegan`
- `preferences.includes('hot')` -> Exclude if `!isHotAvailable`

*Fallback Safety*: If all drinks are filtered out, fallback strictly respects allergies and never recommends an allergen.

### Step 2: Scoring Matrix (Base = 50, Clamped 70 - 99)
1. **Mood Match**: `+25` per matching tag.
2. **Body Status Match**:
   - `+35` for general matching tag.
   - High-impact relief bonuses:
     - `sore_throat` + `ginger-lemongrass-citrus-warm`: `+50`
     - `internal_heat` + (`celery-greenapple-cucumber-detox` | `pennywort-mungbean-coconut`): `+50`
     - `bloated` + `pineapple-mint-kombucha`: `+50`
     - `post_workout` + (`avocado-banana-plant-protein` | `fresh-coconut-calamansi-pink-salt`): `+50`
     - `dehydrated` + `fresh-coconut-calamansi-pink-salt`: `+50`
3. **Preferences**:
   - `+15` per matching tag.
   - `low_sugar` + `sugarGrams <= 9`: `+20`
   - `no_sugar` + `sugarGrams <= 5`: `+25`
4. **Goal Match**: `+30` if `tags.includes(goal)`.

Top 5 ranked drinks are selected (`slice(0, 5)`).

### Step 3: Allergy Shield Notice
Generates clear user notification identifying each active allergy filter:
`Hệ thống AI đã kích hoạt Lá Chắn Dị Ứng: Kiểm duyệt và LOẠI BỎ 100% toàn bộ X yếu tố kiêng cữ...`

### Step 4: Gemini 3.7 Flash Nutritional Reasoning
Calls Gemini model `gemini-3.7-flash` with structured JSON output:
```json
{
  "summary": "1-2 câu thấu hiểu tình trạng của người dùng",
  "wellnessTip": "1 lời khuyên chăm sóc thể trạng thực tế",
  "timingAdvice": "1 lời khuyên về thời điểm uống lý tưởng trong ngày",
  "sugarAdvice": "Lời khuyên về lượng đường & calo",
  "allergyNotice": "Xác nhận an toàn cho toàn bộ dị ứng đã chọn",
  "drinkReasons": [
    { "id": "<drink_id>", "whyItFits": "Giải thích 1-2 câu vì sao món này cải thiện tình trạng" }
  ]
}
```

## 3. Catalog Checklist for New Drinks (`src/data/mockData.ts`)

Every new drink added to the catalog must specify:
1. Exact safety flags: `containsLactose`, `containsCaffeine`, `containsNuts`, `isVegan`, `isHotAvailable`, `isColdAvailable`.
2. Exact nutritional metrics: `calories` (kcal), `sugarGrams` (g), `caffeineMg` (mg).
3. Searchable tags aligning with `MoodType`, `BodyStatusType`, and `GoalType`.
4. Partner store menu references in `STORES_DATABASE.menuItems`.
