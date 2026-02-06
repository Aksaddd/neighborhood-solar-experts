const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { signToken, requireAuth } = require("../auth");

const router = Router();

/** POST /api/auth/login */
router.post("/login", async (req, res) => {
  const db = req.app.locals.db;
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const { data: admin, error } = await db
    .from("admins")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !admin) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({ id: admin.id, username: admin.username });
  res.json({ token, username: admin.username });
});

/** POST /api/auth/change-password  (requires auth) */
router.post("/change-password", requireAuth, async (req, res) => {
  const db = req.app.locals.db;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both current and new password are required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }

  const { data: admin } = await db
    .from("admins")
    .select("*")
    .eq("id", req.admin.id)
    .single();

  const valid = await bcrypt.compare(currentPassword, admin.password);
  if (!valid) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await db
    .from("admins")
    .update({ password: hash })
    .eq("id", req.admin.id);

  res.json({ message: "Password updated" });
});

/** GET /api/auth/me  (requires auth — used to verify tokens) */
router.get("/me", requireAuth, (req, res) => {
  res.json({ id: req.admin.id, username: req.admin.username });
});

module.exports = router;
