import { firstName, humanizeCode } from '@/utils/format';

describe('format helpers', () => {
  it('extrai o primeiro nome sem espaços extras', () => {
    expect(firstName('  Carlos Alberto  ')).toBe('Carlos');
  });

  it('usa um nome neutro quando o perfil ainda não carregou', () => {
    expect(firstName(undefined)).toBe('investidor');
  });

  it('transforma códigos de domínio em texto legível', () => {
    expect(humanizeCode('CURTO_PRAZO')).toBe('Curto Prazo');
    expect(humanizeCode(null)).toBe('Não informado');
  });
});
