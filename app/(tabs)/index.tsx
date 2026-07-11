import { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AddToListBottomSheet } from '@/components/AddToListBottomSheet';
import { SkeletonList, StateView } from '@/components/ui';
import { showAuthRequiredDialog } from '@/components/AuthRequiredDialog';
import { mediaService } from '@/services/mediaService';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme/tokens';
import type { SearchResult } from '@/types/api';

const POSTER_WIDTH = 104;
const POSTER_HEIGHT = 152;

function openMedia(item: SearchResult) {
  router.push({ pathname: '/media/[id]', params: { id: item.sourceId, source: item.source, mediaType: item.mediaType } });
}

function GlassButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return <Pressable onPress={onPress} style={styles.iconButton}><Text style={styles.iconText}>{label}</Text></Pressable>;
}

function SectionHeader({ title }: { title: string }) {
  return <View style={styles.sectionHeader}><Text style={styles.seeAll}>عرض الكل</Text><Text style={styles.sectionTitle}>{title}</Text></View>;
}

function PosterCard({ item, onLongPress }: { item: SearchResult; onLongPress: () => void }) {
  return <Pressable onPress={() => openMedia(item)} onLongPress={onLongPress} style={styles.posterCard}>
    {item.posterUrl ? <Image source={{ uri: item.posterUrl }} style={styles.posterImage} /> : <View style={[styles.posterImage, styles.posterFallback]} />}
    <View style={styles.posterShade} />
    <Text numberOfLines={2} style={styles.posterTitle}>{item.title}</Text>
    <Text style={styles.posterMeta}>{item.rating ? `${item.rating.toFixed(1)} ★` : item.mediaType}</Text>
  </Pressable>;
}

function mediaLabel(item: SearchResult) {
  const parts = [item.mediaType === 'movie' ? 'فيلم' : item.mediaType === 'tv' ? 'مسلسل' : item.mediaType === 'game' ? 'لعبة' : undefined, item.releaseDate ? String(item.releaseDate).slice(0, 4) : undefined].filter(Boolean);
  return parts.join(' · ');
}

function HeroCard({ item, onLongPress }: { item: SearchResult; onLongPress: () => void }) {
  const subtitle = mediaLabel(item);
  return <Pressable onPress={() => openMedia(item)} onLongPress={onLongPress} style={styles.heroCard}>
    {item.posterUrl ? <Image source={{ uri: item.posterUrl }} style={styles.heroImage} /> : <View style={[styles.heroImage, styles.posterFallback]} />}
    <View style={styles.heroOverlay} />
    <View style={styles.heroContent}>
      <Text numberOfLines={1} style={styles.heroTitle}>{item.title}</Text>
      {subtitle ? <Text numberOfLines={1} style={styles.heroSubtitle}>{subtitle}</Text> : null}
      <View style={styles.heroBottomRow}>
        <View style={styles.watchButton}><Text style={styles.playIcon}>▶</Text><Text style={styles.watchText}>شاهد الآن</Text></View>
        {item.rating ? <View style={styles.ratingPill}><Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text></View> : null}
      </View>
    </View>
  </Pressable>;
}

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<SearchResult[]>([]);
  const [pick, setPick] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = async () => { setError(null); const { data, error } = await mediaService.trending(); if (error) setError(error.message); else setItems(((data as any)?.results ?? data ?? []) as SearchResult[]); setLoading(false); setRefreshing(false); };
  useEffect(() => { load(); }, []);
  const rails = useMemo(() => ({ continue: items.slice(1, 8), newest: items.slice(8, 16).length ? items.slice(8, 16) : items.slice(0, 7) }), [items]);
  const select = (item: SearchResult) => user ? setPick(item) : showAuthRequiredDialog();

  return <View style={styles.pageShell}><View style={styles.phoneShell}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top + 14, 24), paddingBottom: Math.max(insets.bottom + 118, 132) }]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
      <View style={styles.topBar}>
        <View style={styles.brand}><View style={styles.logoMark}><Text style={styles.logoText}>M</Text></View><Text style={styles.brandText}>Medly</Text></View>
        <GlassButton label="♧" />
      </View>
      <View style={styles.searchRow}><View style={styles.searchBox}><Text style={styles.searchIcon}>⌕</Text><Text numberOfLines={1} style={styles.searchText}>{t('search')}</Text></View><GlassButton label="⌘" /></View>
      {loading ? <SkeletonList /> : error ? <StateView title={t('configError')} message={error} actionLabel={t('retry')} onAction={load} /> : items.length === 0 ? <StateView title={t('empty')} /> : <>
        <HeroCard item={items[0]} onLongPress={() => select(items[0])} />
        <SectionHeader title="تستمر المشاهدة" />
        <FlatList horizontal inverted showsHorizontalScrollIndicator={false} data={rails.continue} keyExtractor={(item) => item.id} contentContainerStyle={styles.railContent} renderItem={({ item }) => <PosterCard item={item} onLongPress={() => select(item)} />} />
        <SectionHeader title="الأفلام الجديدة" />
        <FlatList horizontal inverted showsHorizontalScrollIndicator={false} data={rails.newest} keyExtractor={(item) => item.id} contentContainerStyle={styles.railContent} renderItem={({ item }) => <PosterCard item={item} onLongPress={() => select(item)} />} />
      </>}
    </ScrollView>
    <AddToListBottomSheet visible={!!pick} item={pick} onClose={() => setPick(null)} />
  </View></View>;
}

const glassWeb = Platform.select({ web: { backdropFilter: 'blur(22px)' } as any, default: {} });

const absoluteFillObject = { position: 'absolute' as const, top: 0, right: 0, bottom: 0, left: 0 };

const styles = StyleSheet.create({
  pageShell: { flex: 1, alignItems: 'center', backgroundColor: colors.background },
  phoneShell: { flex: 1, width: '100%', maxWidth: 460, backgroundColor: colors.background, overflow: 'hidden' },
  content: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 112, gap: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8ebf1', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  logoText: { fontSize: 24, fontWeight: '900', color: '#4b5563' },
  brandText: { fontSize: 20, fontWeight: '700', color: colors.text },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.glass, borderWidth: 1, borderColor: 'rgba(255,255,255,0.72)', alignItems: 'center', justifyContent: 'center', ...glassWeb },
  iconText: { color: colors.text, fontSize: 20 },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  searchBox: { flex: 1, height: 50, borderRadius: 14, paddingHorizontal: 14, backgroundColor: colors.glass, borderWidth: 1, borderColor: 'rgba(255,255,255,0.76)', flexDirection: 'row-reverse', alignItems: 'center', gap: 10, ...glassWeb },
  searchIcon: { color: colors.text, fontSize: 22 },
  searchText: { flex: 1, color: colors.muted, fontSize: 14, textAlign: 'right' },
  heroCard: { height: 214, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.surfaceStrong, borderWidth: 1, borderColor: 'rgba(255,255,255,0.82)', shadowColor: '#1f2937', shadowOpacity: 0.18, shadowRadius: 26, shadowOffset: { width: 0, height: 14 }, elevation: 8 },
  heroImage: { ...absoluteFillObject, width: '100%', height: '100%' },
  posterFallback: { backgroundColor: '#d7dbe3' },
  heroOverlay: { ...absoluteFillObject, backgroundColor: 'rgba(2,6,23,0.34)' },
  heroContent: { flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 22, gap: 8 },
  heroTitle: { color: '#fff', fontSize: 27, fontWeight: '800', textAlign: 'right' },
  heroSubtitle: { color: 'rgba(255,255,255,0.86)', fontSize: 13, textAlign: 'right' },
  heroBottomRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  watchButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 12 },
  playIcon: { color: '#111827', fontSize: 12 },
  watchText: { color: '#111827', fontWeight: '800' },
  ratingPill: { backgroundColor: 'rgba(17,24,39,0.58)', borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8 },
  ratingText: { color: '#fff', fontWeight: '800' },
  sectionHeader: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: '800', textAlign: 'right' },
  seeAll: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  railContent: { gap: 12, paddingVertical: 2, paddingLeft: 18 },
  posterCard: { width: POSTER_WIDTH, height: POSTER_HEIGHT, borderRadius: 13, overflow: 'hidden', marginRight: 10, backgroundColor: colors.surfaceStrong, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', shadowColor: '#111827', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  posterImage: { width: '100%', height: '100%' },
  posterShade: { ...absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  posterTitle: { position: 'absolute', right: 8, left: 8, bottom: 28, color: '#fff', fontSize: 13, fontWeight: '800', textAlign: 'right' },
  posterMeta: { position: 'absolute', right: 8, bottom: 10, color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '700' },
});
