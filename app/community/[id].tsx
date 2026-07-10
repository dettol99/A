import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, Header, Screen, StateView } from '@/components/ui';
import { communityService } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
import { showAuthRequiredDialog } from '@/components/AuthRequiredDialog';
import { colors } from '@/theme/tokens';
export default function PostDetails(){ const {id}=useLocalSearchParams<{id:string}>(); const {user}=useAuth(); const [post,setPost]=useState<any>(),[error,setError]=useState<string|null>(null); const load=async()=>{const {data,error}=await communityService.getPost(id); if(error) setError(error.message); else setPost(data);}; useEffect(()=>{load();},[id]); if(error) return <Screen><StateView title={error} actionLabel="إعادة المحاولة" onAction={load}/></Screen>; if(!post) return <Screen><StateView loading title="جار التحميل" /></Screen>; return <Screen><Header title="تفاصيل المنشور" subtitle={post.profiles?.username}/><Text style={{color:colors.text,fontSize:18,textAlign:'right'}}>{post.body}</Text><Button title="إعجاب" onPress={()=>user?communityService.like(id,user.id):showAuthRequiredDialog()} /><Button title="إبلاغ" onPress={()=>user?communityService.report(user.id,id,'inappropriate'):showAuthRequiredDialog()} /></Screen> }
