import { motion, AnimatePresence } from "framer-motion";
import { useThemeValue } from "@shared/theme";

export default function PageLoader({ loading }) {
  const { theme } = useThemeValue();
  const dark = theme.mode === "dark";

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
          className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-md"
          style={{
            background: dark
              ? "rgba(10,15,25,.90)"
              : "rgba(255,255,255,.90)",
          }}
        >
          <div className="relative flex items-center justify-center">

            {/* Premium Glow */}
            <motion.div
              className="absolute w-40 h-40 rounded-full blur-3xl"
              style={{
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

            {/* Renyou Logo */}
            <motion.img
              src={
  dark
    ? "/assets/logo/renyou-logo-dark.png"
    : "/assets/logo/renyou-logo.png"
}
              alt="Renyou"
              className="relative z-10 w-24 sm:w-28 md:w-32 lg:w-36 h-auto object-contain"
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