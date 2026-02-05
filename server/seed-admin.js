/**
 * Seed script — creates the default admin account.
 *
 * Usage:  npm run seed-admin
 *
 * Default credentials (change immediately after first login):
 *   username: admin
 *   password: changeme123
 */
const bcrypt = require("bcryptjs");
const initDB = require("./db");

const USERNAME = "admin";
const PASSWORD = "changeme123";
const SALT_ROUNDS = 12;

async function seed() {
  const db = await initDB();

  const existing = db.get("SELECT id FROM admins WHERE username = ?", [USERNAME]);
  if (existing) {
    console.log(`Admin "${USERNAME}" already exists (id: ${existing.id}). Skipping.`);
    return;
  }

  const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
  const result = db.run("INSERT INTO admins (username, password) VALUES (?, ?)", [USERNAME, hash]);
  console.log(`Admin "${USERNAME}" created (id: ${result.lastInsertRowid}).`);
  console.log("Default password: changeme123 — please change it after first login.");
}

seed().catch(console.error);
