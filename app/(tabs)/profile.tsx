import { Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Card, Header, Screen, StateView } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme/tokens';
export default function Profile(){ const {t}=useTranslation(); const {user,signOut}=useAuth(); if(!user) return <Screen><Header title={t('profile')} /><StateView title={t('profileEmpty')} message={t('guest')} /></Screen>; return <Screen><Header title={t('profile')} subtitle={user.email ?? user.id} />{[['/lists',t('myLists')],['/profile/edit',t('editProfile')],['/profile/notifications',t('notifications')],['/profile/saved',t('savedItems')],['/profile/blocked-users',t('blockedUsers')],['/settings',t('settings')]].map(([path,label])=><Card key={path} onPress={()=>router.push(path as any)}><Text style={{color:colors.text,fontSize:17,textAlign:'right'}}>{label}</Text></Card>)}<Button title={t('logout')} onPress={signOut}/></Screen> }
