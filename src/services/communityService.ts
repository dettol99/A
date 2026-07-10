import { supabase } from './supabase';

const communityImagesBucket = 'community-images';

const extensionFromUri = (uri: string) => {
  const cleanUri = uri.split('?')[0] ?? uri;
  const match = cleanUri.match(/\.([a-zA-Z0-9]+)$/);
  return match?.[1]?.toLowerCase() ?? 'jpg';
};

export const communityService = {
  feed: () => supabase.from('posts').select('*, profiles(*)').order('created_at', { ascending: false }),
  getPost: (id: string) => supabase.from('posts').select('*, profiles(*)').eq('id', id).single(),
  createPost: (author_id: string, body: string, image_url?: string) => supabase.from('posts').insert({ author_id, body, image_url }).select().single(),
  uploadPostImage: async (userId: string, imageUri: string) => {
    try {
      const response = await fetch(imageUri);
      if (!response.ok) return { publicUrl: '', error: new Error('تعذر قراءة الصورة المحددة') };
      const blob = await response.blob();
      const path = `${userId}/${Date.now()}.${extensionFromUri(imageUri)}`;
      const { error } = await supabase.storage.from(communityImagesBucket).upload(path, blob, { upsert: false, contentType: blob.type || 'image/jpeg' });
      if (error) return { publicUrl: '', error };
      const { data } = supabase.storage.from(communityImagesBucket).getPublicUrl(path);
      return { publicUrl: data.publicUrl, error: null };
    } catch {
      return { publicUrl: '', error: new Error('تعذر رفع الصورة إلى التخزين') };
    }
  },
  comments: (post_id: string) => supabase.from('comments').select('*, profiles(*)').eq('post_id', post_id).order('created_at', { ascending: true }),
  addComment: (post_id: string, author_id: string, body: string) => supabase.from('comments').insert({ post_id, author_id, body }).select('*, profiles(*)').single(),
  like: (post_id: string, user_id: string) => supabase.from('post_reactions').upsert({ post_id, user_id }),
  report: (reporter_id: string, target_id: string, reason: string) => supabase.from('reports').insert({ reporter_id, target_type: 'post', target_id, reason }),
};
