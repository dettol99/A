import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Card, Chip, Header, Screen, SkeletonList, StateView } from '@/components/ui';
import { showAuthRequiredDialog } from '@/components/AuthRequiredDialog';
import { communityService } from '@/services/communityService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';

export default function Community() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const { data, error } = await communityService.feed();
    if (error) setError(error.message);
    else setItems((data as any[]) ?? []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <Screen>
      <Header title={t('community')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, flexDirection: 'row-reverse' }}>{['Overwatch 2','Valorant','Call of Duty','EA FC','Fortnite','Apex Legends','Other'].map((game, index) => <Chip key={game} title={game} active={index === 1} />)}</ScrollView>
      <Card><Text style={{ color: colors.text, textAlign: 'right', fontWeight: '800' }}>غرف صوتية</Text><Text style={{ color: colors.muted, textAlign: 'right' }}>غرف الألعاب داخل المجتمع حسب اسم اللعبة.</Text></Card>
      <Button title={t('createPost')} onPress={() => user ? router.push('/community/create') : showAuthRequiredDialog()} />
      {loading ? <SkeletonList /> : error ? <StateView title={error} actionLabel={t('retry')} onAction={load} /> : (
        <FlatList
          data={items}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
          contentContainerStyle={{ gap: spacing.md }}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<StateView title={t('empty')} />}
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/community/${item.id}`)}>
              {item.image_url ? <Image source={{ uri: item.image_url }} style={{ height: 180, borderRadius: 16, backgroundColor: colors.background }} resizeMode="cover" /> : null}
              <Text style={{ color: colors.text, textAlign: 'right', fontSize: 16 }}>{item.body}</Text>
              <Text style={{ color: colors.muted, textAlign: 'right' }}>{item.author?.display_name ?? item.author?.username ?? 'مستخدم'}</Text>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
