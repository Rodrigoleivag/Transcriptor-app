import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath = path.join(__dirname, '../../data/transcriptions.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

export const initializeDatabase = () => {
  db.serialize(() => {
    // Transcriptions table
    db.run(`
      CREATE TABLE IF NOT EXISTS transcriptions (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        originalAudio TEXT NOT NULL,
        transcription TEXT NOT NULL,
        summary TEXT NOT NULL,
        keyPoints TEXT NOT NULL,
        actionableTasks TEXT NOT NULL,
        duration REAL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('📊 Database tables initialized');
  });
};

export const runQuery = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const runInsert = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};
