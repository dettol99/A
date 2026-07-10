import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AddToListBottomSheet } from '@/components/AddToListBottomSheet';
import { Card, Header, Screen, SkeletonList, StateView } from '@/components/ui';
import { showAuthRequiredDialog } from '@/components/AuthRequiredDialog';
import { mediaService } from '@/services/mediaService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';
import type { SearchResult } from '@/types/api';
export default function Home() { const { t } = useTranslation(); const { user } = useAuth(); const [items,setItems]=useState<SearchResult[]>([]); const [pick,setPick]=useState<SearchResult|null>(null); const [loading,setLoading]=useState(true); const [refreshing,setRefreshing]=useState(false); const [error,setError]=useState<string|null>(null); const load=async()=>{setError(null); const {data,error}=await mediaService.trending(); if(error) setError(error.message); else setItems(((data as any)?.results ?? data ?? []) as SearchResult[]); setLoading(false); setRefreshing(false);}; useEffect(()=>{load();},[]); return <Screen><Header title={t('home')} subtitle={t('moviesTv')} />{loading?<SkeletonList/>:error?<StateView title={t('configError')} message={error} actionLabel={t('retry')} onAction={load}/>:<FlatList data={items} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load();}} />} contentContainerStyle={{ gap: spacing.md }} keyExtractor={(i)=>i.id} ListEmptyComponent={<StateView title={t('empty')} />} renderItem={({item})=><Card onPress={()=>router.push({ pathname:'/media/[id]', params:{ id:item.sourceId, source:item.source, mediaType:item.mediaType }})} onLongPress={()=> user?setPick(item):showAuthRequiredDialog()}>{item.posterUrl?<Image source={{uri:item.posterUrl}} style={{height:180,borderRadius:14}}/>:null}<Text style={{color:colors.text,fontSize:18,fontWeight:'700',textAlign:'right'}}>{item.title}</Text><Text style={{color:colors.muted,textAlign:'right'}}>{item.mediaType}</Text></Card>} /> }<AddToListBottomSheet visible={!!pick} item={pick} onClose={()=>setPick(null)} /></Screen>; }
