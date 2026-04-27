import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect("mongodb://localhost:27017/renyou-shop")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Secret JWT
const JWT_SECRET = "supersecretkey"; // ⚠️ changer en production

// Models
const User = mongoose.model("User", new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  skinType: String,
  agree: Boolean
}));

const Product = mongoose.model("Product", new mongoose.Schema({
  name: String,
  price: Number,
  image: String
}));

const Cart = mongoose.model("Cart", new mongoose.Schema({
  productId: String,
  userId: String
}));

// Middleware pour vérifier token
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

// Transporter nodemailer (⚠️ configure ton vrai compte mail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tonemail@gmail.com",
    pass: "tonpassword"
  }
});

// Routes

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, skinType, agree } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const plainPassword = req.body.password;

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      skinType,
      agree
    });

    await user.save();

    res.status(201).json({ message: "Inscription réussie !" });

  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de l'inscription",
      error: err.message
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login success", token });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du login", error: err.message });
  }
});

// Forgot Password Request
app.post("/api/auth/forgot-password-request", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requis" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Générer token reset
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });

    // Lien reset
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Envoi email
    await transporter.sendMail({
      from: "tonemail@gmail.com",
      to: email,
      subject: "Réinitialisation du mot de passe",
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}`
    });

    res.json({ message: "Lien de réinitialisation envoyé !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la demande", error: err.message });
  }
});

// Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la réinitialisation", error: err.message });
  }
});

// Produits (public)
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// Panier (protégé par token)
app.post("/api/cart", authMiddleware, async (req, res) => {
  const cart = new Cart({ productId: req.body.productId, userId: req.user.id });
  await cart.save();
  res.send(cart);
});

app.get("/api/cart", authMiddleware, async (req, res) => {
  const items = await Cart.find({ userId: req.user.id });
  res.send(items);
});

// ⚠️ juste pour test
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Lancer serveur
app.listen(5000, () => console.log("Backend running on port 5000"));