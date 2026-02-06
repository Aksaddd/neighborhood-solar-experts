-- ============================================================
-- Neighborhood Solar Experts — Supabase Table Setup
-- ============================================================
-- Run this SQL in your Supabase project's SQL Editor:
--   1. Go to https://supabase.com/dashboard
--   2. Select your project
--   3. Click "SQL Editor" in the left sidebar
--   4. Paste this entire file and click "Run"
-- ============================================================

-- Admins table (for admin dashboard login)
CREATE TABLE IF NOT EXISTS admins (
  id          SERIAL PRIMARY KEY,
  username    TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clients table (contact form submissions)
CREATE TABLE IF NOT EXISTS clients (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  zip         TEXT NOT NULL,
  bill        TEXT,
  status      TEXT NOT NULL DEFAULT 'new',
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Estimates table (solar estimates linked to clients)
CREATE TABLE IF NOT EXISTS estimates (
  id                  SERIAL PRIMARY KEY,
  client_id           INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  system_size         TEXT,
  panel_count         TEXT,
  annual_production   TEXT,
  estimated_savings   TEXT,
  incentives          TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Disable Row Level Security (our Express server handles auth)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- Allow full access for the service_role key (used by our server)
CREATE POLICY "Service role full access" ON admins
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON clients
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON estimates
  FOR ALL USING (true) WITH CHECK (true);
