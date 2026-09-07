import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Drink, Store, PastOrder, HydrationLogItem, UserProfile } from '../types';
import { DRINKS_DATABASE, STORES_DATABASE, SAMPLE_PAST_ORDERS } from '../data/mockData';

export const dbService = {
  // 1. Fetch All Drinks
  async getDrinks(): Promise<Drink[]> {
    if (!isSupabaseConfigured) return DRINKS_DATABASE;

    try {
      const { data, error } = await supabase.from('drinks').select('*');
      if (error || !data || data.length === 0) {
        return DRINKS_DATABASE;
      }

      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        vietnameseName: d.vietnamese_name,
        category: d.category,
        description: d.description,
        benefits: d.benefits || [],
        whyItFits: d.why_it_fits || '',
        calories: d.calories || 0,
        sugarGrams: d.sugar_grams || 0,
        caffeineMg: d.caffeine_mg || 0,
        ingredients: d.ingredients || [],
        priceVND: Number(d.price_vnd) || 35000,
        image: d.image,
        isHotAvailable: Boolean(d.is_hot_available),
        isColdAvailable: Boolean(d.is_cold_available),
        containsLactose: Boolean(d.contains_lactose),
        containsCaffeine: Boolean(d.contains_caffeine),
        containsNuts: Boolean(d.contains_nuts),
        isVegan: Boolean(d.is_vegan),
        tags: d.tags || [],
        suggestedToppings: d.suggested_toppings || [],
        homeRecipe: d.home_recipe
      }));
    } catch (err) {
      console.error('Error fetching drinks from Supabase:', err);
      return DRINKS_DATABASE;
    }
  },

  // 2. Fetch All Stores
  async getStores(): Promise<Store[]> {
    if (!isSupabaseConfigured) return STORES_DATABASE;

    try {
      const { data, error } = await supabase.from('stores').select('*');
      if (error || !data || data.length === 0) {
        return STORES_DATABASE;
      }

      return data.map((s: any) => ({
        id: s.id,
        name: s.name,
        brand: s.brand,
        address: s.address,
        district: s.district || 'Quận 1',
        city: s.city || 'TP.HCM',
        latitude: Number(s.lat) || 10.7725,
        longitude: Number(s.lng) || 106.6983,
        distanceKm: Number(s.distance_km) || 1.0,
        rating: Number(s.rating) || 5.0,
        reviewCount: Number(s.review_count) || 0,
        deliveryTimeMins: Number(s.delivery_time_mins) || 20,
        deliveryFeeVND: 15000,
        openHours: '07:00 - 22:30',
        isOpen: true,
        image: s.image,
        promoBadge: s.promo_badge,
        menuItems: (s.menu_items || []).map((m: any) => ({
          drinkId: m.drinkId,
          price: Number(m.price) || 45000,
          isSignature: Boolean(m.isSignature),
          isAvailable: m.isAvailable !== false
        })),
        externalLinks: s.external_links || {}
      }));
    } catch (err) {
      console.error('Error fetching stores from Supabase:', err);
      return STORES_DATABASE;
    }
  },

  // 3. Past Orders
  async getPastOrders(username?: string): Promise<PastOrder[]> {
    if (!isSupabaseConfigured) {
      return username === 'thienluan' ? SAMPLE_PAST_ORDERS : [];
    }

    try {
      let query = supabase.from('orders').select('*').order('placed_at', { ascending: false });
      if (username) {
        query = query.eq('customer_name', username);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return username === 'thienluan' ? SAMPLE_PAST_ORDERS : [];
      }

      return data.map((o: any) => ({
        id: o.id,
        orderCode: `DS-${o.id.slice(-4).toUpperCase()}`,
        createdAt: new Date(o.placed_at).toLocaleDateString('vi-VN'),
        status: o.status === 'cancelled' ? 'cancelled' : 'delivered',
        items: o.items || [],
        subtotal: Number(o.subtotal) || 0,
        deliveryFee: Number(o.delivery_fee) || 0,
        discount: Number(o.discount) || 0,
        totalAmount: Number(o.total_amount) || 0,
        deliveryAddress: o.delivery_address,
        paymentMethod: o.payment_method === 'momo' ? 'Ví MoMo' : o.payment_method === 'vnpay' ? 'VNPay' : 'Tiền mặt (COD)',
        storeName: o.items?.[0]?.storeName || 'DailySip Store',
        review: o.review
      }));
    } catch (err) {
      console.error('Error fetching orders from Supabase:', err);
      return username === 'thienluan' ? SAMPLE_PAST_ORDERS : [];
    }
  },

  // 4. Create New Order in Supabase
  async createOrder(orderData: any): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    try {
      const { error } = await supabase.from('orders').insert({
        id: orderData.id,
        customer_name: orderData.customerName || 'Khách hàng',
        customer_phone: orderData.customerPhone || '0900000000',
        delivery_address: orderData.deliveryAddress,
        items: orderData.items,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        discount: orderData.discount || 0,
        total_amount: orderData.totalAmount,
        payment_method: orderData.paymentMethod,
        status: 'delivered',
        driver: orderData.driver,
        placed_at: new Date().toISOString()
      });

      if (error) {
        console.error('Error creating order in Supabase:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error saving order to Supabase:', err);
      return false;
    }
  },

  // 5. Hydration Logs
  async getHydrationLogs(): Promise<HydrationLogItem[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase.from('hydration_logs').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map((h: any) => ({
        id: h.id,
        drinkName: h.drink_name,
        drinkCategory: h.drink_category,
        volumeMl: Number(h.volume_ml) || 250,
        calories: Number(h.calories) || 0,
        caffeineMg: Number(h.caffeine_mg) || 0,
        sugarGrams: Number(h.sugar_grams) || 0,
        timestamp: h.timestamp,
        moodTag: h.mood_tag || 'good'
      }));
    } catch (err) {
      console.error('Error fetching hydration logs from Supabase:', err);
      return [];
    }
  },

  // 6. Add Hydration Log
  async addHydrationLog(log: HydrationLogItem): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    try {
      const { error } = await supabase.from('hydration_logs').insert({
        id: log.id,
        drink_name: log.drinkName,
        drink_category: log.drinkCategory,
        volume_ml: log.volumeMl,
        calories: log.calories,
        caffeine_mg: log.caffeineMg,
        sugar_grams: log.sugarGrams,
        timestamp: log.timestamp,
        mood_tag: log.moodTag
      });
      return !error;
    } catch (err) {
      console.error('Error inserting hydration log:', err);
      return false;
    }
  },

  // 7. Register New User Account
  async registerUser(params: {
    username: string;
    password: string;
    name: string;
    phone: string;
    email?: string;
  }): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
    const cleanUsername = params.username.trim().toLowerCase();
    const cleanPhone = params.phone.trim();
    const cleanName = params.name.trim();

    if (!cleanUsername || !params.password || !cleanPhone || !cleanName) {
      return { success: false, message: 'Vui lòng điền đầy đủ tài khoản, mật khẩu, tên và số điện thoại.' };
    }

    if (isSupabaseConfigured) {
      try {
        // Check if username already exists
        const { data: existing } = await supabase
          .from('app_users')
          .select('username')
          .eq('username', cleanUsername)
          .maybeSingle();

        if (existing) {
          return { success: false, message: 'Tên tài khoản này đã được đăng ký. Vui lòng chọn tên khác hoặc đăng nhập!' };
        }

        const newId = `usr-${Date.now()}`;
        const newProfile: UserProfile = {
          id: newId,
          username: cleanUsername,
          name: cleanName,
          phone: cleanPhone,
          email: params.email?.trim() || `${cleanUsername}@dailysip.vn`,
          avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=300&auto=format&fit=crop&q=80`,
          totalOrdersCount: 0,
          rank: 'bronze',
          linkedPayments: []
        };

        const { error: insertError } = await supabase.from('app_users').insert({
          id: newId,
          username: cleanUsername,
          password: params.password,
          name: cleanName,
          phone: cleanPhone,
          email: newProfile.email,
          avatar: newProfile.avatar,
          total_orders_count: 0,
          rank: 'bronze',
          linked_payments: []
        });

        if (insertError) {
          console.error('Supabase register error:', insertError);
          return { success: false, message: 'Lỗi đăng ký tài khoản: ' + insertError.message };
        }

        return { success: true, profile: newProfile };
      } catch (err: any) {
        console.error('Register exception:', err);
      }
    }

    // Local fallback registration
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      username: cleanUsername,
      name: cleanName,
      phone: cleanPhone,
      email: params.email?.trim() || `${cleanUsername}@dailysip.vn`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      totalOrdersCount: 0,
      rank: 'bronze',
      linkedPayments: []
    };
    return { success: true, profile: newProfile };
  },

  // 8. Login User Account
  async loginUser(
    usernameOrPhone: string,
    password: string
  ): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
    const query = usernameOrPhone.trim().toLowerCase();

    if (!query || !password) {
      return { success: false, message: 'Vui lòng nhập tài khoản và mật khẩu.' };
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('app_users')
          .select('*')
          .or(`username.eq.${query},phone.eq.${usernameOrPhone.trim()}`)
          .eq('password', password)
          .maybeSingle();

        if (error || !data) {
          return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!' };
        }

        const profile: UserProfile = {
          id: data.id,
          username: data.username,
          name: data.name,
          phone: data.phone,
          email: data.email || `${data.username}@dailysip.vn`,
          avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          totalOrdersCount: data.total_orders_count || 0,
          rank: (data.rank as any) || 'bronze',
          linkedPayments: data.linked_payments || []
        };

        return { success: true, profile };
      } catch (err: any) {
        console.error('Login error:', err);
      }
    }

    // Demo accounts check for offline fallback
    if (query === 'thienluan' && password === '123456') {
      return {
        success: true,
        profile: {
          id: 'usr-thienluan',
          username: 'thienluan',
          name: 'Nguyễn Thiên Luân',
          phone: '0908 123 456',
          email: 'thienluan@dailysip.vn',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          totalOrdersCount: 12,
          rank: 'silver',
          linkedPayments: [
            {
              id: 'pay-1',
              type: 'momo',
              name: 'Ví MoMo Cá Nhân',
              accountNumber: '0908 *** 456',
              isDefault: true,
              logo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png'
            }
          ]
        }
      };
    }

    return { success: false, message: 'Tài khoản hoặc mật khẩu không đúng.' };
  }
};
