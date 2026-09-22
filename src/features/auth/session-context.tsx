import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ApiError, apiRequest, configureApiTransport } from '@/services/api';
import { getGoogleIdToken } from '@/services/google-auth';
import { clearStoredTokens, readStoredTokens, storeTokens } from '@/services/session-storage';
import type { AuthSession, AuthTokens, User } from '@/types/domain';

type Credentials = { email: string; senha: string };
type Registration = Credentials & { nome: string };

type SessionContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (registration: Registration) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  reloadProfile: () => Promise<void>;
  updateTheme: (theme: User['tema']) => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const tokensRef = useRef<AuthTokens | null>(null);
  const pendingGoogleLinkRef = useRef<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  const clearSession = useCallback(async () => {
    tokensRef.current = null;
    setUser(null);
    await clearStoredTokens();
  }, []);

  const updateTokens = useCallback(async (tokens: AuthTokens) => {
    tokensRef.current = tokens;
    await storeTokens(tokens);
  }, []);

  useEffect(() => {
    configureApiTransport({
      getTokens: () => tokensRef.current,
      updateTokens,
      onUnauthorized: clearSession,
    });
  }, [clearSession, updateTokens]);

  const reloadProfile = useCallback(async () => {
    const response = await apiRequest<{ data: User }>('/me');
    setUser(response.data);
  }, []);

  const updateTheme = useCallback(async (theme: User['tema']) => {
    const previous = user;
    if (!previous || previous.tema === theme) return;
    setUser({ ...previous, tema: theme });
    try {
      const response = await apiRequest<{ data: User }>('/me', {
        method: 'PATCH',
        body: JSON.stringify({ tema: theme }),
      });
      setUser(response.data);
    } catch (error) {
      setUser(previous);
      throw error;
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    async function hydrate() {
      const stored = await readStoredTokens();
      if (!active) return;
      if (stored) {
        tokensRef.current = stored;
        try {
          const response = await apiRequest<{ data: User }>('/me');
          if (active) setUser(response.data);
        } catch {
          await clearSession();
        }
      }
      if (active) setIsHydrating(false);
    }
    void hydrate();
    return () => {
      active = false;
    };
  }, [clearSession]);

  const acceptSession = useCallback(async (session: AuthSession) => {
    await updateTokens({ accessToken: session.accessToken, refreshToken: session.refreshToken });
    setUser(session.usuario);
  }, [updateTokens]);

  const login = useCallback(async (credentials: Credentials) => {
    const response = await apiRequest<{ data: AuthSession }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, email: credentials.email.trim().toLowerCase() }),
    }, { auth: false });
    await acceptSession(response.data);
    const pendingGoogleToken = pendingGoogleLinkRef.current;
    if (pendingGoogleToken) {
      pendingGoogleLinkRef.current = null;
      await apiRequest<void>('/auth/google/link', {
        method: 'POST',
        body: JSON.stringify({ idToken: pendingGoogleToken }),
      });
    }
  }, [acceptSession]);

  const register = useCallback(async (registration: Registration) => {
    const response = await apiRequest<{ data: AuthSession }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...registration,
        nome: registration.nome.trim(),
        email: registration.email.trim().toLowerCase(),
      }),
    }, { auth: false });
    await acceptSession(response.data);
  }, [acceptSession]);

  const loginWithGoogle = useCallback(async () => {
    const idToken = await getGoogleIdToken();
    try {
      const response = await apiRequest<{ data: AuthSession }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      }, { auth: false });
      await acceptSession(response.data);
    } catch (error) {
      if (error instanceof ApiError && error.code === 'AUTH_GOOGLE_LINK_REQUIRED') {
        pendingGoogleLinkRef.current = idToken;
      }
      throw error;
    }
  }, [acceptSession]);

  const logout = useCallback(async () => {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' }, { retryAuth: false });
    } finally {
      await clearSession();
    }
  }, [clearSession]);

  const deleteAccount = useCallback(async () => {
    await apiRequest<void>('/me', { method: 'DELETE' });
    await clearSession();
  }, [clearSession]);

  const value = useMemo<SessionContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    isHydrating,
    login,
    register,
    loginWithGoogle,
    logout,
    deleteAccount,
    reloadProfile,
    updateTheme,
  }), [deleteAccount, isHydrating, login, loginWithGoogle, logout, register, reloadProfile, updateTheme, user]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession deve ser usado dentro de SessionProvider.');
  return context;
}
