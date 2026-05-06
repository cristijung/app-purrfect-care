import { SQLiteDatabase } from "expo-sqlite";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db as firebaseDb, storage } from "../config/firebaseConfig";

interface TutorLocal {
  id: number;
  firebase_uid: string;
  full_name: string;
  address: string;
  latitude: number;
  longitude: number;
  profile_photo: string | null;
  synced: number;
}

export const syncTutorData = async (sqliteDb: SQLiteDatabase) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.log("ℹ️ Sincronização de tutor ignorada: Nenhum usuário logado.");
    return;
  }

  try {
    // buscando o dado e já desestruturamos para garantir que não dependemos mais da instância da linha do banco
    const localUser = await sqliteDb.getFirstAsync<TutorLocal>(
      "SELECT * FROM users WHERE firebase_uid = ? AND synced = 0",
      [currentUser.uid],
    );

    // Se não encontrar ou se os campos vitais forem nulos, paramos aqui
    if (!localUser || !localUser.full_name) {
      return;
    }

    console.log(`☁️ Preparando sincronização: ${localUser.full_name}`);

    let remotePhotoUrl = localUser.profile_photo;

    // selfie o fluxo
    // Usamos fallbacks (?? "") para garantir que o Java não receba valores undefined
    const photoPath = localUser.profile_photo ?? "";

    if (photoPath.startsWith("file://")) {
      try {
        const response = await fetch(photoPath);
        const blob = await response.blob();
        const storageRef = ref(
          storage,
          `tutors/${currentUser.uid}/profile.jpg`,
        );

        await uploadBytes(storageRef, blob);
        remotePhotoUrl = await getDownloadURL(storageRef);
        console.log("📸 Selfie enviada com sucesso.");
      } catch (uploadError) {
        console.error(
          "⚠️ Falha no upload da imagem, mas prosseguindo com os dados:",
          uploadError,
        );
      }
    }

    // persistência no Firestore
    // garantindo que latitude e longitude sejam números válidos (fallback para 0)
    await setDoc(doc(firebaseDb, "tutors", currentUser.uid), {
      full_name: localUser.full_name,
      address: localUser.address ?? "Endereço não informado",
      location: {
        latitude: localUser.latitude ?? 0,
        longitude: localUser.longitude ?? 0,
      },
      profile_photo: remotePhotoUrl ?? "",
      is_vip: true,
      updatedAt: serverTimestamp(),
    });

    // confirmação do Local
    await sqliteDb.runAsync(
      "UPDATE users SET synced = 1 WHERE firebase_uid = ?",
      [currentUser.uid],
    );

    console.log(`✅ ${localUser.full_name} está 100% sincronizado.`);
  } catch (error) {
    // Se o erro for o NullPointer do Java, ele será capturado aqui sem travar o app
    console.error("❌ Erro técnico no SQLite/Sync:", error);
  }
};
