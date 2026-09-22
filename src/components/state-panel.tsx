import { useThemeColors, useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { spacing } from '@/theme/tokens';

type Props = {
  title?: string;
  message?: string;
  loading?: boolean;
  onRetry?: () => void;
};

export function StatePanel({ title, message, loading = false, onRetry }: Props) {
  const colors = useThemeColors();
  const styles = useThemeStyles(createStyles);
  return (
    <View style={styles.container} accessibilityRole={loading ? 'progressbar' : 'summary'}>
      {loading ? <ActivityIndicator color={colors.brand} size="large" /> : <View style={styles.signal} />}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? <Button variant="secondary" onPress={onRetry}>Tentar novamente</Button> : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, minHeight: 260, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  signal: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.brand },
  title: { color: colors.text, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  message: { maxWidth: 300, color: colors.textSecondary, fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
