import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { useEffect } from "react";
import { ThemeProvider } from "styled-components/native";
import { theme } from "../styles/theme";

/* imports para sincronização Híbrida e Monitoramento de Rede */
import NetInfo from "@react-native-community/netinfo";
import { runGlobalSync } from "../services/syncManager";

// impede que a Splash Screen nativa se esconda automaticamente
SplashScreen.preventAutoHideAsync();

/**
 * esta função cuida da estrutura do banco de dados.
 * ela garante que a tabela e a coluna de foto existam antes do app abrir.
 */
async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // config inicial de performance
  await db.execAsync("PRAGMA journal_mode = WAL;");

  // criação da tabela de agendamentos
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      synced INTEGER DEFAULT 0,
      remote_id TEXT
    );
  `);

  // criação da tabela de usuários/tutores
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firebase_uid TEXT UNIQUE,
      full_name TEXT NOT NULL,
      address TEXT,
      latitude REAL,
      longitude REAL,
      profile_photo TEXT,
      is_vip INTEGER DEFAULT 0,
      synced INTEGER DEFAULT 0
    );
  `);

  // criação da tabela de pets (Seth, Grogu, Mina e Kirara)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firebase_uid TEXT NOT NULL,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      breed TEXT,
      birth_date TEXT,
      photo TEXT,
      synced INTEGER DEFAULT 0
    );
  `);

  // --- blocos de bigração (Adição de colunas em tabelas existentes) ---

  try {
    await db.execAsync(`ALTER TABLE appointments ADD COLUMN pet_photo TEXT;`);
    console.log("✅ Banco de dados atualizado com a coluna pet_photo.");
  } catch (e) {
    console.log("ℹ️ Estrutura de appointments já está atualizada.");
  }

  try {
    await db.execAsync(`ALTER TABLE users ADD COLUMN firebase_uid TEXT;`);
    console.log("✅ Banco de dados atualizado com a coluna firebase_uid.");
  } catch (e) {
    console.log("ℹ️ Coluna firebase_uid já está presente em users.");
  }
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Adicione suas fontes aqui se necessário
  });

  // efeito para monitorar a conexão com a internet e disparar a sincronização
  useEffect(() => {
    if (!loaded) return;

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {        
        const timer = setTimeout(() => {
          console.log("🔄 [SyncManager] Iniciando varredura segura...");
          runGlobalSync().catch((err) => {
            console.log(
              "ℹ️ Banco ocupado ou em migração, tentando sync depois.",
            );
          });
        }, 5000);

        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, [loaded]);

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
      <SQLiteProvider
        databaseName="purrfectcare.db"
        onInit={migrateDbIfNeeded}
        // useSuspense desativado para evitar deadlocks na Splash Screen
      >
        <Stack screenOptions={{ headerShown: false }}>
          {/* rota das abas principais (Admin/Comum) */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* rota de raças */}
          <Stack.Screen
            name="cat-breeds"
            options={{
              title: "Raças Felinas",
              headerShown: true,
              presentation: "card",
            }}
          />

          {/* rota para o cadastro de tutor */}
          <Stack.Screen
            name="register-tutor"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />

          {/* --- rotas da área VIP --- */}
          <Stack.Screen
            name="tutor/index"
            options={{
              headerShown: false,
              gestureEnabled: false, // impede voltar para o cadastro deslizando a tela
            }}
          />

          <Stack.Screen
            name="tutor/add-pet"
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
