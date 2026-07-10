import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Header, Screen, StateView } from '@/components/ui';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  if (!user) return <Screen><StateView title={t('signInRequired')} /></Screen>;

  const confirmSignOut = () => Alert.alert(t('logout'), 'هل تريد تسجيل الخروج؟', [
    { text: 'إلغاء', style: 'cancel' },
    { text: t('logout'), style: 'destructive', onPress: signOut },
  ]);

  const confirmDelete = () => Alert.alert(t('deleteAccount'), 'سيتم حذف الحساب نهائياً. هل أنت متأكد؟', [
    { text: 'إلغاء', style: 'cancel' },
    {
      text: t('deleteAccount'),
      style: 'destructive',
      onPress: async () => {
        const { error } = await profileService.deleteAccount();
        if (error) Alert.alert('خطأ', error.message);
        else signOut();
      },
    },
  ]);

  return <Screen><Header title={t('settings')} /><Button title={t('logout')} onPress={confirmSignOut} /><Button title={t('deleteAccount')} onPress={confirmDelete} /></Screen>;
}
