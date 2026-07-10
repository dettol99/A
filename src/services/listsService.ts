import { supabase } from './supabase';
export const listsService = { myLists: (userId: string) => supabase.from('user_lists').select('*').eq('user_id', userId), rate: (user_id: string, media_item_id: string, rating: number) => supabase.from('ratings').upsert({ user_id, media_item_id, rating }) };
