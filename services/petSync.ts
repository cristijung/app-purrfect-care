import { SQLiteDatabase } from "expo-sqlite";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db as firebaseDb, storage } from "../config/firebaseConfig";

interface PetLocal {
  id: number;
  firebase_uid: string;
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  photo: string | null;
  synced: number;
}

export const syncPetData = async (sqliteDb: SQLiteDatabase) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    // busca os pets do usuário logado que ainda não foram sincronizados
    const pendingPets = await sqliteDb.getAllAsync<PetLocal>(
      "SELECT * FROM pets WHERE firebase_uid = ? AND synced = 0",
      [currentUser.uid],
    );

    if (pendingPets.length === 0) return;

    for (const pet of pendingPets) {
      console.log(`☁️ Sincronizando pet: ${pet.name}`);

      let remotePhotoUrl = pet.photo;

      // upload da foto do pet --> se existir e for local
      if (pet.photo && pet.photo.startsWith("file://")) {
        try {
          const response = await fetch(pet.photo);
          const blob = await response.blob();

          // organiza no Storage: tutors/UID/pets/ID_LOCAL.jpg
          const storageRef = ref(
            storage,
            `tutors/${currentUser.uid}/pets/${pet.id}.jpg`,
          );

          await uploadBytes(storageRef, blob);
          remotePhotoUrl = await getDownloadURL(storageRef);
        } catch (imgErr) {
          console.error(`⚠️ Erro na foto do pet ${pet.name}:`, imgErr);
        }
      }

      // persistência no Firestore
      // criamos uma subcoleção 'pets' dentro do documento do tutor
      const petDocRef = doc(
        collection(firebaseDb, "tutors", currentUser.uid, "pets"),
      );

      await setDoc(petDocRef, {
        name: pet.name,
        species: pet.species,
        breed: pet.breed || "SRD",
        birth_date: pet.birth_date,
        photo: remotePhotoUrl || "",
        created_at: serverTimestamp(),
        // guardando o ID local para referência se necessário
        local_id: pet.id,
      });

      // marcar como sincronizado no SQLite
      await sqliteDb.runAsync("UPDATE pets SET synced = 1 WHERE id = ?", [
        pet.id,
      ]);

      console.log(`✅ Pet ${pet.name} sincronizado!`);
    }
  } catch (error) {
    console.error("❌ Falha na sincronização de pets:", error);
  }
};
