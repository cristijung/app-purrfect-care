import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
