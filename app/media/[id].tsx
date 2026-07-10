import { useEffect, useState } from 'react';
import { Image, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AddToListBottomSheet } from '@/components/AddToListBottomSheet';
import { Button, Header, Screen, StateView } from '@/components/ui';
import { showAuthRequiredDialog } from '@/components/AuthRequiredDialog';
import { mediaService } from '@/services/mediaService';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme/tokens';
import type { MediaType } from '@/types/database';
export default function MediaDetails(){ const {t}=useTranslation(); const {user}=useAuth(); const p=useLocalSearchParams<{id:string;source:string;mediaType:MediaType}>(); const [item,setItem]=useState<any>(),[error,setError]=useState<string|null>(null),[sheet,setSheet]=useState(false); const load=async()=>{const {data,error}=await mediaService.details({source:p.source ?? 'tmdb',sourceId:p.id,mediaType:p.mediaType ?? 'movie'}); if(error) setError(error.message); else setItem((data as any)?.item ?? data);}; useEffect(()=>{load();},[p.id]); if(error) return <Screen><StateView title={t('configError')} message={error} actionLabel={t('retry')} onAction={load}/></Screen>; if(!item) return <Screen><StateView loading title={t('loading')} /></Screen>; const listItem={id:item.id ?? p.id,source:item.source ?? p.source,sourceId:item.sourceId ?? p.id,mediaType:item.mediaType ?? p.mediaType,title:item.title,posterUrl:item.posterUrl,overview:item.overview,releaseDate:item.releaseDate}; return <Screen><Header title={item.title} subtitle={item.releaseDate}/>{item.posterUrl?<Image source={{uri:item.posterUrl}} style={{height:260,borderRadius:18}}/>:null}<Text style={{color:colors.text,textAlign:'right',lineHeight:24}}>{item.overview}</Text><Button title={t('addToList')} onPress={()=>user?setSheet(true):showAuthRequiredDialog()} /><AddToListBottomSheet visible={sheet} item={listItem} onClose={()=>setSheet(false)} /></Screen> }
