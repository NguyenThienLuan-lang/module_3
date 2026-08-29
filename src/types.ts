export type MoodType =
  | 'sleepy'
  | 'stressed'
  | 'tired'
  | 'happy'
  | 'anxious'
  | 'excited'
  | 'relax'
  | 'bored';

export type BodyStatusType =
  | 'sore_throat'
  | 'internal_heat'
  | 'bloated'
  | 'post_workout'
  | 'cold_flu'
  | 'caffeine_sensitive'
  | 'dehydrated'
  | 'headache'
  | 'stomach_sensitive';

export type PreferenceType =
  | 'low_sugar'
  | 'no_sugar'
  | 'sour'
  | 'creamy'
  | 'bold_rich'
  | 'herbal'
  | 'hot'
  | 'iced'
  | 'fruity';

export type AllergyType =
  | 'lactose'
  | 'caffeine'
  | 'peanuts'
  | 'dairy'
  | 'gluten'
  | 'vegan';

export type TimeSlot = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';

export type GoalType =
  | 'focus'
  | 'stress_relief'
  | 'detox'
  | 'muscle_recovery'
  | 'digestion'
  | 'hydration'
  | 'immunity';

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

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';

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
  status: OrderStatus;
  driver?: {
    name: string;
    phone: string;
    vehiclePlate: string;
    avatar: string;
  };
  placedAt: string;
  estimatedDeliveryAt: string;
}

export interface HydrationLogItem {
  id: string;
  drinkName: string;
  drinkCategory: string;
  volumeMl: number;
  calories: number;
  caffeineMg: number;
  sugarGrams: number;
  timestamp: string;
  moodTag: string;
}

export interface AIAdvice {
  summary: string;
  wellnessTip: string;
  timingAdvice?: string;
  sugarAdvice: string;
  allergyNotice?: string;
}

export type MembershipRank = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface UserVoucher {
  id: string;
  code: string;
  title: string;
  discountText: string;
  minOrderVND: number;
  expiryDate: string;
  description: string;
  minRank: MembershipRank;
  isUnlocked: boolean;
}

export interface LinkedPayment {
  id: string;
  type: 'momo' | 'bank' | 'zalopay';
  name: string;
  accountNumber: string;
  isDefault: boolean;
  logo: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  totalOrdersCount: number;
  rank: MembershipRank;
  linkedPayments: LinkedPayment[];
}

export type OrderHistoryStatus = 'delivered' | 'returned' | 'cancelled';

export interface OrderReview {
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PastOrder {
  id: string;
  orderCode: string;
  createdAt: string;
  status: OrderHistoryStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  storeName: string;
  review?: OrderReview;
}


