import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/components/brand';
import { colors, spacing, typography } from '@/theme/tokens';

type Props = PropsWithChildren<{ title: string; subtitle: string }>;

export function AuthShell({ title, subtitle, children }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.glow} />
          <View style={styles.panel}>
            <Brand />
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>MENOS BARULHO. MAIS SINAL.</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl, overflow: 'hidden' },
  panel: { maxWidth: 440, alignSelf: 'stretch', marginHorizontal: 'auto', gap: spacing.xxxl },
  glow: { position: 'absolute', top: -110, right: -100, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(44,224,189,0.08)' },
  heading: { gap: spacing.sm },
  eyebrow: { color: colors.brand, fontSize: 11, fontWeight: '900', letterSpacing: 1.8 },
  title: { ...typography.title, color: colors.text },
  subtitle: { maxWidth: 350, color: colors.textSecondary, fontSize: 15, lineHeight: 22 },
});
