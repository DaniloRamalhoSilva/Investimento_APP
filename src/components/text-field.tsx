import { useThemeColors, useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { radius } from '@/theme/tokens';

type Props = TextInputProps & {
  label: string;
  error?: string;
  password?: boolean;
};

export function TextField({ label, error, password = false, ...props }: Props) {
  const colors = useThemeColors();
  const styles = useThemeStyles(createStyles);
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputError]}>
        <TextInput
          {...props}
          accessibilityLabel={props.accessibilityLabel || label}
          aria-invalid={Boolean(error)}
          placeholderTextColor={colors.textSubtle}
          secureTextEntry={password && !visible}
          style={styles.input}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={8}
            onPress={() => setVisible((value) => !value)}
          >
            <Text style={styles.toggle}>{visible ? 'Ocultar' : 'Mostrar'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: { width: '100%', gap: 7 },
  label: { color: colors.text, fontSize: 13, fontWeight: '700' },
  inputRow: {
    width: '100%',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  input: { flex: 1, flexShrink: 1, minWidth: 0, minHeight: 50, paddingHorizontal: 15, color: colors.text, fontSize: 15 },
  toggle: { paddingHorizontal: 14, color: colors.brand, fontSize: 12, fontWeight: '700' },
  inputError: { borderColor: colors.urgent },
  error: { color: colors.urgent, fontSize: 12 },
});
