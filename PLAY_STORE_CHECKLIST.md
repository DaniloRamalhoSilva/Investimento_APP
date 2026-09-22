# Checklist Google Play — Sentinela

Atualizado em 21/09/2026.

## Modelo da primeira versão

- [x] Liberar somente o plano Grátis; preços e limites dos planos pagos continuam no catálogo.
- [x] Mostrar aviso claro e lista de espera ao usuário que desejar um plano pago.
- [x] Lançar sem anúncios e sem cobrança; declarar corretamente essas condições no Play Console.
- [ ] Aplicar as migrations da API, incluindo a tabela de interesse em planos, antes de distribuir o app.

## Aplicativo e build

- [x] Nome: Sentinela
- [x] Application ID: `com.sentinela.investimentos`
- [x] Ícone e splash próprios
- [x] Orientação principal em retrato
- [x] Configurar compile/target Android 16 / API 36
- [ ] Confirmar target API 36 no `.aab` final
- [ ] Gerar Android App Bundle (`.aab`)
- [ ] Configurar Play App Signing e guardar a upload key com segurança
- [ ] Configurar perfis `development`, `preview` e `production` no EAS
- [ ] Executar testes em Android 16 e em versões mínimas suportadas

## Conta e revisão

- [x] Exclusão disponível dentro do aplicativo
- [x] Exclusão enviada ao backend, não apenas local
- [ ] Publicar URL web para solicitação de exclusão de conta
- [ ] Informar conta de demonstração/instruções para a equipe de revisão
- [ ] Validar anonimização e prazo de retenção com a política de privacidade

### Decisão de retenção a aprovar

O responsável pelo produto deve aprovar e registrar prazos concretos para: conta e e-mail durante o uso, interesse na lista de espera, registros de acesso/segurança, dados de carteira e análises vinculadas, backups e exceções legais. Registrar também quem recebe esses dados e o prazo de remoção das cópias de segurança. Publicar a decisão na política de privacidade e na página de exclusão de conta, depois conferir o formulário Data Safety no Play Console.

Hoje a exclusão no app anonimiza o cadastro e remove sessões, identidades de login, dispositivos e interesses em planos; os vínculos da carteira são desativados, mas permanecem no banco. A política publicada precisa descrever esse comportamento fielmente ou a API precisa ser alterada antes da publicação.

## Privacidade e dados

- [ ] Publicar política de privacidade acessível e atualizada
- [ ] Preencher Data Safety conforme os dados realmente coletados
- [ ] Declarar conta, e-mail, carteira de FIIs e identificador de sessão
- [ ] Declarar Google Sign-In quando configurado
- [ ] Declarar push token quando notificações forem implementadas
- [ ] Declarar analytics e publicidade somente após SDKs serem escolhidos
- [x] Não solicitar CPF, endereço ou telefone no cadastro do MVP
- [x] Não armazenar senha no dispositivo
- [x] Armazenar tokens nativos via SecureStore

## Conteúdo financeiro

- [ ] Preencher declaração de funcionalidades financeiras no Play Console
- [x] Exibir aviso de que o produto é informativo
- [x] Não apresentar sinais como ordens de compra ou venda
- [x] Dar acesso às fontes originais
- [ ] Revisar textos da ficha da loja para evitar promessa de rentabilidade ou tempo real

## Autenticação Google

- [ ] Criar/configurar projeto no Google Cloud ou Firebase
- [ ] Registrar `com.sentinela.investimentos`
- [ ] Adicionar SHA-1 da upload key
- [ ] Adicionar SHA-1 da Play App Signing key
- [ ] Configurar o Web client ID usado para gerar o ID Token do backend
- [ ] Incluir o client ID em `GOOGLE_AUTH_CLIENT_IDS` na API
- [ ] Testar conta nova, conta existente e vínculo exigido
- [ ] Substituir o `iosUrlScheme` provisório antes de qualquer build iOS

## Assinaturas e anúncios

- [x] Não oferecer checkout na primeira versão gratuita
- [ ] Validar Google Play Billing antes de vender funcionalidades digitais no Android
- [ ] Não integrar checkout Asaas dentro do app sem revisão específica da política
- [ ] Criar contrato de entitlement no backend antes de ativar planos pagos
- [x] Lançar sem SDK de anúncios; catálogo da API informa `anuncios: false`
- [ ] Antes de ativar anúncios, escolher rede e posicionamento, integrar SDK, revisar privacidade/Data Safety e atualizar a declaração de anúncios na Play
- [ ] Ao ativar anúncios, garantir que nunca pareçam alertas ou recomendações financeiras

## Permissões e notificações

- [ ] Solicitar permissão de notificação somente no contexto adequado
- [ ] Registrar e remover dispositivo na API
- [ ] Testar deep link para análise
- [ ] Garantir funcionamento útil quando a permissão for negada
- [ ] Revisar todas as permissões geradas no AndroidManifest do `.aab`

## Qualidade da versão

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npx expo-doctor`
- [ ] Testar loading, sucesso, vazio, erro, offline e retry
- [ ] Testar leitor de tela, contraste, fonte ampliada e alvos de toque
- [ ] Realizar teste fechado antes de produção
- [ ] Verificar se a conta pessoal criada após 13/11/2023 exige 12 testadores por 14 dias contínuos para solicitar acesso à produção
- [ ] Preparar título, descrição curta, descrição completa, ícone, screenshots e imagem de destaque
- [ ] Concluir classificação indicativa e público-alvo
