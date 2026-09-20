import { useCallback } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { StatePanel } from '@/components/state-panel';
import { useApiResource } from '@/hooks/use-api-resource';
import { apiMessage, apiRequest } from '@/services/api';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { PortfolioFund } from '@/types/domain';

export default function PortfolioScreen() {
  const loader = useCallback(async () => {
    const response = await apiRequest<{ data: PortfolioFund[] }>('/me/funds');
    return response.data;
  }, []);
  const resource = useApiResource(loader);

  function remove(item: PortfolioFund) {
    Alert.alert('Parar de monitorar?', `${item.ticker} deixará de aparecer na sua carteira.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          try {
            await apiRequest<void>(`/me/funds/${item.ticker}`, { method: 'DELETE' });
            resource.setData((resource.data || []).filter((fund) => fund.ticker !== item.ticker));
          } catch (error) {
            Alert.alert('Não foi possível remover', apiMessage(error));
          }
        },
      },
    ]);
  }

  if (resource.loading) return <SafeAreaView style={styles.safe}><StatePanel loading title="Carregando sua carteira" /></SafeAreaView>;
  if (resource.error) return <SafeAreaView style={styles.safe}><StatePanel title="Carteira indisponível" message={resource.error} onRetry={resource.reload} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={resource.data || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={resource.refreshing} onRefresh={resource.reload} tintColor={colors.brand} />}
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={styles.eyebrow}>MONITORAMENTO</Text>
            <Text style={styles.title}>Minha carteira</Text>
            <Text style={styles.subtitle}>{resource.data?.length || 0} ativos acompanhados</Text>
            <Button onPress={() => router.push('/(app)/funds/search')}>Adicionar ativo</Button>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => remove(item)} onLongPress={() => remove(item)} style={({ pressed }) => [styles.fund, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Opções para ${item.ticker}`}>
            <View style={styles.fundMark}><Text style={styles.fundMarkText}>{item.ticker.slice(0, 2)}</Text></View>
            <View style={styles.fundBody}>
              <Text style={styles.ticker}>{item.ticker}</Text>
              <Text style={styles.fundMeta}>Fundo imobiliário</Text>
            </View>
            <View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>Monitorando</Text></View>
          </Pressable>
        )}
        ListEmptyComponent={(
          <StatePanel title="Sua carteira está vazia" message="Adicione seus FIIs para o Sentinela começar a acompanhar o que importa." />
        )}
        ListFooterComponent={resource.data?.length ? <Text style={styles.hint}>Toque em um ativo para removê-lo do monitoramento.</Text> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: 28 },
  header: { gap: spacing.sm, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  eyebrow: { color: colors.brand, fontSize: 11, fontWeight: '900', letterSpacing: 1.7 },
  title: { ...typography.title, color: colors.text },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.md },
  fund: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface },
  pressed: { opacity: 0.8 },
  fundMark: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: 'rgba(44,224,189,0.10)' },
  fundMarkText: { color: colors.brand, fontSize: 13, fontWeight: '900' },
  fundBody: { flex: 1 },
  ticker: { color: colors.text, fontSize: 15, fontWeight: '900' },
  fundMeta: { color: colors.textSubtle, fontSize: 11, marginTop: 3 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.positive },
  statusText: { color: colors.positive, fontSize: 10, fontWeight: '700' },
  hint: { color: colors.textSubtle, fontSize: 11, lineHeight: 17, textAlign: 'center', paddingVertical: spacing.xxl },
});
