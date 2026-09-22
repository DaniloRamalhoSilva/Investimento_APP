import { useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { AuthShell } from '@/components/auth-shell';
import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { useSession } from '@/features/auth/session-context';
import { apiMessage } from '@/services/api';
import { spacing } from '@/theme/tokens';

export default function LoginScreen() {
  const styles = useThemeStyles(createStyles);
  const { login, loginWithGoogle } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'password' | 'google' | null>(null);

  async function submit() {
    if (!/^\S+@\S+\.\S+$/.test(email.trim()) || !password) {
      setError('Informe um e-mail válido e sua senha.');
      return;
    }
    setLoading('password');
    setError(null);
    try {
      await login({ email, senha: password });
    } catch (reason) {
      setError(apiMessage(reason));
    } finally {
      setLoading(null);
    }
  }

  async function google() {
    setLoading('google');
    setError(null);
    try {
      await loginWithGoogle();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : apiMessage(reason));
    } finally {
      setLoading(null);
    }
  }

  return (
    <AuthShell title="Bem-vindo de volta" subtitle="Entre para descobrir rapidamente se sua carteira precisa de atenção.">
      <View style={styles.form}>
        <TextField label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <TextField label="Senha" value={password} onChangeText={setPassword} password autoComplete="current-password" />
        <Text style={styles.forgot} onPress={() => Alert.alert('Recuperação de senha', 'Este recurso depende de um endpoint que ainda não está disponível na API Sentinela.')} accessibilityRole="button">
          Esqueci minha senha
        </Text>
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
        <Button onPress={submit} loading={loading === 'password'} disabled={Boolean(loading)}>Entrar</Button>
        <View style={styles.divider}><View style={styles.line} /><Text style={styles.or}>ou</Text><View style={styles.line} /></View>
        <Button variant="secondary" onPress={google} loading={loading === 'google'} disabled={Boolean(loading)}>Continuar com Google</Button>
        <Text style={styles.footer}>Ainda não possui conta? <Link href="/(auth)/register" style={styles.link}>Criar conta</Link></Text>
      </View>
    </AuthShell>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  form: { gap: spacing.lg },
  forgot: { alignSelf: 'flex-end', color: colors.brand, fontSize: 13, fontWeight: '700' },
  error: { color: colors.urgent, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { color: colors.textSubtle, fontSize: 12 },
  footer: { color: colors.textSecondary, textAlign: 'center', fontSize: 14 },
  link: { color: colors.brand, fontWeight: '800' },
});
