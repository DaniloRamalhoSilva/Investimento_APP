export type Classification = 'URGENTE' | 'RELEVANTE' | 'SEM_RELEVANCIA';
export type Impact = 'POSITIVO' | 'NEGATIVO' | 'NEUTRO' | 'INCERTO';
export type Horizon = 'CURTO_PRAZO' | 'MEDIO_PRAZO' | 'LONGO_PRAZO' | 'INDEFINIDO';
export type Confidence = 'ALTA' | 'MEDIA' | 'BAIXA';

export type User = {
  id: string;
  nome: string;
  sobrenome: string | null;
  email: string;
  tema: 'dark' | 'light';
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSession = AuthTokens & {
  usuario: User;
};

export type FeedItem = {
  analiseId: string;
  ticker: string;
  titulo: string | null;
  classificacao: Classification | null;
  impacto: Impact | null;
  horizonte: Horizon | null;
  resumo: string;
  ocorreuEm: string | null;
  lida: boolean;
};

export type Dashboard = {
  monitoramento: {
    ativosMonitorados: number;
    urgentes: number;
    relevantes: number;
    semNovidades: number;
  };
  ultimaAtualizacaoEm: string | null;
  destaques: FeedItem[];
};

export type PortfolioFund = {
  id: string;
  ticker: string;
  monitorando: boolean;
  adicionadoEm: string | null;
};

export type SearchFund = {
  id: string;
  ticker: string;
  naCarteira: boolean;
  monitorando: boolean;
};

export type PlanCode = 'GRATIS' | 'ESSENCIAL' | 'PREMIUM';

export type PlanDefinition = {
  code: PlanCode;
  name: string;
  priceMonthlyCents: number;
  currency: 'BRL';
  fundLimit: number;
  recommended: boolean;
  features: {
    resumosIa: boolean;
    classificacaoRelevancia: boolean;
    possivelImpacto: boolean;
    riscosIdentificados: boolean;
    fonteOriginal: boolean;
    alertasImportantes: boolean;
    historico: 'BASICO' | 'COMPLETO';
    anuncios: boolean;
    recursosAvancados: boolean;
  };
};

export type PlanOverview = {
  currentPlan: PlanCode;
  fundLimit: number;
  fundsUsed: number;
  waitlistedPlans: Exclude<PlanCode, 'GRATIS'>[];
  plans: PlanDefinition[];
};

export type Analysis = {
  id: string;
  ticker: string;
  titulo: string | null;
  status: string;
  classificacao: Classification | null;
  sinalAcao: string | null;
  impacto: Impact | null;
  horizonte: Horizon | null;
  confianca: Confidence | null;
  ocorreuEm: string | null;
  resumo: string;
  justificativaSinal: string | null;
  riscos: string[];
  numerosChave: { descricao: string; valor: string }[];
  publicacoes: {
    titulo: string;
    fonte: string;
    publicadoEm: string | null;
    urlOriginal: string;
  }[];
};

export type Page<T> = {
  data: T[];
  meta: { hasMore: boolean; nextCursor: string | null };
};
