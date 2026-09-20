import { Alert, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/components/brand';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useSession } from '@/features/auth/session-context';
import { apiMessage } from '@/services/api';
import { colors, spacing, typography } from '@/theme/tokens';

export default function ProfileScreen() {
  const { user, logout, deleteAccount } = useSession();

  function confirmDelete() {
    Alert.alert(
      'Excluir conta permanentemente?',
      'Seu acesso será encerrado e seus dados pessoais serão anonimizados. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir minha conta', style: 'destructive', onPress: async () => {
            try {
              await deleteAccount();
            } catch (error) {
              Alert.alert('Não foi possível excluir', apiMessage(error));
            }
          },
        },
      ],
    );
  }

  return (
    <Screen>
      <View style={styles.header}><Brand compact /></View>
      <Text style={styles.eyebrow}>SUA CONTA</Text>
      <Text style={styles.title}>Perfil</Text>
      <Card style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.nome.slice(0, 1).toUpperCase()}</Text></View>
        <View style={styles.profileBody}>
          <Text style={styles.name}>{user?.nome} {user?.sobrenome || ''}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </Card>
      <Card style={styles.note}>
        <Text style={styles.noteTitle}>Plano e assinatura</Text>
        <Text style={styles.noteText}>A API ainda não expõe o plano e os recursos liberados. Essa seção será ativada quando o contrato de entitlement estiver disponível.</Text>
      </Card>
      <View style={styles.actions}>
        <Button variant="secondary" onPress={() => void logout()}>Sair da conta</Button>
        <Button variant="danger" onPress={confirmDelete}>Excluir conta</Button>
      </View>
      <Text style={styles.disclaimer}>O Sentinela é uma ferramenta informativa e não constitui recomendação de investimento. Consulte sempre as fontes originais.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.sm, marginBottom: 30 },
  eyebrow: { color: colors.brand, fontSize: 11, fontWeight: '900', letterSpacing: 1.7 },
  title: { ...typography.title, color: colors.text, marginTop: spacing.sm, marginBottom: spacing.xxl },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 26, backgroundColor: colors.brand },
  avatarText: { color: colors.brandInk, fontSize: 22, fontWeight: '900' },
  profileBody: { flex: 1 },
  name: { color: colors.text, fontSize: 17, fontWeight: '800' },
  email: { color: colors.textSecondary, fontSize: 13, marginTop: 3 },
  note: { gap: spacing.sm, marginTop: spacing.lg, backgroundColor: colors.backgroundElevated },
  noteTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
  noteText: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
  actions: { gap: spacing.md, marginTop: spacing.xxl },
  disclaimer: { color: colors.textSubtle, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 32 },
});
