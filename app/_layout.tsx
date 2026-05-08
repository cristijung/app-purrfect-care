import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { StatusBar } from "expo-status-bar"; // Importação necessária
import { useEffect } from "react";
import { ThemeProvider } from "styled-components/native";
import { theme } from "../styles/theme";

/* imports de auth e monitoramento */
import NetInfo from "@react-native-community/netinfo";
import { auth } from "../config/firebaseConfig";
import { runGlobalSync } from "../services/syncManager";

// impede que a Splash Screen nativa se esconda automaticamente
SplashScreen.preventAutoHideAsync();

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  try {
    await db.execAsync("PRAGMA journal_mode = WAL;");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_name TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        remote_id TEXT,
        pet_photo TEXT
      );
    `);

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

    console.log("✅ [SQLite] Banco de dados pronto.");
  } catch (error) {
    console.error("❌ [SQLite] Erro na migração:", error);
  }
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [loaded, error] = useFonts({});

  // --- LÓGICA DE REDIRECIONAMENTO INTELIGENTE ---
  useEffect(() => {
    if (!loaded) return;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      // Verificamos se o usuário está na pasta 'tutor' ou nas 'tabs' principais
      const inTutorGroup = segments[0] === "tutor";
      const inTabsGroup = segments[0] === "(tabs)";

      // Só redirecionamos automaticamente se o usuário não estiver em NENHUMA dessas áreas
      // Isso permite que ele mude manualmente entre a Home e o Dashboard VIP
      if (user && !inTutorGroup && !inTabsGroup) {
        setTimeout(() => {
          router.replace("/tutor");
        }, 500);
      }
    });

    return unsubscribeAuth;
  }, [loaded, segments]);

  // --- MONITORAMENTO DE REDE E SYNC ---
  useEffect(() => {
    if (!loaded) return;

    const unsubscribeNet = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        const timer = setTimeout(() => {
          runGlobalSync().catch(() => {});
        }, 5000);
        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribeNet();
  }, [loaded]);

  useEffect(() => {
    if (error) throw error;
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) return null;

  return (
    <ThemeProvider theme={theme}>
      {/* Força os ícones da barra de status (hora, bateria) a ficarem brancos */}
      <StatusBar style="light" />

      <SQLiteProvider databaseName="purrfectcare.db" onInit={migrateDbIfNeeded}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="register-tutor"
            options={{ presentation: "modal", headerShown: false }}
          />

          <Stack.Screen
            name="tutor/index"
            options={{ headerShown: false, gestureEnabled: false }}
          />

          <Stack.Screen
            name="tutor/add-pet"
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
