# Sentinela APP — Diretrizes de Desenvolvimento

> **Documento de instruções para o Codex**
>
> Objetivo: orientar o desenvolvimento do aplicativo mobile **Sentinela** em React Native, com foco em qualidade profissional, simplicidade, segurança, experiência mobile-first e aderência ao negócio definido no projeto.
>
> Este documento deve ser tratado como referência geral para o desenvolvimento do aplicativo.

---

# 1. Visão geral do produto

O **Sentinela** é um aplicativo de monitoramento inteligente de investimentos.

A proposta principal é:

> **Você investe. O Sentinela vigia.**

O usuário cadastra os Fundos Imobiliários — FIIs — que deseja acompanhar e o Sentinela apresenta informações relevantes relacionadas a esses ativos, com apoio de inteligência artificial para:

- resumir conteúdos;
- classificar relevância;
- indicar possível impacto;
- destacar riscos;
- apresentar a fonte original;
- organizar o histórico.

O objetivo não é ser um portal de notícias nem incentivar consumo excessivo de informação.

A proposta é:

> **Menos notícias. Mais relevância.**

---

# 2. Fonte das regras de negócio

Utilizar como referência principal de negócio:

```text
Investimento\Investimento_APP\README_SENTINELA.md
```

A parte de negócio desse documento está considerada válida.

A parte técnica deve ser tratada apenas como referência e precisa ser validada contra:

- estrutura real do projeto;
- arquitetura atual;
- documentação oficial das tecnologias utilizadas;
- políticas atuais da Google Play.

Se houver divergência entre documentação técnica antiga e a arquitetura real do projeto, analisar antes de implementar.

---

# 3. Referências obrigatórias

## Funcionalidades e fluxo

Utilizar:

```text
Investimento\Investimento_APP\Arquitetura e Fluxo.png
```

como referência para:

- funcionalidades;
- navegação;
- experiência;
- organização das telas;
- fluxo principal.

O aplicativo deve ser simples e intuitivo.

Não copiar cegamente a imagem caso alguma solução de UX melhor seja identificada.

Se houver proposta de alteração relevante no fluxo, explicar antes de implementar.

## Referência visual

Utilizar:

```text
Investimento\Investimento_Web
```

como referência para:

- identidade visual;
- cores;
- tipografia;
- linguagem da marca;
- botões;
- cards;
- estados;
- espaçamento;
- estilo geral.

O mobile deve pertencer claramente ao mesmo ecossistema visual da landing page.

Não copiar layouts web diretamente para o celular.

Adaptar a experiência para mobile.

---

# 4. Stack

Desenvolver o aplicativo utilizando:

```text
React Native
TypeScript
```

Antes de escolher Expo, React Native CLI ou qualquer outra abordagem, analisar o projeto atual.

Se o projeto já possuir uma estrutura definida:

- preservar;
- reutilizar;
- evitar migração desnecessária.

---

# 5. Padrão profissional

O projeto deve seguir padrões profissionais de mercado.

Priorizar:

- organização;
- separação de responsabilidades;
- código legível;
- testabilidade;
- segurança;
- reutilização;
- baixo acoplamento;
- alta coesão;
- manutenção futura.

Não concentrar lógica de negócio em telas.

Estrutura conceitual esperada:

```text
Screen
   ↓
Components
   ↓
Hooks / Use Cases
   ↓
Services
   ↓
API / Storage
```

Adaptar os nomes à arquitetura existente.

---

# 6. Regra para novas dependências

Se for necessário instalar qualquer nova biblioteca, pacote, SDK ou ferramenta:

**não instalar automaticamente.**

Antes, informar:

1. nome da dependência;
2. objetivo;
3. por que é necessária;
4. alternativa considerada;
5. impacto no projeto;
6. se existe custo;
7. se possui implicações de privacidade;
8. se afeta publicação na Play Store.

Aguardar autorização antes de instalar.

Exceção: dependências já presentes no projeto podem ser utilizadas normalmente.

---

# 7. Context7

Existe um MCP **Context7** disponível para consulta de documentação técnica externa.

Pode e deve ser utilizado quando necessário, especialmente para:

- React Native;
- bibliotecas;
- SDKs;
- autenticação;
- navegação;
- armazenamento seguro;
- build;
- integração nativa.

Para políticas da Google Play e serviços Google, priorizar também a documentação oficial atual.

---

# 8. Filosofia de UX

O aplicativo deve responder rapidamente à pergunta:

> **“Aconteceu algo importante com meus investimentos?”**

A interface deve priorizar:

- clareza;
- relevância;
- hierarquia;
- leitura rápida;
- poucos elementos por tela;
- baixa carga cognitiva.

Evitar:

- dashboards excessivamente densos;
- excesso de gráficos;
- excesso de cards;
- aparência de home broker;
- excesso de indicadores;
- informações que não ajudam na decisão do usuário.

---

# 9. Navegação principal

A navegação deverá ser definida após analisar o arquivo:

```text
Arquitetura e Fluxo.png
```

Como princípio geral, o app deverá possuir acesso simples a:

- Home / Dashboard;
- Carteira;
- Feed / Alertas;
- Detalhe da análise;
- Perfil;
- Plano / Assinatura;
- Configurações.

Não criar abas sem necessidade.

---

# 10. Autenticação — visão geral

O Sentinela deverá oferecer **duas formas de cadastro e login**.

## Opção 1 — Cadastro direto no Sentinela

O usuário poderá criar uma conta diretamente no aplicativo utilizando:

```text
nome
e-mail
senha
```

Fluxo:

```text
Cadastro no APP
      ↓
API Sentinela
      ↓
criação do usuário
      ↓
access token + refresh token
      ↓
sessão autenticada
```

Essa é uma forma de cadastro completamente válida e independente do Google.

## Opção 2 — Continuar com Google

O login com Google será uma alternativa opcional para:

- agilizar cadastro;
- reduzir atrito;
- evitar digitação de senha;
- facilitar retorno do usuário.

O usuário **não deve ser obrigado a possuir conta Google para utilizar o Sentinela**.

Fluxo conceitual:

```text
Google
   ↓
ID Token
   ↓
API Sentinela
   ↓
validação do token
   ↓
localiza ou cria usuário
   ↓
access token + refresh token do Sentinela
```

---

# 11. Tela inicial de autenticação

A tela deve permitir claramente:

```text
Entrar
Criar conta
Continuar com Google
```

Exemplo conceitual:

```text
E-mail
Senha

[ Entrar ]

──────── ou ────────

[ Continuar com Google ]

Ainda não possui conta?
Criar conta
```

Na tela de cadastro:

```text
Nome
E-mail
Senha
Confirmar senha

[ Criar conta ]

──────── ou ────────

[ Continuar com Google ]
```

Não utilizar linguagem que faça parecer que Google é obrigatório.

---

# 12. Vínculo entre conta direta e Google

Este ponto precisa ser tratado com cuidado.

Cenário:

1. usuário cria conta com:
   ```text
   usuario@email.com
   ```
2. futuramente utiliza Google com o mesmo e-mail.

Não criar automaticamente uma segunda conta para a mesma pessoa.

A API deverá possuir regra segura para:

- identificar possível conta existente;
- evitar duplicação;
- vincular provedores quando permitido e seguro.

Nunca vincular contas apenas confiando em um e-mail enviado pelo frontend.

O backend deve validar a identidade Google.

---

# 13. Modelo de autenticação recomendado

A API Sentinela continua sendo a autoridade da sessão do produto.

Independentemente de o login acontecer por:

```text
e-mail + senha
```

ou:

```text
Google
```

o resultado final deve ser:

```text
access token Sentinela
refresh token Sentinela
```

O aplicativo não deve possuir dois modelos completamente diferentes de sessão.

---

# 14. Cadastro direto — requisitos

Implementar:

- validação de nome;
- validação de e-mail;
- normalização de e-mail;
- senha forte;
- confirmação de senha;
- feedback de erro;
- loading;
- prevenção de múltiplos submits.

Nunca armazenar senha localmente.

A senha deve ser enviada apenas via HTTPS para a API.

---

# 15. Login direto — requisitos

Campos:

```text
e-mail
senha
```

Funcionalidades previstas:

```text
Entrar
Esqueci minha senha
Criar conta
Continuar com Google
```

A recuperação de senha pode depender de endpoint backend ainda não existente.

Se não existir, identificar como dependência técnica e não inventar integração.

---

# 16. Login com Google

Utilizar a abordagem atualmente recomendada pelo Google para Android/React Native, validando documentação atual antes da implementação.

O frontend deverá:

1. iniciar autenticação Google;
2. obter credencial/token válido;
3. enviar ao backend;
4. backend valida;
5. backend cria/localiza o usuário;
6. backend devolve sessão Sentinela.

Não considerar apenas a autenticação local do Google suficiente para acessar a API.

---

# 17. Segurança de sessão

Tokens sensíveis devem ser armazenados com solução segura apropriada ao dispositivo.

Não utilizar armazenamento inseguro para:

- refresh token;
- credenciais;
- informações sensíveis.

Não utilizar:

```text
AsyncStorage
```

como armazenamento primário de refresh token sem justificativa de segurança.

Se for necessária biblioteca de secure storage, apresentar a dependência e solicitar autorização antes da instalação.

---

# 18. Refresh de sessão

Preparar fluxo para:

```text
access token expirado
      ↓
refresh token
      ↓
novo access token
```

Se o refresh falhar:

```text
limpar sessão
      ↓
redirecionar para login
```

Evitar múltiplas tentativas concorrentes de refresh.

---

# 19. Logout

Ao sair:

- encerrar sessão;
- apagar tokens locais;
- notificar backend quando aplicável;
- limpar dados sensíveis em memória/cache.

O login Google não muda essa regra.

O usuário continua saindo da sessão do Sentinela.

---

# 20. Exclusão de conta

Como o app terá criação de conta, preparar fluxo para:

```text
Configurações
   ↓
Excluir conta
```

O requisito deve ser validado segundo as políticas atuais da Google Play.

Não implementar exclusão apenas local.

A solicitação precisa chegar ao backend.

Também considerar que a Play Store poderá exigir mecanismo web de solicitação de exclusão.

---

# 21. API como fonte de verdade

O aplicativo não deve decidir sozinho:

- plano do usuário;
- quantidade de FIIs permitida;
- permissões;
- acesso a recursos premium;
- status de assinatura.

A API deverá informar isso.

O frontend apenas representa o estado.

---

# 22. Planos

Hipótese atual:

| | **Grátis** | **Essencial** ⭐ | **Premium** |
|---|---:|---:|---:|
| **Preço** | **R$ 0** | **R$ 9,90/mês** | **R$ 19,90/mês** |
| FIIs monitorados | Até **3** | Até **20** | Até **100** |
| Resumos com IA | ✓ | ✓ | ✓ |
| Classificação de relevância | ✓ | ✓ | ✓ |
| Possível impacto | ✓ | ✓ | ✓ |
| Riscos identificados | ✓ | ✓ | ✓ |
| Fonte original | ✓ | ✓ | ✓ |
| Alertas importantes | ✓ | ✓ | ✓ |
| Histórico | Básico | Completo | Completo |
| Anúncios | **Sim** | **Não** | **Não** |
| Recursos avançados futuros | — | — | ✓ |

Esses valores ainda podem ser ajustados durante a validação do produto.

---

# 23. Limites dos planos

Os limites:

```text
3
20
100
```

não devem ser espalhados pelo código.

A API deve informar:

```text
plano
limite
quantidade_utilizada
recursos_disponiveis
```

Exemplo conceitual:

```json
{
  "plan": "ESSENCIAL",
  "fundLimit": 20,
  "fundsUsed": 12,
  "features": {
    "ads": false,
    "fullHistory": true
  }
}
```

---

# 24. Pagamentos

Existe interesse em utilizar:

```text
Asaas
```

Entretanto, **não implementar checkout com Asaas diretamente dentro do aplicativo Android sem validar as políticas atuais da Google Play**.

As assinaturas do Sentinela liberam funcionalidades digitais no aplicativo.

Antes da implementação, analisar:

- Google Play Billing;
- regras atuais da Play Store;
- uso permitido de meios de pagamento externos;
- utilização do Asaas no site;
- sincronização de assinatura com backend.

---

# 25. Arquitetura de assinatura

Não acoplar o domínio do Sentinela ao Asaas.

Conceito:

```text
Subscription
      ↓
Payment Provider
      ↓
Entitlement
```

O backend deverá conseguir responder:

```text
qual é o plano atual?
está ativo?
quando vence?
quais recursos estão liberados?
```

independentemente do provedor de pagamento.

---

# 26. Possível cenário futuro

Pode existir:

```text
Web
  ↓
Asaas
  ↓
Backend
  ↓
Plano ativo
```

e:

```text
Android App
  ↓
Google Play Billing
  ↓
Backend
  ↓
Plano ativo
```

O usuário não deve depender do provedor para utilizar a aplicação.

O backend centraliza o entitlement.

---

# 27. Mudanças no backend

Se qualquer funcionalidade do aplicativo exigir alteração na API:

1. identificar;
2. explicar;
3. indicar endpoints envolvidos;
4. propor contrato;
5. informar impacto;
6. solicitar autorização antes de alterações estruturais relevantes.

Não implementar workaround ruim no frontend apenas porque o backend ainda não possui um endpoint.

---

# 28. Anúncios

Plano gratuito:

```text
anúncios = sim
```

Planos pagos:

```text
anúncios = não
```

Não selecionar SDK de publicidade automaticamente.

Antes de implementar:

- sugerir provedor;
- explicar implicações;
- explicar privacidade;
- explicar impacto na Google Play;
- solicitar autorização.

---

# 29. Experiência dos anúncios

Anúncios não podem:

- competir visualmente com alertas;
- parecer notícia;
- parecer recomendação financeira;
- interromper leitura de evento urgente;
- gerar confusão com conteúdo do Sentinela.

---

# 30. Dashboard

O dashboard deve responder rapidamente:

> **“Minha carteira precisa de atenção?”**

Exemplo conceitual:

```text
11 ativos acompanhados

9 sem novidades
2 com atualizações
1 alerta importante
```

Não criar dashboard excessivamente técnico.

---

# 31. Carteira

Funcionalidades:

- listar FIIs;
- pesquisar;
- adicionar;
- remover/desativar;
- exibir quantidade utilizada do plano.

Exemplo:

```text
12 de 20 FIIs monitorados
```

Ao atingir limite:

não bloquear silenciosamente.

Exibir contexto:

```text
Seu plano permite acompanhar até 20 FIIs.
```

e oferecer acesso à tela de planos.

---

# 32. Feed

O feed deve priorizar relevância.

Possíveis estados:

```text
URGENTE
RELEVANTE
SEM_RELEVANCIA
```

Não transformar o feed em uma timeline infinita de notícias.

---

# 33. Detalhe da análise

Deve apresentar:

```text
ticker
título
classificação
possível impacto
horizonte
confiança
resumo
justificativa
riscos
números-chave
fontes
documento original
```

A fonte original deve ter destaque adequado.

---

# 34. Notificações

Conceito inicial:

```text
URGENTE → push
RELEVANTE → push
SEM_RELEVANCIA → sem push obrigatório
SEM_NOVIDADES → sem push
```

A lógica de elegibilidade deve permanecer no backend sempre que possível.

---

# 35. Estados de tela

Todas as telas que dependem de dados devem prever:

```text
loading
success
empty
error
offline
retry
```

Evitar loading genérico em tela inteira quando skeleton local for melhor.

---

# 36. Offline e rede instável

O app depende da API, portanto deve lidar bem com:

- ausência de internet;
- timeout;
- API indisponível;
- conexão lenta.

Não exibir erro técnico cru ao usuário.

---

# 37. Design

Referência visual:

```text
Investimento_Web
```

Princípios:

- visual premium;
- escuro;
- tecnologia;
- teal/ciano como cor de marca;
- boa legibilidade;
- pouco ruído;
- status bem definidos.

Estados financeiros:

```text
verde → positivo/normal
âmbar → atenção
vermelho → urgente
```

Cor da marca:

```text
teal/ciano
```

---

# 38. Mobile-first

Todo layout deve ser pensado para:

```text
celular
```

e não como versão reduzida de web.

Priorizar:

- áreas de toque adequadas;
- navegação com uma mão;
- conteúdo vertical;
- leitura confortável;
- feedback rápido.

---

# 39. Acessibilidade

Implementar:

- contraste adequado;
- labels;
- leitores de tela;
- tamanho de toque;
- foco;
- estados não dependentes apenas de cor;
- suporte ao tamanho de fonte quando possível.

Exemplo:

não usar apenas círculo vermelho.

Usar:

```text
Urgente
```

junto com a cor.

---

# 40. Performance

Evitar:

- renders desnecessários;
- listas sem virtualização;
- imagens gigantes;
- cálculos pesados nas screens;
- requisições duplicadas.

Utilizar corretamente:

```text
FlatList
SectionList
memoização quando justificável
cache de API quando necessário
```

Não otimizar prematuramente sem motivo.

---

# 41. API

Centralizar comunicação HTTP.

Exemplo conceitual:

```text
src/services/api
```

Não chamar `fetch` ou cliente HTTP de forma espalhada em todas as telas.

Implementar interceptação/tratamento central para:

```text
401
403
404
422
429
500
503
```

---

# 42. Erros

O frontend deve utilizar códigos da API quando existirem.

Exemplo:

```text
PLAN_LIMIT_REACHED
AUTH_INVALID_CREDENTIALS
AUTH_TOKEN_EXPIRED
```

Não criar lógica baseada apenas no texto de mensagens.

---

# 43. Segredos

Nunca colocar no aplicativo:

- senha de banco;
- chave privada;
- API secret;
- segredo Asaas;
- segredo do backend.

Variáveis embutidas no app não são secretas apenas por estarem em `.env`.

Qualquer valor enviado no bundle deve ser considerado público.

---

# 44. Logs

Não logar:

- access token;
- refresh token;
- senha;
- dados pessoais sensíveis;
- payloads de pagamento sensíveis.

Logs de desenvolvimento devem ser controlados.

---

# 45. Google Play

O aplicativo deverá ser preparado para publicação real na Google Play.

Antes de considerar a aplicação pronta, validar documentação oficial atual.

Criar:

```text
PLAY_STORE_CHECKLIST.md
```

com pelo menos:

- target SDK atual;
- `.aab`;
- assinatura;
- package/application ID;
- ícone;
- splash;
- política de privacidade;
- Data Safety;
- exclusão de conta;
- classificação indicativa;
- declaração de funcionalidades financeiras;
- anúncios;
- Billing;
- permissões;
- testes necessários;
- acesso para equipe de revisão;
- conteúdo da página da loja.

---

# 46. Política de privacidade

A aplicação lida com:

- conta;
- e-mail;
- carteira de FIIs;
- assinatura;
- push token;
- dados de uso possivelmente coletados por analytics/ads.

A política de privacidade deve refletir o que realmente é coletado.

Não afirmar coleta inexistente.

Não ocultar SDKs.

---

# 47. Minimização de dados

No MVP, não solicitar dados sem necessidade.

Cadastro direto inicialmente precisa apenas de:

```text
nome
e-mail
senha
```

Não solicitar:

- CPF;
- endereço;
- telefone;

sem uma necessidade real de negócio.

---

# 48. Testes

Priorizar testes para:

## Autenticação

```text
cadastro direto
login direto
login Google
logout
refresh
sessão expirada
```

## Carteira

```text
adicionar FII
remover FII
limite de plano
```

## Feed

```text
loading
erro
empty
dados
```

## Planos

```text
free
essencial
premium
```

---

# 49. Não criar o app inteiro de uma vez

Desenvolver em fases.

---

# 50. Fase 1 — Fundação

Implementar:

- estrutura;
- tema;
- navegação;
- client API;
- tratamento de erros;
- configuração de ambiente.

---

# 51. Fase 2 — Autenticação

Implementar:

- cadastro direto;
- login direto;
- Google opcional;
- refresh;
- logout;
- recuperação de senha quando API estiver pronta.

---

# 52. Fase 3 — Núcleo do produto

Implementar:

- dashboard;
- carteira;
- pesquisa de FIIs;
- feed;
- detalhe da análise.

---

# 53. Fase 4 — Notificações

Implementar:

- registro do dispositivo;
- push;
- tela de notificações;
- lido/não lido;
- deep link para análise quando aplicável.

---

# 54. Fase 5 — Planos

Implementar:

- tela de planos;
- limite;
- assinatura;
- integração com backend;
- entitlement.

Não implementar pagamento antes de validar a arquitetura.

---

# 55. Fase 6 — Anúncios

Somente após:

- definição do provedor;
- validação da política;
- autorização;
- atualização de privacidade.

---

# 56. Fase 7 — Publicação

Executar:

- checklist Play Store;
- testes;
- build release;
- revisão de políticas;
- teste fechado;
- preparação para produção.

---

# 57. Processo de trabalho do Codex

Antes de alterar código significativamente, produzir uma análise contendo:

## 1. Arquitetura atual

Descrever estrutura encontrada.

## 2. Stack

Listar tecnologias e versões relevantes.

## 3. Arquitetura e Fluxo

Explicar o que foi identificado na imagem de referência.

## 4. Investimento_Web

Identificar padrões visuais reutilizáveis.

## 5. README_SENTINELA

Separar:

```text
regra de negócio válida
x
decisão técnica que precisa validação
```

## 6. Dependências

Listar novas dependências que pretende utilizar.

## 7. Backend

Informar mudanças necessárias.

## 8. Riscos

Listar problemas/inconsistências identificados.

## 9. Plano

Criar plano de implementação por fases.

---

# 58. Definition of Done

Uma funcionalidade não está pronta apenas porque aparece na tela.

Considerar concluída quando:

- funciona;
- é responsiva;
- possui loading;
- possui erro;
- possui empty state quando aplicável;
- possui validação;
- respeita autenticação;
- utiliza API corretamente;
- não duplica regra de negócio;
- não expõe segredo;
- possui testes relevantes;
- lint está limpo;
- build funciona;
- não gera erros importantes no console;
- respeita UX do projeto.

---

# 59. Não fazer

Não:

- obrigar login Google;
- eliminar cadastro direto;
- guardar senha no dispositivo;
- criar duas sessões independentes para Google e senha;
- criar usuário duplicado sem avaliar e-mail já existente;
- instalar biblioteca sem autorização;
- hardcodar limites de plano em vários componentes;
- implementar Asaas diretamente no Android sem validar Play Store;
- colocar segredo no app;
- inventar endpoint;
- fingir que backend suporta recurso inexistente;
- copiar UI web sem adaptação mobile;
- criar dashboard carregado;
- prometer monitoramento em tempo real;
- transformar sinais em ordens de investimento.

---

# 60. Princípios finais

Quando houver dúvida, priorizar:

```text
simplicidade
↓
segurança
↓
clareza
↓
experiência do usuário
↓
manutenção
↓
escalabilidade
```

E sempre lembrar do propósito principal:

> **O usuário não deve sentir que ganhou mais uma plataforma para acompanhar.**
>
> **Ele deve sentir que existe algo acompanhando sua carteira por ele.**

---

# 61. Frase-guia

> **Menos barulho. Mais sinal.**

Se uma decisão técnica ou visual adiciona complexidade sem aumentar claramente o valor do produto, reavaliar antes de implementá-la.
