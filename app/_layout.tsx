import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThemeProvider } from "styled-components/native";
import { theme } from "../styles/theme";

// impede que a Splash Screen nativa se esconda automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // carrega as fontes (se houver fontes personalizadas, adicione aqui)
  const [loaded, error] = useFonts({
    // ex. de fonte personalizada (comente se não estiver usando ainda)
    // 'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  // efeito para esconder a Splash quando tudo estiver pronto
  useEffect(() => {
    // se houve erro no carregamento das fontes, logamos
    if (error) throw error;

    // qdo as fontes terminarem de carregar
    if (loaded) {
      // Escondemos a Splash nativa. O app agora é visível.
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // enquanto as fontes não carregam, não renderizamos nada
  // (a Splash nativa continua visível neste momento)
  if (!loaded) {
    return null;
  }

  // renderização principal do App envolvido pelo seu Tema
  return (
    <ThemeProvider theme={theme}>
      <Stack>
        {/* esconde o cabeçalho padrão para as tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="cat-breeds"
          options={{
            title: "Raças Felinas",
            headerShown: true,
            presentation: "card",
          }}
        />
        {/* add outras telas de modal aqui */}
      </Stack>
    </ThemeProvider>
  );
}
