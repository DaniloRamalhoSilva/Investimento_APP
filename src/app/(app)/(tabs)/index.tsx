import { useCallback } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Brand } from '@/components/brand';
import { Card } from '@/components/card';
import { FeedCard } from '@/components/feed-card';
import { Screen } from '@/components/screen';
import { StatePanel } from '@/components/state-panel';
import { useSession } from '@/features/auth/session-context';
import { useApiResource } from '@/hooks/use-api-resource';
import { apiRequest } from '@/services/api';
import { colors, spacing, typography } from '@/theme/tokens';
import type { Dashboard } from '@/types/domain';
import { firstName, formatDate } from '@/utils/format';

export default function HomeScreen() {
  const { user } = useSession();
  const loadDashboard = useCallback(async () => {
    const response = await apiRequest<{ data: Dashboard }>('/me/dashboard');
    return response.data;
  }, []);
  const resource = useApiResource(loadDashboard);

  if (resource.loading) return <Screen scroll={false}><StatePanel loading title="Consultando sua carteira" message="Buscando apenas o que merece sua atenção." /></Screen>;
  if (resource.error) return <Screen scroll={false}><StatePanel title="Não foi possível atualizar" message={resource.error} onRetry={resource.reload} /></Screen>;

  const dashboard = resource.data;
  return (
    <Screen refreshControl={<RefreshControl refreshing={resource.refreshing} onRefresh={resource.reload} tintColor={colors.brand} />}>
      <View style={styles.header}>
        <Brand compact />
        <Text style={styles.updated}>{formatDate(dashboard?.ultimaAtualizacaoEm)}</Text>
      </View>
      <Text style={styles.greeting}>Olá, {firstName(user?.nome)}</Text>
      <Text style={styles.lead}>Aqui está o que importa hoje.</Text>

      <View style={styles.summaryGrid}>
        <Card style={styles.summaryMain}>
          <Text style={styles.summaryNumber}>{dashboard?.monitoramento.ativosMonitorados || 0}</Text>
          <Text style={styles.summaryLabel}>ativos monitorados</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: colors.positive }]}>{dashboard?.monitoramento.semNovidades || 0}</Text>
          <Text style={styles.summaryLabel}>sem novidades</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: colors.warning }]}>{dashboard?.monitoramento.relevantes || 0}</Text>
          <Text style={styles.summaryLabel}>relevantes</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: colors.urgent }]}>{dashboard?.monitoramento.urgentes || 0}</Text>
          <Text style={styles.summaryLabel}>urgentes</Text>
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Sinais recentes</Text>
          <Text style={styles.sectionSubtitle}>Priorizados por relevância</Text>
        </View>
        <Text style={styles.link} onPress={() => router.push('/(app)/(tabs)/alertas')}>Ver todos</Text>
      </View>

      <View style={styles.list}>
        {dashboard?.destaques.length ? dashboard.destaques.map((item) => (
          <FeedCard key={item.analiseId} item={item} onPress={() => router.push({ pathname: '/(app)/analysis/[id]', params: { id: item.analiseId } })} />
        )) : (
          <Card style={styles.emptyCard}>
            <View style={styles.okDot} />
            <Text style={styles.emptyTitle}>Tudo tranquilo por aqui</Text>
            <Text style={styles.emptyText}>Quando algo relevante surgir nos seus ativos, aparecerá em destaque.</Text>
          </Card>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.sm },
  updated: { color: colors.textSubtle, fontSize: 11 },
  greeting: { ...typography.title, color: colors.text, marginTop: 30 },
  lead: { color: colors.textSecondary, fontSize: 15, marginTop: 4 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xxl },
  summaryMain: { width: '100%', backgroundColor: colors.surfaceRaised },
  summaryCard: { flexGrow: 1, flexBasis: '29%', minWidth: 96 },
  summaryNumber: { color: colors.brand, fontSize: 26, fontWeight: '900' },
  summaryLabel: { color: colors.textSecondary, fontSize: 11, lineHeight: 16, marginTop: 3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 34, marginBottom: spacing.lg },
  sectionTitle: { ...typography.heading, color: colors.text },
  sectionSubtitle: { color: colors.textSubtle, fontSize: 12, marginTop: 2 },
  link: { color: colors.brand, fontSize: 13, fontWeight: '800' },
  list: { gap: spacing.md },
  emptyCard: { alignItems: 'center', gap: spacing.sm, paddingVertical: 32 },
  okDot: { width: 13, height: 13, borderRadius: 7, backgroundColor: colors.positive },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  emptyText: { maxWidth: 280, color: colors.textSecondary, fontSize: 13, lineHeight: 19, textAlign: 'center' },
});
