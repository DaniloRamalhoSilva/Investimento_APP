import 'react-native-gesture-handler';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider } from '@/features/auth/session-context';
import { ThemeProvider, useThemeColors } from '@/theme/theme-context';
import { darkColors } from '@/theme/tokens';

function ThemedNavigation() {
  const colors = useThemeColors();
  return (
    <>
      <StatusBar style={colors === darkColors ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'fade_from_bottom' }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <ThemeProvider><ThemedNavigation /></ThemeProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
