import type { SearchResult } from '@/types/api';
import { mediaService } from './mediaService';
import { supabase } from './supabase';

export const listsService = {
  myLists: (userId: string) => supabase.from('user_lists').select('*, list_items(*, media_items(*))').eq('user_id', userId),
  createList: (user_id: string, name: string, list_type = 'custom') => supabase.from('user_lists').insert({ user_id, name, list_type }).select().single(),
  addItem: (list_id: string, media_item_id: string, status = 'planned') => supabase.from('list_items').upsert({ list_id, media_item_id, status }, { onConflict: 'list_id,media_item_id' }),
  updateProgress: (id: string, progress: number, status?: string) => supabase.from('list_items').update({ progress, ...(status ? { status } : {}) }).eq('id', id),
  removeItem: (id: string) => supabase.from('list_items').delete().eq('id', id),
  rate: (user_id: string, media_item_id: string, rating: number) => supabase.from('ratings').upsert({ user_id, media_item_id, rating }),
  ensureMediaItem: (item: SearchResult) => mediaService.persist({ source: item.source, sourceId: item.sourceId, mediaType: item.mediaType, title: item.title, posterUrl: item.posterUrl, overview: item.overview, releaseDate: item.releaseDate }),
};
