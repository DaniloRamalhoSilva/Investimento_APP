import { useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import { Image, StyleSheet, Text, View } from 'react-native';


export function Brand({ compact = false }: { compact?: boolean }) {
  const styles = useThemeStyles(createStyles);
  return (
    <View style={styles.row} accessibilityRole="header">
      <Image
        source={require('@/assets/images/sentinela-icon.png')}
        style={[styles.mark, compact && styles.markCompact]}
        accessibilityLabel="Símbolo do Sentinela"
      />
      <Text style={[styles.name, compact && styles.nameCompact]}>Sentinela</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  mark: { width: 42, height: 42, borderRadius: 12 },
  markCompact: { width: 30, height: 30 },
  name: { color: colors.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  nameCompact: { fontSize: 17 },
});
