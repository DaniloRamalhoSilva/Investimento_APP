import { useThemeColors, useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { radius } from '@/theme/tokens';

type Props = PropsWithChildren<{
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  accessibilityLabel?: string;
}>;

export function Button({
  children,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  accessibilityLabel,
}: Props) {
  const colors = useThemeColors();
  const styles = useThemeStyles(createStyles);
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.brandInk : colors.text} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{children}</Text>
      )}
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  primary: { backgroundColor: colors.brand, borderColor: colors.brand },
  secondary: { backgroundColor: colors.surfaceRaised, borderColor: colors.borderStrong },
  danger: { backgroundColor: colors.surfaceRaised, borderColor: colors.urgent },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  label: { fontSize: 15, fontWeight: '800' },
  primaryLabel: { color: colors.brandInk },
  secondaryLabel: { color: colors.text },
  dangerLabel: { color: colors.urgent },
  ghostLabel: { color: colors.brand },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
});
