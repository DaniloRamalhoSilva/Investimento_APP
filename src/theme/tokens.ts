export const colors = {
  background: '#061018',
  backgroundElevated: '#081720',
  surface: '#0C1B26',
  surfaceRaised: '#112633',
  brand: '#2CE0BD',
  brandStrong: '#12B99A',
  brandInk: '#03251F',
  text: '#F5F7FA',
  textSecondary: '#9CAEBB',
  textSubtle: '#6F8592',
  border: '#203743',
  borderStrong: '#31505E',
  positive: '#2DD4A8',
  warning: '#F2B84B',
  urgent: '#FF6678',
  info: '#6CB9FF',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800' as const },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const },
  subheading: { fontSize: 16, lineHeight: 22, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '500' as const },
} as const;
