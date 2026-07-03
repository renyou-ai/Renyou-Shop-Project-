// routes/auth.js  (or wherever your POST /api/auth/google is)
// ✅ Compatible with useGoogleLogin (OAuth2 implicit flow)
// Frontend sends: { email, name, picture, googleId }
// NO id_token verification needed — Google already verified the user
// before returning the access_token to the frontend.

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // adjust path to your User model

router.post("/google", async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    // Basic validation
    if (!email || !name) {
      return res.status(400).json({ message: "Missing required Google user data." });
    }

    // Find existing user or create new one
    let user = await User.findOne({ email });

    if (!user) {
      // New user — create account
      user = await User.create({
        email,
        name,
        picture: picture || "",
        googleId: googleId || "",
        role: "user",         // default role
        authProvider: "google",
        password: null,       // no password for Google users
      });
    } else {
      // Existing user — update Google info if needed
      if (!user.googleId && googleId) user.googleId = googleId;
      if (!user.picture && picture) user.picture = picture;
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
    });

  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ message: "Internal server error during Google auth." });
  }
});

module.exports = router;