# Checklist Google Play — Sentinela

Atualizado em 20/09/2026.

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

- [ ] Validar Google Play Billing antes de vender funcionalidades digitais no Android
- [ ] Não integrar checkout Asaas dentro do app sem revisão específica da política
- [ ] Criar contrato de entitlement no backend antes da tela de planos
- [ ] Definir SDK de anúncios e atualizar Data Safety antes de ativar anúncios
- [ ] Garantir que anúncios nunca pareçam alertas ou recomendações financeiras

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
- [ ] Preparar título, descrição curta, descrição completa, ícone, screenshots e imagem de destaque
- [ ] Concluir classificação indicativa e público-alvo
