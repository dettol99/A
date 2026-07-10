import { useCallback, useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Card, Header, Screen, StateView } from '@/components/ui';
import { listsService } from '@/services/listsService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';

const nextStatus = (status: string) => status === 'planned' ? 'in_progress' : status === 'in_progress' ? 'completed' : 'planned';

export default function MyLists() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setError(null);
    const { data, error } = await listsService.myLists(user.id);
    if (error) setError(error.message);
    else setItems((data as any[]) ?? []);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) return <Screen><StateView title={t('signInRequired')} /></Screen>;

  const updateItem = async (item: any, values: { progress?: number; status?: string }) => {
    const { error } = await listsService.updateProgress(item.id, values.progress ?? item.progress ?? 0, values.status);
    if (error) setError(error.message);
    else load();
  };

  return (
    <Screen>
      <Header title={t('myLists')} />
      {error ? <StateView title={error} actionLabel={t('retry')} onAction={load} /> : (
        <FlatList
          data={items}
          contentContainerStyle={{ gap: spacing.md }}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<StateView title={t('empty')} />}
          renderItem={({ item }) => (
            <Card>
              <Text style={{ color: colors.text, textAlign: 'right', fontWeight: '800', fontSize: 18 }}>{item.name}</Text>
              <Text style={{ color: colors.muted, textAlign: 'right' }}>{item.list_items?.length ?? 0} عناصر</Text>
              {(item.list_items ?? []).map((listItem: any) => (
                <Card key={listItem.id}>
                  <Text style={{ color: colors.text, textAlign: 'right', fontWeight: '800' }}>{listItem.media_items?.title ?? 'عنصر'}</Text>
                  <Text style={{ color: colors.muted, textAlign: 'right' }}>الحالة: {listItem.status} — التقدم: {listItem.progress ?? 0}</Text>
                  <Button title="تغيير الحالة" onPress={() => updateItem(listItem, { status: nextStatus(listItem.status) })} />
                  <Button title="زيادة التقدم" onPress={() => updateItem(listItem, { progress: (listItem.progress ?? 0) + 1 })} />
                  <Button title="حذف من القائمة" onPress={async () => { await listsService.removeItem(listItem.id); load(); }} />
                </Card>
              ))}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
