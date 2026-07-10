import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Field, Header, Screen, StateView } from '@/components/ui';
import { communityService } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';

type ImageSource = 'gallery' | 'url' | null;

export default function CreatePost() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [imageSource, setImageSource] = useState<ImageSource>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) return <Screen><StateView title={t('signInRequired')} /></Screen>;

  const busy = uploading || saving;
  const urlValue = imageUrl.trim();
  const previewUrl = selectedImageUri || uploadedImageUrl || urlValue;

  const resetUploadedImage = () => {
    setUploadedImageUrl('');
    setStatusMessage(null);
  };

  const pickImage = async () => {
    if (busy) return;
    setError(null);
    setStatusMessage(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('يرجى السماح بالوصول إلى مكتبة الصور لاختيار صورة.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.9,
    });

    if (result.canceled) {
      setStatusMessage('تم إلغاء اختيار الصورة.');
      return;
    }

    const asset = result.assets[0];
    if (!asset?.uri) {
      setError('تعذر قراءة الصورة المحددة.');
      return;
    }

    setSelectedImageUri(asset.uri);
    setImageSource('gallery');
    setImageUrl('');
    resetUploadedImage();
  };

  const clearImage = () => {
    setImageUrl('');
    setSelectedImageUri('');
    setImageSource(null);
    resetUploadedImage();
    setError(null);
    setStatusMessage('تمت إزالة الصورة.');
  };

  const uploadImage = async () => {
    const sourceUri = selectedImageUri || urlValue;
    if (!sourceUri) return;
    setUploading(true);
    setError(null);
    setStatusMessage(null);
    const { publicUrl, error } = await communityService.uploadPostImage(user.id, sourceUri);
    setUploading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setUploadedImageUrl(publicUrl);
    setStatusMessage('تم رفع الصورة بنجاح.');
  };

  const submit = async () => {
    setSaving(true);
    setError(null);
    setStatusMessage(null);

    let finalImageUrl = uploadedImageUrl || undefined;
    const sourceUri = selectedImageUri || urlValue;
    if (sourceUri && !finalImageUrl) {
      const { publicUrl, error } = await communityService.uploadPostImage(user.id, sourceUri);
      if (error) {
        setSaving(false);
        setError(error.message);
        return;
      }
      finalImageUrl = publicUrl;
      setUploadedImageUrl(publicUrl);
    }

    const { error } = await communityService.createPost(user.id, body.trim(), finalImageUrl);
    setSaving(false);
    if (error) setError(error.message);
    else router.back();
  };

  return (
    <Screen>
      <Header title={t('createPost')} />
      <Field value={body} onChangeText={setBody} placeholder={t('postBody')} multiline />
      <Field
        value={imageUrl}
        onChangeText={(value) => {
          setImageUrl(value);
          setSelectedImageUri('');
          setImageSource(value.trim() ? 'url' : null);
          resetUploadedImage();
        }}
        placeholder="رابط الصورة (اختياري)"
      />
      <View style={{ gap: spacing.sm }}>
        <Button title="اختيار صورة من المعرض" disabled={busy} onPress={pickImage} />
        {previewUrl ? <Button title="إزالة الصورة" disabled={busy} onPress={clearImage} /> : null}
      </View>
      {previewUrl ? <Image source={{ uri: previewUrl }} style={{ height: 220, borderRadius: 18, backgroundColor: colors.surface }} resizeMode="cover" /> : null}
      {previewUrl ? <Text style={{ color: colors.muted, textAlign: 'right', lineHeight: 22 }}>{imageSource === 'gallery' ? 'سيتم رفع صورة المعرض إلى مخزن community-images قبل النشر.' : 'سيتم رفع رابط الصورة إلى مخزن community-images قبل النشر.'}</Text> : null}
      {statusMessage ? <Text style={{ color: colors.primary, textAlign: 'right' }}>{statusMessage}</Text> : null}
      {error ? <Text style={{ color: colors.danger, textAlign: 'right' }}>{error}</Text> : null}
      <Button title={uploading ? 'جار رفع الصورة...' : 'رفع الصورة'} disabled={!previewUrl || uploading || saving || Boolean(uploadedImageUrl)} onPress={uploadImage} />
      <Button title={saving ? 'جار النشر...' : t('publish')} disabled={!body.trim() || saving || uploading} onPress={submit} />
      <Text style={{ color: colors.muted, textAlign: 'right', lineHeight: 22, marginTop: spacing.xs }}>يمكنك اختيار صورة من معرض الجهاز أو استخدام رابط صورة كبديل. في الحالتين يتم رفع الصورة عبر خدمة Supabase Storage الحالية قبل حفظ المنشور.</Text>
    </Screen>
  );
}
