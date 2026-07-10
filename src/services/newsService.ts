import { supabase } from './supabase';
export const newsService = { latest: () => supabase.functions.invoke('trending-news'), save: (user_id: string, news_id: string) => supabase.from('saved_news').upsert({ user_id, news_id }) };
