# DailySip — Data Models & Schema Reference

This document summarizes the core TypeScript interfaces and data models defined in `src/types.ts`.

---

## 1. Drink Model (`Drink`)

Represents an individual beverage item in the DailySip catalog:

```typescript
export interface Drink {
  id: string;
  name: string;
  vietnameseName: string;
  category: 'tea' | 'coffee' | 'juice_detox' | 'smoothie' | 'herbal' | 'milk_nut' | 'kombucha';
  description: string;
  benefits: string[];
  whyItFits?: string;
  matchScore?: number;
  calories: number;
  sugarGrams: number;
  caffeineMg: number;
  ingredients: string[];
  priceVND: number;
  image: string;
  isHotAvailable: boolean;
  isColdAvailable: boolean;
  containsLactose: boolean;
  containsCaffeine: boolean;
  containsNuts: boolean;
  isVegan: boolean;
  tags: string[];
  suggestedToppings: { name: string; price: number; benefit: string }[];
  homeRecipe?: {
    prepTime: string;
    difficulty: 'Dễ' | 'Trung bình' | 'Khá';
    steps: string[];
    tips: string;
  };
}
```

---

## 2. Store Model (`Store`)

Represents a partner beverage merchant or cafe:

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
  rating: number;
  reviewCount: number;
  deliveryTimeMins: number;
  deliveryFeeVND: number;
  openHours: string;
  isOpen: boolean;
  image: string;
  promoBadge?: string;
  externalLinks: {
    grabFoodUrl?: string;
    shopeeFoodUrl?: string;
    beFoodUrl?: string;
    googleMapsUrl?: string;
  };
  menuItems: {
    drinkId: string;
    customName?: string;
    price: number;
    isSignature?: boolean;
    isAvailable: boolean;
  }[];
}
```

---

## 3. Check-In Form Data (`CheckInFormData`)

Payload sent by the client when submitting the daily survey:

```typescript
export interface CheckInFormData {
  moods: MoodType[];
  bodyConditions: BodyStatusType[];
  preferences: PreferenceType[];
  allergies: AllergyType[];
  timeSlot: TimeSlot;
  goal: GoalType;
  customNote?: string;
  userLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}
```

---

## 4. Cart, Orders & Delivery

```typescript
export interface CartCustomization {
  sweetness: '0%' | '30%' | '50%' | '70%' | '100%';
  ice: 'Nóng' | 'Không đá' | '30% đá' | '50% đá' | '100% đá';
  size: 'M' | 'L';
  toppings: { name: string; price: number }[];
  specialNote: string;
}

export interface CartItem {
  id: string;
  drinkId: string;
  drinkName: string;
  drinkImage: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  unitPrice: number;
  quantity: number;
  customization: CartCustomization;
  totalPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  noteForDriver: string;
  paymentMethod: 'cod' | 'momo' | 'vnpay' | 'zalopay' | 'card';
  status: 'placed' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  driver?: {
    name: string;
    phone: string;
    vehiclePlate: string;
    avatar: string;
  };
  placedAt: string;
  estimatedDeliveryAt: string;
}
```
