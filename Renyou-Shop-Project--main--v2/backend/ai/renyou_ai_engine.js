// PATH: backend/ai/renyou_ai_engine.js
// ═══════════════════════════════════════════════════════════════════
// Renyou AI Engine — Custom LLM System
// Dedicated to Renyou Shop — No generic AI branding
// Powered by Groq Llama 3.3 70B (best open model available)
// ═══════════════════════════════════════════════════════════════════

import fetch from "node-fetch";

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// ── In-memory session store ──────────────────────────────────────
const sessions = new Map();

// ── Language detection ───────────────────────────────────────────
function detectLang(text) {
  if (!text) return "fr";
  const t = text.toLowerCase();
  // Tunisian Derja keywords
  const tnWords = [
    "chnowa","chnia","chniya","kifech","kifach","3lech","alech","bech","besh",
    "mazel","mezel","3andi","3andek","3andou","3andha","3andna","3andhom",
    "9adech","9addesh","9adeh","9adach","lazem","yelzem",
    "mochkla","mouchkla","mouchkel",
    "barcha","barsha","yezzi","tawa","tawwa",
    "wa9teh","wa9tach","wakteh",
    "chwaya","chouaya",
    "barra","bara",
    "haka","hakka","heka",
    "yasser","yeser",
    "enti","inta",
    "houa","howa","hiya",
    "nheb","n7eb","n7ib",
    "7ajti","7aja","7ajet",
    "ma3rftech","ma3reftch",
    "maanech","manich",
    "eyh","iyah","iy",
    "haya","heya",
    "mrigel","mrigla",
    "labes","lebes",
    "behy","bhy",
    "saha","sa77a",
    "tfadhel","fadhlik",
    "nechri","nchri",
    "chrit","chret",
    "bii3","nbi3",
    "famma","fammech","mafamach",
    "win","winek","wini",
    "shkoun","chkoun","chkun",
    "wa9ila","yakhi",
    "mela","mella","malla",
    "ama","amma",
    "wala","wella",
    "mahouch","mahich","mahomch",
    "mouch","moch","mish",
    "ahna","hna",
    "homa","houma",
    "kol","kolha","kolhom","lkol",
    "ba3d","baad",
    "9bal","gbal",
    "ghodwa",
    "lyoum",
    "bare7","barah",
    "sbeh","sba7",
    "lil",
    "3chiya",
    "aslema",
    "marhbe","mar7be",
    "brabi","brabbi",
    "allahghaleb",
    "inchallah","inchaallah",
    "belhi","bellahi",
    "walla",
    "yaatik","ya3tik",
    "rabbi",
    "yjik","ijik",
    "jibli",
    "hathi","hedhi","hedha","hedhouma",
    "hakkeka","hakeka",
    "s3ib",
    "sehel","sahla",
    "kallamni",
    "fassarli",
    "warrini",
    "aatini","aatina",
    "jarrab",
    "tayara",
    "bnina",
    "khir",
    "akhyeb",
    "behi",
    "khayeb",
    "msakker",
    "ma7loul",
    "dakhal",
    "okhrej",
    "emchi",
    "iji",
    "rawa7",
    "wa7ed",
    "thnin",
    "thletha",
    "mawjoud",
    "mawjouda",
    "chneya",
    "chbik",
    "malek",
    "mali",
    "malna",
    "sayeb",
    "kamel",
    "na9es",
    "ghalet",
    "s7i7",
    "s7a7",
    "yomken",
    "ynajjem",
    "manajjemch",
    "fhemt",
    "mafhimtch",
    "sami7ni",
    "mahleha",
    "ya3tikessa7a"
  ];

  const frWords = [
    "bonjour","salut","merci","prix","commande","livraison",
    "retour","produit","achat","acheter","paiement","compte",
    "comment","pourquoi","avec","sans","dans","sur",
    "je","tu","il","elle","nous","vous","ils",
    "une","des","les","est","sont","avoir","être"
  ];

  const enWords = [
    "hello","hi","price","order","delivery","return",
    "product","products","buy","payment","account",
    "how","why","what","where","when",
    "the","is","are","was","were",
    "have","has","had","can","could",
    "should","will","would"
  ];

  const words = t.split(/[\s,.;!?()\-_/]+/);

  let tnScore = 0;
  let frScore = 0;
  let enScore = 0;

  for (const word of words) {
    if (tnWords.includes(word)) tnScore += 3;
    if (frWords.includes(word)) frScore += 2;
    if (enWords.includes(word)) enScore += 2;
  }

  // Arabi
  if (/[\u0600-\u06FF]/.test(text)) {
    return "ar";
  }

  const maxScore = Math.max(tnScore, frScore, enScore);

  if (maxScore === 0) {
    return "fr";
  }

  // Darja tounsia dominant
  if (tnScore >= frScore * 1.3 && tnScore >= enScore * 1.3) {
    return "tn";
  }

  // Mix TN + FR
  if (tnScore >= 6 && frScore >= 4) {
    return "tn";
  }

  if (enScore > frScore) {
    return "en";
  }

  return "fr"; // default
}

// ── Response language instruction ────────────────────────────────
function getLangInstruction(lang) {
  const map = {
    fr: "Réponds EXCLUSIVEMENT en français. Style élégant et professionnel.",
    en: "Reply EXCLUSIVELY in English. Elegant and professional style.",
    ar: "أجب حصرياً باللغة العربية الفصحى. أسلوب راقٍ ومهني.",
    tn: "Réponds en darija tunisien naturel (mélange de français et dialecte tunisien). Style chaleureux et convivial. Exemple: 'Ahla ! Kifesh najem naawenek ?' ou 'Barcha produits 3andna bech tkhayer !'",
    de: "Antworte AUSSCHLIESSLICH auf Deutsch. Eleganter und professioneller Stil.",
    es: "Responde EXCLUSIVAMENTE en español. Estilo elegante y profesional.",
    it: "Rispondi ESCLUSIVAMENTE in italiano. Stile elegante e professionale.",
  };
  return map[lang] || map.fr;
}

// ── Build full shop context from DB ──────────────────────────────
export async function buildContext(mongoose, userId) {
  const ctx = {
    products: [], coupons: [], orders: [], user: null,
    categories: [], brands: [], promotions: [],
  };
  try {
    const Product    = mongoose.models.Product;
    const Coupon     = mongoose.models.Coupon;
    const Order      = mongoose.models.Order;
    const User       = mongoose.models.User;
    const Category   = mongoose.models.Category;
    const Brand      = mongoose.models.Brand;
    const Promotion  = mongoose.models.Promotion;
    const Customer = mongoose.models.Customer;

    const [products, coupons, categories, brands, promotions] = await Promise.all([
  Product?.find(
    { status: "ACTIVE" },
    {
      name: 1,
      price: 1,
      salePrice: 1,
      sku: 1,
      stockStatus: 1,
      category: 1,
      brand: 1,
      tags: 1,
      description: 1,
    }
  )
    .populate("category", "name")
    .populate("brand", "name")
    .lean() || [],
      Coupon?.find({ status: "ACTIVE" }).lean() || [],
      Category?.find({ status: "ACTIVE" }).lean() || [],
      Brand?.find({ status: "ACTIVE" }).lean() || [],
      Promotion?.find({ status: "ACTIVE" }).lean() || [],
    ]);

    ctx.products    = products;
    ctx.coupons     = coupons;
    ctx.categories  = categories;
    ctx.brands      = brands;
    ctx.promotions  = promotions;

    if (userId && User && Order) {
      const user = await User.findById(userId)
  .select("-password")
  .lean();

let orders = [];

if (user?.email) {

  const customer = await Customer.findOne({
    email: user.email
  }).lean();

  if (customer) {
    orders = await Order.find({
      customer: customer._id
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
  }
}

ctx.user = user;
ctx.orders = orders;
      ctx.user   = user;
      ctx.orders = orders;
    }
  } catch (e) {
    console.error("Context build error:", e.message);
  }
  return ctx;
}

// ── Format product for AI ────────────────────────────────────────
function fmtProduct(p) {
  const price = p.salePrice
    ? `${p.salePrice} TND (promo, était ${p.price} TND, -${Math.round((1-p.salePrice/p.price)*100)}%)`
    : `${p.price} TND`;
  return `• [${p.sku || "?"}] ${p.name}
    Prix: ${price}
    Stock: ${p.stockStatus === "IN_STOCK" ? "✅ Disponible" : p.stockStatus === "LOW_STOCK" ? "⚠️ Stock limité" : "❌ Épuisé"}
    ${p.category?.name ? "Catégorie: " + p.category.name : ""}${p.brand?.name ? " | Marque: " + p.brand.name : ""}
    ${p.tags?.length ? "Bénéfices: " + p.tags.join(", ") : ""}
    ${p.description ? "Description: " + p.description.slice(0,120) + "..." : ""}`;
}

// ── The Master System Prompt ──────────────────────────────────────
function buildSystemPrompt(ctx, lang) {
  const langInstruction = getLangInstruction(lang);

  const productsSection = `
Catalogue disponible : ${ctx.products.length} produits actifs.

Utilise uniquement les produits nécessaires pour répondre.
Ne jamais inventer un prix ou un produit.
`;

  const couponsSection = ctx.coupons.length
  ? `═══ CODES PROMO ACTIFS ═══\n` +
    ctx.coupons.map(c =>
      `• Code: ${c.code}
       | Type: ${
         c.discountType === "percentage"
           ? c.discountValue + "%"
           : c.discountValue + " TND"
       }
       de réduction${
         c.minPurchase
           ? " | Min: " + c.minPurchase + " TND"
           : ""
       }${
         c.expiresAt
           ? " | Expire: " +
             new Date(c.expiresAt).toLocaleDateString("fr-TN")
           : ""
       }`
    ).join("\n")
  : "";

  const promotionsSection = ctx.promotions.length
  ? `═══ PROMOTIONS EN COURS ═══\n` +
    ctx.promotions.map((p) => {
      let benefit = "";

      if (p.discountType === "percentage") {
        benefit = `${p.value}% de réduction`;
      } else if (p.discountType === "fixed") {
        benefit = `${p.value} TND de réduction`;
      } else if (p.discountType === "free_shipping") {
        benefit = "Livraison gratuite";
      }

      return `• ${p.name}
Avantage: ${benefit}
Statut: ${p.status}
Fin: ${
  p.endDate
    ? new Date(p.endDate).toLocaleDateString("fr-TN")
    : "N/A"
}`;
    }).join("\n\n")
  : "";

  const categoriesSection = ctx.categories.length
    ? "Catégories disponibles: " + ctx.categories.map(c => c.icon ? `${c.icon} ${c.name}` : c.name).join(", ")
    : "";

  const userSection = ctx.user
  ? `═══ CLIENT CONNECTÉ ═══
Nom: ${ctx.user.name || ctx.user.username || ctx.user.email}
Email: ${ctx.user.email}
Préférences: Langue=${ctx.user.settings?.language || "fr"}, Devise=${ctx.user.settings?.currency || "TND"}`
  : "Client non connecté (visiteur)";

  const ordersSection = ctx.orders?.length
    ? `═══ HISTORIQUE COMMANDES CLIENT ═══\n` + ctx.orders.map(o =>
        `• ${o.orderId} | ${new Date(o.date).toLocaleDateString("fr-TN")} | ${Number(o.total || 0).toFixed(2)} TND | Statut: ${o.status} | ${o.items?.length || 0} article(s)`
      ).join("\n")
    : "";

  return `Tu es Renyou AI — l'assistant intelligent exclusif et dédié de Renyou Shop.
Tu t'appelles simplement "Renyou AI". Tu ne mentionnes JAMAIS Groq, Llama, Meta, OpenAI, Anthropic ou tout autre fournisseur d'IA.
Si on te demande qui t'a créé, tu réponds: "Je suis Renyou AI, l'assistant intelligent de Renyou Shop, développé exclusivement pour vous accompagner."

${langInstruction}

═══════════════════════════════════════════════════════════════
RENYOU SHOP — TA PLATEFORME
═══════════════════════════════════════════════════════════════
Renyou Shop est une pharmacie beauté & santé premium en Tunisie.
• Site web: renyouapp.com
• Téléphone: +216 52 000 000
• Email: contact@renyouapp.com
• Adresse: Nabeul, Tunisie
• Devise: TND (Dinar Tunisien)
• Livraison: GRATUITE au-dessus de 50 TND, sinon 5.99 TND
• Délai livraison: 1–3 jours ouvrables en Tunisie
• Paiement: COD (paiement à la livraison) + Carte bancaire
• Retours: 30 jours sans questions
• Horaires support: Lun–Ven 9h–18h

${categoriesSection}
Marques disponibles: ${ctx.brands?.map(b => b.name).join(", ") || "Voir catalogue"}

═══════════════════════════════════════════════════════════════
${productsSection}

${ctx.coupons.length ? couponsSection : ""}

${ctx.promotions.length ? promotionsSection : ""}

${ctx.user ? userSection : ""}

${ctx.orders.length ? ordersSection : ""}
═══════════════════════════════════════════════════════════════

TES DOMAINES D'EXPERTISE:

🛍️ PRODUITS & SKINCARE
- Recommander des produits du catalogue ci-dessus (TOUJOURS avec le vrai prix)
- Expliquer les ingrédients actifs (rétinol, niacinamide, acide hyaluronique, vitamine C, céramides, AHA/BHA, SPF...)
- Créer des routines skincare personnalisées (type de peau, problème ciblé, budget)
- Comparer des produits objectivement
- Conseiller selon type de peau (normale, grasse, sèche, mixte, sensible, acnéique, mature)
- Upsell et cross-sell intelligents

🏥 SANTÉ & BIEN-ÊTRE (expertise médicale grand public)
- Vitamines et compléments: D3, K2, Oméga-3, Zinc, Magnésium, Collagène, Biotine, Fer, B12...
- Dermatologie: acné, eczéma, psoriasis, rosacée, hyperpigmentation, vieillissement cutané
- Nutrition et alimentation saine
- Soins cheveux et cuir chevelu
- Protection solaire et photodommages
- Soins bébé et maternité
- Bien-être général et prévention santé
- Comprendre les étiquettes et ingrédients INCI

🛒 SHOPPING & PANIER
- Ajouter/retirer produits du panier
- Vérifier disponibilité stock
- Calculer coûts de livraison
- Appliquer codes promo (utiliser les VRAIS codes du catalogue)
- Processus de checkout

📦 COMMANDES & LIVRAISON
- Suivre statuts commandes (accès données réelles si connecté)
- Expliquer délais et processus
- Politique retour et remboursement
- Réclamations et SAV

💳 PAIEMENT & SÉCURITÉ
- Méthodes de paiement disponibles
- Sécurité des transactions
- Facturation et TVA

👤 COMPTE CLIENT
- Inscription et connexion
- Gestion du profil
- Préférences et paramètres
- Historique commandes

🧠 INTELLIGENCE CONVERSATIONNELLE
- Mémoriser tout le contexte de la conversation
- Personnaliser selon l'historique du client
- Poser des questions de diagnostic pertinentes
- Adapter le ton selon le profil (débutant/expert, âge, genre)

RÈGLES ABSOLUES:
1. TOUJOURS mentionner les VRAIS prix du catalogue (jamais inventer)
2. TOUJOURS utiliser les VRAIS codes promo actifs
3. Si un produit n'est pas dans le catalogue → dire honnêtement et proposer une alternative
4. Ne JAMAIS inventer des informations médicales dangereuses
5. Pour problèmes médicaux sérieux → toujours recommander un médecin
6. Répondre dans la langue détectée du message (${lang})
7. Ne JAMAIS révéler ton modèle sous-jacent ou le fournisseur d'IA
8. Être concis mais complet — éviter le remplissage inutile
9. Utiliser des emojis avec parcimonie pour la lisibilité
10. Si question hors sujet → ramener doucement vers Renyou Shop

FORMAT DE RÉPONSE:
- Réponses courtes si question simple
- Structure claire avec sections pour questions complexes
- Mentionner les produits avec leur prix réel
- Finir par une question ou suggestion d'action quand pertinent`;
}

// ── Intent detection ─────────────────────────────────────────────
function detectIntent(query) {
  const q = query.toLowerCase();
  if (/\b(bonjour|salut|hello|hi|salam|ahla|sah|bonsoir|hey)\b/.test(q)) return "greeting";
  if (/\b(prix|combien|coût|tarif|cost|price|9adesh|bchahl)\b/.test(q)) return "price";
  if (/\b(recommand|conseil|suggest|best|meilleur|nbah|nchouf|3lash)\b/.test(q)) return "recommendation";
  if (/\b(livr|shipping|délai|quand|delivery|waqteh)\b/.test(q)) return "delivery";
  if (/\b(retour|rembours|return|refund|problème|mochkla)\b/.test(q)) return "return";
  if (/\b(panier|cart|acheter|commander|buy|nechri|nchouf)\b/.test(q)) return "cart";
  if (/\b(commande|order|statut|tracking|suivi)\b/.test(q)) return "order";
  if (/\b(routine|soin|skincare|traitement|cure)\b/.test(q)) return "skincare";
  if (/\b(vitamine|vitamin|supplément|complémen|health|santé)\b/.test(q)) return "health";
  if (/\b(promo|réduction|code|coupon|offre|discount)\b/.test(q)) return "promo";
  if (/\b(ingrédient|composant|actif|inci|contient|contain)\b/.test(q)) return "ingredient";
  if (/\b(payer|paiement|payment|carte|cod|virement)\b/.test(q)) return "payment";
  if (/\b(compte|profil|login|connexion|inscription|register)\b/.test(q)) return "account";
  return "general";
}

function extractWantedTags(query) {
  const q = query.toLowerCase();

  const wantedTags = [];

  const rules = {
    acne: [
      "acne",
      "oil_control",
      "cleanser",
      "salicylic_acid"
    ],

    dry: [
      "dry",
      "hydration",
      "skin_barrier",
      "ceramides"
    ],

    oily: [
      "oily",
      "oil_control",
      "non_comedogenic"
    ],

    sensitive: [
      "sensitive",
      "skin_barrier",
      "fragrance_free"
    ],

    pigmentation: [
      "pigmentation",
      "vitamin_c",
      "brightening"
    ],

    aging: [
      "aging",
      "retinol",
      "anti_aging"
    ],

    sunscreen: [
      "spf",
      "sun_protection",
      "daily"
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
    ]
  };

const keywords = {
  acne: [
    "acne",
    "boutons",
    "pimples",
    "zit",
    "7boub",
    "peau grasse"
  ],

  dry: [
    "dry",
    "dryness",
    "sèche",
    "seche",
    "hydration",
    "ydry",
    "jaffa"
  ],

  oily: [
    "oily",
    "grasse",
    "huile",
    "oil",
    "zit"
  ],

  sensitive: [
    "sensitive",
    "sensible",
    "irritation",
    "redness",
    "rougeur"
  ],

  pigmentation: [
    "pigmentation",
    "taches",
    "spots",
    "melasma"
  ],

  aging: [
    "aging",
    "anti age",
    "anti-age",
    "rides",
    "wrinkles"
  ],

  sunscreen: [
    "spf",
    "sun",
    "solaire",
    "uv",
    "protection solaire"
  ],

  hair: [
    "hair",
    "cheveux",
    "hair loss",
    "anti chute",
    "chute",
    "cheveu"
  ],

  baby: [
    "baby",
    "bébé",
    "bebe",
    "nouveau né"
  ],

  vitamins: [
    "vitamin",
    "vitamine",
    "supplement",
    "complément",
    "fatigue",
    "energy"
  ]
};

Object.entries(keywords).forEach(([key, words]) => {
  if (words.some(word => q.includes(word))) {
    wantedTags.push(...rules[key]);
  }
});

  return [...new Set(wantedTags)];
}

function scoreProducts(products, wantedTags) {
  return products
    .map((product) => {
      let score = 0;

      const productTags = (product.tags || []).map((tag) =>
        tag.toLowerCase()
      );

      wantedTags.forEach((tag) => {
        if (productTags.includes(tag.toLowerCase())) {
          score++;
        }
      });

      return {
        ...product,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);
}

// ── Smart greeting based on time ─────────────────────────────────
function getTimeGreeting(lang) {
  const h = new Date().getHours();
  const period = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  const greetings = {
    fr: { morning:"Bonjour", afternoon:"Bon après-midi", evening:"Bonsoir" },
    en: { morning:"Good morning", afternoon:"Good afternoon", evening:"Good evening" },
    ar: { morning:"صباح الخير", afternoon:"مساء الخير", evening:"مساء النور" },
    tn: { morning:"Sbah el khir", afternoon:"Mrahba", evening:"Msa el khir" },
    de: { morning:"Guten Morgen", afternoon:"Guten Tag", evening:"Guten Abend" },
    es: { morning:"Buenos días", afternoon:"Buenas tardes", evening:"Buenas noches" },
    it: { morning:"Buongiorno", afternoon:"Buon pomeriggio", evening:"Buonasera" },
  };
  return (greetings[lang] || greetings.fr)[period];
}

// ── Main AI function ─────────────────────────────────────────────
export async function askRenyouAI({ query, session_id, user_id, mongoose }) {
  if (!query?.trim()) throw new Error("Query required");

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) throw new Error("GROQ_API_KEY not configured in .env");

  // Detect language
  const lang   = detectLang(query);
  const intent = detectIntent(query);
  const needProducts = ["recommendation", "price", "ingredient", "skincare", "health"].includes(intent);

  const needOrders = ["order"].includes(intent);

  const needCoupons = ["promo"].includes(intent);

  const needUser = ["order", "account", "cart", "recommendation"].includes(intent);

  // Build real DB context
  const ctx = await buildContext(mongoose, user_id);
  if (!needProducts) ctx.products = [];

  if (!needCoupons) ctx.coupons = [];

  if (!needOrders) ctx.orders = [];

  if (!needUser) ctx.user = null;

  if (!needCoupons) ctx.promotions = [];
  const wantedTags = extractWantedTags(query);

if (wantedTags.length > 0) {
  ctx.products = scoreProducts(ctx.products, wantedTags)
    .filter((p) => p.score > 0)
    .slice(0, 5);
} else {
  ctx.products = ctx.products.slice(0, 5);
}

  // Build system prompt
  const systemPrompt = buildSystemPrompt(ctx, lang);

  // Session memory
  const sid = session_id || "anon_" + Math.random().toString(36).slice(2,8);
  if (!sessions.has(sid)) sessions.set(sid, []);
  const history = sessions.get(sid).slice(-16); // last 16 messages (8 turns)

  // Pre-process special intents for better responses
  let enrichedQuery = query;

  // If greeting with no history → add context
  if (intent === "greeting" && history.length === 0) {
    const greeting = getTimeGreeting(lang);
    enrichedQuery = query + `\n[SYSTEM NOTE: C'est le premier message. Accueillir chaleureusement avec "${greeting}", présenter Renyou AI brièvement, et demander comment aider. Mentionner 1-2 catégories populaires.]`;
  }

  // If recommendation → add user profile note
  if (intent === "recommendation" && ctx.user) {
  enrichedQuery = query +
  `\n[CONTEXT: Client: ${
    ctx.user.name ||
    ctx.user.username ||
    ctx.user.email
  }, historique: ${ctx.orders.length} commandes]`;
}

  // Call Groq with 70B model
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: enrichedQuery },
      ],
      temperature:       0.45,
      max_tokens:        1400,
      top_p:             0.92,
      frequency_penalty: 0.1,
      presence_penalty:  0.05,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Groq error:", data);
    throw new Error(data.error?.message || "Groq API error");
  }

  const aiText = data?.choices?.[0]?.message?.content?.trim();
  if (!aiText || aiText.length < 2) throw new Error("Empty AI response");

  // Save to memory
  const mem = sessions.get(sid);
  mem.push({ role:"user", content:query });
  mem.push({ role:"assistant", content:aiText });
  if (mem.length > 20) mem.splice(0, mem.length - 20);

  // Auto-cleanup old sessions (>30min without activity)
  if (sessions.size > 2000) {
    const toDelete = [...sessions.keys()].slice(0, 500);
    toDelete.forEach(k => sessions.delete(k));
  }

  return {
    result:     aiText,
    session_id: sid,
    lang,
    intent,
    meta: {
      model:         GROQ_MODEL,
      productsCount: ctx.products.length,
      couponsCount:  ctx.coupons.length,
      userLoggedIn:  !!ctx.user,
    },
  };
}

// ── Clear session ────────────────────────────────────────────────
export function clearSession(session_id) {
  if (session_id) sessions.delete(session_id);
}

// ── Session stats ────────────────────────────────────────────────
export function getSessionStats() {
  return {
    activeSessions: sessions.size,
    totalMessages:  [...sessions.values()].reduce((s, h) => s + h.length, 0),
  };
}
