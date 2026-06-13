import sqlite3 from 'sqlite3';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../../data');
const dbPath = path.resolve(dataDir, 'phishguard.sqlite');

let database = null;

class DatabaseWrapper {
  constructor(db) {
    this.db = db;
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function callback(error) {
        if (error) reject(error);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (error, row) => {
        if (error) reject(error);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (error, rows) => {
        if (error) reject(error);
        else resolve(rows);
      });
    });
  }
}

export async function initDatabase() {
  await mkdir(dataDir, { recursive: true });

  const rawDb = new sqlite3.Database(dbPath);
  database = new DatabaseWrapper(rawDb);

  await database.run(`CREATE TABLE IF NOT EXISTS analyses (
    id TEXT PRIMARY KEY,
    channel TEXT NOT NULL,
    original_message TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    risk_score INTEGER NOT NULL,
    detected_features TEXT NOT NULL,
    recommendations TEXT NOT NULL,
    explanation TEXT NOT NULL,
    threat_type TEXT,
    created_at TEXT NOT NULL
  )`);

  await database.run(`CREATE TABLE IF NOT EXISTS acl_messages (
    id TEXT PRIMARY KEY,
    analysis_id TEXT,
    conversation_id TEXT NOT NULL,
    performative TEXT NOT NULL,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    ontology TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (analysis_id) REFERENCES analyses(id)
  )`);

  await database.run(`CREATE TABLE IF NOT EXISTS ontology_changes (
    id TEXT PRIMARY KEY,
    change_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);
}

export function getDatabase() {
  if (!database) {
    throw new Error('Database has not been initialized.');
  }

  return database;
}
