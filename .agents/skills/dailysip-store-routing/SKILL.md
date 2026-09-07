---
name: dailysip-store-routing
description: >-
  Store catalog, GPS distance routing, and store menu management for DailySip. Use when adding store locations, updating menus, calculating Haversine distances, delivery ETA, or external deep-links.
---

# DailySip Store Routing & Menus

Manages the merchant partner network, GPS geolocation calculations, dynamic delivery ETAs, in-store menus, and third-party delivery links.

## 1. API Contract

- **Endpoint**: `GET /api/stores`
- **Query Parameters**:
  - `lat` (number, default `10.7725` - HCMC center)
  - `lng` (number, default `106.6983`)
  - `drinkId` (optional string): Filters only stores serving this specific drink where `isAvailable !== false`.
- **Response**: `{ success: true, stores: Store[] }` (sorted ascending by `distanceKm`).

## 2. Geolocation & ETA Calculations (`server.ts`)

```typescript
// Haversine formula in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Estimated delivery time in minutes (minimum 12 mins)
const estDeliveryTime = Math.max(12, Math.round(distanceKm * 6 + 10));
```

## 3. Store Data Structure & In-Store Menus (`src/types.ts`)

```typescript
export interface Store {
  id: string;
  name: string;
  brand: string;
  address: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  deliveryTimeMins?: number;
  rating: number;
  openHours: string;          // e.g. '07:00 - 22:30'
  image: string;
  promoBadge?: string;        // e.g. 'Freeship 2km', 'Giảm 20k'
  menuItems: {
    drinkId: string;
    price: number;            // Store-specific pricing
    isSignature?: boolean;
    isAvailable: boolean;
  }[];
  externalLinks?: {
    grabFoodUrl?: string;
    shopeeFoodUrl?: string;
    googleMapsUrl?: string;
  };
}
```

## 4. UI Modals & Navigation

- **`StoreMapView.tsx`**: Renders nearby merchant cards, filter by district, and direct navigation links to GrabFood, ShopeeFood, or Google Maps directions.
- **`StoreDetailModal.tsx`**: Displays store hero image, operating hours, full menu items with search/filter, and instant "Thêm vào giỏ" button.
- **`LocationModal.tsx`**: Allows user to change default GPS location (District 1, District 3, Binh Thanh, etc.) which recalculates distances and re-ranks stores.
