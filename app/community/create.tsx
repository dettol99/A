import { useState } from 'react';
import { Image, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Field, Header, Screen, StateView } from '@/components/ui';
import { communityService } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';

export default function CreatePost() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) return <Screen><StateView title={t('signInRequired')} /></Screen>;

  const uploadImage = async () => {
    const sourceUrl = imageUrl.trim();
    if (!sourceUrl) return;
    setUploading(true);
    setError(null);
    const { publicUrl, error } = await communityService.uploadPostImage(user.id, sourceUrl);
    setUploading(false);
    if (error) setError(error.message);
    else {
      setUploadedImageUrl(publicUrl);
      setImageUrl(publicUrl);
    }
  };

  const submit = async () => {
    setSaving(true);
    setError(null);
    let finalImageUrl = uploadedImageUrl || imageUrl.trim() || undefined;
    if (imageUrl.trim() && !uploadedImageUrl) {
      const { publicUrl, error } = await communityService.uploadPostImage(user.id, imageUrl.trim());
      if (error) {
        setSaving(false);
        setError(error.message);
        return;
      }
      finalImageUrl = publicUrl;
      setUploadedImageUrl(publicUrl);
      setImageUrl(publicUrl);
    }
    const { error } = await communityService.createPost(user.id, body.trim(), finalImageUrl);
    setSaving(false);
    if (error) setError(error.message);
    else router.back();
  };

  const previewUrl = uploadedImageUrl || imageUrl.trim();

  return (
    <Screen>
      <Header title={t('createPost')} />
      <Field value={body} onChangeText={setBody} placeholder={t('postBody')} multiline />
      <Field value={imageUrl} onChangeText={(value) => { setImageUrl(value); setUploadedImageUrl(''); }} placeholder="رابط الصورة أو مسارها المحلي (اختياري)" />
      {previewUrl ? <Image source={{ uri: previewUrl }} style={{ height: 220, borderRadius: 18, backgroundColor: colors.surface }} resizeMode="cover" /> : null}
      {previewUrl ? <Text style={{ color: colors.muted, textAlign: 'right', lineHeight: 22 }}>سيتم رفع الصورة إلى مخزن community-images قبل النشر.</Text> : null}
      {uploadedImageUrl ? <Text style={{ color: colors.primary, textAlign: 'right' }}>تم رفع الصورة بنجاح.</Text> : null}
      {error ? <Text style={{ color: colors.danger, textAlign: 'right' }}>{error}</Text> : null}
      <Button title={uploading ? 'جار رفع الصورة...' : 'رفع الصورة'} disabled={!imageUrl.trim() || uploading || saving} onPress={uploadImage} />
      <Button title={saving ? 'جار النشر...' : t('publish')} disabled={!body.trim() || saving || uploading} onPress={submit} />
      <Text style={{ color: colors.muted, textAlign: 'right', lineHeight: 22, marginTop: spacing.xs }}>ملاحظة: اختيار الصور من معرض الجهاز يحتاج حزمة expo-image-picker، وتعذر تثبيتها من السجل في هذه البيئة؛ يدعم هذا النموذج رفع الرابط/المسار المتاح إلى Supabase Storage.</Text>
    </Screen>
  );
}
