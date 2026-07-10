import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme/tokens';
export default function TabsLayout() { const { t } = useTranslation(); return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.surface } }}><Tabs.Screen name="index" options={{ title: t('home') }} /><Tabs.Screen name="discover" options={{ title: t('discover') }} /><Tabs.Screen name="news" options={{ title: t('news') }} /><Tabs.Screen name="community" options={{ title: t('community') }} /><Tabs.Screen name="profile" options={{ title: t('profile') }} /></Tabs>; }
