import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "../../expenses.db");
export const db = new Database(dbPath);

export const initDatabase = (): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'INR',
      category VARCHAR(50) NOT NULL,
      description TEXT,
      merchant VARCHAR(100),
      original_input TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Database initialized");
};
