import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { Button, Header, Screen, StateView } from '@/components/ui';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/hooks/useAuth';
import { showAuthRequiredDialog } from '@/components/AuthRequiredDialog';
import { colors } from '@/theme/tokens';
export default function OtherUserProfile(){ const {id}=useLocalSearchParams<{id:string}>(); const {user}=useAuth(); const [profile,setProfile]=useState<any>(),[error,setError]=useState<string|null>(null); const load=async()=>{const {data,error}=await profileService.get(id); if(error) setError(error.message); else setProfile(data);}; useEffect(()=>{load();},[id]); if(error)return <Screen><StateView title={error} actionLabel="إعادة المحاولة" onAction={load}/></Screen>; if(!profile)return <Screen><StateView loading title="جار التحميل"/></Screen>; return <Screen><Header title={profile.display_name ?? profile.username ?? 'ملف'} subtitle={profile.username}/><Text style={{color:colors.muted,textAlign:'right'}}>{profile.id}</Text><Button title="متابعة" onPress={()=>user?profileService.follow(user.id,id):showAuthRequiredDialog()}/><Button title="حظر" onPress={()=>user?profileService.block(user.id,id):showAuthRequiredDialog()}/></Screen> }
