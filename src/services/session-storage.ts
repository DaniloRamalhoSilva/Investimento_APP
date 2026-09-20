import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import type { AuthTokens } from '@/types/domain';

const STORAGE_KEY = 'sentinela.auth.tokens.v1';
let webMemory: AuthTokens | null = null;

export async function readStoredTokens(): Promise<AuthTokens | null> {
  try {
    const raw = Platform.OS === 'web' ? null : await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return webMemory;
    const value = JSON.parse(raw) as Partial<AuthTokens>;
    return value.accessToken && value.refreshToken
      ? { accessToken: value.accessToken, refreshToken: value.refreshToken }
      : null;
  } catch {
    return null;
  }
}

export async function storeTokens(tokens: AuthTokens) {
  if (Platform.OS === 'web') {
    webMemory = tokens;
    return;
  }
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(tokens), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function clearStoredTokens() {
  webMemory = null;
  if (Platform.OS !== 'web') await SecureStore.deleteItemAsync(STORAGE_KEY);
}
