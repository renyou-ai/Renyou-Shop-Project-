import { motion } from "framer-motion";

export default function Petals() {

  const petals = Array.from({ length: 10 }, (_, i) => ({
    id: i, left: `${(i * 11 + 3) % 100}%`,
    delay: i * 1.2, dur: 14 + i * 1.5, size: 6 + (i % 4) * 3, opacity: 0.04 + (i % 3) * 0.02,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {petals.map((p) => (
        <motion.div key={p.id}
          initial={{ y: "110vh", rotate: 0, opacity: p.opacity }}
          animate={{ y: "-10vh", x: [0, 25, -15, 8, 0], rotate: [0, 90, 200, 360] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", left: p.left, bottom: 0, width: p.size, height: p.size, borderRadius: "62% 38% 58% 42%", background: "rgba(249,168,212,0.85)" }}
        />
      ))}
    </div>
  );
}