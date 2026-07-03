import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useMemo } from "react";

import ScoreRing from "./ScoreRing";
import RoutineStep from "./RoutineStep";

export default function DiagnosticResult({
  score,
  method,
  quizAnswers,
  analysisData,
  products,
  onReset,
  navigate,
  buildSkinSummary,
  cardAnim,
  glass,
  pinkBtn,
}) {

      const scoreLabel  = score >= 88 ? "Radiant" : score >= 75 ? "Healthy" : score >= 60 ? "Balanced" : "Nourish Me";
      const scoreAccent = score >= 88 ? "#f9a8d4" : score >= 75 ? "#fcd34d" : "#fca5a5";
    
      const skinSummary = quizAnswers ? buildSkinSummary(quizAnswers) : null;
    
    const morningProducts = useMemo(() => {
      return products.filter((p) => {
        const period = p.routine?.period?.trim()?.toLowerCase();
        return period === "morning";
      });
    }, [products]);
    
    const eveningProducts = useMemo(() => {
      return products.filter((p) => {
        const period = p.routine?.period?.trim()?.toLowerCase();
        return period === "evening";
      });
    }, [products]);

      return (
        <AnimatePresence mode="wait">
          <motion.div key="result" {...cardAnim} style={{ ...glass, maxWidth: 520, width: "100%" }}>
            {/* Method badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <span style={{ background: "rgba(249,168,212,0.08)", border: "1px solid rgba(249,168,212,0.18)", color: "rgba(249,168,212,0.6)", borderRadius: 100, padding: "3px 14px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {method === "quiz" ? "✦ Quiz Analysis" : "◉ Photo Analysis"}
              </span>
            </div>
    
            <ScoreRing score={score}/>
    
            {analysisData?.summary && (
      <div
        style={{
          marginBottom: "1.3rem",
          padding: "12px",
          borderRadius: "14px",
          background: "rgba(249,168,212,0.05)",
          border: "1px solid rgba(249,168,212,0.1)",
          color: "rgba(255,255,255,0.75)",
          fontSize: "13px",
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        {analysisData.summary}
      </div>
    )}
    
            {/* Score label */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                style={{ display: "inline-block", background: `${scoreAccent}18`, border: `1px solid ${scoreAccent}44`, color: scoreAccent, borderRadius: 100, padding: "4px 18px", fontSize: 12.5, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                {scoreLabel}
              </motion.span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "rgba(249,168,212,0.5)", fontSize: 14.5, margin: 0 }}>
                Your skin is beautifully unique
              </p>
            </div>
    
            {/* Skin metrics */}
            {skinSummary ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 9, marginBottom: "1.5rem" }}>
                {[
                  { label: "Skin Type",   val: skinSummary.skinType       },
                  { label: "Main Focus",  val: skinSummary.mainConcern     },
                  { label: "Reactivity",  val: skinSummary.skinReaction    },
                  { label: "Sun Habit",   val: skinSummary.sunHabit        },
                ].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                    style={{ background: "rgba(249,168,212,0.05)", borderRadius: 12, border: "1px solid rgba(249,168,212,0.1)", padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f9a8d4", fontSize: 14.5, fontWeight: 600, marginBottom: 3 }}>{m.val}</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em" }}>{m.label}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, marginBottom: "1.5rem" }}>
                {[
      {
        label: "Hydration",
        val: `${analysisData?.hydration || 0}%`,
      },
      {
        label: "Texture",
        val: analysisData?.texture || "Unknown",
      },
      {
        label: "Radiance",
        val: analysisData?.radiance || "Unknown",
      },
    ].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.12 }}
                    style={{ background: "rgba(249,168,212,0.05)", borderRadius: 12, border: "1px solid rgba(249,168,212,0.1)", padding: "12px 8px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "#f9a8d4", fontSize: 16, fontWeight: 600, marginBottom: 3 }}>{m.val}</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em" }}>{m.label}</div>
                  </motion.div>
                ))}
              </div>
            )}
    
            {/* Recommendations header */}
            <div style={{ marginBottom: "1rem" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: 19, fontWeight: 600, margin: "0 0 3px" }}>
                Your Skin Ritual
              </h3>
              <p style={{ color: "rgba(249,168,212,0.4)", fontSize: 12.5, margin: 0 }}>
                Curated for score <span style={{ color: "#f9a8d4", fontWeight: 500 }}>{score}</span> — {scoreLabel}
              </p>
            </div>
    
            {/* Product recommendations */}
    {/* Morning Routine */}
    {morningProducts.length > 0 && (
      <div style={{ marginBottom: "1.8rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Sun size={22} color="#f9a8d4" strokeWidth={2} />
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#fff",
          fontSize: 22,
          fontWeight: 600,
          margin: 0,
        }}
      >
        Morning Routine
      </h3>
    </div>
    
          <p
            style={{
              color: "rgba(249,168,212,0.4)",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            Start your day with these essentials
          </p>
        </div>
    
    {morningProducts.map((p, i) => (
      <RoutineStep
        key={p._id || i}
        index={i + 1}
        total={morningProducts.length}
        title={p.routine?.label || "Step"}
        product={p}
        color="#ec4899"
        onClick={() =>
          p._id
            ? navigate(`/user/products/${p._id}`)
            : navigate("/user/products")
        }
      />
    ))}
      </div>
    )}
    
    {/* Evening Routine */}
    {eveningProducts.length > 0 && (
      <div style={{ marginBottom: "1.8rem" }}>
        <div
          style={{
            height: 1,
            background: "rgba(249,168,212,0.08)",
            margin: "1.5rem 0",
          }}
        />
    
        <div style={{ marginBottom: "1rem" }}>
          <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Moon size={22} color="#c4b5fd" strokeWidth={2} />
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#fff",
          fontSize: 22,
          fontWeight: 600,
          margin: 0,
        }}
      >
        Evening Routine
      </h3>
    </div>
    
          <p
            style={{
              color: "rgba(249,168,212,0.4)",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            Restore & nourish your skin overnight
          </p>
        </div>
    
    {eveningProducts.map((p, i) => (
      <RoutineStep
        key={p._id || i}
        index={morningProducts.length + i + 1}
        total={morningProducts.length + eveningProducts.length}
        title={p.routine?.label || "Step"}
        product={p}
        color="#a855f7"
        onClick={() =>
          p._id
            ? navigate(`/user/products/${p._id}`)
            : navigate("/user/products")
        }
      />
    ))}
      </div>
    )}
    
            {/* CTA */}
            <motion.button whileHover={{ scale: 1.02, boxShadow: "0 10px 36px rgba(236,72,153,0.45)" }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/user/products")}
              style={{ ...pinkBtn, marginTop: 6 }}>
               Shop Recommended Products
            </motion.button>
    
            <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }} onClick={onReset}
              style={{ ...pinkBtn, marginTop: 8, background: "rgba(249,168,212,0.07)", border: "1px solid rgba(249,168,212,0.18)", boxShadow: "none", color: "#fbcfe8" }}>
              ↺ Start New Analysis
            </motion.button>
          </motion.div>
        </AnimatePresence>
      );
    }