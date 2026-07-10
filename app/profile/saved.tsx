import { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Header, Screen, StateView } from '@/components/ui';
import { newsService } from '@/services/newsService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';
export default function Saved(){ const {t}=useTranslation(); const {user}=useAuth(); const [items,setItems]=useState<any[]>([]),[error,setError]=useState<string|null>(null); const load=async()=>{ if(!user)return; const {data,error}=await newsService.saved(user.id); if(error) setError(error.message); else setItems((data as any[])??[]);}; useEffect(()=>{load();},[user]); if(!user) return <Screen><StateView title={t('signInRequired')} /></Screen>; return <Screen><Header title={t('savedItems')} />{error?<StateView title={error}/>:<FlatList data={items} contentContainerStyle={{gap:spacing.md}} keyExtractor={(i)=>i.news_items?.id ?? i.created_at} ListEmptyComponent={<StateView title={t('empty')} />} renderItem={({item})=><Card><Text style={{color:colors.text,textAlign:'right'}}>{item.news_items?.title}</Text></Card>} />}</Screen> }
