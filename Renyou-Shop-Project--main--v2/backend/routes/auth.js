import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


// ─── REGISTER ───────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        error: "All required fields must be provided",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    // Existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    // Create user
    const user = new User({
      username: fullName,
      name: fullName,
      email: email.toLowerCase(),
      password,
      role: "user",
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// ─── GOOGLE LOGIN ────────────────────────────────────────
router.post("/google", async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        error: "Missing Google user data."
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
  username: name,
  name,
  email,
  password: "google_oauth_" + email,
  avatar: picture || "",
  role: "user",
  googleAccount: true
});

      await user.save();
    } else {
      if (!user.avatar && picture) {
  await User.updateOne(
    { _id: user._id },
    { avatar: picture }
  );

  user.avatar = picture;
}
    }

await User.updateOne(
  { _id: user._id },
  { lastActive: new Date() }
);

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        initials: user.initials,
        department: user.department,
        settings: user.settings
      }
    });

  } catch (err) {
      console.error("LOGIN ERROR =", err);

    res.status(500).json({
      error: "Google auth failed: " + err.message
    });
  }
});


  // ─── LOGIN ──────────────────────────────────────────────
router.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

const valid = await user.comparePassword(password);


    if (!valid) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    if (user.status === "INACTIVE") {
      return res.status(403).json({
        error: "Account disabled"
      });
    }

await User.updateOne(
  { _id: user._id },
  { lastActive: new Date() }
);

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
      }
    )
    ;


    // IMPORTANT
    res.json({
      token,

      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        initials: user.initials,
        department: user.department,
        settings: user.settings,
        avatar: user.avatar
      }
    })
    ;


  } catch (err) {
    console.error("LOGIN ERROR", err);

    res.status(500).json({
      error: err.message
    });
  }
});


// ─── CURRENT USER ───────────────────────────────────────
router.get("/me", auth, (req, res) => {
  res.json(req.user);
});


// ─── CHANGE PASSWORD ────────────────────────────────────
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const valid = await user.comparePassword(currentPassword);

    if (!valid) {
      return res.status(400).json({
        error: "Current password incorrect"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Minimum 6 characters"
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password changed"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ─── FORGOT PASSWORD ────────────────────────────────────
router.post("/forgot-password-request", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Password Reset",
      text: `Click this link to reset your password:\n\n${resetLink}`,
    });

    res.json({
      message: "Password reset link sent successfully.",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get("/debug-users", async (req, res) => {
  const users = await User.find({}, {
    email: 1,
    username: 1,
    googleAccount: 1
  });

  res.json(users);
});

// ─── RESET PASSWORD ─────────────────────────────────────
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: "Token, new password and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    user.password = newPassword;

    // Le pre("save") fi User.js yhashi automatiquement le mot de passe
    await user.save();

    res.json({
      message: "Password reset successfully",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;