export const colors = {
  background: '#eef0f5',
  surface: 'rgba(255,255,255,0.72)',
  surfaceStrong: '#ffffff',
  glass: 'rgba(255,255,255,0.58)',
  primary: '#7962e8',
  accent: '#7962e8',
  text: '#111827',
  muted: '#7b8190',
  border: 'rgba(17,24,39,0.08)',
  shadow: 'rgba(31,41,55,0.14)',
  danger: '#ef4444',
} as const;
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radii = { sm: 10, md: 18, lg: 28, xl: 34 } as const;
export const typography = { regular: 'System', medium: 'System', bold: 'System' } as const;
export const shadows = { card: { shadowColor: colors.shadow, shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 6 } } as const;
