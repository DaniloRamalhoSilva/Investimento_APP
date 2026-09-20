import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { AuthShell } from '@/components/auth-shell';
import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { useSession } from '@/features/auth/session-context';
import { apiMessage } from '@/services/api';
import { colors, spacing } from '@/theme/tokens';

export default function RegisterScreen() {
  const { register, loginWithGoogle } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'register' | 'google' | null>(null);

  function validate() {
    if (name.trim().length < 2) return 'Informe seu nome.';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Informe um e-mail válido.';
    if (password.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    if (password !== confirmation) return 'As senhas não coincidem.';
    return null;
  }

  async function submit() {
    const validation = validate();
    if (validation) return setError(validation);
    setLoading('register');
    setError(null);
    try {
      await register({ nome: name, email, senha: password });
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
    <AuthShell title="Crie sua conta" subtitle="Comece com poucos ativos. O Sentinela cuida do que merece sua atenção.">
      <View style={styles.form}>
        <TextField label="Nome" value={name} onChangeText={setName} autoComplete="name" />
        <TextField label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <TextField label="Senha" value={password} onChangeText={setPassword} password autoComplete="new-password" />
        <TextField label="Confirmar senha" value={confirmation} onChangeText={setConfirmation} password autoComplete="new-password" />
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
        <Button onPress={submit} loading={loading === 'register'} disabled={Boolean(loading)}>Criar conta</Button>
        <View style={styles.divider}><View style={styles.line} /><Text style={styles.or}>ou</Text><View style={styles.line} /></View>
        <Button variant="secondary" onPress={google} loading={loading === 'google'} disabled={Boolean(loading)}>Continuar com Google</Button>
        <Text style={styles.footer}>Já possui uma conta? <Link href="/(auth)/login" style={styles.link}>Entrar</Link></Text>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  error: { color: colors.urgent, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { color: colors.textSubtle, fontSize: 12 },
  footer: { color: colors.textSecondary, textAlign: 'center', fontSize: 14 },
  link: { color: colors.brand, fontWeight: '800' },
});
