import { useThemeColors, useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { StatePanel } from '@/components/state-panel';
import { useApiResource } from '@/hooks/use-api-resource';
import { apiMessage, apiRequest } from '@/services/api';
import { radius, spacing, typography } from '@/theme/tokens';
import type { PortfolioFund } from '@/types/domain';

export default function PortfolioScreen() {
  const colors = useThemeColors();
  const styles = useThemeStyles(createStyles);
  const loader = useCallback(async () => {
    const response = await apiRequest<{ data: PortfolioFund[] }>('/me/funds');
    return response.data;
  }, []);
  const resource = useApiResource(loader);
  const { reload } = resource;
  const hasFocused = useRef(false);
  const [fundToUpdate, setFundToUpdate] = useState<PortfolioFund | null>(null);
  const [dialogMode, setDialogMode] = useState<'actions' | 'delete'>('actions');
  const [updating, setUpdating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (hasFocused.current) {
        void reload();
      } else {
        hasFocused.current = true;
      }
    }, [reload]),
  );

  async function updateMonitoring() {
    if (!fundToUpdate || updating) return;
    const enabled = !fundToUpdate.monitorando;
    setUpdating(true);
    try {
      const response = await apiRequest<{ data: PortfolioFund }>(
        `/me/funds/${fundToUpdate.ticker}/monitoring`,
        { method: 'PATCH', body: JSON.stringify({ enabled }) },
      );
      resource.setData((current) => (current || []).map(
        (fund) => fund.ticker === fundToUpdate.ticker ? response.data : fund,
      ));
      setFundToUpdate(null);
    } catch (error) {
      Alert.alert('Não foi possível alterar o monitoramento', apiMessage(error));
    } finally {
      setUpdating(false);
    }
  }

  async function deleteFromPortfolio() {
    if (!fundToUpdate || fundToUpdate.monitorando || updating) return;
    setUpdating(true);
    try {
      await apiRequest<void>(`/me/funds/${fundToUpdate.ticker}`, { method: 'DELETE' });
      resource.setData((current) => (current || []).filter(
        (fund) => fund.ticker !== fundToUpdate.ticker,
      ));
      setFundToUpdate(null);
      setDialogMode('actions');
    } catch (error) {
      Alert.alert('Não foi possível excluir da carteira', apiMessage(error));
    } finally {
      setUpdating(false);
    }
  }

  function openFundActions(fund: PortfolioFund) {
    setDialogMode('actions');
    setFundToUpdate(fund);
  }

  function closeFundActions() {
    if (updating) return;
    setFundToUpdate(null);
    setDialogMode('actions');
  }

  const funds = resource.data || [];
  const monitored = funds.filter((fund) => fund.monitorando).length;

  if (resource.loading) return <SafeAreaView style={styles.safe}><StatePanel loading title="Carregando sua carteira" /></SafeAreaView>;
  if (resource.error) return <SafeAreaView style={styles.safe}><StatePanel title="Carteira indisponível" message={resource.error} onRetry={resource.reload} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={funds}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={resource.refreshing} onRefresh={resource.reload} tintColor={colors.brand} />}
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={styles.eyebrow}>MONITORAMENTO</Text>
            <Text style={styles.title}>Minha carteira</Text>
            <Text style={styles.subtitle}>{funds.length} na carteira · {monitored} monitorados</Text>
            <Button onPress={() => router.push('/(app)/funds/search')}>Adicionar ativo</Button>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => openFundActions(item)} style={({ pressed }) => [styles.fund, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={item.monitorando ? `Desligar monitoramento de ${item.ticker}` : `Opções para ${item.ticker}`}>
            <View style={styles.fundMark}><Text style={styles.fundMarkText}>{item.ticker.slice(0, 2)}</Text></View>
            <View style={styles.fundBody}>
              <Text style={styles.ticker}>{item.ticker}</Text>
              <Text style={styles.fundMeta}>Fundo imobiliário</Text>
            </View>
            <View style={styles.status}>
              <View style={[styles.statusDot, !item.monitorando && styles.statusDotOff]} />
              <Text style={[styles.statusText, !item.monitorando && styles.statusTextOff]}>
                {item.monitorando ? 'Monitorando' : 'Desligado'}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={(
          <StatePanel title="Sua carteira está vazia" message="Adicione seus FIIs para o Sentinela começar a acompanhar o que importa." />
        )}
        ListFooterComponent={funds.length ? <Text style={styles.hint}>Toque em um ativo para ligar ou desligar o monitoramento.</Text> : null}
      />
      <Modal
        animationType="fade"
        transparent
        visible={Boolean(fundToUpdate)}
        onRequestClose={closeFundActions}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard} accessibilityViewIsModal>
            <Text style={styles.modalTitle}>
              {dialogMode === 'delete'
                ? 'Excluir da carteira?'
                : fundToUpdate?.monitorando
                  ? 'Desligar monitoramento?'
                  : 'Monitoramento desligado'}
            </Text>
            <Text style={styles.modalText}>
              {dialogMode === 'delete'
                ? `${fundToUpdate?.ticker} será removido da sua carteira. Esta ação pode ser desfeita adicionando o ativo novamente.`
                : fundToUpdate?.monitorando
                  ? `${fundToUpdate.ticker} continuará na sua carteira, mas não gerará novos sinais e alertas.`
                  : `Escolha se deseja voltar a monitorar ${fundToUpdate?.ticker} ou excluí-lo da carteira.`}
            </Text>
            <View style={styles.modalActions}>
              <Button variant="ghost" disabled={updating} onPress={dialogMode === 'delete' ? () => setDialogMode('actions') : closeFundActions}>
                {dialogMode === 'delete' ? 'Voltar' : 'Cancelar'}
              </Button>
              {dialogMode === 'delete' ? (
                <Button variant="danger" loading={updating} onPress={() => void deleteFromPortfolio()}>
                  Excluir da carteira
                </Button>
              ) : (
                <>
                  <Button
                    variant={fundToUpdate?.monitorando ? 'danger' : 'primary'}
                    loading={updating}
                    onPress={() => void updateMonitoring()}
                  >
                    {fundToUpdate?.monitorando ? 'Desligar monitoramento' : 'Ligar monitoramento'}
                  </Button>
                  {!fundToUpdate?.monitorando && (
                    <Button variant="danger" disabled={updating} onPress={() => setDialogMode('delete')}>
                      Excluir da carteira
                    </Button>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: 28 },
  header: { gap: spacing.sm, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  eyebrow: { color: colors.brand, fontSize: 11, fontWeight: '900', letterSpacing: 1.7 },
  title: { ...typography.title, color: colors.text },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.md },
  fund: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface },
  pressed: { opacity: 0.8 },
  fundMark: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.surfaceRaised },
  fundMarkText: { color: colors.brand, fontSize: 13, fontWeight: '900' },
  fundBody: { flex: 1 },
  ticker: { color: colors.text, fontSize: 15, fontWeight: '900' },
  fundMeta: { color: colors.textSubtle, fontSize: 11, marginTop: 3 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.positive },
  statusText: { color: colors.positive, fontSize: 10, fontWeight: '700' },
  statusDotOff: { backgroundColor: colors.textSubtle },
  statusTextOff: { color: colors.textSubtle },
  hint: { color: colors.textSubtle, fontSize: 11, lineHeight: 17, textAlign: 'center', paddingVertical: spacing.xxl },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: spacing.xl, backgroundColor: 'rgba(0,0,0,0.72)' },
  modalCard: { gap: spacing.md, padding: spacing.xl, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.lg, backgroundColor: colors.surfaceRaised },
  modalTitle: { ...typography.heading, color: colors.text },
  modalText: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  modalActions: { gap: spacing.sm, marginTop: spacing.sm },
});
