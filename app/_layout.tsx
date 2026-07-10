import 'react-native-gesture-handler';
import '@/i18n';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/theme/tokens';
import { AuthProvider } from '@/providers/AuthProvider';
export default function RootLayout() { const [fontsLoaded] = useFonts({}); if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}><ActivityIndicator /></View>; return <AuthProvider><Stack screenOptions={{ headerShown: false }} /><StatusBar style="light" /></AuthProvider>; }
