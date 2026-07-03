import express from "express";
import mongoose from "mongoose";

import { analyzeSkin } from "../ai/skin_diagnostic_engine.js";
import { analyzeQuiz } from "../ai/quiz_diagnostic_engine.js";

import {
  extractWantedTags,
  quizAnswersToTags,
  scoreProducts,
  diversifyProducts,
  buildRoutine,
} from "../ai/productMatcher.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: "imageBase64 is required"
      });
    }

    const result = await analyzeSkin(imageBase64);
    const aiTags = extractWantedTags(result.summary || "");

const wantedTags = [...aiTags];

// Toujours recommander une protection solaire
wantedTags.push("spf");

// Hydration
if ((result.hydration || 0) < 70) {
  wantedTags.push("hydration", "dry");
} else {
  wantedTags.push("hydration");
}

// Texture
if (result.texture === "Uneven") {
  wantedTags.push("exfoliation");
}

if (result.texture === "Smooth") {
  wantedTags.push("skin_barrier");
}

if (result.texture === "Rough") {
  wantedTags.push("hydration", "ceramides");
}

// Radiance
if (result.radiance === "Low") {
  wantedTags.push("brightening", "vitamin_c");
}

if (result.radiance === "Soft") {
  wantedTags.push("niacinamide");
}

if (result.radiance === "High") {
  wantedTags.push("antioxidant");
}

// Skin score
if ((result.overall_skin_score || 0) < 60) {
  wantedTags.push("skin_barrier");
}

const Product = mongoose.models.Product;
const test = await Product.findById("6a0afd3fa9a8b0cfea193d11");

const serum = await Product.findById("6a0afd3fa9a8b0cfea193d13");

const finalTags = [...new Set(wantedTags)];
const products = await Product.find(
  { status: "ACTIVE" }
)
.populate("category", "name")
.populate("brand", "name")
.lean();

const cleanser = products.find(
  (p) => p._id.toString() === "6a0afd3fa9a8b0cfea193d11"
);

const scoredProducts = scoreProducts(products, finalTags)
  .filter((p) => p.score > 0);

const diversifiedProducts = diversifyProducts(scoredProducts, 10);

const recommendedProducts = buildRoutine(
  diversifiedProducts,
  finalTags
);

res.json({
  success: true,
  result,
  recommendedProducts,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/quiz-analysis", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({
        success: false,
        message: "answers are required",
      });
    }

    const Product = mongoose.models.Product;
const test = await Product.findById("6a0afd3fa9a8b0cfea193d11");

const serum = await Product.findById("6a0afd3fa9a8b0cfea193d13");

const products = await Product.find(
  { status: "ACTIVE" }
)
.populate("category", "name")
.populate("brand", "name")
.lean();

const cleanser = products.find(
  (p) => p._id.toString() === "6a0afd3fa9a8b0cfea193d11"
);

// Quiz answers → tags
const wantedTags = quizAnswersToTags(answers);

// Score
const scoredProducts = scoreProducts(products, wantedTags)
  .filter((p) => p.score > 0);

// Diversification
const diversifiedProducts = diversifyProducts(scoredProducts, 10);

// Build routine
const recommendedProducts = buildRoutine(
  diversifiedProducts,
  wantedTags
);


const result = await analyzeQuiz(answers);

recommendedProducts.sort((a, b) => {
  const stepA = a.routine?.step ?? 999;
  const stepB = b.routine?.step ?? 999;

  return stepA - stepB;
});

res.json({
  success: true,
  result,
  recommendedProducts,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;