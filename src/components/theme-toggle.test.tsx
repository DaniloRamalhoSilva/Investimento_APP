import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ThemeToggle } from '@/components/theme-toggle';
import { useSession } from '@/features/auth/session-context';

jest.mock('@/features/auth/session-context', () => ({ useSession: jest.fn() }));

const mockedSession = useSession as jest.Mock;

it('ativa o tema claro pela mesma preferência usada no Perfil', async () => {
  const updateTheme = jest.fn().mockResolvedValue(undefined);
  mockedSession.mockReturnValue({ user: { tema: 'dark' }, updateTheme });

  render(<ThemeToggle />);
  fireEvent.press(screen.getByRole('button', { name: 'Ativar tema claro' }));

  await waitFor(() => expect(updateTheme).toHaveBeenCalledWith('light'));
});

it('oferece voltar ao escuro quando o tema atual é claro', () => {
  mockedSession.mockReturnValue({ user: { tema: 'light' }, updateTheme: jest.fn() });

  render(<ThemeToggle />);

  expect(screen.getByRole('button', { name: 'Ativar tema escuro' })).toBeTruthy();
});
