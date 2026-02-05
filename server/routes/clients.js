const { Router } = require("express");
const db = require("../db");
const { requireAuth } = require("../auth");

const router = Router();

// ── Public: submit a new lead from the contact form ──────

/** POST /api/clients  (public — called by the website form) */
router.post("/", (req, res) => {
  const { name, email, phone, zip, bill } = req.body;

  if (!name || !email || !phone || !zip) {
    return res.status(400).json({ error: "Name, email, phone, and ZIP are required" });
  }

  const result = db.prepare(
    `INSERT INTO clients (name, email, phone, zip, bill) VALUES (?, ?, ?, ?, ?)`
  ).run(name, email, phone, zip, bill || null);

  res.status(201).json({ id: result.lastInsertRowid, message: "Submission received" });
});

// ── Admin-only routes below ──────────────────────────────

/** GET /api/clients  (admin) — list all clients */
router.get("/", requireAuth, (req, res) => {
  const { status, search, sort, order } = req.query;

  let sql = "SELECT * FROM clients WHERE 1=1";
  const params = [];

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  if (search) {
    sql += " AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR zip LIKE ?)";
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  const sortCol = ["name", "email", "created_at", "status", "zip"].includes(sort) ? sort : "created_at";
  const sortOrder = order === "asc" ? "ASC" : "DESC";
  sql += ` ORDER BY ${sortCol} ${sortOrder}`;

  const clients = db.prepare(sql).all(...params);
  res.json(clients);
});

/** GET /api/clients/:id  (admin) — single client with estimates */
router.get("/:id", requireAuth, (req, res) => {
  const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const estimates = db.prepare("SELECT * FROM estimates WHERE client_id = ? ORDER BY created_at DESC").all(req.params.id);
  res.json({ ...client, estimates });
});

/** PATCH /api/clients/:id  (admin) — update client fields */
router.patch("/:id", requireAuth, (req, res) => {
  const client = db.prepare("SELECT * FROM clients WHERE id = ?").get(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const allowed = ["name", "email", "phone", "zip", "bill", "status", "notes"];
  const updates = [];
  const params = [];

  for (const field of allowed) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  updates.push("updated_at = datetime('now')");
  params.push(req.params.id);

  db.prepare(`UPDATE clients SET ${updates.join(", ")} WHERE id = ?`).run(...params);

  const updated = db.prepare("SELECT * FROM clients WHERE id = ?").get(req.params.id);
  res.json(updated);
});

/** DELETE /api/clients/:id  (admin) */
router.delete("/:id", requireAuth, (req, res) => {
  const result = db.prepare("DELETE FROM clients WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Client not found" });
  res.json({ message: "Client deleted" });
});

module.exports = router;
