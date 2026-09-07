---
name: dailysip-engine
description: >-
  Core fullstack runbook for DailySip Vietnam. Use when starting, building, running, debugging, or extending the Express + Vite + TSX application, environment variables, or global architecture.
---

# DailySip Engine — Fullstack Architecture & Dev SOP

DailySip Vietnam is an AI-powered personalized beverage recommendation and delivery web application built with Express, Vite, React 19, Tailwind CSS v4, and Google Gemini AI.

## 1. Quick Commands

```bash
# Install dependencies
npm install

# Dev server (Express + Vite HMR on http://localhost:3000)
npm run dev

# Cloudflare tunnel for external mobile testing
npm run tunnel

# Check TypeScript types (zero tolerance)
npm run lint

# Production build
npm run build
npm start
```

## 2. Environment Variables (.env / .env.local)

| Variable | Required | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional | Google Gemini API key. If absent, system automatically uses intelligent heuristic fallbacks. |
| `VITE_SUPABASE_URL` | Optional | Supabase Project URL. Enables cloud DB sync. |
| `VITE_SUPABASE_ANON_KEY` | Optional | Supabase Anon Public Key. |
| `PORT` | Optional | Server port (default `3000`). |

## 3. Directory & Component Layout

```text
module_3/
├── server.ts                    # Express backend + Vite middleware + Gemini AI endpoints
├── index.html                   # HTML entry point (viewport, fonts, meta)
├── package.json                 # Dependencies & scripts (React 19, @google/genai, @supabase/supabase-js)
├── supabase_schema.sql          # Cloud PostgreSQL table definitions & RLS
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Global State Coordinator (tabs, modals, cart, user session)
    ├── types.ts                 # Centralized TypeScript interfaces & models
    ├── index.css                # Tailwind CSS v4 directives & custom theme rules
    ├── lib/supabase.ts          # Supabase client singleton & connection status check
    ├── services/dbService.ts    # Persistence layer (Dual-mode: Supabase Cloud <-> Local Mock)
    ├── data/mockData.ts         # Catalog: DRINKS_DATABASE, STORES_DATABASE, presets
    └── components/              # UI Components & feature modals
        ├── MobileDeviceFrame.tsx     # Frame wrapper: mobile mock vs responsive desktop
        ├── MobileHeader.tsx          # Top bar: logo, location picker, theme toggle, cart badge
        ├── MobileBottomNav.tsx       # Bottom bar: 5 navigation tabs
        ├── CheckInSurvey.tsx         # Mood, body status, preferences, vision upload
        ├── RecommendationView.tsx    # Top 5 recommended drinks + AI nutritional advice
        ├── StoreMapView.tsx          # GPS store list, distances, delivery routing
        ├── StoreDetailModal.tsx      # Detailed store view with in-store beverage menu
        ├── CartDrawer.tsx            # Cart item list, voucher input, payment checkout
        ├── DrinkCustomizationModal.tsx # Size, sugar, ice, temperature, topping customizer
        ├── OrderTrackingModal.tsx    # Live simulation of 5-stage delivery pipeline
        ├── HydrationTracker.tsx      # Daily water intake tracking & confetti celebration
        ├── NutritionistChatModal.tsx # Gemini AI Sommelier Chatbot
        ├── HomeRecipeModal.tsx       # AI DIY recipe generator from available ingredients
        ├── UserProfileModal.tsx      # Profile, bank cards, past orders, membership rank
        └── AuthScreen.tsx            # Login & registration modal with dual-mode support
```

## 4. Global State Architecture (`src/App.tsx`)

- **Tab Routing**: `activeTab` (`checkin` | `recommendations` | `stores` | `history` | `sommelier`). Persisted in `localStorage['dailysip_active_tab']`.
- **Theme**: `isDarkMode` toggles class `.dark` on document root. Persisted in `localStorage['dailysip_theme']`.
- **Cart**: `cart` array of `CartItem`. Stored in React state and synced across modals.
- **User Session**: `userProfile` (default `DEFAULT_GUEST_PROFILE`). Updated upon login/register via `dbService`.
- **Drink Recommendations**: `recommendedDrinks` + `aiAdvice`. Cached in `localStorage['dailysip_recommended_drinks']`.

## 5. Coding & Contribution Rules

1. **TypeScript Integrity**: Run `npm run lint` (`tsc --noEmit`) before committing. Never use `any` without defensive fallbacks.
2. **Offline-First Resilience**: All AI endpoints (`/api/recommendations`, `/api/analyze-vision`, `/api/nutritionist-chat`, `/api/home-recipe`) MUST have working heuristic fallback responses when `GEMINI_API_KEY` is missing or fails.
3. **Database Dual-Mode**: Every database operation in `src/services/dbService.ts` MUST check `isSupabaseConfigured`. If false or failed, fallback transparently to local mock data.
