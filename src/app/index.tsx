import { Redirect } from 'expo-router';

import { StatePanel } from '@/components/state-panel';
import { Screen } from '@/components/screen';
import { useSession } from '@/features/auth/session-context';

export default function Index() {
  const { isAuthenticated, isHydrating } = useSession();
  if (isHydrating) {
    return <Screen scroll={false}><StatePanel loading title="Preparando seu monitoramento" /></Screen>;
  }
  return <Redirect href={isAuthenticated ? '/(app)' : '/(auth)/login'} />;
}
