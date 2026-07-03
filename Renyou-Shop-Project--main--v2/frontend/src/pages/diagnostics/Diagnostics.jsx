// PATH: frontend/src/pages/diagnostics/Diagnostics.jsx
// Système complet de diagnostics — 2 méthodes: Photo/Camera OU Quiz

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RoutineStep from "./components/RoutineStep";
import ScoreRing from "./components/ScoreRing";
import DiagnosticResult from "./components/DiagnosticResult";
import Petals from "./components/Petals";
import * as THREE from "three";
import { useToast } from "../../context/ToastContext.jsx";
import { Sun, Moon } from "lucide-react";

/* ── Google Fonts ── */
if (!document.getElementById("diag-fonts")) {
  const s = document.createElement("style");
  s.id = "diag-fonts";
  s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;
  document.head.appendChild(s);
}

// ─── QUIZ QUESTIONS ────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: "skin_type",
    question: "How does your skin feel a few hours after cleansing ?",
    subtitle: "Without applying any product",
    options: [
      { value: "normal",    label: "Comfortable & balanced",      desc: "Neither oily nor dry" },
      { value: "oily",      label: "Shiny with visible pores",    desc: "Especially T-zone" },
      { value: "dry",       label: "Tight, sometimes flaky",      desc: "Feels rough to touch" },
      { value: "combo",     label: "Oily T-zone, dry cheeks",     desc: "Mixed sensation" },
      { value: "sensitive", label: "Reactive, prone to redness",  desc: "Stings or burns easily" },
    ],
  },
  {
    id: "main_concern",
    question: "What is your primary skin concern ?",
    subtitle: "Choose what bothers you the most",
    options: [
      { value: "acne",         label: "Acne & breakouts",           desc: "Pimples, blackheads, whiteheads" },
      { value: "aging",        label: "Fine lines & aging",         desc: "Wrinkles, loss of firmness" },
      { value: "pigmentation", label: "Dark spots & uneven tone",   desc: "Hyperpigmentation, melasma" },
      { value: "hydration",    label: "Dryness & dehydration",      desc: "Thirsty, tight skin" },
      { value: "pores",        label: "Enlarged pores",             desc: "Visible, large pores" },
      { value: "redness",      label: "Redness & sensitivity",      desc: "Rosacea, irritation" },
    ],
  },
  {
    id: "secondary_concern",
    question: "Any secondary skin concern ?",
    subtitle: "You can skip this if only one concern",
    icon: "✦",
    multiple: true,
    options: [
      { value: "dullness",     label: "Dullness",            desc: "Lack of radiance" },
      { value: "dark_circles", label: "Dark circles",        desc: "Around eyes" },
      { value: "texture",      label: "Rough texture",       desc: "Bumpy or uneven" },
      { value: "redness",      label: "Redness",             desc: "Persistent redness" },
      { value: "none",         label: "No other concern",    desc: "One issue only" },
    ],
  },
  {
    id: "sun_exposure",
    question: "How much sun exposure do you get daily ?",
    subtitle: "Average on a typical weekday",
    options: [
      { value: "low",      label: "Minimal (indoors)",     desc: "Less than 15 min" },
      { value: "moderate", label: "Moderate",              desc: "30–60 minutes" },
      { value: "high",     label: "A lot (outdoor job)",   desc: "Several hours" },
    ],
  },
  {
    id: "skin_reactions",
    question: "How does your skin react to new products ?",
    subtitle: "First-time use experience",
    options: [
      { value: "never",      label: "Rarely or never reacts",     desc: "Very tolerant skin" },
      { value: "sometimes",  label: "Sometimes mild irritation",  desc: "Slight redness or tingling" },
      { value: "often",      label: "Often reacts",               desc: "Breakouts or burning" },
    ],
  },
  {
    id: "current_routine",
    question: "What is your current skincare routine ?",
    subtitle: "Be honest — no judgment!",
    options: [
      { value: "none",      label: "I don't have one",                desc: "Soap and water only" },
      { value: "basic",     label: "Basic (cleanser + moisturizer)",  desc: "Just the essentials" },
      { value: "moderate",  label: "Moderate (3–5 steps)",            desc: "Serum, SPF included" },
      { value: "advanced",  label: "Advanced (5+ steps)",             desc: "Layering multiple actives" },
    ],
  },
  {
    id: "age_range",
    question: "What is your age range ?",
    subtitle: "Helps tailor ingredient recommendations",
    options: [
      { value: "teen",     label: "Under 20",   desc: "Teen skin" },
      { value: "20s",      label: "20–29",      desc: "Young adult" },
      { value: "30s",      label: "30–39",      desc: "Early aging concern" },
      { value: "40s",      label: "40–49",      desc: "Anti-aging priority" },
      { value: "50plus",   label: "50+",        desc: "Mature skin" },
    ],
  },
  {
    id: "lifestyle",
    question: "Describe your lifestyle",
    subtitle: "Lifestyle factors affect skin health",
    multiple: true,
    options: [
      { value: "stressed",    label: "High stress",            desc: "Work / life pressure" },
      { value: "poor_sleep",  label: "Poor sleep (<6h)",       desc: "Not enough rest" },
      { value: "smoker",      label: "Smoker",                 desc: "Affects skin aging" },
      { value: "active",      label: "Active / sports",        desc: "Sweating daily" },
      { value: "healthy_diet","label": "Balanced diet",        desc: "Fruits & vegetables" },
      { value: "hydrated",    label: "Well hydrated",          desc: "2L+ water per day" },
    ],
  },
];

// ─── Score calculation from quiz ──────────────────────────────────
function calcQuizScore(answers) {
  let score = 72; // base score
  const skinType = answers.skin_type;
  const concern  = answers.main_concern;

  // Skin type modifier
  if (skinType === "normal")    score += 12;
  if (skinType === "combo")     score += 5;
  if (skinType === "oily")      score += 2;
  if (skinType === "dry")       score -= 3;
  if (skinType === "sensitive") score -= 5;

  // Concern modifier
  if (concern === "hydration")  score += 6;
  if (concern === "pores")      score += 3;
  if (concern === "acne")       score -= 8;
  if (concern === "pigmentation")score -= 5;
  if (concern === "aging")      score -= 4;
  if (concern === "redness")    score -= 6;

  // Lifestyle
  const life = answers.lifestyle || [];
  if (life.includes("healthy_diet")) score += 5;
  if (life.includes("hydrated"))     score += 5;
  if (life.includes("active"))       score += 3;
  if (life.includes("poor_sleep"))   score -= 6;
  if (life.includes("stressed"))     score -= 5;
  if (life.includes("smoker"))       score -= 8;

  // Reaction sensitivity
  if (answers.skin_reactions === "never")     score += 4;
  if (answers.skin_reactions === "often")     score -= 6;

  // Sun
  if (answers.sun_exposure === "high") score -= 5;
  if (answers.sun_exposure === "low")  score += 2;

  // Age
  if (answers.age_range === "teen")   score -= 3;
  if (answers.age_range === "50plus") score -= 4;
  if (answers.age_range === "20s")    score += 4;

  return Math.max(28, Math.min(99, Math.round(score)));
}

// Build skincare recommendations based on answers
async function buildRecommendations(answers) {
  try {
    const data = await fetchRecommendations(answers);

    if (data.success) {
  return data.recommendedProducts || [];
}

    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}
// Build skin analysis summary from answers
function buildSkinSummary(answers) {
  const labels = {
    skin_type:  { normal:"Normal", oily:"Oily", dry:"Dry", combo:"Combination", sensitive:"Sensitive" },
    main_concern:{ acne:"Acne-prone", aging:"Aging", pigmentation:"Uneven tone", hydration:"Dehydrated", pores:"Large pores", redness:"Sensitive/Redness" },
    age_range:  { teen:"Teen", "20s":"20s", "30s":"30s", "40s":"40s", "50plus":"50+" },
  };
  return {
    skinType:    labels.skin_type[answers.skin_type]    || "Unknown",
    mainConcern: labels.main_concern[answers.main_concern] || "General care",
    ageRange:    labels.age_range[answers.age_range]    || "Adult",
    skinReaction:answers.skin_reactions === "never" ? "Tolerant" : answers.skin_reactions === "often" ? "Reactive" : "Moderate",
    sunHabit:    answers.sun_exposure === "high" ? "High sun" : answers.sun_exposure === "low" ? "Low exposure" : "Moderate sun",
  };
}

async function fetchRecommendations(answers) {
  const res = await fetch("/api/ai/diagnostic-recommendations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  if (!res.ok) {
    throw new Error("Failed to load recommendations");
  }

  return await res.json();
}

// ─── Shared UI ─────────────────────────────────────────────────────
const glass = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(28px)",
  WebkitBackdropFilter: "blur(28px)",
  border: "1px solid rgba(249,168,212,0.13)",
  borderRadius: 26,
  padding: "2rem",
  boxShadow: "0 30px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
};
const pinkBtn = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  width: "100%", padding: "13px 24px", borderRadius: 14, border: "none",
  background: "linear-gradient(135deg,#be185d,#ec4899)",
  color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
  fontSize: 14.5, cursor: "pointer", letterSpacing: "0.04em",
  boxShadow: "0 8px 28px rgba(236,72,153,0.38)",
};
const cardAnim = {
  initial: { opacity: 0, y: 28, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.97 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

// ─── ANALYZE LABELS ───────────────────────────────────────────────
const ANALYZE_LABELS = [
  "Reading skin texture…", "Mapping hydration zones…",
  "Detecting luminosity…", "Evaluating tone evenness…",
];

// ═══════════════════════════════════════════════════════════════════
// QUIZ COMPONENT
// ═══════════════════════════════════════════════════════════════════
function QuizFlow({ onComplete, onBack }) {
  const [qIdx,    setQIdx]    = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected,setSelected]= useState(null); // current selection(s)
  const [direction,setDir]    = useState(1);

  const q = QUIZ_QUESTIONS[qIdx];
  const isLast = qIdx === QUIZ_QUESTIONS.length - 1;
  const progress = ((qIdx) / QUIZ_QUESTIONS.length) * 100;

  const handleSelect = (val) => {
    if (q.multiple) {
      const prev = answers[q.id] || [];
      if (val === "none") {
        setAnswers(p => ({ ...p, [q.id]: ["none"] }));
        setSelected(["none"]);
      } else {
        const filtered = prev.filter(v => v !== "none");
        const next = filtered.includes(val) ? filtered.filter(v => v !== val) : [...filtered, val];
        setAnswers(p => ({ ...p, [q.id]: next }));
        setSelected(next);
      }
    } else {
      setAnswers(p => ({ ...p, [q.id]: val }));
      setSelected(val);
      // Auto-advance after short delay for single select
      setTimeout(() => next(val), 320);
    }
  };

  const next = (forcedVal) => {
    const val = forcedVal || selected || answers[q.id];
    if (!val || (Array.isArray(val) && val.length === 0)) return;
    if (isLast) {
      const finalAnswers = { ...answers, [q.id]: val };
      onComplete(finalAnswers);
    } else {
      setDir(1);
      setQIdx(p => p + 1);
      setSelected(answers[QUIZ_QUESTIONS[qIdx + 1]?.id] || null);
    }
  };

  const prev = () => {
    if (qIdx === 0) { onBack(); return; }
    setDir(-1);
    setQIdx(p => p - 1);
    setSelected(answers[QUIZ_QUESTIONS[qIdx - 1]?.id] || null);
  };

  const currentAnswers = answers[q.id];
  const hasAnswer = currentAnswers && (Array.isArray(currentAnswers) ? currentAnswers.length > 0 : true);

  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      {/* Progress bar */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "rgba(249,168,212,0.5)", letterSpacing: "0.1em" }}>
            QUESTION {qIdx + 1} / {QUIZ_QUESTIONS.length}
          </span>
          <button onClick={prev} style={{ background: "none", border: "none", color: "rgba(249,168,212,0.45)", fontSize: 13, cursor: "pointer", padding: "2px 8px", borderRadius: 8 }}>
            ← Back
          </button>
        </div>
        <div style={{ background: "rgba(249,168,212,0.08)", borderRadius: 100, height: 4, overflow: "hidden" }}>
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
    height: "100%",
    borderRadius: 100,
    background:
      "linear-gradient(90deg,#be185d,#f9a8d4,#ec4899)"
  }}
  animate={{ width: `${progress}%` }}
  transition={{
    ease: "easeOut",
    duration: 0.35
  }}
/>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={qIdx}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={glass}>

          {/* Question header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div style={{ fontSize: 38, marginBottom: 12 }}>{q.icon}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: "clamp(1.3rem,4vw,1.7rem)", fontWeight: 600, margin: "0 0 8px", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
              {q.question}
            </h2>
            <p style={{ color: "rgba(249,168,212,0.4)", fontSize: 13, margin: 0 }}>{q.subtitle}</p>
            {q.multiple && (
              <p style={{ color: "rgba(249,168,212,0.3)", fontSize: 11.5, marginTop: 4, letterSpacing: "0.05em" }}>
                ✦ Select all that apply
              </p>
            )}
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt) => {
              const isActive = q.multiple
                ? (answers[q.id] || []).includes(opt.value)
                : answers[q.id] === opt.value;
              return (
                <motion.button key={opt.value}
                  whileHover={{ x: 4, borderColor: "rgba(249,168,212,0.45)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "13px 16px", borderRadius: 16, border: "none", cursor: "pointer",
                    textAlign: "left", width: "100%",
                    background: isActive ? "rgba(236,72,153,0.18)" : "rgba(249,168,212,0.04)",
                    outline: isActive ? "1.5px solid rgba(249,168,212,0.55)" : "1.5px solid rgba(249,168,212,0.1)",
                    transition: "all 0.2s",
                    boxShadow: isActive ? "0 0 20px rgba(236,72,153,0.15)" : "none",
                  }}>
                  <div
  style={{
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: isActive ? "#ec4899" : "rgba(249,168,212,0.25)",
    flexShrink: 0,
  }}
/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Sans'", color: isActive ? "#fbcfe8" : "rgba(255,255,255,0.85)", fontWeight: 500, fontSize: 14, marginBottom: 2 }}>
                      {opt.label}
                    </div>
                    <div style={{ color: "rgba(249,168,212,0.38)", fontSize: 12 }}>{opt.desc}</div>
                  </div>
                  {isActive && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#be185d,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: "#fff" }}>
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Continue button for multiple select or when no auto-advance */}
          {q.multiple && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => next()}
              disabled={!hasAnswer}
              style={{ ...pinkBtn, marginTop: "1.25rem", opacity: hasAnswer ? 1 : 0.5 }}>
              {isLast ? "✦ Reveal My Skin Profile" : "Continue →"}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN DIAGNOSTICS COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function Diagnostics() {
  const navigate = useNavigate();
  const toast = useToast();

  // "landing" | "method" | "photo" | "quiz" | "analyzing" | "result"
  const [view,       setView]       = useState("landing");
  const [stepIndex,  setStepIndex]  = useState(0); // for photo flow: 0=capture, 1=analyzing, 2=result, 3=ritual
  const [progress,   setProgress]   = useState(0);
  const [image,      setImage]      = useState(null);
  const [score,      setScore]      = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [cameraOn,   setCameraOn]   = useState(false);
  const [dragOver,   setDragOver]   = useState(false);
  const [labelIdx,   setLabelIdx]   = useState(0);
  const [mediaStream,setMediaStream]= useState(null);
  const [quizAnswers,setQuizAnswers]= useState(null);
  const [resultMethod,setResultMethod] = useState("photo");

  const [products, setProducts] = useState([]);

  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const fileRef    = useRef(null);

  // Camera management
  useEffect(() => {
    if (!cameraOn) return;
    let active = true, stream = null;
    const attach = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 } } });
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        setMediaStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { console.warn("Camera:", err.message); setCameraOn(false); }
    };
    const raf = requestAnimationFrame(attach);
    return () => { active = false; cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [cameraOn]);

  const stopCamera = () => {
    if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
    setMediaStream(null); setCameraOn(false);
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const cv = document.createElement("canvas");
    cv.width = video.videoWidth; cv.height = video.videoHeight;
    cv.getContext("2d").drawImage(video, 0, 0);
    const img = cv.toDataURL("image/png");
    setImage(img); stopCamera(); beginPhotoAnalysis(img);
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => { setImage(reader.result); beginPhotoAnalysis(reader.result); };
    reader.readAsDataURL(file);
  };

  // Photo analysis → real API
  const beginPhotoAnalysis = async (img) => {
    setView("photo");
setStepIndex(1);
setProgress(0);

let currentProgress = 0;

const progressInterval = setInterval(() => {
  setProgress(prev => {
    if (prev >= 99) return prev;

    if (prev < 90) {
      return prev + 0.5;
    }

    return prev + 0.5;
  });
}, 60);
    try {
      const res  = await fetch("/api/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: img }),
      });
      setProgress(prev => Math.max(prev, 60));
      const data = await res.json();

      clearInterval(progressInterval);

// animation finale smooth 95 -> 100
for (let p = 96; p <= 100; p++) {
  setProgress(p);
  await new Promise(r => setTimeout(r, 40));
}
if (!data.success) {
  throw new Error(data.error || "Analysis failed");
}

const analysis = data.result || {};

setAnalysisData(analysis);

setProducts(data.recommendedProducts || []);

setProgress(prev => Math.max(prev, 90));

setScore(analysis.overall_skin_score || 0);

localStorage.setItem(
  "lastSkinAnalysis",
  JSON.stringify(analysis)
);
      // Save to localStorage
      try {
        const old = JSON.parse(localStorage.getItem("diagnostics") || "[]");
        old.push({
  date: new Date().toLocaleString(),
  score: analysis.overall_skin_score || 0,
  image: img,
  details: data.result,
  method: "photo"
});
        localStorage.setItem("diagnostics", JSON.stringify(old));
      } catch (_) {}
      setProgress(100);
      setTimeout(() => { setStepIndex(2); setResultMethod("photo"); }, 700);
    } catch (err) {
      console.error(err);
      clearInterval(progressInterval);
      toast.error("Analysis failed", "Skin analysis failed — " + err.message);
      reset();
    }
  };

  // Quiz complete → compute score
  const handleQuizComplete = async (answers) => {
  try {
    setQuizAnswers(answers);

    const res = await fetch(
      "/api/diagnostics/quiz-analysis",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error(
        data.message || "Quiz analysis failed"
      );
    }

    const analysis = data.result || {};

    setAnalysisData(analysis);
    setProducts(data.recommendedProducts || []);

    const aiScore =
      analysis.overall_skin_score || 0;

    setScore(aiScore);
    setResultMethod("quiz");

    try {
      const old = JSON.parse(
        localStorage.getItem("diagnostics") || "[]"
      );

      old.push({
        date: new Date().toLocaleString(),
        score: aiScore,
        method: "quiz",
        answers,
        details: analysis,
      });

      localStorage.setItem(
        "diagnostics",
        JSON.stringify(old)
      );
    } catch (_) {}

    setView("result");
  } catch (err) {
    console.error(err);
    toast.error("Analysis failed", "Quiz analysis failed — " + err.message);
  }
};

  // THREE.JS for photo analyzing step
  useEffect(() => {
    if (view !== "photo" || stepIndex !== 1 || !canvasRef.current) return;
    let renderer, animId;
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    cam.position.z = 2.8;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(160, 160); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.innerHTML = "";
    canvasRef.current.appendChild(renderer.domElement);
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 2),
      new THREE.MeshStandardMaterial({ color: "#f9a8d4", wireframe: true, emissive: "#ec4899", emissiveIntensity: 0.3 })
    );
    scene.add(mesh);
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 32),
      new THREE.MeshStandardMaterial({ color: "#fce7f3", emissive: "#f9a8d4", emissiveIntensity: 0.8, transparent: true, opacity: 0.35 })
    );
    scene.add(core);
    const pts = Array.from({ length: 120 }, () => {
      const t = Math.random() * Math.PI * 2, p2 = Math.acos(2 * Math.random() - 1), r = 1.6 + Math.random() * 0.5;
      return new THREE.Vector3(r * Math.sin(p2) * Math.cos(t), r * Math.sin(p2) * Math.sin(t), r * Math.cos(p2));
    });
    scene.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts), new THREE.PointsMaterial({ color: "#fbcfe8", size: 0.04 })));
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pl = new THREE.PointLight(0xf9a8d4, 4); pl.position.set(3, 3, 3); scene.add(pl);
    const animate = () => { animId = requestAnimationFrame(animate); mesh.rotation.y += 0.007; mesh.rotation.x += 0.003; renderer.render(scene, cam); };
    animate();
    return () => { cancelAnimationFrame(animId); renderer.dispose(); if (canvasRef.current) canvasRef.current.innerHTML = ""; };
  }, [view, stepIndex]);

  useEffect(() => {
    if (view !== "photo" || stepIndex !== 1) return;
    const iv = setInterval(() => setLabelIdx(i => (i + 1) % ANALYZE_LABELS.length), 1600);
    return () => clearInterval(iv);
  }, [view, stepIndex]);

  const reset = () => { setView("landing"); setStepIndex(0); setProgress(0); setImage(null); setQuizAnswers(null); setAnalysisData(null); stopCamera(); };

  const bg = { fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "linear-gradient(160deg, #1a0a14 0%, #2d0f20 40%, #180a22 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", position: "relative", overflow: "hidden" };

  return (
    <div style={bg}>
      {/* Ambient blobs */}
      <div style={{ position: "fixed", top: "-15%", left: "-5%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 70%)", pointerEvents: "none" }}/>
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)", pointerEvents: "none" }}/>
      <div style={{ position: "fixed", top: "40%", right: "5%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,168,212,0.08) 0%, transparent 70%)", pointerEvents: "none" }}/>
      <Petals/>

      <div style={{ width: "100%", maxWidth: 560, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Brand header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "2rem", width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,168,212,0.1)", border: "1px solid rgba(249,168,212,0.2)", borderRadius: 100, padding: "5px 16px", marginBottom: "0.9rem" }}>
            <span style={{ fontSize: 8, color: "#f9a8d4" }}>✦✦✦</span>
            <span style={{ fontSize: 11, color: "#fbcfe8", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>AI Skin Ritual</span>
            <span style={{ fontSize: 8, color: "#f9a8d4" }}>✦✦✦</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 6vw, 2.8rem)", fontWeight: 600, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Discover Your Glow
          </h1>
          <p style={{ color: "rgba(249,168,212,0.45)", fontSize: 13, margin: 0, fontWeight: 300 }}>
            Advanced skin intelligence, beautifully personal
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ══ LANDING — Choose method ══════════════════════════════ */}
          {view === "landing" && (
            <motion.div key="landing" {...cardAnim} style={{ ...glass, width: "100%" }}>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>
                  Choose Your Analysis Method
                </h2>
                <p style={{ color: "rgba(249,168,212,0.4)", fontSize: 13, margin: 0 }}>
                  Two ways to understand your skin — choose what feels right for you
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: "1.5rem" }}>
                {/* Photo method */}
                <motion.button whileHover={{ scale: 1.03, borderColor: "rgba(249,168,212,0.55)", boxShadow: "0 0 30px rgba(236,72,153,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setView("photo_capture")}
                  style={{ background: "rgba(249,168,212,0.04)", border: "1.5px solid rgba(249,168,212,0.18)", borderRadius: 20, padding: "1.75rem 1.25rem", textAlign: "center", cursor: "pointer", transition: "all 0.25s" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📸</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
                    Photo / Camera
                  </div>
                  <div style={{ color: "rgba(249,168,212,0.4)", fontSize: 12, lineHeight: 1.6 }}>
                    Upload a selfie or use your camera for instant AI skin analysis
                  </div>
                  <div style={{ marginTop: 14, background: "rgba(236,72,153,0.14)", color: "#f9a8d4", borderRadius: 100, padding: "4px 12px", fontSize: 11, display: "inline-block", letterSpacing: "0.08em" }}>
                    ⚡ Instant results
                  </div>
                </motion.button>

                {/* Quiz method */}
                <motion.button whileHover={{ scale: 1.03, borderColor: "rgba(167,139,250,0.55)", boxShadow: "0 0 30px rgba(167,139,250,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setView("quiz")}
                  style={{ background: "rgba(167,139,250,0.04)", border: "1.5px solid rgba(167,139,250,0.18)", borderRadius: 20, padding: "1.75rem 1.25rem", textAlign: "center", cursor: "pointer", transition: "all 0.25s" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🧬</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
                    Skin Quiz
                  </div>
                  <div style={{ color: "rgba(167,139,250,0.5)", fontSize: 12, lineHeight: 1.6 }}>
                    Answer 8 expert questions for a detailed dermatological profile
                  </div>
                  <div style={{ marginTop: 14, background: "rgba(167,139,250,0.14)", color: "#c4b5fd", borderRadius: 100, padding: "4px 12px", fontSize: 11, display: "inline-block", letterSpacing: "0.08em" }}>
                    ✦ Deep profile
                  </div>
                </motion.button>
              </div>

              {/* Info banner */}
              <div style={{ background: "rgba(249,168,212,0.04)", border: "1px solid rgba(249,168,212,0.1)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
                <p style={{ color: "rgba(249,168,212,0.45)", fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>
                  Both methods generate personalized product recommendations based on your unique skin profile.
                </p>
              </div>
            </motion.div>
          )}

          {/* ══ PHOTO — Capture step ════════════════════════════════ */}
          {view === "photo_capture" && (
            <motion.div key="photo_capture" {...cardAnim} style={{ ...glass, width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
                <button onClick={() => { stopCamera(); setView("landing"); }} style={{ background: "rgba(249,168,212,0.08)", border: "1px solid rgba(249,168,212,0.15)", borderRadius: 10, padding: "5px 12px", color: "rgba(249,168,212,0.6)", cursor: "pointer", fontSize: 13 }}>← Back</button>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>Photo Analysis</h3>
              </div>

              {!cameraOn ? (
                <>
                  <motion.div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                    onClick={() => fileRef.current?.click()}
                    whileHover={{ borderColor: "rgba(249,168,212,0.5)" }}
                    style={{ border: `1.5px dashed ${dragOver ? "rgba(249,168,212,0.7)" : "rgba(249,168,212,0.22)"}`, borderRadius: 18, padding: "2.2rem 1.5rem", textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(249,168,212,0.06)" : "rgba(255,255,255,0.02)", marginBottom: "1.2rem", transition: "background 0.3s" }}>
                    <div style={{ fontSize: 34, marginBottom: 10, color: "#f9a8d4", opacity: 0.7 }}>❋</div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fbcfe8", fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>Upload your portrait</p>
                    <p style={{ color: "rgba(249,168,212,0.38)", fontSize: 12.5, margin: 0 }}>Drag & drop or click to browse</p>
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])}/>
                  </motion.div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.2rem" }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}/>
                    <span style={{ color: "rgba(249,168,212,0.35)", fontSize: 12 }}>or</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}/>
                  </div>
                  <motion.button whileHover={{ scale: 1.02, boxShadow: "0 12px 36px rgba(236,72,153,0.48)" }} whileTap={{ scale: 0.97 }}
                    onClick={() => setCameraOn(true)} style={pinkBtn}>
                    <span>◉</span> Open Camera
                  </motion.button>
                </>
              ) : (
                <div style={{ position: "relative" }}>
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", borderRadius: 16, display: "block", maxHeight: 300, objectFit: "cover", background: "#100010" }}/>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-54%)", width: 140, height: 178, border: "1.5px solid rgba(249,168,212,0.6)", borderRadius: "50%", boxShadow: "0 0 20px rgba(249,168,212,0.1) inset" }}/>
                    <motion.div animate={{ top: ["28%", "72%", "28%"] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      style={{ position: "absolute", left: "calc(50% - 70px)", width: 140, height: 1.5, background: "linear-gradient(90deg,transparent,rgba(249,168,212,0.8),transparent)" }}/>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={capture} style={{ ...pinkBtn, marginTop: "0.9rem" }}>
                    ◉ Capture & Analyze
                  </motion.button>
                  <button onClick={stopCamera} style={{ background: "none", border: "none", color: "rgba(249,168,212,0.45)", fontSize: 13, cursor: "pointer", width: "100%", marginTop: 8, padding: "4px 0" }}>Cancel</button>
                </div>
              )}
            </motion.div>
          )}

          {/* ══ PHOTO — Analyzing ══════════════════════════════════ */}
          {view === "photo" && stepIndex === 1 && (
            <motion.div key="analyzing" {...cardAnim} style={{ ...glass, textAlign: "center", width: "100%" }}>
              <div ref={canvasRef} style={{ width: 160, height: 160, margin: "0 auto 1rem", borderRadius: "50%", overflow: "hidden" }}/>
              <AnimatePresence mode="wait">
                <motion.p key={labelIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#fbcfe8", fontSize: 16, marginBottom: "1.4rem", letterSpacing: "0.03em" }}>
                  {ANALYZE_LABELS[labelIdx]}
                </motion.p>
              </AnimatePresence>
              <div style={{ background: "rgba(249,168,212,0.08)", borderRadius: 100, height: 5, overflow: "hidden", border: "1px solid rgba(249,168,212,0.12)", marginBottom: 8 }}>
                <motion.div style={{ height: "100%", borderRadius: 100, background: "linear-gradient(90deg,#be185d,#f9a8d4,#ec4899)" }}
                  animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }}/>
              </div>
              <span style={{ color: "rgba(249,168,212,0.4)", fontSize: 12 }}>{Math.round(progress)}%</span>
            </motion.div>
          )}

          {/* ══ QUIZ FLOW ══════════════════════════════════════════ */}
          {view === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: "100%" }}>
              <QuizFlow
                onComplete={handleQuizComplete}
                onBack={() => setView("landing")}
              />
            </motion.div>
          )}

          {/* ══ RESULT (photo step 2) ══════════════════════════════ */}
          {view === "photo" && stepIndex === 2 && (
            <motion.div key="photo_result" {...cardAnim} style={{ width: "100%" }}>
              <DiagnosticResult
  score={score}
  method="photo"
  quizAnswers={null}
  analysisData={analysisData}
  products={products}
  onReset={reset}
  navigate={navigate}
  buildSkinSummary={buildSkinSummary}
  cardAnim={cardAnim}
  glass={glass}
  pinkBtn={pinkBtn}
/>
            </motion.div>
          )}

          {/* ══ RESULT (quiz) ══════════════════════════════════════ */}
          {view === "result" && (
            <motion.div key="quiz_result" {...cardAnim} style={{ width: "100%" }}>
              <DiagnosticResult
  score={score}
  method="quiz"
  quizAnswers={quizAnswers}
  analysisData={analysisData}
  products={products}
  onReset={reset}
  navigate={navigate}
  buildSkinSummary={buildSkinSummary}
  cardAnim={cardAnim}
  glass={glass}
  pinkBtn={pinkBtn}
/>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
