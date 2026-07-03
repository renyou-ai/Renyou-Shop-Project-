import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import authRoutes from "./routes/auth.js";
import diagnosticsRoutes from "./routes/diagnostics.js";
import productsRoutes from "./routes/products.js";

import categoryRoutes from "./routes/categories.js";
import brandRoutes from "./routes/brands.js";
import orderRoutes from "./routes/orders.js";
import customerRoutes from "./routes/customers.js";
import promotionRoutes from "./routes/promotions.js";
import couponRoutes from "./routes/coupons.js";
import userRoutes from "./routes/users.js";
import notificationRoutes from "./routes/notifications.js";
import dashboardRoutes from "./routes/dashboard.js";
import settingsRoutes from "./routes/settings.js";
import cartRoutes from "./routes/cart.js";

import bundleRoutes from "./routes/bundles.js";
import aiRoutes from "./routes/ai.js";

import {
  askRenyouAI,
  clearSession,
  getSessionStats,
} from "./ai/renyou_ai_engine.js";

app.use(cors());
app.use(express.json({ limit: "50mb" }));
import path from "path";

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "public/uploads")
  )
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/diagnostics", diagnosticsRoutes);
app.use("/api/products", productsRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/bundles", bundleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/ai", aiRoutes);

// ===============================
// ✅ DEBUG API KEY
// ===============================
console.log("GROQ KEY:", process.env.GROQ_API_KEY);

// ===============================
// ✅ MongoDB
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// ===============================
// 🚀 SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// juste pour test
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/api/health", (_, res) =>
  res.json({
    status: "ok",
    time: new Date(),
  })
);