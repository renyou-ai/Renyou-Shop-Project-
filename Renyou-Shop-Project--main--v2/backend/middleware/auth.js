import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─────────────────────────────────────────────
// Require valid JWT
// ─────────────────────────────────────────────
export const auth = async (req, res, next) => {
  try {
const authHeader = req.headers.authorization;

if (!authHeader) {
  return res.status(401).json({
    success: false,
    message: "Token manquant",
  });
}

const token = authHeader.startsWith("Bearer ")
  ? authHeader.slice(7)
  : authHeader;

const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
} catch (err) {
  console.error("URL =", req.originalUrl);
  console.error("Authorization =", req.headers.authorization);
  console.error("ERROR =", err.message);

  return res.status(401).json({
    success: false,
    message: "Token invalide ou expiré",
  });
}
};

// ─────────────────────────────────────────────
// Require admin role
// ─────────────────────────────────────────────
export const adminOnly = (req, res, next) => {
  if (!["Super Admin", "Pharmacist"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};