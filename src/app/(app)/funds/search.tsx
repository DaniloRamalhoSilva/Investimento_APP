import { useThemeColors, useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { StatePanel } from '@/components/state-panel';
import { ApiError, apiMessage, apiRequest } from '@/services/api';
import { radius, spacing } from '@/theme/tokens';
import type { PortfolioFund, SearchFund } from '@/types/domain';

type AddError = { message: string; canUpgrade: boolean };

export default function SearchFundsScreen() {
  const colors = useThemeColors();
  const styles = useThemeStyles(createStyles);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [addError, setAddError] = useState<AddError | null>(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest<{ data: SearchFund[] }>(`/funds?search=${encodeURIComponent(query.trim())}`);
        if (active) setItems(response.data);
      } catch (reason) {
        if (active) setError(apiMessage(reason));
      } finally {
        if (active) setLoading(false);
      }
    }, query ? 300 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [query]);

  async function add(item: SearchFund) {
    if (item.naCarteira || adding) return;
    setAddError(null);
    setAdding(item.ticker);
    try {
      await apiRequest<{ data: PortfolioFund }>('/me/funds', { method: 'POST', body: JSON.stringify({ ticker: item.ticker }) });
      setItems((current) => current.map((fund) => fund.id === item.id
        ? { ...fund, naCarteira: true, monitorando: true }
        : fund));
    } catch (reason) {
      setAddError({
        message: apiMessage(reason),
        canUpgrade: reason instanceof ApiError && reason.code === 'PLAN_LIMIT_REACHED',
      });
    } finally {
      setAdding(null);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>
        <Text style={styles.topTitle}>Adicionar ativo</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          autoFocus
          value={query}
          onChangeText={(value) => setQuery(value.toUpperCase())}
          autoCapitalize="characters"
          placeholder="Busque por ticker, ex.: MXRF11"
          placeholderTextColor={colors.textSubtle}
          style={styles.input}
          accessibilityLabel="Buscar fundo por ticker"
        />
      </View>
      {loading ? <StatePanel loading title="Buscando fundos" /> : error ? <StatePanel title="Busca indisponível" message={error} /> : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={<Text style={styles.result}>{items.length} ativos encontrados</Text>}
          ListEmptyComponent={<StatePanel title="Nenhum ativo encontrado" message="Verifique o ticker informado e tente novamente." />}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => void add(item)}
              disabled={item.naCarteira || Boolean(adding)}
              accessibilityRole="button"
              accessibilityLabel={item.naCarteira ? `${item.ticker} já está na carteira` : `Adicionar ${item.ticker}`}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View style={styles.mark}><Text style={styles.markText}>{item.ticker.slice(0, 2)}</Text></View>
              <View style={styles.body}><Text style={styles.ticker}>{item.ticker}</Text><Text style={styles.meta}>Fundo imobiliário</Text></View>
              {adding === item.ticker ? <ActivityIndicator color={colors.brand} /> : (
                <Text style={[styles.action, item.naCarteira && styles.following]}>
                  {item.naCarteira ? (item.monitorando ? 'Na carteira · ligado' : 'Na carteira · desligado') : '+ Adicionar'}
                </Text>
              )}
            </Pressable>
          )}
        />
      )}
      <Modal
        animationType="fade"
        transparent
        visible={Boolean(addError)}
        onRequestClose={() => setAddError(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard} accessibilityViewIsModal>
            <Text style={styles.modalTitle}>
              {addError?.canUpgrade ? 'Sua carteira está crescendo' : 'Não foi possível adicionar'}
            </Text>
            <Text style={styles.modalText}>{addError?.message}</Text>
            {addError?.canUpgrade ? (
              <View style={styles.modalActions}>
                <Button variant="ghost" onPress={() => setAddError(null)}>Agora não</Button>
                <Button onPress={() => {
                  setAddError(null);
                  router.replace('/(app)/(tabs)/perfil');
                }}>
                  Ver lista de espera
                </Button>
              </View>
            ) : (
              <Button onPress={() => setAddError(null)}>Entendi</Button>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topbar: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl },
  back: { width: 36, color: colors.text, fontSize: 38, lineHeight: 38 },
  topTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  placeholder: { width: 36 },
  searchBox: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, margin: spacing.xl, marginBottom: spacing.md, paddingHorizontal: spacing.lg, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, backgroundColor: colors.surface },
  searchIcon: { color: colors.brand, fontSize: 24 },
  input: { flex: 1, minHeight: 50, color: colors.text, fontSize: 15 },
  list: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: 30 },
  result: { color: colors.textSubtle, fontSize: 12, marginBottom: spacing.lg },
  row: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface },
  pressed: { opacity: 0.8 },
  mark: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.surfaceRaised },
  markText: { color: colors.brand, fontWeight: '900' },
  body: { flex: 1 },
  ticker: { color: colors.text, fontSize: 15, fontWeight: '900' },
  meta: { color: colors.textSubtle, fontSize: 11, marginTop: 2 },
  action: { color: colors.brand, fontSize: 12, fontWeight: '800' },
  following: { color: colors.positive },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: spacing.xl, backgroundColor: 'rgba(0,0,0,0.72)' },
  modalCard: { gap: spacing.md, padding: spacing.xl, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.lg, backgroundColor: colors.surfaceRaised },
  modalTitle: { color: colors.text, fontSize: 20, lineHeight: 26, fontWeight: '700' },
  modalText: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, marginBottom: spacing.sm },
  modalActions: { gap: spacing.sm },
});
