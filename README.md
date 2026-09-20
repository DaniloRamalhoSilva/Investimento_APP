# Sentinela App

Aplicativo mobile do Sentinela para monitoramento inteligente de Fundos Imobiliários.

> Você investe. O Sentinela vigia.

## Stack

- Expo SDK 57 e React Native;
- Android compile/target SDK 36 via Expo Build Properties;
- TypeScript;
- Expo Router;
- Expo SecureStore;
- Google Credential Manager via `react-native-nitro-google-signin`;
- Jest Expo e React Native Testing Library.

## Configuração

1. Use uma versão LTS do Node.js.
2. Instale as dependências com `npm install`.
3. Copie `.env.example` para `.env.local`.
4. Ajuste `EXPO_PUBLIC_API_URL` para a API Sentinela.
5. Para login Google, configure `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, o projeto OAuth e os fingerprints SHA-1.

Antes de um build iOS, substitua o `iosUrlScheme` provisório de `app.json` pelo `REVERSED_CLIENT_ID` real do cliente OAuth iOS.

No emulador Android, `10.0.2.2` aponta para o computador host. Em dispositivo físico, use o IP local ou uma URL HTTPS acessível pelo aparelho.

## Execução

```bash
npm start
npm run android
```

O login Google usa código nativo e, portanto, exige um development build. As demais telas podem ser desenvolvidas sem configurar Google, mas o botão exibirá uma mensagem orientativa até o client ID existir.

O `expo-doctor` ignora apenas a checagem de metadados do React Native Directory para `react-native-nitro-google-signin`: a biblioteca usa Nitro Modules e a nova arquitetura, mas ainda aparece como “não testada” naquele diretório.

## Qualidade

```bash
npm run typecheck
npm run lint
npm test
npx expo-doctor
```

## Estrutura

```text
src/app             rotas, layouts e telas
src/components      componentes reutilizáveis
src/features        contextos e regras por domínio
src/hooks           hooks de carregamento
src/services        API, sessão segura e Google
src/theme           tokens visuais
src/types           contratos do aplicativo
src/utils           formatação e utilidades
```

## Funcionalidades implementadas

- cadastro e login com e-mail/senha;
- Google Sign-In configurável;
- persistência segura e refresh token rotativo;
- dashboard;
- carteira e pesquisa de FIIs;
- feed paginado;
- detalhe completo da análise e fontes originais;
- perfil, logout e exclusão de conta;
- estados de loading, vazio, erro, retry e pull-to-refresh.

## Dependências conhecidas do backend

- recuperação de senha ainda não possui endpoint;
- plano, limite utilizado e entitlement ainda não são expostos pela API;
- o limite padrão da API precisa ser alinhado à regra comercial do plano gratuito;
- a página web de solicitação de exclusão ainda precisa ser publicada.
