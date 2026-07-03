import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductImageZoom({
  src,
  alt,
  className = "",
}) {
  const [style, setStyle] = useState({});
  const [zoom, setZoom] = useState(false);
  const [open, setOpen] = useState(false);

  const handleMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.5)",
    });
  };

  return (
    <>
      {/* Hover Zoom */}
      <div
        className="relative overflow-hidden w-full h-full cursor-crosshair"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => {
          setZoom(false);
          setStyle({
            transform: "scale(1)",
            transformOrigin: "center",
          });
        }}
        onMouseMove={handleMove}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={`${className} transition-transform duration-100 ease-out select-none`}
          style={zoom ? style : {}}
        />
      </div>

      {/* Fullscreen Zoom */}
      <AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(10px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center"
      onClick={() => setOpen(false)}
    >
      <motion.img
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 22,
        }}
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={() => setOpen(false)}
        className="absolute top-5 right-6 text-white text-5xl hover:scale-110 transition"
      >
        ×
      </button>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}