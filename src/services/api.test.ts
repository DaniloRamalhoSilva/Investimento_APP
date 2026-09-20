import { apiMessage, ApiError, apiRequest, configureApiTransport } from '@/services/api';
import type { AuthTokens } from '@/types/domain';

function response(status: number, body?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('api client', () => {
  afterEach(() => jest.restoreAllMocks());

  it('traduz códigos conhecidos sem depender da mensagem do backend', () => {
    expect(apiMessage(new ApiError(401, 'AUTH_INVALID_CREDENTIALS', 'raw'))).toBe('E-mail ou senha inválidos.');
  });

  it('renova a sessão e repete uma requisição expirada', async () => {
    let tokens: AuthTokens | null = { accessToken: 'old-access', refreshToken: 'old-refresh' };
    const updateTokens = jest.fn(async (next: AuthTokens) => { tokens = next; });
    configureApiTransport({
      getTokens: () => tokens,
      updateTokens,
      onUnauthorized: jest.fn(async () => undefined),
    });

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(async (_input, init) => {
      const authorization = (init?.headers as Record<string, string> | undefined)?.Authorization;
      if (String(_input).endsWith('/auth/refresh')) {
        return response(200, { data: { accessToken: 'new-access', refreshToken: 'new-refresh' } });
      }
      if (authorization === 'Bearer old-access') {
        return response(401, { error: { code: 'AUTH_TOKEN_EXPIRED', message: 'Expirou.' } });
      }
      return response(200, { data: { ok: true } });
    });

    await expect(apiRequest<{ data: { ok: boolean } }>('/me')).resolves.toEqual({ data: { ok: true } });
    expect(updateTokens).toHaveBeenCalledWith({ accessToken: 'new-access', refreshToken: 'new-refresh' });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
