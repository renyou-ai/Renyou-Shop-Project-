import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import RatingStars from "../../../components/RatingStars";

export default function RoutineStep ({

  index,
  total,
  title,
  product,
  color = "#ec4899",
  onClick,
}) {

const originalPrice = Number(product.price || 0);

const discount = Number(product.discountPercentage || 0);

const salePrice =
  discount > 0
    ? (originalPrice * (1 - discount / 100)).toFixed(2)
    : originalPrice.toFixed(2);

  const stockStatus = product.stockStatus;
const stock = Number(product.stock ?? 0);

let stockLabel = "Out of Stock";
let stockColor = "#ef4444";
let stockGlow = "0 0 10px rgba(239,68,68,.6)";

if (stock > 0) {
  stockLabel = "In Stock";
  stockColor = "#22c55e";
  stockGlow = "0 0 10px rgba(34,197,94,.6)";
}

if (stockStatus === "LOW_STOCK") {
  stockLabel = "Low Stock";
  stockColor = "#f59e0b";
  stockGlow = "0 0 10px rgba(245,158,11,.6)";
}

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{
        x: 6,
        borderColor: `${color}55`,
        background: "rgba(255,255,255,.045)",
      }}
      whileTap={{ scale: 0.985 }}
      transition={{
        duration: .35,
        ease: [0.22,1,0.36,1],
      }}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 18,
        padding: "16px",
        marginBottom: 14,
        borderRadius: 20,
        cursor: "pointer",
background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.025))",
border: "1px solid rgba(249,168,212,.12)",
backdropFilter: "blur(18px)",
boxShadow: "0 12px 40px rgba(0,0,0,.18)",
        transition: ".25s",
      }}
    >

      {/* Timeline */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "500%",
            background: `linear-gradient(135deg,${color},#f9a8d4)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            fontFamily: "'Cormorant Garamond', serif",
            boxShadow: `0 8px 24px ${color}33`,
          }}
        >
          {String(index).padStart(2, "0")}
        </div>

        {index < total && (
          <div
            style={{
              width: 2,
              flex: 1,
              minHeight: 58,
              marginTop: 8,
              borderRadius: 99,
              background: `linear-gradient(to bottom,${color}66,transparent)`,
            }}
          />
        )}
      </div>

      {/* Content */}

      <motion.div
  whileHover={{
    scale: 1.08,
    rotate: -2,
  }}
  transition={{ duration: 0.25 }}
  style={{
    width: 58,
    height: 58,
    borderRadius: 18,
    overflow: "hidden",
    flexShrink: 0,
    background: "#fff",
    border: "1px solid rgba(249,168,212,.20)",
    boxShadow: "0 12px 30px rgba(236,72,153,.18)",
  }}
>
  <img
    src={product.image}
    alt={product.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
    onError={(e) => {
      e.target.src = "/placeholder-product.png";
    }}
  />
</motion.div>

      <div style={{ flex: 1 }}>

        <div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    marginBottom: 10,
    borderRadius: 999,
    background: `${color}12`,
    border: `1px solid ${color}30`,
    color,
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    backdropFilter: "blur(8px)",
    width: "fit-content",
  }}
>
  ✦ {title}
</div>

        <div
  style={{
    fontFamily: "'Cormorant Garamond', serif",
    color: "#fff",
    fontSize: 22,
    fontWeight: 600,
    lineHeight: 1.15,
    letterSpacing: "-.02em",
    marginBottom: 4,
  }}
>
          {product.name}
        </div>

        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  }}
>
  <span
    style={{
      color: "#fff",
      fontSize: 20,
      fontWeight: 700,
    }}
  >
    ${salePrice}
  </span>

  {discount > 0 && (
    <>
      <span
        style={{
          color: "rgba(255,255,255,.35)",
          textDecoration: "line-through",
          fontSize: 14,
        }}
      >
        ${originalPrice}
      </span>

      <span
        style={{
          background: "linear-gradient(135deg,#ec4899,#f472b6)",
          color: "#fff",
          padding: "3px 8px",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        -{discount}%
      </span>
    </>
  )}
</div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  }}
>
  <span
    style={{
      padding: "5px 10px",
      borderRadius: 999,
      background: "rgba(249,168,212,.08)",
      border: "1px solid rgba(249,168,212,.18)",
      color: "#f9a8d4",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: ".05em",
    }}
  >
    {product.category?.name || "Skincare"}
  </span>

  <span
    style={{
      color: "rgba(255,255,255,.45)",
      fontSize: 12,
    }}
  >
    by {product.brand?.name}
  </span>
</div>

<RatingStars
  rating={product.rating}
  reviewCount={product.reviewCount}
  size={16}
/>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  }}
>
  <span
    style={{
      width: 8,
      height: 8,
      borderRadius: "50%",
background: stockColor,
boxShadow: stockGlow,
    }}
  />

  <span
    style={{
      fontSize: 12,
color: stockColor,
      fontWeight: 600,
    }}
  >
{stockLabel}
  </span>
</div>

        {(product.shortDescription || product.description) && (
  <p
    style={{
      margin: "8px 0 0",
      color: "rgba(255,255,255,.62)",
      fontSize: 13,
      lineHeight: 1.65,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    }}
  >
    {product.shortDescription || product.description}
  </p>
)}

      </div>

      <motion.div
  whileHover={{ x: 4 }}
  style={{
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#f9a8d4",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: ".04em",
    whiteSpace: "nowrap",
  }}
>
  <span>View</span>
  <span style={{ fontSize: 18 }}>→</span>
</motion.div>

    </motion.div>
  );
}