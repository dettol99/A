import { useState } from 'react';
import { Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
  const [localImageUri, setLocalImageUri] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) return <Screen><StateView title={t('signInRequired')} /></Screen>;

  const pickImage = async () => {
    setError(null);
    setStatus(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('يلزم السماح بالوصول إلى معرض الصور لاختيار صورة.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.85 });
    if (result.canceled) return;
    const uri = result.assets[0]?.uri;
    if (!uri) {
      setError('تعذر قراءة الصورة المحددة.');
      return;
    }
    setLocalImageUri(uri);
    setUploadedImageUrl('');
    setStatus('تم اختيار الصورة. سيتم رفعها عند النشر.');
  };

  const uploadSelectedImage = async () => {
    const sourceUri = localImageUri || imageUrl.trim();
    if (!sourceUri) return { publicUrl: '', error: null };
    setUploading(true);
    setError(null);
    setStatus('جار رفع الصورة...');
    const result = await communityService.uploadPostImage(user.id, sourceUri);
    setUploading(false);
    if (result.error) {
      setError(result.error.message);
      setStatus(null);
    } else {
      setUploadedImageUrl(result.publicUrl);
      setStatus('تم رفع الصورة بنجاح.');
    }
    return result;
  };

  const submit = async () => {
    setSaving(true);
    setError(null);
    let finalImageUrl = uploadedImageUrl || undefined;
    if (!finalImageUrl && (localImageUri || imageUrl.trim())) {
      const { publicUrl, error } = await uploadSelectedImage();
      if (error) {
        setSaving(false);
        return;
      }
      finalImageUrl = publicUrl || undefined;
    }
    const { error } = await communityService.createPost(user.id, body.trim(), finalImageUrl);
    setSaving(false);
    if (error) setError(error.message);
    else {
      setStatus('تم نشر المنشور بنجاح.');
      router.back();
    }
  };

  const previewUrl = uploadedImageUrl || localImageUri || imageUrl.trim();
  const busy = uploading || saving;

  return (
    <Screen>
      <Header title={t('createPost')} />
      <Field value={body} onChangeText={setBody} placeholder={t('postBody')} multiline />
      <Button title="اختيار صورة من المعرض" disabled={busy} onPress={pickImage} />
      <Field value={imageUrl} onChangeText={(value) => { setImageUrl(value); setLocalImageUri(''); setUploadedImageUrl(''); setStatus(null); }} placeholder="رابط صورة اختياري بدلاً من المعرض" />
      {previewUrl ? <Image source={{ uri: previewUrl }} style={{ height: 220, borderRadius: 18, backgroundColor: colors.surface }} resizeMode="cover" /> : null}
      {previewUrl ? <Text style={{ color: colors.muted, textAlign: 'right', lineHeight: 22 }}>سيتم رفع الصورة إلى مخزن community-images قبل النشر.</Text> : null}
      {status ? <Text style={{ color: colors.primary, textAlign: 'right' }}>{status}</Text> : null}
      {error ? <Text style={{ color: colors.danger, textAlign: 'right' }}>{error}</Text> : null}
      <Button title={uploading ? 'جار رفع الصورة...' : 'رفع الصورة'} disabled={!previewUrl || busy} onPress={uploadSelectedImage} />
      <Button title={saving ? 'جار النشر...' : t('publish')} disabled={!body.trim() || busy} onPress={submit} />
      <Text style={{ color: colors.muted, textAlign: 'right', lineHeight: 22, marginTop: spacing.xs }}>يمكنك اختيار صورة من المعرض أو إدخال رابط صورة اختياري، وسيتم تخزين الصورة المرفوعة في Supabase Storage.</Text>
    </Screen>
  );
}
