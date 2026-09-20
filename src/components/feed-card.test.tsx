import { render, screen } from '@testing-library/react-native';

import { FeedCard } from '@/components/feed-card';
import type { FeedItem } from '@/types/domain';

const item: FeedItem = {
  analiseId: '1',
  ticker: 'KNRI11',
  titulo: 'Título completo da análise',
  classificacao: 'SEM_RELEVANCIA',
  impacto: 'NEUTRO',
  horizonte: 'CURTO_PRAZO',
  resumo: 'Resumo detalhado da análise.',
  ocorreuEm: null,
  lida: false,
};

describe('FeedCard', () => {
  it('mostra apenas ticker, status, impacto e data no modo compacto', () => {
    render(<FeedCard compact item={item} onPress={jest.fn()} />);

    expect(screen.getByText('KNRI11')).toBeTruthy();
    expect(screen.getByText('Sem Relevancia')).toBeTruthy();
    expect(screen.getByText('Neutro')).toBeTruthy();
    expect(screen.getByText('Ainda não atualizado')).toBeTruthy();
    expect(screen.queryByText(item.titulo!)).toBeNull();
    expect(screen.queryByText(item.resumo)).toBeNull();
  });

  it('mantém título e resumo no modo detalhado usado em Alertas', () => {
    render(<FeedCard item={item} onPress={jest.fn()} />);

    expect(screen.getByText(item.titulo!)).toBeTruthy();
    expect(screen.getByText(item.resumo)).toBeTruthy();
  });
});
