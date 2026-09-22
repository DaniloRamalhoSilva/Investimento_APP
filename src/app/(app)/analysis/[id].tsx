import { useThemeColors, useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import { useCallback } from 'react';
import { Linking, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { StatePanel } from '@/components/state-panel';
import { StatusChip, statusColor } from '@/components/status-chip';
import { useApiResource } from '@/hooks/use-api-resource';
import { apiRequest } from '@/services/api';
import { spacing, typography } from '@/theme/tokens';
import type { Analysis } from '@/types/domain';
import { formatDate, humanizeCode } from '@/utils/format';

export default function AnalysisScreen() {
  const colors = useThemeColors();
  const styles = useThemeStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const loadAnalysis = useCallback(async () => {
    const response = await apiRequest<{ data: Analysis }>(`/me/analyses/${id}`);
    return response.data;
  }, [id]);
  const resource = useApiResource(loadAnalysis);

  if (resource.loading) return <Screen scroll={false}><StatePanel loading title="Abrindo a análise" /></Screen>;
  if (resource.error || !resource.data) return <Screen scroll={false}><StatePanel title="Análise indisponível" message={resource.error || 'Conteúdo não encontrado.'} onRetry={resource.reload} /></Screen>;

  const analysis = resource.data;
  return (
    <Screen refreshControl={<RefreshControl refreshing={resource.refreshing} onRefresh={resource.reload} tintColor={colors.brand} />}>
      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>
        <Text style={styles.ticker}>{analysis.ticker}</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.hero}>
        <StatusChip status={analysis.classificacao} />
        <Text style={styles.title}>{analysis.titulo || 'Análise do ativo'}</Text>
        <Text style={styles.date}>{formatDate(analysis.ocorreuEm)}</Text>
      </View>

      <View style={styles.metricRow}>
        <Card style={styles.metric}><Text style={styles.metricLabel}>Impacto</Text><Text style={[styles.metricValue, { color: statusColor(analysis.impacto, colors) }]}>{humanizeCode(analysis.impacto)}</Text></Card>
        <Card style={styles.metric}><Text style={styles.metricLabel}>Horizonte</Text><Text style={styles.metricValue}>{humanizeCode(analysis.horizonte)}</Text></Card>
        <Card style={styles.metric}><Text style={styles.metricLabel}>Confiança</Text><Text style={styles.metricValue}>{humanizeCode(analysis.confianca)}</Text></Card>
      </View>

      <Section title="Resumo"><Text style={styles.body}>{analysis.resumo}</Text></Section>
      {analysis.justificativaSinal ? <Section title="Por que isso importa"><Text style={styles.body}>{analysis.justificativaSinal}</Text></Section> : null}
      {analysis.riscos.length ? <Section title="Riscos e pontos de atenção">{analysis.riscos.map((risk, index) => <View key={`${risk}-${index}`} style={styles.bulletRow}><View style={styles.riskDot} /><Text style={styles.bulletText}>{risk}</Text></View>)}</Section> : null}
      {analysis.numerosChave.length ? <Section title="Números-chave">{analysis.numerosChave.map((item, index) => <View key={`${item.descricao}-${index}`} style={styles.numberRow}><Text style={styles.numberLabel}>{item.descricao}</Text><Text style={styles.numberValue}>{item.valor}</Text></View>)}</Section> : null}
      <Section title="Fontes originais">
        {analysis.publicacoes.map((publication, index) => (
          <Card key={`${publication.urlOriginal}-${index}`} style={styles.source}>
            <Text style={styles.sourceName}>{publication.titulo}</Text>
            <Text style={styles.sourceMeta}>{humanizeCode(publication.fonte)} · {formatDate(publication.publicadoEm)}</Text>
            <Button variant="secondary" onPress={() => void Linking.openURL(publication.urlOriginal)}>Abrir documento original</Button>
          </Card>
        ))}
      </Section>
      <Text style={styles.disclaimer}>Análise informativa. Não constitui recomendação de investimento e pode conter imprecisões. Consulte a fonte original.</Text>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const styles = useThemeStyles(createStyles);
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><View style={styles.sectionContent}>{children}</View></View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  topbar: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: -4 },
  back: { width: 40, color: colors.text, fontSize: 38, lineHeight: 38 },
  ticker: { color: colors.brand, fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  placeholder: { width: 40 },
  hero: { gap: spacing.md, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  title: { ...typography.title, color: colors.text },
  date: { color: colors.textSubtle, fontSize: 12 },
  metricRow: { flexDirection: 'row', gap: spacing.sm },
  metric: { flex: 1, minWidth: 0, padding: spacing.md },
  metricLabel: { color: colors.textSubtle, fontSize: 10, textTransform: 'uppercase', fontWeight: '700' },
  metricValue: { color: colors.text, fontSize: 12, lineHeight: 17, fontWeight: '800', marginTop: 5 },
  section: { marginTop: spacing.xxxl },
  sectionTitle: { ...typography.heading, color: colors.text },
  sectionContent: { gap: spacing.md, marginTop: spacing.lg },
  body: { color: colors.textSecondary, fontSize: 15, lineHeight: 24 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  riskDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning, marginTop: 7 },
  bulletText: { flex: 1, color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  numberRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  numberLabel: { flex: 1, color: colors.textSecondary, fontSize: 13 },
  numberValue: { color: colors.text, fontSize: 14, fontWeight: '800', textAlign: 'right' },
  source: { gap: spacing.md, backgroundColor: colors.backgroundElevated },
  sourceName: { color: colors.text, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  sourceMeta: { color: colors.textSubtle, fontSize: 11 },
  disclaimer: { color: colors.textSubtle, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 36 },
});
