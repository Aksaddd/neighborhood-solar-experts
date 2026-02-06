const { Router } = require("express");
const { requireAuth } = require("../auth");

const router = Router();

// All estimate routes require admin auth

/** POST /api/estimates  (admin) — create estimate for a client */
router.post("/", requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const { client_id, system_size, panel_count, annual_production, estimated_savings, incentives, notes } = req.body;

  if (!client_id) {
    return res.status(400).json({ error: "client_id is required" });
  }

  const client = db.get("SELECT id FROM clients WHERE id = ?", [client_id]);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const result = db.run(
    `INSERT INTO estimates (client_id, system_size, panel_count, annual_production, estimated_savings, incentives, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [client_id, system_size || null, panel_count || null, annual_production || null, estimated_savings || null, incentives || null, notes || null]
  );

  const estimate = db.get("SELECT * FROM estimates WHERE id = ?", [result.lastInsertRowid]);
  res.status(201).json(estimate);
});

/** GET /api/estimates/:id  (admin) */
router.get("/:id", requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const estimate = db.get("SELECT * FROM estimates WHERE id = ?", [req.params.id]);
  if (!estimate) return res.status(404).json({ error: "Estimate not found" });
  res.json(estimate);
});

/** PATCH /api/estimates/:id  (admin) */
router.patch("/:id", requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const estimate = db.get("SELECT * FROM estimates WHERE id = ?", [req.params.id]);
  if (!estimate) return res.status(404).json({ error: "Estimate not found" });

  const allowed = ["system_size", "panel_count", "annual_production", "estimated_savings", "incentives", "notes"];
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

  db.run(`UPDATE estimates SET ${updates.join(", ")} WHERE id = ?`, params);

  const updated = db.get("SELECT * FROM estimates WHERE id = ?", [req.params.id]);
  res.json(updated);
});

/** DELETE /api/estimates/:id  (admin) */
router.delete("/:id", requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const result = db.run("DELETE FROM estimates WHERE id = ?", [req.params.id]);
  if (result.changes === 0) return res.status(404).json({ error: "Estimate not found" });
  res.json({ message: "Estimate deleted" });
});

module.exports = router;
