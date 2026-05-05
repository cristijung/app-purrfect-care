import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { useEffect } from "react";
import { ThemeProvider } from "styled-components/native";
import { theme } from "../styles/theme";

// impede que a Splash Screen nativa se esconda automaticamente
SplashScreen.preventAutoHideAsync();

/**
 * esta função cuida da estrutura do banco de dados.
 * ela garante que a tabela e a coluna de foto existam antes do app abrir.
 */
async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // cria a tabela inicial caso não exista
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      synced INTEGER DEFAULT 0,
      remote_id TEXT
    );

    /* criação da tabela de usuários para a Área do Tutor VIP */
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      address TEXT,
      latitude REAL,
      longitude REAL,
      profile_photo TEXT,
      is_vip INTEGER DEFAULT 0,
      synced INTEGER DEFAULT 0
    );
  `);

  // tenta adicionar a coluna de foto para evitar o erro no NewAppointment
  try {
    await db.execAsync(`ALTER TABLE appointments ADD COLUMN pet_photo TEXT;`);
    console.log("✅ Banco de dados atualizado com a coluna pet_photo.");
  } catch (e) {
    // se a coluna já existir, ele cai aqui e apenas ignoramos o erro
    console.log("ℹ️ Estrutura do banco já está atualizada.");
  }
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Adicione suas fontes aqui se necessário
  });

  useEffect(() => {
    if (error) throw error;
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      {/* 
        o onInit chama a nossa função de migração assim que o banco abre.
        Isso garante que o NewAppointment encontre a coluna 'pet_photo'.
      */}
      <SQLiteProvider
        databaseName="purrfectcare.db"
        onInit={migrateDbIfNeeded}
        useSuspense
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="cat-breeds"
            options={{
              title: "Raças Felinas",
              headerShown: true,
              presentation: "card",
            }}
          />

          {/* Rota para o novo cadastro de Tutor/Usuário */}
          <Stack.Screen
            name="register-tutor"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
        </Stack>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
