const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "solar.db");

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

/**
 * Wraps sql.js to provide a synchronous API similar to better-sqlite3.
 * Automatically persists the database to disk after every write.
 */
class Database {
  constructor(sqlDb) {
    this._db = sqlDb;
  }

  /** Save in-memory DB to disk */
  _save() {
    const data = this._db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }

  /** Run a statement that doesn't return rows (INSERT/UPDATE/DELETE) */
  run(sql, params = []) {
    this._db.run(sql, params);
    // Capture results before save (save re-exports the buffer)
    const lastId = this._db.exec("SELECT last_insert_rowid() AS id")[0]?.values[0][0];
    const changes = this._db.getRowsModified();
    this._save();
    return { lastInsertRowid: lastId, changes };
  }

  /** Get a single row */
  get(sql, params = []) {
    const stmt = this._db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
      const cols = stmt.getColumnNames();
      const vals = stmt.get();
      stmt.free();
      const row = {};
      cols.forEach((c, i) => (row[c] = vals[i]));
      return row;
    }
    stmt.free();
    return undefined;
  }

  /** Get all matching rows */
  all(sql, params = []) {
    const stmt = this._db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    const cols = stmt.getColumnNames();
    while (stmt.step()) {
      const vals = stmt.get();
      const row = {};
      cols.forEach((c, i) => (row[c] = vals[i]));
      rows.push(row);
    }
    stmt.free();
    return rows;
  }

  /** Execute raw SQL (for schema creation, etc.) */
  exec(sql) {
    this._db.run(sql);
    this._save();
  }
}

/** Initialize and return the wrapped database (async, called once at startup) */
async function initDB() {
  const SQL = await initSqlJs();

  let sqlDb;
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    sqlDb = new SQL.Database(fileBuffer);
  } else {
    sqlDb = new SQL.Database();
  }

  const db = new Database(sqlDb);

  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON");

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL,
      phone       TEXT    NOT NULL,
      zip         TEXT    NOT NULL,
      bill        TEXT,
      status      TEXT    NOT NULL DEFAULT 'new',
      notes       TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS estimates (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id   INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      system_size TEXT,
      panel_count TEXT,
      annual_production TEXT,
      estimated_savings TEXT,
      incentives  TEXT,
      notes       TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  return db;
}

module.exports = initDB;
