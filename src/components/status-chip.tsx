import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/theme/tokens';
import type { Classification, Impact } from '@/types/domain';
import { humanizeCode } from '@/utils/format';

type Status = Classification | Impact | null | undefined;

export function statusColor(status: Status) {
  if (status === 'URGENTE' || status === 'NEGATIVO') return colors.urgent;
  if (status === 'RELEVANTE' || status === 'INCERTO') return colors.warning;
  if (status === 'POSITIVO') return colors.positive;
  return colors.brand;
}

export function StatusChip({ status }: { status: Status }) {
  const color = statusColor(status);
  return (
    <View style={[styles.chip, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{humanizeCode(status || 'SEM_RELEVANCIA')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundElevated,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
});
