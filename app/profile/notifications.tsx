import { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Header, Screen, StateView } from '@/components/ui';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';
export default function Notifications(){ const {t}=useTranslation(); const {user}=useAuth(); const [items,setItems]=useState<any[]>([]); useEffect(()=>{ if(user) profileService.notifications(user.id).then(({data})=>setItems((data as any[])??[]));},[user]); if(!user)return <Screen><StateView title={t('signInRequired')}/></Screen>; return <Screen><Header title={t('notifications')} /><FlatList data={items} contentContainerStyle={{gap:spacing.md}} keyExtractor={(i)=>i.created_at} ListEmptyComponent={<StateView title={t('empty')}/>} renderItem={({item})=><Card><Text style={{color:colors.text,textAlign:'right'}}>{item.profiles?.username ?? 'متابع جديد'}</Text></Card>} /></Screen> }
