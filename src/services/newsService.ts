import { supabase } from './supabase';

export const newsService = {
  latest: (query?: string) => supabase.functions.invoke('trending-news', { body: { query } }),
  save: (user_id: string, news_id: string) => supabase.from('saved_news').upsert({ user_id, news_id }),
  unsave: (user_id: string, news_id: string) => supabase.from('saved_news').delete().eq('user_id', user_id).eq('news_id', news_id),
  isSaved: (user_id: string, news_id: string) => supabase.from('saved_news').select('news_id').eq('user_id', user_id).eq('news_id', news_id).maybeSingle(),
  saved: (userId: string) =>
    supabase
      .from('saved_news')
      .select('created_at, news_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
};
