import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Field, Header, Screen, StateView } from '@/components/ui';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/hooks/useAuth';
export default function EditProfile(){ const {t}=useTranslation(); const {user}=useAuth(); const [name,setName]=useState(''),[username,setUsername]=useState(''),[error,setError]=useState<string|null>(null); useEffect(()=>{ if(user) profileService.get(user.id).then(({data})=>{setName((data as any)?.display_name??'');setUsername((data as any)?.username??'');});},[user]); if(!user) return <Screen><StateView title={t('signInRequired')} /></Screen>; const save=async()=>{const {error}=await profileService.update(user.id,{display_name:name,username}); if(error) setError(error.message); else router.back();}; return <Screen><Header title={t('editProfile')} /><Field value={name} onChangeText={setName} placeholder="الاسم"/><Field value={username} onChangeText={setUsername} placeholder="اسم المستخدم"/>{error?<StateView title={error}/>:null}<Button title={t('save')} onPress={save}/></Screen> }
