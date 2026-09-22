import { useThemeColors, useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeedCard } from '@/components/feed-card';
import { StatePanel } from '@/components/state-panel';
import { apiMessage, apiRequest } from '@/services/api';
import { spacing, typography } from '@/theme/tokens';
import type { FeedItem, Page } from '@/types/domain';

export default function AlertsScreen() {
  const colors = useThemeColors();
  const styles = useThemeStyles(createStyles);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const load = useCallback(async (reset = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    if (reset) setRefreshing(true);
    else if (cursor) setLoadingMore(true);
    else setLoading(true);
    setError(null);
    try {
      const query = !reset && cursor ? `?limit=20&cursor=${encodeURIComponent(cursor)}` : '?limit=20';
      const page = await apiRequest<Page<FeedItem>>(`/me/feed${query}`);
      setItems((current) => reset ? page.data : [...current, ...page.data.filter((next) => !current.some((item) => item.analiseId === next.analiseId))]);
      setCursor(page.meta.nextCursor);
      setHasMore(page.meta.hasMore);
    } catch (reason) {
      setError(apiMessage(reason));
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [cursor]);

  useEffect(() => {
    const timer = setTimeout(() => void load(true), 0);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <SafeAreaView style={styles.safe}><StatePanel loading title="Organizando os sinais" /></SafeAreaView>;
  if (error && !items.length) return <SafeAreaView style={styles.safe}><StatePanel title="Feed indisponível" message={error} onRetry={() => load(true)} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.analiseId}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.brand} />}
        onEndReached={() => { if (hasMore && !loadingMore) void load(false); }}
        onEndReachedThreshold={0.35}
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={styles.eyebrow}>RELEVÂNCIA PRIMEIRO</Text>
            <Text style={styles.title}>Alertas e análises</Text>
            <Text style={styles.subtitle}>Nada de timeline infinita. Apenas informações relacionadas à sua carteira.</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => <FeedCard item={item} onPress={() => router.push({ pathname: '/(app)/analysis/[id]', params: { id: item.analiseId } })} />}
        ListEmptyComponent={<StatePanel title="Nenhum sinal por enquanto" message="As análises dos seus ativos aparecerão aqui quando estiverem disponíveis." />}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.brand} style={styles.footer} /> : error ? <Text style={styles.error}>{error}</Text> : null}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: 30 },
  header: { gap: spacing.sm, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  eyebrow: { color: colors.brand, fontSize: 11, fontWeight: '900', letterSpacing: 1.7 },
  title: { ...typography.title, color: colors.text },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 21 },
  footer: { padding: spacing.xxl },
  error: { color: colors.urgent, textAlign: 'center', padding: spacing.xl },
});
