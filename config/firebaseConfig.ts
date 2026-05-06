import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
/* importações para autenticação mobile */
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// chaves pegamos no Console do Firebase --> Configurações do Projeto
const firebaseConfig = {
  apiKey: "AIzaSyDRZnmln3w_utpD8r1H6gdRSJhiqt1-HKY",
  authDomain: "purrfeccareapp.firebaseapp.com",
  projectId: "purrfeccareapp",
  storageBucket: "purrfeccareapp.firebasestorage.app",
  messagingSenderId: "709831901725",
  appId: "1:709831901725:web:d1419a905381528cb43cf4",
  measurementId: "G-M34ZNJKLTY",
};

// Inicialização segura para evitar o erro de múltiplas instâncias no Fast Refresh do Expo
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Configuração de Autenticação com Persistência Nativa.
 * O AsyncStorage permite que o login do tutor seja mantido mesmo offline.
 */
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

// Exportamos o 'auth' para ser usado na tela de cadastro e no tutorSync
export { app, auth, db, storage };