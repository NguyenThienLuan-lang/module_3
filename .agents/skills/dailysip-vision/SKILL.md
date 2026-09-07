---
name: dailysip-vision
description: >-
  Multimodal AI Vision context analyzer for DailySip. Use when working on camera capture, image uploads, Gemini 2.5 Flash scene recognition, heuristic vision fallback, or auto-filling check-in surveys.
---

# DailySip Vision — Multimodal Scene & Vibe Analyzer

Analyzes user photos (workspace, gym, outdoors, relaxing balcony, or sickbed) using Gemini 2.5 Flash Vision to deduce physical state, mood, and auto-populate check-in parameters.

## 1. API Contract

- **Endpoint**: `POST /api/analyze-vision`
- **Request Body**:
  ```json
  {
    "imageBase64": "data:image/jpeg;base64,...",
    "mimeType": "image/jpeg",
    "sceneHint": "optional text hint for offline testing"
  }
  ```
- **Response Schema (`VisionAnalysisResult`)**:
  ```json
  {
    "success": true,
    "analysis": {
      "sceneType": "desk_work" | "study" | "relax_scenery" | "workout_gym" | "sick_bed" | "outdoor_hot" | "social_party" | "other",
      "detectedObjects": ["laptop", "sổ tay ghi chép", "bàn làm việc"],
      "vibeDescription": "Không gian làm việc tập trung, cần thức uống tỉnh táo êm dịu.",
      "suggestedMoods": ["sleepy", "tired"],
      "suggestedBodyConditions": [],
      "suggestedPreferences": ["low_sugar", "bold_rich"],
      "suggestedGoal": "focus",
      "autoCustomNote": "Bàn làm việc với laptop, cần tăng cường sự tỉnh táo không gây ép tim",
      "confidenceScore": 96
    },
    "source": "gemini_vision" | "heuristic_vision"
  }
  ```

## 2. Gemini 2.5 Flash Multimodal Pipeline

1. Strip data URL prefix: `imageBase64.replace(/^data:image\/\w+;base64,/, '')`.
2. Send to `ai.models.generateContent` with model `gemini-2.5-flash`, setting `inlineData` with `mimeType` and clean base64.
3. Configure `responseMimeType: 'application/json'`.

## 3. Scene Presets & Fallback Classifier

If `GEMINI_API_KEY` is not present or vision fails, the heuristic classifier maps `sceneHint` or default patterns:

| Scene Type | Keywords / Detected Objects | Suggested Mood / Body | Suggested Goal | Typical Drink Profile |
| :--- | :--- | :--- | :--- | :--- |
| `desk_work` | laptop, computer, desk, books | `sleepy`, `tired` | `focus` | Cold Brew Cam Sả, Matcha Yến Mạch |
| `workout_gym` | gym, weights, dumbbell, sport bottle | `tired`, `post_workout`, `dehydrated` | `muscle_recovery` | Sinh Tố Bơ Chuối Protein, Nước Dừa Tắc Muối Hồng |
| `relax_scenery` | sunset, balcony, chill, plants | `relax`, `happy` | `stress_relief` | Trà Hoa Cúc Táo Đỏ, Trà Đào Cam Sả |
| `sick_bed` | bed, cold, throat, tissue, thermometer | `tired`, `sore_throat`, `cold_flu` | `stress_relief` | Trà Gừng Sả Tắc Ấm Nóng (kiêng đá) |
| `outdoor_hot` | outdoor, sun, sunny, street | `tired`, `dehydrated`, `internal_heat` | `hydration` | Nước Dừa Muối Hồng, Nước Ép Cần Tây Táo Xanh |

## 4. Client Integration (`src/components/CheckInSurvey.tsx`)

- Users can capture via live camera (`<video>` + `<canvas>` stream) or upload image file.
- Payload is sent to `/api/analyze-vision`.
- On success:
  1. `formData.visionAnalysis` is attached to survey data.
  2. Detected `suggestedMoods`, `suggestedPreferences`, and `suggestedGoal` automatically update the survey checkboxes.
  3. `formData.customNote` is populated with `autoCustomNote`.
