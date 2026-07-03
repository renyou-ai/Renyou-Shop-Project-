const TAG_ALIASES = {
  // Skin
  dry_skin: "dry",
  dehydrated: "dry",

  // Hair
  dry_hair: "damaged_hair",
  anti_hair_loss: "hair_loss",
  hair_fall: "hair_loss",

  // Barrier
  barrier_repair: "skin_barrier",

  // Hydration
  moisturizer: "hydration",

  // Cleansers
  daily_cleanser: "cleanser",

  // Sun
  sun_protection: "sunscreen",

  // Supplements
  supplements: "supplement",
  vitamins: "supplement"
};

function normalizeTag(tag) {
  return TAG_ALIASES[tag] || tag;
}

export function extractWantedTags(query) {
  const q = query.toLowerCase();
  const wantedTags = [];

  // Kol catégorie 3andha synonymes
  const keywords = {
    acne: [
      "acne",
      "boutons",
      "pimples",
      "blackheads",
      "whiteheads",
      "7boub",
      "hboub",
      "zit",
      "peau grasse"
    ],

    dry: [
      "dry",
      "dryness",
      "dehydrated",
      "hydration",
      "hydrate",
      "sèche",
      "seche",
      "peau sèche",
      "jaffa"
    ],

    oily: [
      "oily",
      "oil",
      "huile",
      "grasse",
      "peau grasse",
      "sebum"
    ],

    sensitive: [
      "sensitive",
      "sensible",
      "redness",
      "irritation",
      "reactive",
      "reactif",
      "rougeur"
    ],

    pigmentation: [
      "pigmentation",
      "dark spot",
      "dark spots",
      "taches",
      "melasma",
      "hyperpigmentation"
    ],

    radiance: [
  "radiance",
  "glow",
  "glowing",
  "bright",
  "healthy",
  "balanced",
  "smooth",
  "high radiance",
  "good skin care"
],

aging: [
  "aging",
  "anti age",
  "anti-age",
  "wrinkles",
  "rides",
  "firming",
  "collagen",
  "vieillissement",
  "fine lines"
],

    sunscreen: [
      "spf",
      "sun",
      "uv",
      "solaire",
      "sunscreen",
      "protection solaire"
    ],

    hair: [
      "hair",
      "cheveux",
      "hair loss",
      "anti chute",
      "hair growth",
      "hair_growth",
      "hair_loss",
      "strengthening"
    ],

    baby: [
      "baby",
      "bébé",
      "bebe",
      "gentle",
      "sensitive skin"
    ],

    vitamins: [
      "vitamin",
      "vitamins",
      "vitamine",
      "supplement",
      "complément",
      "supplements",
      "energy",
      "fatigue",
      "omega",
      "zinc",
      "magnesium",
      "biotin",
      "collagen"
    ]
  };

  // Tags elli nlawjoulhom fil produits
  const rules = {
    acne: [
      "acne",
      "oil_control",
      "cleanser",
      "niacinamide",
      "salicylic_acid"
    ],

    dry: [
      "dry",
      "hydration",
      "skin_barrier",
      "ceramides",
      "hyaluronic_acid"
    ],

    oily: [
      "oily",
      "oil_control",
      "niacinamide",
      "cleanser"
    ],

    sensitive: [
      "sensitive",
      "calming",
      "skin_barrier",
      "centella",
      "ceramides"
    ],

    pigmentation: [
      "pigmentation",
      "vitamin_c",
      "brightening",
      "exfoliation"
    ],

    aging: [
      "aging",
      "retinol",
      "collagen",
      "firming",
      "peptides"
    ],

    sunscreen: [
      "spf",
      "sunscreen",
      "uv_protection"
    ],

    hair: [
      "hair",
      "hair_loss",
      "hair_growth",
      "strengthening"
    ],

    baby: [
      "baby",
      "gentle",
      "sensitive_skin"
    ],

    vitamins: [
      "supplement",
      "vitamins",
      "energy"
    ],

    radiance: [
  "radiance",
  "brightening",
  "vitamin_c",
  "antioxidant",
  "all_skin_types"
],

  };

  Object.entries(keywords).forEach(([key, words]) => {
    if (words.some((word) => q.includes(word))) {
      wantedTags.push(...rules[key]);
    }
  });

  return [...new Set(wantedTags.map(normalizeTag))];
}

export function quizAnswersToTags(answers) {
  const tags = [];

  // Skin type
if (answers.skin_type === "dry") {
  tags.push("dry", "hydration", "skin_barrier");
}

if (answers.skin_type === "oily") {
  tags.push("oily", "oil_control", "cleanser");
}

if (answers.skin_type === "combination") {
  tags.push("combination", "cleanser", "hydration");
}

if (answers.skin_type === "sensitive") {
  tags.push("sensitive", "skin_barrier", "gentle");
}

if (answers.skin_type === "normal") {
  tags.push("normal", "hydration");
}

  // Main concern
if (answers.main_concern === "acne") {
  tags.push(
    "acne",
    "oil_control",
    "cleanser",
    "niacinamide",
    "salicylic_acid"
  );
}

if (answers.main_concern === "dry") {
  tags.push(
    "dry",
    "hydration",
    "skin_barrier",
    "ceramides",
    "hyaluronic_acid"
  );
}

if (answers.main_concern === "pigmentation") {
  tags.push(
    "pigmentation",
    "vitamin_c",
    "brightening",
    "dark_spots",
    "antioxidant"
  );
}

if (answers.main_concern === "aging") {
  tags.push(
    "anti_aging",
    "retinol",
    "collagen",
    "peptides",
    "firming"
  );
}

if (answers.main_concern === "sensitive") {
  tags.push(
    "sensitive",
    "skin_barrier",
    "gentle",
    "calming"
  );
}

if (answers.main_concern === "hair_loss") {
  tags.push(
    "hair_loss",
    "hair_growth",
    "strengthening",
    "biotin"
  );
}

  // Secondary concerns
if (Array.isArray(answers.secondary_concern)) {
  answers.secondary_concern.forEach((concern) => {

    if (concern === "acne") {
      tags.push(
        "acne",
        "oil_control",
        "cleanser",
        "niacinamide"
      );
    }

    if (concern === "dry") {
      tags.push(
        "dry",
        "hydration",
        "skin_barrier"
      );
    }

    if (concern === "pigmentation") {
      tags.push(
        "pigmentation",
        "vitamin_c",
        "brightening"
      );
    }

    if (concern === "aging") {
      tags.push(
        "anti_aging",
        "retinol",
        "peptides"
      );
    }

    if (concern === "sensitive") {
      tags.push(
        "sensitive",
        "skin_barrier",
        "gentle"
      );
    }

    if (concern === "hair_loss") {
      tags.push(
        "hair_loss",
        "hair_growth",
        "strengthening"
      );
    }

  });
}

  // Skin reactions
if (answers.skin_reactions === "never") {
  tags.push(
    "all_skin_types"
  );
}

if (answers.skin_reactions === "sometimes") {
  tags.push(
    "sensitive",
    "gentle"
  );
}

if (answers.skin_reactions === "often") {
  tags.push(
    "sensitive",
    "skin_barrier",
    "gentle",
    "hydration",
    "calming"
  );
}

  // Sun exposure
if (answers.sun_exposure === "low") {
  tags.push(
    "spf",
    "daily"
  );
}

if (answers.sun_exposure === "moderate") {
  tags.push(
    "spf",
    "sunscreen",
    "uv_protection",
    "daily"
  );
}

if (answers.sun_exposure === "high") {
  tags.push(
    "spf",
    "sunscreen",
    "uv_protection",
    "hydration",
    "antioxidant"
  );
}

// Lifestyle
if (Array.isArray(answers.lifestyle)) {
  answers.lifestyle.forEach((item) => {

    if (item === "outdoor") {
      tags.push(
        "spf",
        "sunscreen",
        "uv_protection",
        "antioxidant"
      );
    }

    if (item === "sports") {
      tags.push(
        "spf",
        "hydration",
        "cleanser"
      );
    }

    if (item === "air_conditioning") {
      tags.push(
        "hydration",
        "skin_barrier"
      );
    }

    if (item === "pollution") {
      tags.push(
        "cleanser",
        "antioxidant",
        "brightening"
      );
    }

    if (item === "stress") {
      tags.push(
        "skin_barrier",
        "hydration"
      );
    }

  });
}

return [...new Set(tags.map(normalizeTag))];
}

const TAG_WEIGHTS = {
  // Problèmes principaux
  acne: 3,
  pigmentation: 3,
  hair_loss: 3,
  vitamin_c: 3,

  // Besoins importants
  hydration: 2,
  skin_barrier: 2,
  spf: 2,
  sunscreen: 2,
  brightening: 2,
  oil_control: 2,
  sensitive: 2,
  dry: 2,
  oily: 2,

  // Valeur par défaut
  default: 1
};

const BONUS_RULES = [
  {
    tags: ["vitamin_c", "brightening", "pigmentation"],
    bonus: 2,
  },
  {
    tags: ["spf", "sunscreen", "uv_protection"],
    bonus: 2,
  },
  {
    tags: ["hydration", "skin_barrier"],
    bonus: 2,
  },
  {
    tags: ["hair_loss", "hair_growth", "strengthening"],
    bonus: 2,
  },
];

export function scoreProducts(products, wantedTags) {
  return products
    .map((product) => {
let score = 0;

let mainScore = 0;
let bonusScore = 0;
let penaltyScore = 0;

const productTags = (product.tags || []).map((tag) =>
  normalizeTag(tag.toLowerCase())
);

wantedTags.forEach((tag) => {
  const normalizedTag = normalizeTag(tag.toLowerCase());

if (productTags.includes(normalizedTag)) {
  mainScore += TAG_WEIGHTS[normalizedTag] || TAG_WEIGHTS.default;
}
});

// Bonus scoring
BONUS_RULES.forEach((rule) => {
  const hasAllTags = rule.tags.every((tag) =>
    productTags.includes(normalizeTag(tag))
  );

BONUS_RULES.forEach((rule) => {
  const matches = rule.tags.filter((tag) =>
    productTags.includes(normalizeTag(tag))
  ).length;

if (matches === rule.tags.length) {
  bonusScore += rule.bonus;
} else if (matches >= 2) {
  bonusScore += 1;
}
});
});

// Penalties
if (wantedTags.includes("dry") && productTags.includes("oil_control")) {
  penaltyScore -= 2;
}

if (wantedTags.includes("oily") && productTags.includes("hydration")) {
  penaltyScore -= 1;
}

if (wantedTags.includes("sensitive") && productTags.includes("exfoliation")) {
  penaltyScore -= 2;
}

score = mainScore + bonusScore + penaltyScore;

const newProduct = {
  ...product,
  score,
  mainScore,
  bonusScore,
  penaltyScore,
};

return newProduct;
    })
    .sort((a, b) => b.score - a.score);
}

export function diversifyProducts(products, limit = 4) {
  const selected = [];
  const usedTypes = new Set();

  for (const product of products) {
    const tags = product.tags || [];

    let type = "other";

    if (tags.includes("serum")) type = "serum";
    else if (tags.includes("cleanser")) type = "cleanser";
    else if (tags.includes("sunscreen")) type = "sunscreen";
    else if (tags.includes("supplement")) type = "supplement";
    else if (tags.includes("shampoo")) type = "shampoo";
    else if (tags.includes("hair_mask")) type = "hair_mask";
    else if (tags.includes("night_cream")) type = "night_cream";
    else if (tags.includes("medical_device")) type = "device";

    if (!usedTypes.has(type)) {
      selected.push(product);
      usedTypes.add(type);
    }

    if (selected.length === limit) break;
  }

  return selected;
}

function getProductType(product) {
  const tags = product.tags || [];

  if (tags.includes("cleanser")) return "cleanser";
  if (tags.includes("serum")) return "serum";
  if (tags.includes("sunscreen")) return "sunscreen";
  if (tags.includes("night_cream")) return "night_cream";
  if (tags.includes("supplement")) return "supplement";
  if (tags.includes("shampoo")) return "hair";
  if (tags.includes("hair_mask")) return "hair";
  if (tags.includes("baby")) return "baby";
  if (tags.includes("medical_device")) return "device";

  return "other";
}

export function buildRoutine(products, wantedTags = []) {
  const routine = [];
  const routineProducts = products
  .filter((p) => p.routine?.step != null)
  .sort((a, b) => a.routine.step - b.routine.step);

  for (const product of routineProducts) {
  if (!routine.includes(product)) {
    routine.push(product);
  }

  if (routine.length === 4) break;
}
  
  const needsSPF =
  wantedTags.includes("spf") ||
  wantedTags.includes("sunscreen");

const needsHair =
  wantedTags.includes("hair") ||
  wantedTags.includes("hair_loss") ||
  wantedTags.includes("hair_growth");

const needsBaby =
  wantedTags.includes("baby");

const needsSupplement =
  wantedTags.includes("supplement") ||
  wantedTags.includes("vitamin_c") ||
  wantedTags.includes("energy");

const addFirst = (tag) => {
  const candidates = products
    .filter(
      (p) => p.tags?.includes(tag) && !routine.includes(p)
    )
    .sort((a, b) => b.score - a.score);

  if (candidates.length > 0) {
    routine.push(candidates[0]);
  }
};

// Toujours cleanser + serum
addFirst("cleanser");
addFirst("serum");

// Sunscreen seulement si nécessaire
if (needsSPF) {
  addFirst("sunscreen");
}

// Hair routine
if (needsHair) {
  addFirst("shampoo");
  addFirst("hair_mask");
}

// Baby routine
if (needsBaby) {
  addFirst("baby");
}

// Supplements
if (needsSupplement) {
  addFirst("supplement");
}

// Night cream si mazel fama blassa
if (routine.length < 4) {
  addFirst("night_cream");
}

  // Ken mazel na9es
  for (const product of products) {
    if (!routine.includes(product)) {
      routine.push(product);
    }

    if (routine.length === 4) break;
  }

  // Fallback: akmel routine bel a7sen produits elli mazelo ma t5tarouch

[...products]
  .sort((a, b) => b.score - a.score)
  .forEach((product) => {
    if (
      routine.length < 4 &&
      !routine.some((p) => p._id.toString() === product._id.toString())
    ) {
      routine.push(product);
    }
  });



  return routine.sort((a, b) => {
  const stepA = a.routine?.step ?? 999;
  const stepB = b.routine?.step ?? 999;

  return stepA - stepB;
});
}