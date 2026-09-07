---
name: dailysip-supabase
description: >-
  Supabase cloud database and local fallback sync for DailySip. Use when modifying database schemas, auth (register/login), orders persistence, hydration logs, user profiles, or dbService.ts.
---

# DailySip Supabase — Cloud Database & Local Persistence

DailySip operates on a resilient dual-mode data layer: seamless Supabase Cloud sync when credentials exist, with automatic zero-error fallback to local mock data.

## 1. Setup & Credentials

- Environment variables in `.env` / `.env.local`:
  ```bash
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
  ```
- Client status check in `src/lib/supabase.ts`:
  ```typescript
  export const isSupabaseConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co'
  );
  ```

## 2. Database Schema (`supabase_schema.sql`)

| Table Name | Primary Key | Key Columns | Purpose |
| :--- | :--- | :--- | :--- |
| `app_users` | `id` (text) | `username`, `password`, `name`, `phone`, `email`, `avatar`, `total_orders_count`, `rank`, `linked_payments` (jsonb) | User credentials & profile |
| `drinks` | `id` (text) | `name`, `vietnamese_name`, `category`, `price_vnd`, `calories`, `sugar_grams`, `caffeine_mg`, `contains_lactose`, `contains_caffeine`, `contains_nuts`, `is_vegan`, `tags` (text[]) | Beverage master catalog |
| `stores` | `id` (text) | `name`, `brand`, `address`, `district`, `city`, `lat`, `lng`, `rating`, `menu_items` (jsonb), `external_links` (jsonb) | Merchant network |
| `orders` | `id` (text) | `customer_name`, `customer_phone`, `delivery_address`, `items` (jsonb), `subtotal`, `delivery_fee`, `discount`, `total_amount`, `payment_method`, `status`, `driver` (jsonb), `placed_at` | Completed orders & tracking |
| `hydration_logs` | `id` (text) | `drink_name`, `drink_category`, `volume_ml`, `calories`, `caffeine_mg`, `sugar_grams`, `timestamp`, `mood_tag` | Water intake history |

## 3. Data Service Layer (`src/services/dbService.ts`)

All database interactions MUST route through `dbService`. Do not invoke Supabase directly from UI components.

- `dbService.getDrinks()`: Fetches drinks table or returns `DRINKS_DATABASE`.
- `dbService.getStores()`: Fetches stores table or returns `STORES_DATABASE`.
- `dbService.getPastOrders(username?)`: Fetches past orders by customer username.
- `dbService.createOrder(orderData)`: Inserts new completed order into cloud DB.
- `dbService.getHydrationLogs()`: Retrieves historical water intake records.
- `dbService.addHydrationLog(log)`: Inserts hydration log.
- `dbService.registerUser(params)`: Checks username uniqueness and inserts into `app_users`.
- `dbService.loginUser(usernameOrPhone, password)`: Validates credentials and returns `UserProfile`.

## 4. Offline Test Credentials

When operating in offline/demo mode without Supabase connection:
- Username: `thienluan`
- Password: `123456`
- Role: Silver Member with linked MoMo wallet and pre-filled order history.
