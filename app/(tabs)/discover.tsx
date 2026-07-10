import { useState } from 'react';
import { FlatList, Image, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AddToListBottomSheet } from '@/components/AddToListBottomSheet';
import { Card, Field, Header, Screen, StateView } from '@/components/ui';
import { showAuthRequiredDialog } from '@/components/AuthRequiredDialog';
import { mediaService } from '@/services/mediaService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';
import type { SearchResult } from '@/types/api';
export default function Discover(){ const {t}=useTranslation(); const {user}=useAuth(); const [query,setQuery]=useState(''),[items,setItems]=useState<SearchResult[]>([]),[loading,setLoading]=useState(false),[error,setError]=useState<string|null>(null),[pick,setPick]=useState<SearchResult|null>(null); const search=async(q:string)=>{setQuery(q); if(q.trim().length<2){setItems([]);return;} setLoading(true); setError(null); const {data,error}=await mediaService.search({query:q}); if(error) setError(error.message); else setItems(((data as any)?.results ?? data ?? []) as SearchResult[]); setLoading(false);}; return <Screen><Header title={t('discover')} /><Field value={query} onChangeText={search} placeholder={t('search')} />{loading?<StateView loading title={t('loading')} />:error?<StateView title={t('configError')} message={error}/>:<FlatList data={items} contentContainerStyle={{gap:spacing.md}} keyExtractor={(i)=>i.id} ListEmptyComponent={query.length>1?<StateView title={t('empty')} />:null} renderItem={({item})=><Card onPress={()=>router.push({pathname:'/media/[id]',params:{id:item.sourceId,source:item.source,mediaType:item.mediaType}})} onLongPress={()=>user?setPick(item):showAuthRequiredDialog()}>{item.posterUrl?<Image source={{uri:item.posterUrl}} style={{height:160,borderRadius:14}}/>:null}<Text style={{color:colors.text,fontWeight:'800',textAlign:'right'}}>{item.title}</Text><Text style={{color:colors.muted,textAlign:'right'}}>{item.mediaType}</Text></Card>} />}<AddToListBottomSheet visible={!!pick} item={pick} onClose={()=>setPick(null)} /></Screen> }
