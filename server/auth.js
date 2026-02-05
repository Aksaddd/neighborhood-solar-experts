const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "nse-dev-secret-change-in-production";
const TOKEN_EXPIRY = "8h";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/** Express middleware — rejects unauthenticated requests */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = verifyToken(header.slice(7));
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { signToken, verifyToken, requireAuth, JWT_SECRET };
