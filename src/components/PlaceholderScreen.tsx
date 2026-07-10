import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme/tokens';
export function PlaceholderScreen({ title, children }: { title: string; children?: ReactNode }) {
  return <View style={styles.container}><Text style={styles.title}>{title}</Text><Text style={styles.text}>{children ?? 'Coming soon'}</Text></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, backgroundColor: colors.background, padding: spacing.lg }, title: { color: colors.text, fontSize: 28, fontWeight: '700', textAlign: 'center' }, text: { color: colors.muted, fontSize: 16, textAlign: 'center' } });
