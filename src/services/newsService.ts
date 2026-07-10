import { supabase } from './supabase';
import type { NewsArticle } from '@/types/api';

type NewsItemInsert = {
  source_id: string;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  published_at: string;
  category: string | null;
};

const sourceIdForArticle = (article: NewsArticle) => article.sourceId || article.url;

const toNewsItemInsert = (article: NewsArticle): NewsItemInsert => ({
  source_id: sourceIdForArticle(article),
  title: article.title,
  description: article.description ?? null,
  url: article.url,
  image_url: article.imageUrl ?? null,
  published_at: article.publishedAt,
  category: article.category ?? null,
});

export const newsService = {
  latest: (query?: string) => supabase.functions.invoke('trending-news', { body: { query } }),
  findOrCreateNewsItem: async (article: NewsArticle) => {
    const payload = toNewsItemInsert(article);
    const existing = await supabase.from('news_items').select('id').eq('source_id', payload.source_id).maybeSingle();
    if (existing.error) return existing;
    if (existing.data) return existing;
    return supabase.from('news_items').upsert(payload, { onConflict: 'source_id' }).select('id').single();
  },
  save: async (user_id: string, article: NewsArticle) => {
    const newsItem = await newsService.findOrCreateNewsItem(article);
    if (newsItem.error || !newsItem.data) return { data: null, error: newsItem.error ?? new Error('Unable to save news item') };
    return supabase.from('saved_news').upsert({ user_id, news_id: (newsItem.data as { id: string }).id });
  },
  unsave: async (user_id: string, article: NewsArticle) => {
    const newsItem = await newsService.findOrCreateNewsItem(article);
    if (newsItem.error || !newsItem.data) return { data: null, error: newsItem.error ?? new Error('Unable to unsave news item') };
    return supabase.from('saved_news').delete().eq('user_id', user_id).eq('news_id', (newsItem.data as { id: string }).id);
  },
  isSaved: async (user_id: string, article: NewsArticle) => {
    const newsItem = await supabase.from('news_items').select('id').eq('source_id', sourceIdForArticle(article)).maybeSingle();
    if (newsItem.error || !newsItem.data) return { data: null, error: newsItem.error };
    return supabase.from('saved_news').select('news_id').eq('user_id', user_id).eq('news_id', (newsItem.data as { id: string }).id).maybeSingle();
  },
  saved: (userId: string) =>
    supabase
      .from('saved_news')
      .select('created_at, news_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
};
