import { useThemeColors, useThemeStyles } from '@/theme/theme-context';
import type { ThemeColors } from '@/theme/tokens';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';


const icons: Record<string, string> = { index: '⌂', carteira: '▦', alertas: '●', perfil: '◎' };

export default function TabsLayout() {
  const colors = useThemeColors();
  const styles = useThemeStyles(createStyles);
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color }) => (
          <View style={styles.iconBox}>
            <Text style={[styles.icon, { color }]}>{icons[route.name] || '•'}</Text>
          </View>
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="carteira" options={{ title: 'Carteira' }} />
      <Tabs.Screen name="alertas" options={{ title: 'Alertas' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  bar: { height: 68, paddingTop: 7, paddingBottom: 8, borderTopColor: colors.border, backgroundColor: colors.backgroundElevated },
  label: { fontSize: 11, fontWeight: '700' },
  iconBox: { width: 28, height: 24, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20, fontWeight: '900' },
});
