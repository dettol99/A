import { supabase } from './supabase';
export const profileService = {
  get: (id: string) => supabase.from('profiles').select('*').eq('id', id).single(),
  update: (id: string, values: { username?: string; display_name?: string; avatar_url?: string; language?: string }) => supabase.from('profiles').update(values).eq('id', id).select().single(),
  follow: (follower_id: string, following_id: string) => supabase.from('follows').upsert({ follower_id, following_id }),
  block: (blocker_id: string, blocked_id: string) => supabase.from('blocks').upsert({ blocker_id, blocked_id }),
  blocked: (blocker_id: string) => supabase.from('blocks').select('created_at, profiles:blocked_id(*)').eq('blocker_id', blocker_id),
  notifications: (userId: string) => supabase.from('follows').select('created_at, profiles:follower_id(*)').eq('following_id', userId).order('created_at', { ascending: false }),
  deleteAccount: () => supabase.functions.invoke('delete-account'),
};
