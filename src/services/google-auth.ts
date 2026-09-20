import { Platform } from 'react-native';

export async function getGoogleIdToken() {
  if (Platform.OS === 'web') {
    throw new Error('O login Google desta versão está disponível no aplicativo Android ou iOS.');
  }
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!webClientId) {
    throw new Error('O login Google ainda precisa do client ID do projeto.');
  }

  try {
    const google = await import('react-native-nitro-google-signin');
    google.GoogleOneTapSignIn.configure({ webClientId, autoSelectOnSignIn: true });
    await google.GoogleOneTapSignIn.checkPlayServices();
    let response = await google.GoogleOneTapSignIn.signIn();
    if (google.isNoSavedCredentialFoundResponse(response)) {
      response = await google.GoogleOneTapSignIn.createAccount();
    }
    if (google.isNoSavedCredentialFoundResponse(response)) {
      response = await google.GoogleOneTapSignIn.presentExplicitSignIn();
    }
    if (!google.isSuccessResponse(response) || !response.data.idToken) {
      throw new Error('O login Google foi cancelado.');
    }
    return response.data.idToken;
  } catch (error) {
    if (error instanceof Error && error.message) throw error;
    throw new Error('Não foi possível iniciar o login Google neste dispositivo.');
  }
}
