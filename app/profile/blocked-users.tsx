import { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Header, Screen, StateView } from '@/components/ui';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';
export default function Blocked(){ const {t}=useTranslation(); const {user}=useAuth(); const [items,setItems]=useState<any[]>([]); useEffect(()=>{ if(user) profileService.blocked(user.id).then(({data})=>setItems((data as any[])??[]));},[user]); if(!user)return <Screen><StateView title={t('signInRequired')}/></Screen>; return <Screen><Header title={t('blockedUsers')} /><FlatList data={items} contentContainerStyle={{gap:spacing.md}} keyExtractor={(i)=>i.profiles?.id ?? i.created_at} ListEmptyComponent={<StateView title={t('empty')}/>} renderItem={({item})=><Card><Text style={{color:colors.text,textAlign:'right'}}>{item.profiles?.username ?? item.profiles?.id}</Text></Card>} /></Screen> }
