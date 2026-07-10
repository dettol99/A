import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Header, Screen, StateView } from '@/components/ui';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/hooks/useAuth';
export default function Settings(){ const {t}=useTranslation(); const {user,signOut}=useAuth(); if(!user)return <Screen><StateView title={t('signInRequired')}/></Screen>; return <Screen><Header title={t('settings')} /><Button title={t('logout')} onPress={signOut}/><Button title={t('deleteAccount')} onPress={async()=>{ const {error}=await profileService.deleteAccount(); if(error) Alert.alert('خطأ', error.message); else signOut(); }} /></Screen> }
