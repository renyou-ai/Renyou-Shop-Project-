import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function PageLoader({ loading }) {
  const { dark } = useTheme();

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
          }}
          transition={{
            duration: 0.35,
            ease: "easeInOut",
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: dark
              ? "rgba(10,15,25,.90)"
              : "rgba(255,255,255,.90)",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Premium Glow */}
            <motion.div
              style={{
                position: "absolute",
                width: 170,
                height: 170,
                borderRadius: "50%",
                filter: "blur(50px)",
                background:
                  "conic-gradient(from 0deg,#7C3AED55,#EC489955,#F4742A55,#7C3AED55)",
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
                opacity: [0.35, 0.8, 0.35],
              }}
              transition={{
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />

            {/* Logo */}
            <motion.img
              src={dark
  ? "/assets/logo/renyou-logo-dark.png"
  : "/assets/logo/renyou-logo.png"}
              alt="Renyou"
              style={{
                position: "relative",
                zIndex: 10,
                width: 150,
                height: "auto",
                objectFit: "contain",
              }}
              animate={{
                scale: [1, 1.05, 1],
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}