import * as SQLite from "expo-sqlite";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db as firebaseDb, storage } from "../config/firebaseConfig";

// interface para garantir o Type Safety
interface Appointment {
  id: number;
  pet_name: string;
  owner_name: string;
  type: string;
  date: string;
  status: string;
  pet_photo: string | null;
  synced: number;
}

/**
 * orquestrador de Sincronização Híbrida (Offline-First)
 * transfere dados e imagens do SQLite local para o Firebase.
 */
export const syncAppointmentsWithFirebase = async () => {
  const sqliteDb = await SQLite.openDatabaseAsync("purrfectcare.db");

  try {
    // busca apenas registros pendentes de sincronização
    const pendentes = await sqliteDb.getAllAsync<Appointment>(
      "SELECT * FROM appointments WHERE synced = 0",
    );

    if (pendentes.length === 0) return;

    console.log(`☁️ Iniciando sincronização de ${pendentes.length} itens...`);

    for (const item of pendentes) {
      try {
        let finalPhotoUrl = item.pet_photo;

        // fluxo de Mídia: Upload para o Firebase Storage
        // verificamos se existe uma URI local (file://) para fazer o upload
        if (item.pet_photo && item.pet_photo.startsWith("file://")) {
          // conversão da URI local em Blob (necessário para upload mobile)
          const response = await fetch(item.pet_photo);
          const blob = await response.blob();

          // cria referência única na pasta 'pets/' usando o nome e timestamp
          const storageRef = ref(
            storage,
            `pets/${item.pet_name}-${Date.now()}.jpg`,
          );

          // upload do binário para a nuvem
          await uploadBytes(storageRef, blob);

          // recupera a URL pública (HTTPS) para salvar no Firestore
          finalPhotoUrl = await getDownloadURL(storageRef);
        }

        // persistência na Nuvem: Firestore
        const docRef = await addDoc(collection(firebaseDb, "appointments"), {
          pet_name: item.pet_name,
          owner_name: item.owner_name,
          type: item.type,
          date: item.date,
          status: item.status,
          pet_photo: finalPhotoUrl, // URL da nuvem ou null
          syncedAt: serverTimestamp(),
        });

        // confirmação Local: Atualiza o SQLite para evitar duplicidade
        // armazenamos o remote_id gerado pelo Firebase para futuras edições
        await sqliteDb.runAsync(
          "UPDATE appointments SET synced = 1, remote_id = ? WHERE id = ?",
          [docRef.id, item.id],
        );

        console.log(`✅ Item ${item.id} sincronizado com sucesso.`);
      } catch (itemError) {
        // Try/Catch interno: se um item falhar, o loop continua para os outros
        console.error(`❌ Erro ao sincronizar item ${item.id}:`, itemError);
      }
    }
  } catch (error) {
    console.error("⚠️ Erro crítico no serviço de sincronização:", error);
  }
};
