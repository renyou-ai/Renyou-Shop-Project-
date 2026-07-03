// PATH: backend/routes/ai.js
// Renyou AI — Express routes using the custom AI engine

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import { askRenyouAI, clearSession, getSessionStats } from "../ai/renyou_ai_engine.js";
import { analyzeSkin } from "../ai/skin_diagnostic_engine.js";
import multer from "multer";
import fs from "fs";
import Groq from "groq-sdk";


const router = express.Router();

// ── POST /api/ai/ask ─────────────────────────────────────────────
// Main chat endpoint — called by frontend AIPopup
router.post("/ask", async (req, res) => {
  const start = Date.now();
  try {
    const { query, session_id, user_id } = req.body;

    if (!query?.trim()) {
      return res.status(400).json({ success:false, error:"Query required" });
    }

    const result = await askRenyouAI({
      query,
      session_id,
      user_id,
      mongoose,
    });

    res.json({
      success:    true,
      result:     result.result,
      session_id: result.session_id,
      lang:       result.lang,
      intent:     result.intent,
      meta:       result.meta,
      took:       Date.now() - start,
    });

  } catch (err) {
    console.error("🔥 AI Route Error:", err.message);

    // Graceful error messages per error type
    let userMessage = "Je rencontre une difficulté technique. Réessayez dans un instant. 🔧";
    if (err.message?.includes("GROQ_API_KEY")) {
      userMessage = "L'assistant AI n'est pas configuré. Contactez l'administrateur.";
    } else if (err.message?.includes("rate limit") || err.message?.includes("429")) {
      userMessage = "Trop de requêtes en même temps. Veuillez patienter quelques secondes. ⏳";
    } else if (err.message?.includes("timeout") || err.message?.includes("network")) {
      userMessage = "Problème de connexion. Vérifiez votre réseau et réessayez. 📶";
    }

    res.status(500).json({
      success: false,
      result:  userMessage,
      error:   err.message,
    });
  }
});

// ── POST /api/ai/clear ──────────────────────────────────────────
// Clear conversation history for a session
router.post("/clear", (req, res) => {
  const { session_id } = req.body;
  clearSession(session_id);
  res.json({ success:true, message:"Conversation cleared" });
});

// ── GET /api/ai/stats ───────────────────────────────────────────
// Admin stats
router.get("/stats", (req, res) => {
  res.json({ success:true, ...getSessionStats() });
});

// ── POST /api/ai/feedback ───────────────────────────────────────
// Store feedback (thumbs up/down) for future fine-tuning
router.post("/feedback", async (req, res) => {
  try {
    const { session_id, message_index, rating, comment } = req.body;
    // TODO: save to DB for future training data

    res.json({ success:true, message:"Feedback recorded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/ai/diagnostics ─────────────────────────────
router.post("/diagnostics", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: "Image required",
      });
    }

    const result = await analyzeSkin(image);

    res.json({
      success: true,
      result,
    });

  } catch (err) {
    console.error("Diagnostic Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/diagnostic-recommendations", async (req, res) => {
  try {
    const { answers } = req.body;

    // taw ba3d bech n3amrouha
    res.json({
      success: true,
      products: [],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".webm");
  },
});

const upload = multer({ storage });
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Audio required",
      });
    }

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-large-v3-turbo",
      response_format: "verbose_json",
    });

    res.json({
      success: true,
      text: transcription.text,
    });

  } catch (err) {
    console.error("Transcription error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

export default router;
