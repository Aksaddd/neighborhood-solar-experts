const { Router } = require("express");
const { requireAuth } = require("../auth");

const router = Router();

// ── Public: submit a new lead from the contact form ──────

/** POST /api/clients  (public — called by the website form) */
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const { name, email, phone, zip, bill } = req.body;

  if (!name || !email || !phone || !zip) {
    return res.status(400).json({ error: "Name, email, phone, and ZIP are required" });
  }

  const { data, error } = await db
    .from("clients")
    .insert({ name, email, phone, zip, bill: bill || null })
    .select("id")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ id: data.id, message: "Submission received" });
});

// ── Admin-only routes below ──────────────────────────────

/** GET /api/clients  (admin) — list all clients */
router.get("/", requireAuth, async (req, res) => {
  const db = req.app.locals.db;
  const { status, search, sort, order } = req.query;

  let query = db.from("clients").select("*");

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,zip.ilike.%${search}%`
    );
  }

  const sortCol = ["name", "email", "created_at", "status", "zip"].includes(sort) ? sort : "created_at";
  const ascending = order === "asc";
  query = query.order(sortCol, { ascending });

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/** GET /api/clients/:id  (admin) — single client with estimates */
router.get("/:id", requireAuth, async (req, res) => {
  const db = req.app.locals.db;

  const { data: client, error } = await db
    .from("clients")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !client) return res.status(404).json({ error: "Client not found" });

  const { data: estimates } = await db
    .from("estimates")
    .select("*")
    .eq("client_id", req.params.id)
    .order("created_at", { ascending: false });

  res.json({ ...client, estimates: estimates || [] });
});

/** PATCH /api/clients/:id  (admin) — update client fields */
router.patch("/:id", requireAuth, async (req, res) => {
  const db = req.app.locals.db;

  const allowed = ["name", "email", "phone", "zip", "bill", "status", "notes"];
  const updates = {};

  for (const field of allowed) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await db
    .from("clients")
    .update(updates)
    .eq("id", req.params.id)
    .select("*")
    .single();

  if (error || !data) return res.status(404).json({ error: "Client not found" });
  res.json(data);
});

/** DELETE /api/clients/:id  (admin) */
router.delete("/:id", requireAuth, async (req, res) => {
  const db = req.app.locals.db;

  const { data, error } = await db
    .from("clients")
    .delete()
    .eq("id", req.params.id)
    .select("id");

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: "Client not found" });
  res.json({ message: "Client deleted" });
});

module.exports = router;
