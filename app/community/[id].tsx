import { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, Card, Field, Header, Screen, StateView } from '@/components/ui';
import { communityService } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
import { showAuthRequiredDialog } from '@/components/AuthRequiredDialog';
import { colors, spacing } from '@/theme/tokens';

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<any>();
  const [comments, setComments] = useState<any[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savingComment, setSavingComment] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    const [{ data: postData, error: postError }, { data: commentData, error: commentError }] = await Promise.all([
      communityService.getPost(id),
      communityService.comments(id),
    ]);
    if (postError || commentError) setError(postError?.message ?? commentError?.message ?? 'تعذر تحميل المنشور');
    else {
      setPost(postData);
      setComments((commentData as any[]) ?? []);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const submitComment = async () => {
    if (!user) return showAuthRequiredDialog();
    const body = commentBody.trim();
    if (!body) return;
    setSavingComment(true);
    const { data, error } = await communityService.addComment(id, user.id, body);
    setSavingComment(false);
    if (error) setError(error.message);
    else {
      setCommentBody('');
      setComments((current) => [...current, data]);
    }
  };

  if (error && !post) return <Screen><StateView title={error} actionLabel="إعادة المحاولة" onAction={load} /></Screen>;
  if (!post) return <Screen><StateView loading title="جار التحميل" /></Screen>;

  return (
    <Screen>
      <Header title="تفاصيل المنشور" subtitle={post.profiles?.username} />
      <FlatList
        data={comments}
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.lg }}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={(
          <Card>
            <Text style={{ color: colors.text, fontSize: 18, lineHeight: 28, textAlign: 'right' }}>{post.body}</Text>
            {post.image_url ? <Image source={{ uri: post.image_url }} style={{ height: 260, borderRadius: 18, backgroundColor: colors.background }} resizeMode="cover" /> : null}
            <Button title="إعجاب" onPress={() => user ? communityService.like(id, user.id) : showAuthRequiredDialog()} />
            <Button title="إبلاغ" onPress={() => user ? communityService.report(user.id, id, 'inappropriate') : showAuthRequiredDialog()} />
          </Card>
        )}
        ListEmptyComponent={<StateView title="لا توجد تعليقات بعد" />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ color: colors.text, fontWeight: '800', textAlign: 'right' }}>{item.profiles?.username ?? 'مستخدم'}</Text>
            <Text style={{ color: colors.text, lineHeight: 24, textAlign: 'right' }}>{item.body}</Text>
          </Card>
        )}
        ListFooterComponent={(
          <Card>
            <Text style={{ color: colors.text, fontWeight: '800', textAlign: 'right' }}>أضف تعليقاً</Text>
            <Field value={commentBody} onChangeText={setCommentBody} placeholder="اكتب تعليقك" multiline />
            {error ? <Text style={{ color: colors.danger, textAlign: 'right' }}>{error}</Text> : null}
            <Button title="نشر التعليق" disabled={!commentBody.trim() || savingComment} onPress={submitComment} />
          </Card>
        )}
      />
    </Screen>
  );
}
