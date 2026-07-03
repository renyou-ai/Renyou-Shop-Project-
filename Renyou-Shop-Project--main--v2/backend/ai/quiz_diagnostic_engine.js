import fetch from "node-fetch";
import Product from "../models/Product.js";

function calculateSkinScore(answers) {
  let score = 60;

  // Skin type
  switch (answers.skin_type) {
    case "normal":
      score += 15;
      break;
    case "combination":
      score += 8;
      break;
    case "oily":
      score += 3;
      break;
    case "dry":
      score -= 8;
      break;
    case "sensitive":
      score -= 10;
      break;
  }

  // Main concern
  switch (answers.main_concern) {
    case "acne":
      score -= 10;
      break;
    case "aging":
      score -= 6;
      break;
    case "pigmentation":
      score -= 5;
      break;
    case "dryness":
      score -= 8;
      break;
    case "pores":
      score -= 4;
      break;
    case "redness":
      score -= 7;
      break;
  }

  // Secondary concerns
  if (answers.secondary_concern?.includes("dark_circles"))
    score -= 3;

  if (answers.secondary_concern?.includes("rough_texture"))
    score -= 4;

  if (answers.secondary_concern?.includes("redness"))
    score -= 4;

  if (answers.secondary_concern?.includes("dullness"))
    score -= 3;

  // Sun exposure
  switch (answers.sun_exposure) {
    case "low":
      score += 5;
      break;
    case "moderate":
      score += 1;
      break;
    case "high":
      score -= 8;
      break;
  }

  // Skin reactions
  switch (answers.skin_reactions) {
    case "rarely":
      score += 5;
      break;
    case "sometimes":
      score += 0;
      break;
    case "often":
      score -= 8;
      break;
  }

  // Routine
  switch (answers.current_routine) {
    case "none":
      score -= 10;
      break;
    case "basic":
      score += 4;
      break;
    case "moderate":
      score += 8;
      break;
    case "advanced":
      score += 12;
      break;
  }

  // Lifestyle
  if (answers.lifestyle?.includes("active"))
    score += 4;

  if (answers.lifestyle?.includes("healthy_diet"))
    score += 6;

  if (answers.lifestyle?.includes("well_hydrated"))
    score += 6;

  if (answers.lifestyle?.includes("poor_sleep"))
    score -= 8;

  if (answers.lifestyle?.includes("stress"))
    score -= 6;

  if (answers.lifestyle?.includes("smoker"))
    score -= 12;

  return Math.max(35, Math.min(95, score));
}

function calculateHydration(answers) {
  let hydration = 70;

  // Skin type
  switch (answers.skin_type) {
    case "dry":
      hydration -= 25;
      break;

    case "normal":
      hydration += 10;
      break;

    case "combination":
      hydration += 0;
      break;

    case "oily":
      hydration -= 5;
      break;

    case "sensitive":
      hydration -= 10;
      break;
  }

  // Main concern
  if (answers.main_concern === "dryness")
    hydration -= 20;

  // Lifestyle
  if (answers.lifestyle?.includes("well_hydrated"))
    hydration += 15;

  if (answers.lifestyle?.includes("poor_sleep"))
    hydration -= 8;

  return Math.max(30, Math.min(95, hydration));
}

function calculateTexture(answers) {
  let texture = "Balanced";

  // Main concern
  if (
    answers.main_concern === "acne" ||
    answers.main_concern === "pores"
  ) {
    texture = "Uneven";
  }

  if (
    answers.main_concern === "dryness" ||
    answers.main_concern === "aging"
  ) {
    texture = "Balanced";
  }

  // Secondary concerns
  if (
    answers.secondary_concern?.includes("rough_texture")
  ) {
    texture = "Uneven";
  }

  // Good routine improves texture
  if (
    answers.current_routine === "advanced" &&
    texture === "Uneven"
  ) {
    texture = "Balanced";
  }

  // Excellent profile
  if (
    answers.skin_type === "normal" &&
    answers.current_routine === "advanced" &&
    answers.lifestyle?.includes("healthy_diet")
  ) {
    texture = "Smooth";
  }

  return texture;
}

function calculateRadiance(answers) {
  let score = 0;

  // Lifestyle
  if (answers.lifestyle?.includes("healthy_diet")) score += 2;
  if (answers.lifestyle?.includes("well_hydrated")) score += 2;
  if (answers.lifestyle?.includes("active")) score += 1;

  if (answers.lifestyle?.includes("poor_sleep")) score -= 2;
  if (answers.lifestyle?.includes("high_stress")) score -= 1;
  if (answers.lifestyle?.includes("smoker")) score -= 2;

  // Skin concerns
  if (answers.main_concern === "pigmentation") score -= 1;
  if (answers.main_concern === "dryness") score -= 1;

  // Routine
  if (answers.current_routine === "advanced") score += 2;
  else if (answers.current_routine === "moderate") score += 1;

  // Final result
  if (score >= 5) return "High";
  if (score >= 2) return "Warm";
  if (score >= 0) return "Soft";
  return "Low";
}

export async function analyzeQuiz(answers) {
      console.log(answers);
  const calculatedScore = calculateSkinScore(answers);
  const calculatedHydration = calculateHydration(answers);
  const calculatedTexture = calculateTexture(answers);
  const calculatedRadiance = calculateRadiance(answers);
  const prompt = `
User skin profile:

${JSON.stringify(answers, null, 2)}

Analyze this skincare profile.

The following values are already calculated.

overall_skin_score = ${calculatedScore}
hydration = ${calculatedHydration}
texture = "${calculatedTexture}"
radiance = "${calculatedRadiance}"

DO NOT modify these values.

Your job is ONLY to generate:

- summary
- skin_type
- main_concern
- routine_level

The summary must be personalized according to the user's answers.
Never reuse the same wording.

Return ONLY valid JSON.

overall_skin_score = ${calculatedScore}
hydration = ${calculatedHydration}
texture = "${calculatedTexture}"
radiance = "${calculatedRadiance}"

You MUST use exactly these values.
Do NOT change them.

Return ONLY valid JSON:

{
  "summary": "short paragraph",
  "skin_type": "",
  "main_concern": "",
  "routine_level": ""
}
`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are a skincare expert. Return ONLY valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    }
  );

  const data = await response.json();

const text =
  data?.choices?.[0]?.message?.content || "{}";

const aiResult = JSON.parse(
  text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()
);

return {
  overall_skin_score: calculatedScore,
  hydration: calculatedHydration,
  texture: calculatedTexture,
  radiance: calculatedRadiance,

  summary: aiResult.summary,
  skin_type: aiResult.skin_type,
  main_concern: aiResult.main_concern,
  routine_level: aiResult.routine_level,
};
}