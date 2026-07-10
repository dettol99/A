import { useEffect, useMemo, useState } from 'react';
import { Image, Linking, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, Header, Screen } from '@/components/ui';
import { showAuthRequiredDialog } from '@/components/AuthRequiredDialog';
import { useAuth } from '@/hooks/useAuth';
import { newsService } from '@/services/newsService';
import { colors } from '@/theme/tokens';
import type { NewsArticle } from '@/types/api';

export default function NewsDetails() {
  const params = useLocalSearchParams<{ id: string; sourceId?: string; title: string; url: string; description: string; imageUrl: string; publishedAt: string; category?: string; sourceName?: string }>();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const article = useMemo<NewsArticle>(() => ({
    id: params.id,
    sourceId: params.sourceId ?? params.url,
    title: params.title,
    url: params.url,
    description: params.description || null,
    imageUrl: params.imageUrl || null,
    publishedAt: params.publishedAt,
    category: params.category ?? null,
    sourceName: params.sourceName ?? null,
  }), [params]);

  useEffect(() => {
    if (!user || !article.url) return;
    newsService.isSaved(user.id, article).then(({ data }) => setSaved(Boolean(data)));
  }, [article, user]);

  const toggleSave = async () => {
    if (!user) return showAuthRequiredDialog();
    setSaving(true);
    const { error } = saved ? await newsService.unsave(user.id, article) : await newsService.save(user.id, article);
    setSaving(false);
    if (!error) setSaved((current) => !current);
  };

  return (
    <Screen>
      <Header title={article.title ?? 'الأخبار'} subtitle={article.publishedAt} />
      {article.imageUrl ? <Image source={{ uri: article.imageUrl }} style={{ height: 220, borderRadius: 18 }} /> : null}
      <Text style={{ color: colors.text, textAlign: 'right', lineHeight: 24 }}>{article.description}</Text>
      <Button title={saved ? 'إزالة من المحفوظات' : 'حفظ الخبر'} disabled={saving} onPress={toggleSave} />
      {article.url ? <Button title="فتح المصدر" onPress={() => Linking.openURL(article.url)} /> : null}
    </Screen>
  );
}
