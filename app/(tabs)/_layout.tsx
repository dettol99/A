import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@/theme/tokens';

const tabBarGlass = Platform.select({ web: { backdropFilter: 'blur(24px)' } as any, default: {} });

export default function TabsLayout() {
  const { t } = useTranslation();
  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: {
      position: 'absolute',
      left: 18,
      right: 18,
      bottom: 18,
      alignSelf: 'center',
      maxWidth: 424,
      height: 72,
      paddingTop: 8,
      paddingBottom: 10,
      backgroundColor: 'rgba(255,255,255,0.72)',
      borderTopWidth: 0,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.78)',
      borderRadius: 24,
      shadowColor: '#1f2937',
      shadowOpacity: 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 10,
      ...tabBarGlass,
    },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
  }}><Tabs.Screen name="index" options={{ title: t('home') }} /><Tabs.Screen name="discover" options={{ title: t('discover') }} /><Tabs.Screen name="news" options={{ title: t('news') }} /><Tabs.Screen name="community" options={{ title: t('community') }} /><Tabs.Screen name="profile" options={{ title: t('profile') }} /></Tabs>;
}
