import { useCallback, useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Card, Header, Screen, StateView } from '@/components/ui';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';

export default function Blocked() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setError(null);
    const { data, error } = await profileService.blocked(user.id);
    if (error) setError(error.message);
    else setItems((data as any[]) ?? []);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) return <Screen><StateView title={t('signInRequired')} /></Screen>;

  return (
    <Screen>
      <Header title={t('blockedUsers')} />
      {error ? <StateView title={error} actionLabel={t('retry')} onAction={load} /> : (
        <FlatList
          data={items}
          contentContainerStyle={{ gap: spacing.md }}
          keyExtractor={(item) => item.profiles?.id ?? item.created_at}
          ListEmptyComponent={<StateView title={t('empty')} />}
          renderItem={({ item }) => (
            <Card>
              <Text style={{ color: colors.text, textAlign: 'right' }}>{item.profiles?.username ?? item.profiles?.id}</Text>
              <Button title="إلغاء الحظر" onPress={async () => { await profileService.unblock(user.id, item.profiles.id); load(); }} />
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
