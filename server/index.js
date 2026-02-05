const express = require("express");
const cors = require("cors");
const path = require("path");

// Initialize DB (runs migrations on first load)
require("./db");

const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clients");
const estimateRoutes = require("./routes/estimates");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Serve admin dashboard ─────────────────────────────────
app.use("/admin", express.static(path.join(__dirname, "..", "admin")));

// ── API Routes ────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/estimates", estimateRoutes);

// ── Health check ──────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
  console.log(`API base: http://localhost:${PORT}/api`);
});
