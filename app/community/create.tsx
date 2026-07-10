import { useState } from 'react';
import { Image, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Field, Header, Screen, StateView } from '@/components/ui';
import { communityService } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme/tokens';

export default function CreatePost() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user) return <Screen><StateView title={t('signInRequired')} /></Screen>;

  const submit = async () => {
    setSaving(true);
    setError(null);
    const { error } = await communityService.createPost(user.id, body.trim(), imageUrl.trim() || undefined);
    setSaving(false);
    if (error) setError(error.message);
    else router.back();
  };

  return (
    <Screen>
      <Header title={t('createPost')} />
      <Field value={body} onChangeText={setBody} placeholder={t('postBody')} multiline />
      <Field value={imageUrl} onChangeText={setImageUrl} placeholder="رابط الصورة (اختياري)" />
      {imageUrl.trim() ? <Image source={{ uri: imageUrl.trim() }} style={{ height: 180, borderRadius: 18 }} /> : null}
      {error ? <Text style={{ color: colors.danger, textAlign: 'right' }}>{error}</Text> : null}
      <Button title={t('publish')} disabled={!body.trim() || saving} onPress={submit} />
    </Screen>
  );
}
