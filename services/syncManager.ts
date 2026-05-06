import * as SQLite from "expo-sqlite";
import { syncAppointmentsWithFirebase } from "./syncServices"; // os agendamentos existentes
import { syncTutorData } from "./tutorSync"; // novo serviço de tutores VIP

/**
 * syncManager: este vai ser "O Cérebro" da sincronização do app
 * garante que todos os domínios (pets e tutores) sejam processados
 */
export const runGlobalSync = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("purrfectcare.db");

    console.log("🔄 [SyncManager] Iniciando varredura global...");

    // executamos ambos em paralelo para otimizar a performance
    // se um falhar, o outro ainda tenta completar o processo
    await Promise.all([
      syncAppointmentsWithFirebase(), // o que já tínhamos
      syncTutorData(db), // que criamos agora
    ]);

    console.log("🏁 [SyncManager] Sincronização concluída com sucesso.");
  } catch (error) {
    console.error("⚠️ [SyncManager] Falha crítica na orquestração:", error);
  }
};
