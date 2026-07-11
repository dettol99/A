import { useState } from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Field, Header, Screen } from '@/components/ui';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme/tokens';

export default function Onboarding() {
  const { continueAsGuest } = useAuth();
  const [mode, setMode] = useState<'signin'|'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const submit = async () => {
    setError(null);
    const { data, error } = mode === 'signin' ? await authService.signIn(email.trim(), password) : await authService.signUp(email.trim(), password);
    if (error) setError(error.message);
    else {
      if (data.user) await authService.createProfile(data.user.id, email.split('@')[0]);
      router.replace('/(tabs)/profile');
    }
  };
  return <Screen scroll><Header title={mode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب'} subtitle="تابع قوائمك ومجتمع Medly عبر حساب Supabase الحقيقي." />
    <Card><Field value={email} onChangeText={setEmail} placeholder="البريد الإلكتروني" /><Field value={password} onChangeText={setPassword} placeholder="كلمة المرور" secureTextEntry />{error ? <Text style={{ color: colors.danger, textAlign: 'right' }}>{error}</Text> : null}<Button title={mode === 'signin' ? 'دخول' : 'إنشاء الحساب'} onPress={submit} /><Button variant="glass" title={mode === 'signin' ? 'إنشاء حساب جديد' : 'لدي حساب بالفعل'} onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')} /></Card>
    <Button variant="glass" title="المتابعة كضيف" onPress={() => { continueAsGuest(); router.replace('/(tabs)'); }} />
  </Screen>;
}
