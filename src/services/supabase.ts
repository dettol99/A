import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { publicEnv } from '@/config/publicEnv';
import type { Database } from '@/types/database';

export const supabase = createClient<Database>(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});
