import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Chip, Header, Screen, StateView } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profileService';
import { colors, spacing } from '@/theme/tokens';
const tabs=['نظرة عامة','الوقت','الأنواع','المنصات','الأشخاص'];
export default function Profile(){ const {user,signOut}=useAuth(); const [profile,setProfile]=useState<any>(null); const [counts,setCounts]=useState({followers:0,following:0}); const [tab,setTab]=useState(tabs[0]); useEffect(()=>{if(user){profileService.get(user.id).then(({data})=>setProfile(data)); profileService.counts(user.id).then(setCounts);}},[user]); if(!user) return <Screen><Header title="ملفي الشخصي" /><StateView title="سجل الدخول لإدارة ملفك وقوائمك" actionLabel="تسجيل الدخول" onAction={()=>router.push('/auth/onboarding')} /></Screen>; return <Screen scroll>
    <View style={{height:190,borderRadius:28,overflow:'hidden',backgroundColor:colors.glass}}>{profile?.cover_url?<Image source={{uri:profile.cover_url}} style={{height:'100%',width:'100%'}}/>:<View style={{flex:1,backgroundColor:'#d9dee8'}}/>}<Button variant="glass" title="تعديل الغلاف" onPress={()=>router.push('/profile/edit')} /></View>
    <View style={{marginTop:-42,alignItems:'flex-end',gap:spacing.sm}}><Image source={profile?.avatar_url?{uri:profile.avatar_url}:undefined as any} style={{width:88,height:88,borderRadius:44,backgroundColor:'#111',borderWidth:3,borderColor:'#fff'}}/><Text style={{color:colors.text,fontSize:22,fontWeight:'900'}}>{profile?.display_name ?? 'عزيز'}</Text><Text style={{color:colors.muted}}>@{profile?.username ?? user.email?.split('@')[0]}</Text><View style={{flexDirection:'row-reverse',gap:spacing.sm}}><Chip title="عضو" active/><Text style={{color:colors.muted}}>{counts.followers} متابع</Text><Text style={{color:colors.muted}}>{counts.following} متابعة</Text></View></View>
    <View style={{flexDirection:'row-reverse',gap:spacing.sm,flexWrap:'wrap'}}>{tabs.map(x=><Chip key={x} title={x} active={tab===x} onPress={()=>setTab(x)}/>)}</View>
    <View style={{flexDirection:'row-reverse',gap:spacing.sm}}>{[['0','وقت المشاهدة'],['—','متوسط التقييم'],['0','المتابعات']].map(([n,l])=><Card key={l} style={{flex:1,alignItems:'center'}}><Text style={{fontSize:24,fontWeight:'900',color:colors.text}}>{n}</Text><Text style={{color:colors.muted}}>{l}</Text></Card>)}</View>
    <Card><Text style={{textAlign:'right',color:colors.text,fontWeight:'800'}}>أفلام 0 · مسلسلات 0 · ألعاب 0</Text><Text style={{textAlign:'right',color:colors.muted}}>قسم الألعاب نشط ومتاح ضمن الإحصاءات والقوائم.</Text></Card>
    {[['/lists','قوائمي'],['/profile/saved','العناصر المحفوظة'],['/settings','الإعدادات']].map(([path,label])=><Card key={path} onPress={()=>router.push(path as any)}><Text style={{color:colors.text,fontSize:17,textAlign:'right'}}>{label}</Text></Card>)}
    <Button variant="glass" title="تسجيل الخروج" onPress={signOut}/>
  </Screen> }
