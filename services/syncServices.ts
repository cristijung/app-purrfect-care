import * as SQLite from "expo-sqlite";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db as firebaseDb } from "../config/firebaseConfig";

// definindo a interface para garantir o Type Safety que você utiliza no projeto
interface Appointment {
  id: number;
  pet_name: string;
  owner_name: string;
  type: string;
  date: string;
  status: string;
  synced: number;
}

export const syncAppointmentsWithFirebase = async () => {
  try {
    const sqliteDb = await SQLite.openDatabaseAsync("purrfectcare.db");

    // busca apenas registros locais que ainda não foram sincronizados
    const pendentes = await sqliteDb.getAllAsync<Appointment>(
      "SELECT * FROM appointments WHERE synced = 0",
    );

    if (pendentes.length === 0) return;

    console.log(`☁️ Sincronizando ${pendentes.length} itens com o Firebase...`);

    for (const item of pendentes) {
      // envia para a coleção no Firestore
      const docRef = await addDoc(collection(firebaseDb, "appointments"), {
        pet_name: item.pet_name,
        owner_name: item.owner_name,
        type: item.type,
        date: item.date,
        status: item.status,
        syncedAt: serverTimestamp(), // timestamp do servidor firebase
      });

      // atualiza o SQLite local para marcar como sincronizado --> synced = 1
      // aqui guardamos o ID gerado pelo Firebase no remote_id
      await sqliteDb.runAsync(
        "UPDATE appointments SET synced = 1, remote_id = ? WHERE id = ?",
        [docRef.id, item.id],
      );
    }

    console.log("Sincronização concluída com sucesso!");
  } catch (error) {
    console.error("Falha na sincronização:", error);
  }
};
