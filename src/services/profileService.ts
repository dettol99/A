import { supabase } from './supabase';

const profileImagesBucket = 'profile-images';
const extensionFromUri = (uri: string) => uri.split('?')[0]?.match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase() ?? 'jpg';

export const profileService = {
  get: (id: string) => supabase.from('profiles').select('*').eq('id', id).single(),
  update: (id: string, values: { username?: string; display_name?: string; avatar_url?: string; cover_url?: string; language?: string }) => supabase.from('profiles').update(values).eq('id', id).select().single(),
  uploadImage: async (userId: string, uri: string, kind: 'avatar' | 'cover') => {
    try {
      const response = await fetch(uri);
      if (!response.ok) return { publicUrl: '', error: new Error('تعذر قراءة الصورة المحددة') };
      const blob = await response.blob();
      const path = `${userId}/${kind}-${Date.now()}.${extensionFromUri(uri)}`;
      const { error } = await supabase.storage.from(profileImagesBucket).upload(path, blob, { upsert: true, contentType: blob.type || 'image/jpeg' });
      if (error) return { publicUrl: '', error };
      const { data } = supabase.storage.from(profileImagesBucket).getPublicUrl(path);
      return { publicUrl: data.publicUrl, error: null };
    } catch {
      return { publicUrl: '', error: new Error('تعذر رفع الصورة إلى التخزين') };
    }
  },
  follow: (follower_id: string, following_id: string) => supabase.from('follows').upsert({ follower_id, following_id }),
  counts: async (id: string) => {
    const [followers, following] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', id),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', id),
    ]);
    return { followers: followers.count ?? 0, following: following.count ?? 0 };
  },
  block: (blocker_id: string, blocked_id: string) => supabase.from('blocks').upsert({ blocker_id, blocked_id }),
  unblock: (blocker_id: string, blocked_id: string) => supabase.from('blocks').delete().eq('blocker_id', blocker_id).eq('blocked_id', blocked_id),
  blocked: (blocker_id: string) => supabase.from('blocks').select('created_at, profiles:blocked_id(*)').eq('blocker_id', blocker_id),
  notifications: (userId: string) => supabase.from('follows').select('created_at, profiles:follower_id(*)').eq('following_id', userId).order('created_at', { ascending: false }),
  deleteAccount: () => supabase.functions.invoke('delete-account'),
};
