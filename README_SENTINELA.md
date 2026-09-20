# Sentinela

> **Você investe. O Sentinela vigia.**

O **Sentinela** é uma plataforma de monitoramento inteligente de investimentos criada para ajudar investidores a identificar informações relevantes sobre os ativos que acompanham sem precisar monitorar manualmente dezenas de fontes todos os dias.

A proposta não é entregar mais notícias.

A proposta é entregar **menos ruído e mais sinal**.

O sistema acompanha informações relacionadas aos ativos cadastrados pelo usuário, organiza os dados, utiliza inteligência artificial para gerar contexto e destaca aquilo que pode merecer atenção.

> **Menos notícias. Mais relevância.**

---

# Visão geral

O Sentinela nasceu de um problema real: uma informação importante sobre um Fundo Imobiliário foi descoberta tarde demais, depois que o mercado já havia reagido.

A informação existia.

O problema era saber que ela existia e entender rapidamente se aquilo realmente importava.

A partir disso surgiu a ideia:

> **E se existisse algo acompanhando meus investimentos mesmo quando eu não estivesse olhando?**

O Sentinela foi criado para responder a essa pergunta.

---

# Objetivo do produto

O objetivo do Sentinela é permitir que o investidor:

- cadastre os investimentos que deseja acompanhar;
- receba apenas informações potencialmente relevantes;
- entenda rapidamente o que aconteceu;
- veja o possível impacto da informação;
- consulte riscos e pontos de atenção;
- acesse a fonte original;
- mantenha histórico dos acontecimentos relacionados à sua carteira.

O produto não pretende substituir a análise do investidor.

O Sentinela organiza e contextualiza informações para ajudar o usuário a tomar suas próprias decisões.

---

# Posicionamento

O Sentinela **não é**:

- corretora;
- banco;
- portal de notícias;
- plataforma de trading;
- robô de compra e venda;
- recomendação automática de investimento;
- promessa de rentabilidade;
- ferramenta de previsão de mercado.

O Sentinela é:

> **uma camada de monitoramento e inteligência entre o investidor e as informações relacionadas à carteira dele.**

---

# Público inicial

A primeira versão do produto é focada em investidores pessoa física que possuem **Fundos Imobiliários — FIIs** e não conseguem acompanhar diariamente todas as publicações, comunicados e notícias relacionadas aos ativos da própria carteira.

No futuro, a plataforma poderá evoluir para suportar:

- ações;
- ETFs;
- BDRs;
- outros fundos;
- outros tipos de ativos.

A marca Sentinela foi pensada para permitir essa expansão sem precisar reposicionar o produto.

---

# Proposta de valor

A principal proposta de valor do Sentinela é:

> **Saiba quando algo importante acontecer com seus investimentos.**

O usuário não precisa acompanhar continuamente:

- B3;
- CVM;
- Fundos.NET;
- sites de gestoras;
- comunicados;
- fatos relevantes;
- relatórios;
- outras fontes confiáveis.

O Sentinela faz o acompanhamento, organiza os dados e apresenta o que merece atenção.

---

# Conceitos da marca

## Slogan

> **Você investe. O Sentinela vigia.**

## Proposta

> **Saiba quando algo importante acontecer com seus investimentos.**

## Conceito

> **Menos notícias. Mais relevância.**

## Comparativo

> **Menos barulho. Mais sinal.**

---

# Como funciona

Fluxo simplificado:

```text
Fontes de informação
        ↓
Pesquisa / coleta
        ↓
Análise e classificação
        ↓
Inteligência Artificial
        ↓
JSON estruturado
        ↓
API Sentinela
        ↓
Banco de dados
        ↓
Distribuição por carteira
        ↓
Aplicativo
        ↓
Usuário
```

O objetivo é analisar uma informação **uma única vez** e distribuí-la para todos os usuários que acompanham o ativo relacionado.

Exemplo:

```text
Nova publicação sobre MXRF11
        ↓
Análise única
        ↓
10.000 usuários possuem MXRF11
        ↓
A mesma análise pode atender todos eles
```

Essa abordagem é fundamental para a escalabilidade do produto.

---

# MVP atual

O projeto está sendo validado de forma incremental.

Na fase atual, o processo de análise utiliza tarefas agendadas no ChatGPT.

Fluxo do MVP:

```text
ChatGPT Tasks
        ↓
Pesquisa dos FIIs configurados
        ↓
Resumo e análise
        ↓
Estruturação em JSON
        ↓
Envio para a API
        ↓
Persistência no banco
```

Essa estratégia permite validar o produto antes da criação de uma infraestrutura própria de coleta e processamento.

O MVP inicialmente será disponibilizado apenas para amigos, conhecidos e usuários convidados.

---

# Evolução planejada

A dependência das tarefas do ChatGPT é propositalmente temporária.

A evolução prevista é:

```text
Fontes oficiais
      ↓
Coletores próprios
      ↓
Normalização
      ↓
Deduplicação
      ↓
Filtro de relevância
      ↓
LLM
      ↓
Análise estruturada
      ↓
API Sentinela
      ↓
Usuários
```

A LLM continuará sendo uma parte importante do produto, mas não será responsável por toda a infraestrutura.

---

# Fontes de informação

A primeira versão prioriza fontes confiáveis e oficiais.

Entre elas:

- **B3**
- **CVM**
- **Fundos.NET**
- sites e documentos oficiais de gestoras e administradores

A plataforma pode incorporar novas fontes conforme o produto evoluir.

O objetivo não é esconder a origem da informação.

Sempre que possível, o usuário poderá acessar a publicação original.

> **A IA ajuda a interpretar. A fonte continua sendo a referência.**

---

# O que uma análise pode conter

Uma análise do Sentinela poderá apresentar:

## Importância

Exemplos:

```text
URGENTE
RELEVANTE
SEM_RELEVANCIA
```

## Possível impacto

```text
POSITIVO
NEGATIVO
NEUTRO
INCERTO
```

## Horizonte

```text
CURTO_PRAZO
MEDIO_PRAZO
LONGO_PRAZO
INDEFINIDO
```

## Confiança

```text
ALTA
MEDIA
BAIXA
```

## Sinal para análise

Exemplos:

```text
AVALIAR_SAIDA
MANTER
AVALIAR_AUMENTAR_POSICAO
SEM_DADOS_SUFICIENTES
```

Esses sinais devem ser tratados como informações auxiliares para análise do usuário e não como ordens automáticas.

Uma análise também poderá conter:

- resumo;
- justificativa;
- riscos;
- números-chave;
- publicações relacionadas;
- data;
- fonte;
- URL original.

---

# Exemplo de análise

```json
{
  "ticker": "MXRF11",
  "status": "ANALISADO",
  "classificacao": "RELEVANTE",
  "impacto": "NEGATIVO",
  "horizonte": "CURTO_PRAZO",
  "confianca": "ALTA",
  "sinalAcao": "MANTER",
  "resumo": "Resumo objetivo da informação identificada.",
  "justificativaSinal": "Explicação factual sobre o motivo da classificação.",
  "riscos": [
    "Risco identificado na publicação."
  ],
  "publicacoes": [
    {
      "fonte": "FUNDOS_NET",
      "titulo": "Documento original",
      "urlOriginal": "https://..."
    }
  ]
}
```

---

# Experiência do usuário

A experiência do Sentinela deve ser simples.

O usuário não precisa conversar com um chatbot.

Fluxo esperado:

```text
Criar conta
    ↓
Cadastrar FIIs
    ↓
Sentinela monitora
    ↓
Informação relevante identificada
    ↓
Usuário recebe alerta
    ↓
Usuário abre análise
    ↓
Consulta resumo, impacto, riscos e fonte
```

O produto deve trabalhar em segundo plano.

A ideia é que o usuário abra o aplicativo e responda rapidamente:

> **Está tudo bem com meus investimentos?**

---

# Dashboard

O dashboard deve apresentar uma visão simples da carteira.

Exemplo:

```text
11 ativos acompanhados

9 sem novidades importantes
2 com atualizações
1 informação urgente
```

O objetivo não é criar um terminal financeiro complexo.

O dashboard deve comunicar **estado e prioridade**.

---

# Feed

O feed apresenta as análises relacionadas aos ativos do usuário.

Prioridade visual:

```text
URGENTE
RELEVANTE
SEM_RELEVANCIA
```

O Sentinela não deve incentivar consumo infinito de notícias.

A relevância é mais importante que quantidade.

---

# Notificações

O conceito inicial é:

## Urgente

Gera notificação.

## Relevante

Gera notificação.

## Sem relevância

Pode aparecer no histórico, mas não precisa interromper o usuário.

## Sem novidades

Não gera notificação.

A regra poderá evoluir conforme o comportamento dos usuários e as preferências individuais.

---

# Modelo de negócio

O produto foi pensado inicialmente em modelo **freemium**.

Hipótese atual:

| Plano | Limite de FIIs | Anúncios | Valor inicial |
|---|---:|---|---:|
| Grátis | até 3 | Sim | R$ 0 |
| Essencial | até 20 | Não | R$ 9,90/mês |
| Premium | até 100 | Não | R$ 19,90/mês |

Os valores ainda não devem ser considerados definitivos.

A fase de lista de espera e MVP será utilizada para validar:

- interesse;
- percepção de valor;
- quantidade média de ativos;
- disposição a pagar;
- diferenciais entre planos.

---

# Lista de espera

Antes da abertura pública do produto, será utilizada uma landing page para capturar interessados.

Objetivos:

- validar a proposta de valor;
- medir interesse;
- montar base inicial de usuários;
- aprender sobre o perfil dos investidores;
- testar percepção de preço;
- identificar funcionalidades mais desejadas.

CTA principal:

> **Quero entrar na lista de espera**

---

# Landing page

A landing page oficial segue uma abordagem:

- mobile-first;
- vertical;
- visual premium;
- fundo escuro;
- teal/ciano como cor de marca;
- narrativa baseada em scroll;
- uso de radar, farol e paisagens como elementos visuais;
- bastante espaço;
- pouca poluição visual.

A landing não deve parecer:

- corretora;
- banco;
- terminal financeiro.

A sensação desejada é:

> **calma, vigilância e confiança.**

---

# Identidade visual

O conceito visual do Sentinela utiliza elementos relacionados a:

- vigilância;
- radar;
- farol;
- orientação;
- monitoramento;
- visão à distância.

Paleta conceitual:

```text
Background:      #080D16
Surface:         #101824
Brand / Teal:    #22D3B6
Text:            #F5F7FA
Muted:           #94A3B8
```

Estados:

- verde: normal/positivo;
- âmbar: atenção;
- vermelho: urgente;
- teal: identidade da marca.

---

# Estrutura do projeto

A estrutura física pode variar conforme os repositórios, mas conceitualmente o ecossistema possui:

```text
Sentinela
│
├── API
│   ├── autenticação
│   ├── usuários
│   ├── fundos
│   ├── carteira
│   ├── análises
│   ├── ingestão
│   ├── dashboard
│   └── notificações
│
├── Mobile
│   ├── autenticação
│   ├── carteira
│   ├── dashboard
│   ├── feed
│   ├── detalhe da análise
│   └── notificações
│
├── Landing Page
│   ├── apresentação
│   ├── lista de espera
│   └── pesquisa de validação
│
└── Pipeline de Inteligência
    ├── coleta
    ├── deduplicação
    ├── classificação
    ├── resumo
    └── integração com API
```

---

# Tecnologias

## Backend

A base atual utiliza:

- **Node.js**
- **Sequelize**
- **PostgreSQL**
- migrations versionadas

A API é responsável por:

- usuários;
- autenticação;
- fundos;
- carteira;
- ingestão;
- persistência;
- consultas;
- análises;
- dashboard;
- notificações;
- integração com o mobile.

---

# Front-end

## Landing Page

- React
- TypeScript
- abordagem mobile-first

## Aplicativo

Planejado em:

- **React Native**

O front-end mobile será desenvolvido após a consolidação da proposta de valor e da experiência principal do produto.

---

# Inteligência Artificial

Na fase inicial:

- ChatGPT Tasks realiza pesquisas;
- as informações são analisadas;
- o resultado é estruturado;
- um JSON é enviado para a API.

Na arquitetura futura:

- coleta será própria;
- IA será utilizada principalmente para interpretação;
- a API não deverá depender de um fornecedor específico de LLM.

Princípio:

> **A IA é parte do motor do Sentinela, não o produto inteiro.**

---

# Banco de dados

As principais entidades atuais incluem:

```text
tb_usuarios
tb_fundos
tb_usuarios_fundos

tb_consultas
tb_analises_fundos

tb_riscos
tb_numeros_chave
tb_publicacoes
tb_avisos
```

Além das tabelas de domínio:

```text
tb_tipo_status
tb_tipo_classificacao
tb_tipo_sinal_acao
tb_tipo_impacto
tb_tipo_horizonte
tb_tipo_confianca
tb_tipo_fonte
```

A estrutura deverá evoluir conforme o produto exigir.

Existe liberdade para criação de novas tabelas e refatorações através de migrations.

---

# Princípio de escalabilidade

Um dos princípios mais importantes do projeto:

> **Coletar uma vez. Analisar uma vez. Distribuir para quem importa.**

Não realizar uma análise separada para cada usuário.

Exemplo:

```text
MXRF11 possui 50.000 usuários acompanhando
                ↓
        nova publicação
                ↓
       uma análise
                ↓
distribuição para os usuários elegíveis
```

---

# Idempotência e deduplicação

A plataforma deverá evitar:

- processamento duplicado;
- notícias repetidas;
- notificações duplicadas;
- análises repetidas do mesmo evento.

Existem dois conceitos distintos:

## Idempotência

Evita processar duas vezes a mesma requisição.

## Deduplicação de evento

Evita considerar a mesma informação como nova em execuções diferentes.

Esses princípios são essenciais para a experiência do usuário.

---

# Segurança

Princípios gerais:

- senhas nunca armazenadas em texto puro;
- segredos fora do repositório;
- autenticação adequada;
- validação de entrada;
- rate limiting quando necessário;
- logs sem dados sensíveis;
- acesso protegido às análises do usuário;
- minimização de dados pessoais;
- atenção à LGPD.

---

# Privacidade

O MVP deve coletar apenas os dados necessários.

O produto não precisa inicialmente solicitar:

- CPF;
- endereço;
- telefone;
- outros dados pessoais sem relação direta com a experiência.

Princípio:

> **Se o produto não precisa do dado, não solicitar.**

---

# Aviso importante

O Sentinela é uma ferramenta informativa.

Não constitui recomendação de investimento.

Informações produzidas ou resumidas por inteligência artificial podem conter imprecisões.

Sempre que possível, o usuário poderá consultar a fonte original.

A decisão de investimento é responsabilidade do próprio investidor.

---

# Roadmap

## Fase 1 — Validação

- [x] definição da ideia;
- [x] proposta de valor;
- [x] identidade inicial;
- [x] API inicial;
- [x] banco de dados inicial;
- [x] tarefas de pesquisa no ChatGPT;
- [x] integração via JSON;
- [ ] landing page;
- [ ] lista de espera;
- [ ] primeiros usuários convidados.

---

## Fase 2 — MVP funcional

- [ ] autenticação completa;
- [ ] carteira;
- [ ] dashboard;
- [ ] feed;
- [ ] detalhe de análise;
- [ ] notificações;
- [ ] aplicativo React Native;
- [ ] testes com usuários reais.

---

## Fase 3 — Pipeline próprio

- [ ] coletores de fontes oficiais;
- [ ] processo próprio de descoberta;
- [ ] normalização;
- [ ] deduplicação;
- [ ] classificação;
- [ ] integração com LLM;
- [ ] processamento assíncrono;
- [ ] observabilidade.

---

## Fase 4 — Monetização

- [ ] validar preços;
- [ ] implementar plano gratuito;
- [ ] implementar Essencial;
- [ ] implementar Premium;
- [ ] assinatura;
- [ ] gestão de plano;
- [ ] limites por plano.

---

## Fase 5 — Expansão

- [ ] ações;
- [ ] ETFs;
- [ ] outros ativos;
- [ ] novos tipos de eventos;
- [ ] personalização de alertas;
- [ ] novos recursos baseados em carteira.

---

# Filosofia do projeto

Toda decisão deve passar por algumas perguntas:

### Isso reduz ruído?

Se não, provavelmente não é prioridade.

### Isso ajuda o usuário a entender algo importante?

Se sim, pode gerar valor.

### Isso é realmente necessário no MVP?

Se não, pode esperar.

### Estamos prometendo algo que conseguimos entregar?

Se não, não devemos comunicar.

### Estamos analisando a mesma informação várias vezes?

Se sim, a arquitetura deve ser revisada.

---

# Princípio de UX

O usuário não deve sentir:

> “Tenho mais uma plataforma financeira para acompanhar.”

Ele deve sentir:

> **“Existe algo acompanhando minha carteira por mim.”**

---

# Princípio de produto

O Sentinela não deve tentar competir em quantidade de informação.

Seu diferencial é exatamente o contrário.

> **Menos barulho. Mais sinal.**

---

# Status atual

O projeto encontra-se em fase de **MVP e validação de produto**.

A prioridade atual é:

1. consolidar a proposta de valor;
2. concluir a landing page;
3. criar a lista de espera;
4. validar o fluxo atual de ingestão;
5. testar com usuários próximos;
6. aprender com o comportamento real;
7. somente depois investir na infraestrutura definitiva.

---

# Documentação complementar

O projeto possui documentos específicos para partes importantes da solução.

Exemplos:

```text
SENTINELA_API_DESENVOLVIMENTO.md
SENTINELA_LANDING_PAGE_CODEX.md
```

Esses documentos contêm especificações mais detalhadas para implementação.

O `README.md` deve continuar sendo a visão geral do produto e do ecossistema.

---

# Contribuição

Durante a fase inicial, qualquer contribuição deve respeitar:

- proposta central do produto;
- arquitetura existente;
- simplicidade;
- separação de responsabilidades;
- segurança;
- performance;
- acessibilidade;
- experiência mobile-first;
- ausência de promessas financeiras;
- foco na validação antes de complexidade.

Antes de implementar uma nova funcionalidade, confirmar se ela realmente faz parte da fase atual.

---

# Frase final

> **Você investe. O Sentinela vigia.**

O objetivo não é fazer o usuário acompanhar mais o mercado.

É ajudá-lo a perceber quando alguma coisa realmente merece sua atenção.
