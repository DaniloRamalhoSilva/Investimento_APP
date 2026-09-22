import { Platform } from 'react-native';

import type { AuthTokens } from '@/types/domain';

type ApiErrorBody = {
  error?: { code?: string; message?: string; details?: unknown };
  code?: string;
  message?: string;
  requestId?: string;
};

type Transport = {
  getTokens: () => AuthTokens | null;
  updateTokens: (tokens: AuthTokens) => Promise<void>;
  onUnauthorized: () => Promise<void>;
};

const developmentHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_URL = (
  process.env.EXPO_PUBLIC_API_URL || `http://${developmentHost}:3000/api/v1`
).replace(/\/$/, '');

let transport: Transport = {
  getTokens: () => null,
  updateTokens: async () => undefined,
  onUnauthorized: async () => undefined,
};
let refreshPromise: Promise<AuthTokens> | null = null;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function configureApiTransport(next: Transport) {
  transport = next;
}

async function parseError(response: Response) {
  let body: ApiErrorBody = {};
  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    // A resposta pode estar vazia em falhas de infraestrutura.
  }
  const error = body.error;
  return new ApiError(
    response.status,
    error?.code || body.code || `HTTP_${response.status}`,
    error?.message || body.message || 'Não foi possível concluir a solicitação.',
    error?.details,
    body.requestId,
  );
}

async function baseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Sem conexão com o Sentinela. Verifique sua internet e tente novamente.');
  }

  if (!response.ok) throw await parseError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

async function refreshTokens() {
  const current = transport.getTokens();
  if (!current?.refreshToken) throw new ApiError(401, 'AUTH_SESSION_MISSING', 'Sua sessão expirou.');

  if (!refreshPromise) {
    refreshPromise = baseRequest<{ data: AuthTokens }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    })
      .then(async ({ data }) => {
        await transport.updateTokens(data);
        return data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: { auth?: boolean; retryAuth?: boolean } = {},
): Promise<T> {
  const auth = options.auth !== false;
  const token = transport.getTokens()?.accessToken;

  try {
    return await baseRequest<T>(path, {
      ...init,
      headers: {
        ...init.headers,
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !auth || options.retryAuth === false) {
      throw error;
    }
    try {
      const refreshed = await refreshTokens();
      return await baseRequest<T>(path, {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${refreshed.accessToken}` },
      });
    } catch (refreshError) {
      await transport.onUnauthorized();
      throw refreshError;
    }
  }
}

export function apiMessage(error: unknown) {
  if (error instanceof ApiError) {
    const messages: Record<string, string> = {
      AUTH_INVALID_CREDENTIALS: 'E-mail ou senha inválidos.',
      USER_ALREADY_EXISTS: 'Já existe uma conta com este e-mail.',
      PLAN_LIMIT_REACHED: 'Você chegou ao limite de FIIs do plano gratuito. Os planos pagos ainda não estão disponíveis; você pode entrar na lista de espera no Perfil.',
      AUTH_GOOGLE_LINK_REQUIRED: 'Este e-mail já possui conta. Entre com senha para vincular o Google.',
      FUND_NOT_FOUND: 'Ativo não encontrado.',
      FUND_NOT_IN_PORTFOLIO: 'Este ativo ainda não foi adicionado à sua carteira.',
      FUND_MONITORING_ACTIVE: 'Desligue o monitoramento antes de excluir este ativo.',
      ANALYSIS_NOT_FOUND: 'Esta análise não está mais disponível.',
    };
    return messages[error.code] || error.message;
  }
  return 'Algo não saiu como esperado. Tente novamente.';
}
