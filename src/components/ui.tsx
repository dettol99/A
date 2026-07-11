import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, shadows, spacing } from '@/theme/tokens';

export function Screen({ children, scroll = false }: { children: ReactNode; scroll?: boolean }) {
  const content = <View style={styles.inner}>{children}</View>;
  return <SafeAreaView style={styles.screen}>{scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}</SafeAreaView>;
}
export function Header({ title, subtitle, left }: { title: string; subtitle?: string; left?: ReactNode }) { return <View style={styles.header}>{left}<View style={{ flex: 1 }}><Text style={styles.title}>{title}</Text>{subtitle ? <Text style={styles.muted}>{subtitle}</Text> : null}</View></View>; }
export function StateView({ title, message, actionLabel, onAction, loading }: { title: string; message?: string; actionLabel?: string; onAction?: () => void; loading?: boolean }) { return <View style={styles.state}>{loading ? <ActivityIndicator color={colors.primary} /> : null}<Text style={styles.stateTitle}>{title}</Text>{message ? <Text style={styles.muted}>{message}</Text> : null}{actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} /> : null}</View>; }
export function Button({ title, onPress, disabled, variant = 'primary' }: { title: string; onPress?: () => void; disabled?: boolean; variant?: 'primary'|'glass' }) { return <Pressable disabled={disabled} onPress={onPress} style={[styles.button, variant === 'glass' && styles.glassButton, disabled && styles.disabled]}><Text style={[styles.buttonText, variant === 'glass' && styles.glassButtonText]}>{title}</Text></Pressable>; }
export function Card({ children, onPress, onLongPress, style }: { children: ReactNode; onPress?: () => void; onLongPress?: () => void; style?: object }) { return <Pressable onPress={onPress} onLongPress={onLongPress} style={[styles.card, style]}>{children}</Pressable>; }
export function Chip({ title, active, onPress }: { title: string; active?: boolean; onPress?: () => void }) { return <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{title}</Text></Pressable>; }
export function Field(props: { value: string; onChangeText: (v: string) => void; placeholder: string; multiline?: boolean; secureTextEntry?: boolean }) { return <TextInput {...props} placeholderTextColor={colors.muted} style={[styles.input, props.multiline && styles.multiline]} textAlign="right" />; }
export function SkeletonList() { return <View style={{ gap: spacing.md }}>{[0,1,2].map((i) => <View key={i} style={styles.skeleton} />)}</View>; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, padding: spacing.md, gap: spacing.md },
  scroll: { flexGrow: 1 },
  header: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', textAlign: 'right' },
  muted: { color: colors.muted, fontSize: 13, textAlign: 'right', lineHeight: 20 },
  state: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  stateTitle: { color: colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  button: { backgroundColor: colors.primary, borderRadius: radii.md, paddingVertical: 13, paddingHorizontal: spacing.lg, alignItems: 'center', ...shadows.card },
  glassButton: { backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border, shadowOpacity: 0.08 },
  disabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '800' },
  glassButtonText: { color: colors.text },
  card: { backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm, overflow: 'hidden', ...shadows.card },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  chipTextActive: { color: '#fff' },
  input: { minHeight: 50, borderRadius: radii.md, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border, color: colors.text, padding: spacing.md },
  multiline: { minHeight: 140, textAlignVertical: 'top' },
  skeleton: { height: 96, borderRadius: radii.lg, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border },
});
