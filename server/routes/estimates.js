const { Router } = require("express");
const { requireAuth } = require("../auth");

const router = Router();

// All estimate routes require admin auth

/** POST /api/estimates  (admin) — create estimate for a client */
router.post("/", requireAuth, async (req, res) => {
  const db = req.app.locals.db;
  const { client_id, system_size, panel_count, annual_production, estimated_savings, incentives, notes } = req.body;

  if (!client_id) {
    return res.status(400).json({ error: "client_id is required" });
  }

  // Verify client exists
  const { data: client } = await db
    .from("clients")
    .select("id")
    .eq("id", client_id)
    .single();

  if (!client) return res.status(404).json({ error: "Client not found" });

  const { data, error } = await db
    .from("estimates")
    .insert({
      client_id,
      system_size: system_size || null,
      panel_count: panel_count || null,
      annual_production: annual_production || null,
      estimated_savings: estimated_savings || null,
      incentives: incentives || null,
      notes: notes || null,
    })
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/** GET /api/estimates/:id  (admin) */
router.get("/:id", requireAuth, async (req, res) => {
  const db = req.app.locals.db;

  const { data, error } = await db
    .from("estimates")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: "Estimate not found" });
  res.json(data);
});

/** PATCH /api/estimates/:id  (admin) */
router.patch("/:id", requireAuth, async (req, res) => {
  const db = req.app.locals.db;

  const allowed = ["system_size", "panel_count", "annual_production", "estimated_savings", "incentives", "notes"];
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
    .from("estimates")
    .update(updates)
    .eq("id", req.params.id)
    .select("*")
    .single();

  if (error || !data) return res.status(404).json({ error: "Estimate not found" });
  res.json(data);
});

/** DELETE /api/estimates/:id  (admin) */
router.delete("/:id", requireAuth, async (req, res) => {
  const db = req.app.locals.db;

  const { data, error } = await db
    .from("estimates")
    .delete()
    .eq("id", req.params.id)
    .select("id");

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: "Estimate not found" });
  res.json({ message: "Estimate deleted" });
});

module.exports = router;
