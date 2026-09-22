import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from 'react-native';

import { useSession } from '@/features/auth/session-context';
import { apiMessage } from '@/services/api';
import { useThemeColors, useThemeStyles } from '@/theme/theme-context';
import { radius } from '@/theme/tokens';
import type { ThemeColors } from '@/theme/tokens';

export function ThemeToggle() {
  const colors = useThemeColors();
  const styles = useThemeStyles(createStyles);
  const { user, updateTheme } = useSession();
  const [saving, setSaving] = useState(false);
  const isDark = user?.tema !== 'light';

  async function toggleTheme() {
    if (saving) return;
    setSaving(true);
    try {
      await updateTheme(isDark ? 'light' : 'dark');
    } catch (error) {
      Alert.alert('Não foi possível salvar o tema', apiMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      accessibilityState={{ disabled: saving, busy: saving }}
      disabled={saving}
      onPress={() => void toggleTheme()}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {saving ? <ActivityIndicator color={colors.brand} size="small" /> : (
        <Text style={styles.icon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {isDark ? '☀' : '☾'}
        </Text>
      )}
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  button: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.sm, backgroundColor: colors.surfaceRaised },
  icon: { color: colors.brand, fontSize: 25, lineHeight: 30, textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
