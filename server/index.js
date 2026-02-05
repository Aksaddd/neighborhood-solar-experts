const express = require("express");
const cors = require("cors");
const path = require("path");
const initDB = require("./db");

async function start() {
  const db = await initDB();

  // Make db accessible to route files via app.locals
  const app = express();
  app.locals.db = db;
  const PORT = process.env.PORT || 3001;

  // ── Middleware ─────────────────────────────────────────────
  app.use(cors());
  app.use(express.json());

  // ── Serve admin dashboard ─────────────────────────────────
  app.use("/admin", express.static(path.join(__dirname, "..", "admin")));

  // ── API Routes ────────────────────────────────────────────
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/clients", require("./routes/clients"));
  app.use("/api/estimates", require("./routes/estimates"));

  // ── Health check ──────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ── Serve frontend (production) ───────────────────────────
  const distPath = path.join(__dirname, "..", "dist");
  const fs = require("fs");
  if (fs.existsSync(distPath)) {
    console.log("Serving frontend from:", distPath);
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log("WARNING: dist/ not found at", distPath, "— frontend will not be served");
  }

  // ── Start ─────────────────────────────────────────────────
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
  });
}

start().catch(console.error);
