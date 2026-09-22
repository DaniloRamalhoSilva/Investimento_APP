import { createContext, useContext, useEffect, useMemo } from 'react';
import { Appearance, Platform } from 'react-native';

import { useSession } from '@/features/auth/session-context';
import { darkColors, lightColors, type ThemeColors } from '@/theme/tokens';

const ThemeContext = createContext<ThemeColors>(darkColors);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const palette = user?.tema === 'light' ? lightColors : darkColors;
  useEffect(() => {
    if (Platform.OS !== 'web') Appearance.setColorScheme(user?.tema === 'light' ? 'light' : 'dark');
  }, [user?.tema]);
  return <ThemeContext.Provider value={palette}>{children}</ThemeContext.Provider>;
}

export function useThemeColors() {
  return useContext(ThemeContext);
}

export function useThemeStyles<T>(factory: (colors: ThemeColors) => T): T {
  const palette = useThemeColors();
  return useMemo(() => factory(palette), [factory, palette]);
}
