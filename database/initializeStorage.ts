// para gerenciar a sincronização, precisamos de uma coluna extra
// em nossas tabelas (geralmente chamada de synced) para saber o que
// já foi enviado para a nuvem e o que ainda é apenas local.

import * as SQLite from "expo-sqlite";

export async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync("purrfectcare.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    -- Tabela de Agendamentos (Consultas, Exames, Cirurgias)
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      remote_id TEXT, -- ID que virá do Firebase após sincronizar
      pet_name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      type TEXT NOT NULL, -- 'Consulta', 'Exame', 'Cirurgia'
      date TEXT NOT NULL,
      status TEXT DEFAULT 'Agendado',
      synced INTEGER DEFAULT 0 -- 0 para não sincronizado, 1 para sincronizado
    );
  `);

  return db;
}

// A Lógica de Sincronização
// Para a área administrativa, o fluxo será:
// - Gravação Local: Você salva a nova cirurgia no SQLite com synced = 0.
// - Tentativa de Sync: O app dispara uma função que busca tudo que tem synced = 0.
// - Update no Firebase: Se houver internet, ele manda para o Firebase.
// - Confirmação: Ao receber o "OK" do Firebase,
// o app atualiza o SQLite local para synced = 1.
