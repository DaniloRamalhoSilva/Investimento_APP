import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatePanel } from '@/components/state-panel';
import { apiMessage, apiRequest } from '@/services/api';
import { colors, radius, spacing } from '@/theme/tokens';
import type { PortfolioFund, SearchFund } from '@/types/domain';

export default function SearchFundsScreen() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);

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
    if (item.seguindo || adding) return;
    setAdding(item.ticker);
    try {
      await apiRequest<{ data: PortfolioFund }>('/me/funds', { method: 'POST', body: JSON.stringify({ ticker: item.ticker }) });
      setItems((current) => current.map((fund) => fund.id === item.id ? { ...fund, seguindo: true } : fund));
    } catch (reason) {
      Alert.alert('Não foi possível adicionar', apiMessage(reason));
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
              disabled={item.seguindo || Boolean(adding)}
              accessibilityRole="button"
              accessibilityLabel={item.seguindo ? `${item.ticker} já monitorado` : `Adicionar ${item.ticker}`}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View style={styles.mark}><Text style={styles.markText}>{item.ticker.slice(0, 2)}</Text></View>
              <View style={styles.body}><Text style={styles.ticker}>{item.ticker}</Text><Text style={styles.meta}>Fundo imobiliário</Text></View>
              {adding === item.ticker ? <ActivityIndicator color={colors.brand} /> : <Text style={[styles.action, item.seguindo && styles.following]}>{item.seguindo ? 'Monitorando' : '+ Adicionar'}</Text>}
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  mark: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: 'rgba(44,224,189,0.10)' },
  markText: { color: colors.brand, fontWeight: '900' },
  body: { flex: 1 },
  ticker: { color: colors.text, fontSize: 15, fontWeight: '900' },
  meta: { color: colors.textSubtle, fontSize: 11, marginTop: 2 },
  action: { color: colors.brand, fontSize: 12, fontWeight: '800' },
  following: { color: colors.positive },
});
