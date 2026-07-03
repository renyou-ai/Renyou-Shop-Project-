import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  adminGetAllCarts,
} from "../controllers/cartController.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ── User routes (require login) ───────────────────────────────────
router.get("/",                   auth, getCart);
router.post("/add",               auth, addToCart);
router.put("/update",             auth, updateCartItem);
router.delete("/remove/:productId", auth, removeFromCart);
router.delete("/clear",           auth, clearCart);
router.post("/coupon",            auth, applyCoupon);
router.delete("/coupon",          auth, removeCoupon);

// ── Admin routes ──────────────────────────────────────────────────
router.get("/admin/all", auth, adminOnly, adminGetAllCarts);

export default router;
