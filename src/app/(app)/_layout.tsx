import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/features/auth/session-context';
import { useThemeColors } from '@/theme/theme-context';

export default function AppLayout() {
  const colors = useThemeColors();
  const { isAuthenticated, isHydrating } = useSession();
  if (!isHydrating && !isAuthenticated) return <Redirect href="/(auth)/login" />;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
