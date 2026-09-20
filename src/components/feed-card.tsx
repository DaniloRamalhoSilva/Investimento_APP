import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusChip } from '@/components/status-chip';
import { colors, radius, spacing } from '@/theme/tokens';
import type { FeedItem } from '@/types/domain';
import { formatDate, humanizeCode } from '@/utils/format';

export function FeedCard({ item, onPress }: { item: FeedItem; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir análise de ${item.ticker}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <Text style={styles.ticker}>{item.ticker}</Text>
        <StatusChip status={item.classificacao} />
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.titulo || 'Nova análise disponível'}</Text>
      <Text style={styles.summary} numberOfLines={3}>{item.resumo}</Text>
      <View style={styles.bottomRow}>
        <Text style={styles.meta}>{humanizeCode(item.impacto)}</Text>
        <Text style={styles.meta}>{formatDate(item.ocorreuEm)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface },
  pressed: { opacity: 0.85, transform: [{ scale: 0.992 }] },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  ticker: { color: colors.brand, fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  title: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: '800' },
  summary: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  meta: { color: colors.textSubtle, fontSize: 11, fontWeight: '600' },
});
