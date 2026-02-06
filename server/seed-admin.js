/**
 * Seed script — creates the default admin account in Supabase.
 *
 * Usage:  npm run seed-admin
 *
 * Requires SUPABASE_URL and SUPABASE_KEY environment variables.
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

  // Check if admin already exists
  const { data: existing } = await db
    .from("admins")
    .select("id")
    .eq("username", USERNAME)
    .single();

  if (existing) {
    console.log(`Admin "${USERNAME}" already exists (id: ${existing.id}). Skipping.`);
    return;
  }

  const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

  const { data, error } = await db
    .from("admins")
    .insert({ username: USERNAME, password: hash })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }

  console.log(`Admin "${USERNAME}" created (id: ${data.id}).`);
  console.log("Default password: changeme123 — please change it after first login.");
}

seed().catch(console.error);
