import { SQLiteDatabase } from "expo-sqlite";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export const registerTutorVIP = async (
  db: SQLiteDatabase,
  email: string,
  pass: string,
  userData: any,
) => {
  // criar conta no Firebase
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    pass,
  );
  const uid = userCredential.user.uid;

  // salvar localmente no SQLite
  await db.runAsync(
    `INSERT INTO users (firebase_uid, full_name, address, latitude, longitude, profile_photo, synced) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      uid,
      userData.fullName,
      userData.address,
      userData.coords?.lat || 0,
      userData.coords?.lng || 0,
      userData.photo || "",
      0,
    ],
  );

  return uid;
};
