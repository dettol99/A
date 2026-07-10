import { useEffect, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Card, StateView } from '@/components/ui';
import { listsService } from '@/services/listsService';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing } from '@/theme/tokens';
import type { SearchResult } from '@/types/api';

export function AddToListBottomSheet({ visible, item, onClose }: { visible: boolean; item?: SearchResult | null; onClose?: () => void }) {
  const { t } = useTranslation(); const { user } = useAuth(); const [lists, setLists] = useState<any[]>([]); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (!visible || !user) return; setLoading(true); void (async () => { const { data, error } = await listsService.myLists(user.id); if (error) setError(error.message); else setLists((data as any[]) ?? []); setLoading(false); })(); }, [visible, user]);
  const add = async (listId: string) => { if (!item) return; const persisted = await listsService.ensureMediaItem(item); if (persisted.error || !persisted.data) { setError(persisted.error?.message ?? t('configError')); return; } const { error } = await listsService.addItem(listId, (persisted.data as any).id); if (error) setError(error.message); else onClose?.(); };
  return <Modal visible={visible} transparent animationType="slide"><View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#0008' }}><View style={{ backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}><Text style={{ color: colors.text, fontSize: 22, fontWeight: '800', textAlign: 'right' }}>{t('addToList')}</Text>{loading ? <StateView loading title={t('loading')} /> : error ? <StateView title={error} /> : lists.length === 0 ? <StateView title={t('empty')} /> : lists.map((list) => <Card key={list.id} onPress={() => add(list.id)}><Text style={{ color: colors.text, textAlign: 'right' }}>{list.name}</Text></Card>)}<Button title="إغلاق" onPress={onClose} /></View></View></Modal>;
}
