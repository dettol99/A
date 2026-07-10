import { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Header, Screen, StateView } from '@/components/ui';
import { listsService } from '@/services/listsService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';
export default function MyLists(){ const {t}=useTranslation(); const {user}=useAuth(); const [items,setItems]=useState<any[]>([]),[error,setError]=useState<string|null>(null); const load=async()=>{ if(!user)return; const {data,error}=await listsService.myLists(user.id); if(error) setError(error.message); else setItems((data as any[])??[]);}; useEffect(()=>{load();},[user]); if(!user) return <Screen><StateView title={t('signInRequired')} /></Screen>; return <Screen><Header title={t('myLists')} />{error?<StateView title={error} actionLabel={t('retry')} onAction={load}/>:<FlatList data={items} contentContainerStyle={{gap:spacing.md}} keyExtractor={(i)=>i.id} ListEmptyComponent={<StateView title={t('empty')} />} renderItem={({item})=><Card><Text style={{color:colors.text,textAlign:'right',fontWeight:'800'}}>{item.name}</Text><Text style={{color:colors.muted,textAlign:'right'}}>{item.list_items?.length ?? 0} عناصر</Text></Card>} />}</Screen> }
