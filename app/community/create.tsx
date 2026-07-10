import { useState } from 'react';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Field, Header, Screen, StateView } from '@/components/ui';
import { communityService } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
export default function CreatePost(){ const {t}=useTranslation(); const {user}=useAuth(); const [body,setBody]=useState(''),[error,setError]=useState<string|null>(null),[saving,setSaving]=useState(false); if(!user) return <Screen><StateView title={t('signInRequired')} /></Screen>; const submit=async()=>{setSaving(true); const {error}=await communityService.createPost(user.id,body); setSaving(false); if(error) setError(error.message); else router.back();}; return <Screen><Header title={t('createPost')} /><Field value={body} onChangeText={setBody} placeholder={t('postBody')} multiline />{error?<StateView title={error}/>:null}<Button title={t('publish')} disabled={!body.trim()||saving} onPress={submit}/></Screen> }
