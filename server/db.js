const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

/**
 * Initialize and return the Supabase client.
 * Expects SUPABASE_URL and SUPABASE_KEY environment variables.
 * Use the service_role key (not anon) for full server-side access.
 */
async function initDB() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("ERROR: Missing SUPABASE_URL or SUPABASE_KEY environment variables.");
    console.error("Set them in your .env file or Render dashboard.");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Test connection
  const { error } = await supabase.from("admins").select("id").limit(1);
  if (error) {
    console.warn("Supabase connection warning:", error.message);
    console.warn("Make sure you've created the tables (see supabase-setup.sql).");
  } else {
    console.log("Connected to Supabase successfully.");
  }

  return supabase;
}

module.exports = initDB;
