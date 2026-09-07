import { createClient } from '@supabase/supabase-js';

// Supabase project credentials for DailySip
// Project URL: https://tsqupswcdlbisnzswsyv.supabase.co
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://tsqupswcdlbisnzswsyv.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6ZyeR3LQ907q-k4pPF_FUw_nYQ4vCwN';

export const isSupabaseConfigured = Boolean(
  supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE'
);

// Create Supabase Client instance
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
