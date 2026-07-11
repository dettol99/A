import { Tabs } from 'expo-router';
import { ColorValue, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/tokens';

const tabBarGlass = Platform.select({ web: { backdropFilter: 'blur(24px)' } as any, default: {} });
const tabs = {
  index: ['⌂', 'الرئيسية'],
  discover: ['⌕', 'بحث'],
  news: ['▤', 'الأخبار'],
  community: ['♟', 'المجتمع'],
  profile: ['◉', 'ملفي الشخصي'],
} as const;
function TabIcon({ name, color, focused }: { name: keyof typeof tabs; color: ColorValue; focused: boolean }) { return <Text style={{ color, fontSize: focused ? 25 : 23, lineHeight: 27 }}>{tabs[name][0]}</Text>; }
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: {
      position: 'absolute', left: 16, right: 16, alignSelf: 'center', bottom: Math.max(insets.bottom, 12),
      maxWidth: 424, height: 74 + Math.min(insets.bottom, 10), paddingTop: 8, paddingBottom: 10,
      backgroundColor: 'rgba(255,255,255,0.76)', borderTopWidth: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.86)', borderRadius: 25,
      shadowColor: '#1f2937', shadowOpacity: 0.12, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 10, ...tabBarGlass,
    },
    tabBarItemStyle: { minWidth: 70 },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '800', writingDirection: 'rtl' },
  }}>
    <Tabs.Screen name="index" options={{ title: tabs.index[1], tabBarIcon: (props) => <TabIcon name="index" {...props} /> }} />
    <Tabs.Screen name="discover" options={{ title: tabs.discover[1], tabBarIcon: (props) => <TabIcon name="discover" {...props} /> }} />
    <Tabs.Screen name="news" options={{ title: tabs.news[1], tabBarIcon: (props) => <TabIcon name="news" {...props} /> }} />
    <Tabs.Screen name="community" options={{ title: tabs.community[1], tabBarIcon: (props) => <TabIcon name="community" {...props} /> }} />
    <Tabs.Screen name="profile" options={{ title: tabs.profile[1], tabBarIcon: (props) => <TabIcon name="profile" {...props} /> }} />
  </Tabs>;
}
