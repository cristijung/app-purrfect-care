import * as SQLite from "expo-sqlite";

export async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync("purrfectcare.db");

  // criando a tabela de histórico de compras para a loja
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_names TEXT NOT NULL,
      total_price REAL NOT NULL,
      date TEXT NOT NULL
    );
  `);

  return db;
}
