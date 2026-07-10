import { useEffect, useState } from 'react';
import { Image, Linking, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, Header, Screen } from '@/components/ui';
import { showAuthRequiredDialog } from '@/components/AuthRequiredDialog';
import { useAuth } from '@/hooks/useAuth';
import { newsService } from '@/services/newsService';
import { colors } from '@/theme/tokens';

export default function NewsDetails() {
  const params = useLocalSearchParams<{ id: string; title: string; url: string; description: string; imageUrl: string; publishedAt: string }>();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !params.id) return;
    newsService.isSaved(user.id, params.id).then(({ data }) => setSaved(Boolean(data)));
  }, [params.id, user]);

  const toggleSave = async () => {
    if (!user) return showAuthRequiredDialog();
    setSaving(true);
    const { error } = saved ? await newsService.unsave(user.id, params.id) : await newsService.save(user.id, params.id);
    setSaving(false);
    if (!error) setSaved((current) => !current);
  };

  return (
    <Screen>
      <Header title={params.title ?? 'الأخبار'} subtitle={params.publishedAt} />
      {params.imageUrl ? <Image source={{ uri: params.imageUrl }} style={{ height: 220, borderRadius: 18 }} /> : null}
      <Text style={{ color: colors.text, textAlign: 'right', lineHeight: 24 }}>{params.description}</Text>
      <Button title={saved ? 'إزالة من المحفوظات' : 'حفظ الخبر'} disabled={saving} onPress={toggleSave} />
      {params.url ? <Button title="فتح المصدر" onPress={() => Linking.openURL(params.url)} /> : null}
    </Screen>
  );
}
