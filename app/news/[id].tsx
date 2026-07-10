import { Image, Linking, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, Header, Screen } from '@/components/ui';
import { colors } from '@/theme/tokens';
export default function NewsDetails(){ const p=useLocalSearchParams<{title:string;url:string;description:string;imageUrl:string;publishedAt:string}>(); return <Screen><Header title={p.title ?? 'الأخبار'} subtitle={p.publishedAt}/>{p.imageUrl?<Image source={{uri:p.imageUrl}} style={{height:220,borderRadius:18}}/>:null}<Text style={{color:colors.text,textAlign:'right',lineHeight:24}}>{p.description}</Text>{p.url?<Button title="فتح المصدر" onPress={()=>Linking.openURL(p.url)}/>:null}</Screen> }
