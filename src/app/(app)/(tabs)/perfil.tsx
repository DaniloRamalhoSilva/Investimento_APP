import { useThemeColors, useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import { useCallback, useRef, useState } from 'react';
import { Alert, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { Brand } from '@/components/brand';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useSession } from '@/features/auth/session-context';
import { useApiResource } from '@/hooks/use-api-resource';
import { apiMessage, apiRequest } from '@/services/api';
import { radius, spacing, typography } from '@/theme/tokens';
import type { PlanCode, PlanDefinition, PlanOverview } from '@/types/domain';

function formatPrice(plan: PlanDefinition) {
  if (plan.priceMonthlyCents === 0) return 'R$ 0';
  return `R$ ${(plan.priceMonthlyCents / 100).toFixed(2).replace('.', ',')}/mês`;
}

function PlanCard({
  plan, current, waitlisted, saving, onJoin, onLeave,
}: {
  plan: PlanDefinition;
  current: boolean;
  waitlisted: boolean;
  saving: boolean;
  onJoin: (plan: PlanDefinition) => void;
  onLeave: (plan: PlanDefinition) => void;
}) {
  const styles = useThemeStyles(createStyles);
  const features = [
    'Resumos com IA',
    'Classificação de relevância',
    'Possível impacto',
    'Riscos identificados',
    'Fonte original',
    'Alertas importantes',
    `Histórico ${plan.features.historico === 'COMPLETO' ? 'completo' : 'básico'}`,
    plan.features.anuncios ? 'Com anúncios' : 'Sem anúncios',
    ...(plan.features.recursosAvancados ? ['Recursos avançados futuros'] : []),
  ];

  return (
    <Card style={[styles.planCard, plan.recommended && styles.recommendedPlan]}>
      <View style={styles.planHeader}>
        <View>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>{formatPrice(plan)}</Text>
        </View>
        {current ? <Text style={styles.currentChip}>PLANO ATUAL</Text> : null}
        {!current && waitlisted ? <Text style={styles.currentChip}>NA LISTA</Text> : null}
        {!current && !waitlisted && plan.recommended ? <Text style={styles.recommendedChip}>RECOMENDADO</Text> : null}
      </View>
      <Text style={styles.planLimit}>Até {plan.fundLimit} FIIs na carteira</Text>
      <View style={styles.featureList}>
        {features.map((feature) => <Text key={feature} style={styles.feature}>✓  {feature}</Text>)}
      </View>
      {!current ? (
        <Button
          variant={waitlisted ? 'secondary' : 'primary'}
          loading={saving}
          onPress={() => (waitlisted ? onLeave(plan) : onJoin(plan))}
        >
          {waitlisted ? 'Sair da lista de espera' : 'Quero ser avisado'}
        </Button>
      ) : null}
    </Card>
  );
}

export default function ProfileScreen() {
  const colors = useThemeColors();
  const styles = useThemeStyles(createStyles);
  const { user, logout, deleteAccount, updateTheme } = useSession();
  const [savingTheme, setSavingTheme] = useState(false);
  const [savingPlan, setSavingPlan] = useState<PlanCode | null>(null);

  async function chooseTheme(theme: 'dark' | 'light') {
    if (savingTheme || user?.tema === theme) return;
    setSavingTheme(true);
    try {
      await updateTheme(theme);
    } catch (error) {
      Alert.alert('Não foi possível salvar o tema', apiMessage(error));
    } finally {
      setSavingTheme(false);
    }
  }
  const loadPlan = useCallback(async () => {
    const response = await apiRequest<{ data: PlanOverview }>('/me/plan');
    return response.data;
  }, []);
  const planResource = useApiResource(loadPlan);
  const { reload } = planResource;
  const hasFocused = useRef(false);

  async function joinPlanWaitlist(plan: PlanDefinition) {
    if (savingPlan) return;
    setSavingPlan(plan.code);
    try {
      await apiRequest('/me/plan/waitlist', {
        method: 'POST',
        body: JSON.stringify({ planCode: plan.code }),
      });
      planResource.setData((current) => current ? {
        ...current,
        waitlistedPlans: [...new Set([...current.waitlistedPlans, plan.code as Exclude<PlanCode, 'GRATIS'>])],
      } : current);
      Alert.alert('Você está na lista', `Avisaremos por e-mail quando o plano ${plan.name} estiver disponível. Nenhuma cobrança foi feita.`);
    } catch (error) {
      Alert.alert('Não foi possível entrar na lista', apiMessage(error));
    } finally {
      setSavingPlan(null);
    }
  }

  async function leavePlanWaitlist(plan: PlanDefinition) {
    if (savingPlan) return;
    setSavingPlan(plan.code);
    try {
      await apiRequest(`/me/plan/waitlist/${plan.code}`, { method: 'DELETE' });
      planResource.setData((current) => current ? {
        ...current,
        waitlistedPlans: current.waitlistedPlans.filter((code) => code !== plan.code),
      } : current);
    } catch (error) {
      Alert.alert('Não foi possível sair da lista', apiMessage(error));
    } finally {
      setSavingPlan(null);
    }
  }

  function confirmJoin(plan: PlanDefinition) {
    Alert.alert(
      `${plan.name} estará disponível em breve`,
      'O lançamento começa pelo plano gratuito. Você pode entrar na lista para receber um aviso por e-mail quando este plano abrir. Não há cobrança agora.',
      [
        { text: 'Agora não', style: 'cancel' },
        { text: 'Entrar na lista', onPress: () => void joinPlanWaitlist(plan) },
      ],
    );
  }

  useFocusEffect(
    useCallback(() => {
      if (hasFocused.current) {
        void reload();
      } else {
        hasFocused.current = true;
      }
    }, [reload]),
  );

  const overview = planResource.data;
  const currentPlan = overview?.plans.find((plan) => plan.code === overview.currentPlan);
  const usage = overview && overview.fundLimit > 0
    ? Math.min(overview.fundsUsed / overview.fundLimit, 1)
    : 0;

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
    <Screen refreshControl={<RefreshControl refreshing={planResource.refreshing} onRefresh={planResource.reload} tintColor={colors.brand} />}>
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
      <Text style={styles.sectionTitle}>Aparência</Text>
      <Text style={styles.sectionSubtitle}>Escolha como o Sentinela aparece para você.</Text>
      <View style={styles.themeOptions} accessibilityRole="radiogroup">
        {(['dark', 'light'] as const).map((theme) => (
          <Pressable
            key={theme}
            accessibilityRole="radio"
            accessibilityLabel={theme === 'dark' ? 'Tema escuro' : 'Tema claro'}
            accessibilityState={{ checked: (user?.tema || 'dark') === theme, disabled: savingTheme }}
            disabled={savingTheme}
            onPress={() => void chooseTheme(theme)}
            style={[styles.themeOption, (user?.tema || 'dark') === theme && styles.themeOptionSelected]}
          >
            <Text style={[styles.themeOptionText, (user?.tema || 'dark') === theme && styles.themeOptionTextSelected]}>
              {theme === 'dark' ? 'Escuro' : 'Claro'}
            </Text>
          </Pressable>
        ))}
      </View>
      {savingTheme ? <Text style={styles.themeSaving}>Salvando preferência...</Text> : null}
      <Text style={styles.sectionTitle}>Plano e assinatura</Text>
      {planResource.loading ? (
        <Card style={styles.note}><Text style={styles.noteText}>Consultando seu plano...</Text></Card>
      ) : planResource.error ? (
        <Card style={styles.note}>
          <Text style={styles.noteTitle}>Plano indisponível</Text>
          <Text style={styles.noteText}>{planResource.error}</Text>
          <Button variant="secondary" onPress={planResource.reload}>Tentar novamente</Button>
        </Card>
      ) : currentPlan && overview ? (
        <Card style={styles.currentPlanCard}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.currentPlanLabel}>SEU PLANO</Text>
              <Text style={styles.currentPlanName}>{currentPlan.name}</Text>
            </View>
            <Text style={styles.currentPlanPrice}>{formatPrice(currentPlan)}</Text>
          </View>
          <Text style={styles.usageText}>{overview.fundsUsed} de {overview.fundLimit} FIIs na carteira</Text>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${usage * 100}%` }]} /></View>
        </Card>
      ) : null}

      {overview ? (
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Conheça os planos</Text>
          <Text style={styles.sectionSubtitle}>Os planos pagos ainda não estão disponíveis. Entre na lista para receber um aviso quando abrirem, sem cobrança agora.</Text>
          <View style={styles.planList}>
            {overview.plans.map((plan) => (
              <PlanCard
                key={plan.code}
                plan={plan}
                current={plan.code === overview.currentPlan}
                waitlisted={overview.waitlistedPlans.includes(plan.code as Exclude<PlanCode, 'GRATIS'>)}
                saving={savingPlan === plan.code}
                onJoin={confirmJoin}
                onLeave={(selected) => void leavePlanWaitlist(selected)}
              />
            ))}
          </View>
          <Text style={styles.billingNote}>Os preços são informativos. A lista de espera não contrata o plano nem gera cobrança.</Text>
        </View>
      ) : null}
      <View style={styles.actions}>
        <Button variant="secondary" onPress={() => void logout()}>Sair da conta</Button>
        <Button variant="danger" onPress={confirmDelete}>Excluir conta</Button>
      </View>
      <Text style={styles.disclaimer}>O Sentinela é uma ferramenta informativa e não constitui recomendação de investimento. Consulte sempre as fontes originais.</Text>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
  sectionTitle: { ...typography.heading, color: colors.text, marginTop: spacing.xxl },
  sectionSubtitle: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: spacing.xs },
  themeOptions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  themeOption: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, backgroundColor: colors.surface },
  themeOptionSelected: { borderColor: colors.brand, backgroundColor: colors.surfaceRaised },
  themeOptionText: { color: colors.textSecondary, fontSize: 14, fontWeight: '700' },
  themeOptionTextSelected: { color: colors.brand },
  themeSaving: { color: colors.textSubtle, fontSize: 12, marginTop: spacing.sm },
  currentPlanCard: { gap: spacing.md, marginTop: spacing.md, borderColor: colors.brand, backgroundColor: colors.surfaceRaised },
  currentPlanLabel: { color: colors.brand, fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  currentPlanName: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: spacing.xs },
  currentPlanPrice: { color: colors.brand, fontSize: 16, fontWeight: '900' },
  usageText: { color: colors.textSecondary, fontSize: 12 },
  progressTrack: { height: 7, overflow: 'hidden', borderRadius: radius.pill, backgroundColor: colors.border },
  progressFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.brand },
  plansSection: { marginTop: spacing.sm },
  planList: { gap: spacing.md, marginTop: spacing.lg },
  planCard: { gap: spacing.md },
  recommendedPlan: { borderColor: colors.brand },
  planHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  planName: { color: colors.text, fontSize: 18, fontWeight: '900' },
  planPrice: { color: colors.brand, fontSize: 14, fontWeight: '800', marginTop: spacing.xs },
  currentChip: { color: colors.brand, fontSize: 9, fontWeight: '900', letterSpacing: 0.8, paddingHorizontal: spacing.sm, paddingVertical: 5, borderWidth: 1, borderColor: colors.brand, borderRadius: radius.pill },
  recommendedChip: { color: colors.brandInk, fontSize: 9, fontWeight: '900', letterSpacing: 0.6, paddingHorizontal: spacing.sm, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.brand },
  planLimit: { color: colors.text, fontSize: 13, fontWeight: '800' },
  featureList: { gap: spacing.xs },
  feature: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  billingNote: { color: colors.textSubtle, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: spacing.lg },
  actions: { gap: spacing.md, marginTop: spacing.xxl },
  disclaimer: { color: colors.textSubtle, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 32 },
});
