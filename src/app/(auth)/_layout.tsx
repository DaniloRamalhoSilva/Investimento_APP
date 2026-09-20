import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/features/auth/session-context';

export default function AuthLayout() {
  const { isAuthenticated, isHydrating } = useSession();
  if (!isHydrating && isAuthenticated) return <Redirect href="/(app)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
