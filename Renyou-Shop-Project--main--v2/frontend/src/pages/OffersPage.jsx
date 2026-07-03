import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Zap, Clock, Gift, Percent, ShoppingCart, Star, ChevronRight, Copy, Check } from "lucide-react";
import { useToast } from "../context/ToastContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useEffect } from "react";
import { api } from "../services/api";
import Price from "@shared/currency/Price";
import { useThemeValue } from "@shared/theme/useThemeValue";
import Footer from "../components/Footer";

/* ─── Données des offres ───────────────────────────── */

const CATEGORIES = [
  {
    label: "Skincare",
    discount: "Up to 35% off",
    categoryId: "6a0afd3ea9a8b0cfea193cf7",
  },
  {
    label: "Supplements",
    discount: "Up to 25% off",
    categoryId: "6a0afd3ea9a8b0cfea193cf8",
  },
  {
    label: "Baby Care",
    discount: "Up to 30% off",
    categoryId: "6a0afd3ea9a8b0cfea193cfb",
  },
  {
    label: "Haircare",
    discount: "Up to 20% off",
    categoryId: "6a0afd3ea9a8b0cfea193cfa",
  },
];

/* ─── Countdown hook ────────────────────────────────── */
function useCountdown(hours = 5, minutes = 47, seconds = 22) {
  const [time, setTime] = useState({ h: hours, m: minutes, s: seconds });
useEffect(() => {
  const t = setInterval(() => {
    setTime((prev) => {
      let { h, m, s } = prev;
      s -= 1;
      if (s < 0) {
        s = 59;
        m -= 1;
      }
      if (m < 0) {
        m = 59;
        h -= 1;
      }
      if (h < 0) {
        h = 23;
        m = 59;
        s = 59;
      }
      return { h, m, s };
    });
  }, 1000);

  return () => clearInterval(t);
}, []);
  const pad = n => String(n).padStart(2, "0");
  return `${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`;
}

/* ─── Product deal card ─────────────────────────────── */
function DealCard({ deal }) {
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const dark = useThemeValue((t) => t.mode === "dark");

  const handleAdd = e => {
    e.stopPropagation();
    addToCart({ _id: deal.id, name: deal.name, price: deal.sale, image: deal.image, brand: deal.brand });
    setAdded(true);
    toast.cart(
  deal.name,
  <>
  Added to your cart • <Price value={deal.sale} />
</>,
  {
    image: deal.image,
    duration: 2500,
  }
);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  onClick={() => navigate(`/products/${deal.id}`)}
className="group rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-[var(--color-surface)] border-[var(--color-border)]"
>
<div
  className="relative aspect-square overflow-hidden bg-[var(--color-surface-hover)]"
>
        <span className="absolute top-3 left-3 z-10 bg-[#f4742a] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
          {deal.badge}
        </span>
        {!imgErr && deal.image
          ? <img src={deal.image} alt={deal.name} onError={() => setImgErr(true)} className="w-full h-full object-contain p-6 bg-transparent group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🧴</div>}
      </div>
<div
  className="p-4 flex flex-col h-[230px] bg-[var(--color-surface)]"
>
        <div
  className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${
    dark ? "text-violet-400" : "text-violet-500"
  }`}
>{deal.brand}</div>
<h3
  className="text-sm font-semibold line-clamp-2 min-h-[40px] mb-2 leading-snug text-[var(--color-text)]"
>
  {deal.name}
</h3>
        <div className="flex items-center gap-1 mb-3">
          {Array.from({length:5}).map((_,i) => (
            <Star
  key={i}
  size={11}
  className={
    i < Math.round(deal.rating)
      ? "fill-yellow-400 text-yellow-400"
      : dark
        ? "fill-gray-700 text-gray-700"
        : "fill-gray-200 text-gray-200"
  }
/>
          ))}
          <span
  className={`text-[11px] ml-1 ${
    dark ? "text-gray-400" : "text-gray-500"
  }`}
>
  ({deal.reviews})
</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
<span
  className="text-lg font-black text-[var(--color-text)]"
>
  <Price value={deal.sale} />
</span>
          <span
  className={`text-sm line-through ${
    dark ? "text-gray-500" : "text-gray-400"
  }`}
>
  <Price value={deal.price} />
</span>
        </div>
<button
  onClick={handleAdd}
  className={`
    mt-auto
    w-full
    h-11 sm:h-12
    flex items-center justify-center gap-2
    rounded-xl
    font-semibold
    text-sm
    text-white
    overflow-hidden
    transition-all duration-300 ease-out
    active:scale-[0.97]
    hover:-translate-y-0.5
    hover:shadow-xl
    focus:outline-none
    focus:ring-2
    focus:ring-violet-500/40
    ${
      added
        ? "bg-emerald-500 hover:bg-emerald-500"
        : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
    }
  `}
>
  <ShoppingCart
    size={16}
    className={`transition-transform duration-300 ${
      added ? "scale-110 rotate-6" : "group-hover:scale-110"
    }`}
  />
  <span>{added ? "Added!" : "Add to Cart"}</span>
</button>
      </div>
    </motion.div>
  );
}

/* ─── Coupon card ───────────────────────────────────── */
function CouponCard({ c }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const dark = useThemeValue((t) => t.mode === "dark");
  const copy = () => {
    navigator.clipboard?.writeText(c.code);
    setCopied(true);
    toast.success(`Coupon "${c.code}" copied !`, "Paste it at checkout.", { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };
  return (
  <div
className="rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-[var(--color-surface)] border border-[var(--color-border)]"
  >
    <div className="p-5 flex items-center gap-4">

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: c.color + "18" }}
      >
        <Percent size={20} style={{ color: c.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="font-black text-lg font-mono tracking-widest"
            style={{ color: c.color }}
          >
            {c.code}
          </span>
        </div>

        <div
          className={`text-sm font-semibold ${
            dark ? "text-white" : "text-gray-800"
          }`}
        >
          {c.discountType === "percentage" ? (
            `${c.discountValue}% off`
          ) : (
            <>
              <Price value={c.discountValue} /> off
            </>
          )}
        </div>

        <div
          className={`text-xs ${
            dark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Min. <Price value={c.minPurchase || 0} />
        </div>
      </div>

      <button
        onClick={copy}
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center hover:border-violet-400 transition-all ${
          dark
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {copied ? (
          <Check size={14} className="text-emerald-500" />
        ) : (
          <Copy
            size={14}
            className={dark ? "text-gray-300" : "text-gray-500"}
          />
        )}
      </button>

    </div>
  </div>
);}

/* ─── Main OffersPage ───────────────────────────────── */
export default function OffersPage() {
  const navigate = useNavigate();
  const dark = useThemeValue((t) => t.mode === "dark");
  const countdown = useCountdown(5, 47, 22);
  const [flashDeals, setFlashDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [bundles, setBundles] = useState([]);
  const { addToCart } = useCart();
  const toast = useToast();
  const addBundleToCart = (bundle) => {
  addToCart({
    _id: bundle._id,
    name: bundle.name,
    price: bundle.salePrice,
    image: bundle.image,
    isBundle: true,
    products: bundle.products,
  });

  toast.success(`${bundle.name} added to cart`);
};

  useEffect(() => {
  const fetchCoupons = async () => {
    try {
      const data = await api.getCoupons();

      setCoupons(
        data.coupons || data || []
      );
    } catch (err) {
      console.error(err);
    }
  };

  fetchCoupons();
}, []);

useEffect(() => {
  const fetchBundles = async () => {
    try {
      const data = await api.getBundles();

      setBundles(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  fetchBundles();
}, []);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.getFlashSale();

      const offers = res.map(product => {
  const discount = product.discountPercentage || 0;

  return {
    id: product._id,
    name: product.name,
    brand: product.brand?.name || "Unknown",
    price: product.price,
    sale: product.price * (1 - discount / 100),
    image: product.image,
    rating: product.rating || 4.5,
    reviews: product.reviewCount || 0,
    badge: discount > 0 ? `${discount}% OFF` : "SPECIAL OFFER"
  };
});

      setFlashDeals(offers);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  return (
      <div
    className="min-h-screen"
    style={{
      background: "var(--color-background)",
      color: "var(--color-text)",
    }}
  >

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-purple-700 text-white py-20 px-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize:"40px 40px" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <Zap size={14} className="text-yellow-300" /> Limited Time Offers — Don't miss out!
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="text-[40px] md:text-[60px] font-black leading-tight mb-4">
            Exclusive Deals &<br />
            <span className="text-yellow-300">Special Offers</span>
          </motion.h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
            className="text-violet-100 text-lg mb-8 max-w-2xl mx-auto">
            Save big on premium health, beauty and skincare products — hand-picked deals updated daily.
          </motion.p>
          <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
            onClick={() => navigate("/products-list")}
className={`font-bold px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:opacity-90 border ${
  dark
    ? "bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
    : "bg-[var(--color-surface)] text-[var(--color-primary)] border-[var(--color-border)]"
}`}>
            Browse All Products
          </motion.button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ── FLASH DEALS ── */}
        <section>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div
  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
    dark ? "bg-orange-900/30" : "bg-orange-100"
  }`}
>
                <Zap size={20} className="text-[#f4742a]" />
              </div>
              <div>
                <h2
  className={`text-2xl font-black text-[var(--color-text)]`}
>Flash Deals</h2>
                <p
  className={`text-sm ${
    dark ? "text-gray-400" : "text-gray-500"
  }`}
>
  Ends in <span className="font-bold text-[#f4742a] font-mono">{countdown}</span>
</p>
              </div>
            </div>
<button
  onClick={() => navigate("/products-list")}
className={`flex items-center gap-1.5 font-semibold text-sm transition-all hover:gap-2.5 ${
  dark
    ? "text-violet-400 hover:text-violet-300"
    : "text-violet-600 hover:text-violet-700"
}`}
>
              See all <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
  <p className={dark ? "text-gray-400" : "text-gray-600"}>
  Loading products...
</p>
) : (
  flashDeals.map(d => (
<DealCard key={d.id} deal={d} />
  ))
)}
          </div>
        </section>

        {/* ── COUPONS ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div
  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
    dark ? "bg-violet-900/30" : "bg-violet-100"
  }`}
>
              <Tag size={20} className="text-violet-600" />
            </div>
            <div>
              <h2
  className={`text-2xl font-black text-[var(--color-text)]`}
>Promo Codes</h2>
              <p
  className={`text-sm ${
    dark ? "text-gray-500" : "text-gray-400"
  }`}
>
  Copy and use at checkout
</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {console.log(coupons)}
            {coupons.map(c => (
  <CouponCard key={c._id || c.code} c={c} />
))}
          </div>
        </section>

        {/* ── BUNDLES ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div
  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
    dark ? "bg-pink-900/30" : "bg-pink-100"
  }`}
>
              <Gift size={20} className="text-pink-600" />
            </div>
            <div>
              <h2
  className={`text-2xl font-black text-[var(--color-text)]`}
>
  Value Bundles
</h2>

<p className="text-sm text-[var(--color-text-secondary)]">
  Curated sets at unbeatable prices
</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((b, i) => {
  const originalPrice = b.products.reduce(
    (sum, p) => sum + (p.price || 0),
    0
  );

  const savePercent =
    originalPrice > 0
      ? Math.round(
          ((originalPrice - b.salePrice) / originalPrice) * 100
        )
      : 0;
      console.log("Bundle:", b.name, "Save:", savePercent);

  return (
    <motion.div
    onClick={() => navigate(`/bundles/${b._id}`)}
      key={b._id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
className="rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-[var(--color-surface)] border border-[var(--color-border)]"
    >
<div className="h-52 overflow-hidden bg-[var(--color-surface-hover)]">
  <img
    src={`http://localhost:5000${b.image}`}
    alt={b.name}
    className="w-full h-full object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-105"
    onError={() => console.log("IMAGE ERROR =", b.image)}
  />
</div>

      <div className="p-6 bg-[var(--color-surface)]">
<h3 className="font-black text-lg mb-3 text-[var(--color-text)]">
          {b.name}
        </h3>

        <ul className="space-y-1.5 mb-5">
          {b.products.map((p) => (
            <li
              key={p._id}
className="text-sm flex items-center gap-2 text-[var(--color-text-secondary)]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
              {p.name}
            </li>
          ))}
        </ul>

<div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <div>
<div className="text-2xl font-black text-[var(--color-text)]">
              <Price value={b.salePrice} />
            </div>

            <div
className="text-sm line-through text-[var(--color-text-secondary)]"
>
              <Price value={originalPrice} />
            </div>
          </div>

<span
  className="
    inline-flex
    items-center
    px-3.5
    py-1.5
    rounded-full
    text-sm
    font-bold
    !bg-emerald-500/15
    !text-emerald-600
    border
    !border-emerald-500/30
    shadow-sm
  "
>
  Save {savePercent}%
</span>
        </div>

<button
  onClick={(e) => {
    e.stopPropagation();
    addBundleToCart(b);
  }}
  className="
    mt-4
    w-full
    h-11 sm:h-12
    rounded-xl
    font-semibold
    text-sm
    text-white
    bg-gradient-to-r
    from-violet-600
    to-purple-600
    hover:from-violet-700
    hover:to-purple-700
    transition-all
    duration-300
    ease-out
    hover:-translate-y-0.5
    hover:shadow-xl
    active:scale-[0.97]
    focus:outline-none
    focus:ring-2
    focus:ring-violet-500/40
  "
>
  Get This Bundle
</button>
      </div>
    </motion.div>
  );
})}
          </div>
        </section>

        {/* ── SHOP BY CATEGORY ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div
  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
    dark ? "bg-blue-900/30" : "bg-blue-100"
  }`}
>
              <Percent size={20} className="text-blue-600" />
            </div>
            <div>
              <h2
  className={`text-2xl font-black text-[var(--color-text)]`}
>Sale by Category</h2>
<p className="text-sm text-[var(--color-text-secondary)]">
  Shop discounted products by category</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((c, i) => (
              <motion.button key={c.label} initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                onClick={() =>
  navigate(`/products-list?category=${c.categoryId}&page=1`)
}
className="
group relative overflow-hidden
flex flex-col items-center justify-center
p-7 rounded-3xl
bg-[var(--color-surface)]
border border-[var(--color-border)]
shadow-sm hover:shadow-xl
transition-all duration-300
hover:-translate-y-1 hover:border-violet-500
">
                <span className="text-4xl group-hover:scale-110 transition-transform">{c.icon}</span>
                <div>
<div className="font-bold text-sm text-[var(--color-text)]">
  {c.label}
</div>
                  <div
  className={`text-xs font-semibold ${
    dark ? "text-orange-400" : "text-[#f4742a]"
  }`}
>{c.discount}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── NEWSLETTER CTA ── */}
        <section className="rounded-[32px] bg-gradient-to-r from-violet-600 to-purple-700 text-white p-10 md:p-14 text-center">
          <div className="text-4xl mb-4"></div>
          <h2 className="text-3xl font-black mb-3">Never Miss a Deal</h2>
          <p className="text-violet-200 mb-8 max-w-lg mx-auto">
            Subscribe to get exclusive offers, flash deal alerts and new arrival notifications directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Your email address"
className="flex-1 px-4 py-3 rounded-xl text-sm font-medium bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <button className="bg-[#f4742a] hover:bg-[#e06520] text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </section>

      </div>
        <Footer />
    </div>
  );
}
