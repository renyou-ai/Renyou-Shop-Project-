import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, ArrowLeft, Package, Star, Shield,
  Truck, Tag, Check, ChevronRight, Minus, Plus,
  Gift, Zap, Heart
} from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { api } from "../services/api";
import ProductImageZoom from "../components/common/ProductImageZoom";
import Price from "@shared/currency/Price";

/* ─── Skeleton ───────────────────────────────── */
function BundleSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-6 bg-gray-100 rounded w-1/4 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="h-96 bg-gray-100 rounded-3xl" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-20 bg-gray-100 rounded" />
          <div className="h-12 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── Product mini-card inside bundle ────────── */
function BundleProductCard({ product }) {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/products/${product._id}`)}
      className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-violet-50 hover:shadow-sm transition-all cursor-pointer group"
    >
      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100 shadow-sm">
        {!imgErr && product.image
          ? <img src={product.image} alt={product.name} onError={() => setImgErr(true)} className="w-full h-full object-contain p-1.5" />
          : <span className="text-2xl">🧴</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-violet-500 uppercase tracking-wide">
          {product.brand?.name || product.brand || ""}
        </div>
        <div className="text-sm font-semibold text-[#0f1b3d] line-clamp-1 group-hover:text-violet-700 transition-colors">
          {product.name}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={9}
                className={i < Math.round(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">
            {product.reviewCount > 0 ? `(${product.reviewCount})` : ""}
          </span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-bold text-[#0f1b3d]">
  <Price value={product.price || 0} />
</div>
        <ChevronRight size={13} className="text-gray-300 group-hover:text-violet-400 transition-colors ml-auto mt-1" />
      </div>
    </motion.div>
  );
}

/* ─── Main BundleDetails ─────────────────────── */
export default function BundleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  const { toggle, isWished } = useWishlist();

  const [bundle,  setBundle]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [qty,     setQty]     = useState(1);
  const [added,   setAdded]   = useState(false);
  const [imgErr,  setImgErr]  = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
  if (bundle) {
    setSelectedImage(bundle.image);
  }
}, [bundle]);

  const wished = bundle ? isWished(bundle._id) : false;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    api.getBundleById(id)
      .then(data => setBundle(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="h-5 bg-gray-100 rounded w-40 mb-8 animate-pulse" />
        <BundleSkeleton />
      </div>
    </div>
  );

  if (error || !bundle) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="text-6xl">📦</div>
      <h2 className="text-2xl font-black text-[#0f1b3d]">Bundle not found</h2>
      <p className="text-gray-400 text-sm">This bundle may no longer be available.</p>
      <button onClick={() => navigate("/offers")}
        className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all">
        <ArrowLeft size={16} /> Back to Offers
      </button>
    </div>
  );
  
  const bundleImage = bundle?.image?.startsWith("http")
  ? bundle.image
  : `http://localhost:5000${bundle.image}`;

  /* ── Computed values ── */
  const products = bundle.products || [];
  const originalTotal = products.reduce((s, p) => s + (p.price || 0), 0);
  const salePrice     = bundle.salePrice || originalTotal;
  const saveAmount    = originalTotal - salePrice;
  const savePercent   = originalTotal > 0 ? Math.round((saveAmount / originalTotal) * 100) : 0;

  /* ── Handlers ── */
  const handleAddToCart = () => {
    // Add the bundle as a single cart item
    addToCart({
      id:    bundle._id,
      _id:   bundle._id,
      name:  bundle.name,
      price: salePrice,
      image: bundleImage,
      brand: "Bundle",
      isBundle: true,
      bundleItems: products.map(p => p.name),
      qty,
    });
    setAdded(true);
    toast.cart(
  bundle.name,
  `Bundle added — ${savePercent}% saved !`,
  {
    image: bundleImage,
    duration: 5000,
    action: {
      label: "View Cart",
      onClick: () => navigate("/cart"),
    },
  }
);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleWish = () => {
    const wasWished = wished;
    toggle({ _id: bundle._id, name: bundle.name, price: salePrice, image: bundleImage });
    if (!wasWished) toast.success(bundle.name, "Bundle saved to wishlist", { duration: 2000 });
  };

  const TABS = [
    { id: "products", label: `Included Products (${products.length})` },
    { id: "shipping", label: "Shipping & Returns" },
    { id: "why",      label: "Why This Bundle ?" },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Breadcrumb ── */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-xs text-gray-400">
          <button onClick={() => navigate("/")} className="hover:text-violet-600 transition-colors">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate("/offers")} className="hover:text-violet-600 transition-colors">Offers</button>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium line-clamp-1">{bundle.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* Left — Bundle image */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100"
            >
              {/* Save badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  <Zap size={11} /> Save {savePercent}%
                </span>
              </div>

              {/* Wishlist */}
              <button onClick={handleWish}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all">
                <Heart size={16} className={wished ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </button>

              {!imgErr && bundle.image
                ? <ProductImageZoom
  src={
    selectedImage
      ? (
          selectedImage.startsWith("http")
            ? selectedImage
            : `http://localhost:5000${selectedImage}`
        )
      : bundleImage
  }
  alt={bundle.name}
  className="w-full h-full object-contain p-6"
/>
                : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <Gift size={64} className="text-violet-300" strokeWidth={1} />
                    <div className="text-lg font-bold text-violet-400 text-center px-6">{bundle.name}</div>
                  </div>
                )}
            </motion.div>

            {/* Product thumbnails strip */}
            {products.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">

<div className="flex flex-col items-center">
  <button
    onClick={() => setSelectedImage(bundle.image)}
    className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 ${
      selectedImage === bundle.image
        ? "border-violet-500"
        : "border-gray-100"
    }`}
  >
    <img
      src={bundleImage}
      alt={bundle.name}
      className="w-full h-full object-cover"
    />
  </button>

  <div className="text-[10px] text-center mt-1 font-semibold text-violet-600">
    Bundle
  </div>
</div>

                {products.map((p, i) => (
  <div
    key={p._id || i}
    className="flex flex-col items-center"
  >
    <button
      onClick={() => setSelectedImage(p.image)}
      className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 ${
        selectedImage === p.image
          ? "border-violet-500"
          : "border-gray-100"
      }`}
    >
      {p.image ? (
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xl">🧴</span>
      )}
    </button>

    <div className="text-[10px] text-center mt-1 text-gray-500">
      Product {i + 1}
    </div>
  </div>
))}           
              </div>
            )}
          </div>

          {/* Right — Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="flex flex-col">

            {/* Bundle badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full">
                <Package size={12} /> Value Bundle
              </span>
              {bundle.flashSale && (
                <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full">
                  <Zap size={12} /> Flash Deal
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-[#0f1b3d] leading-tight mb-3">{bundle.name}</h1>

            {bundle.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{bundle.description}</p>
            )}

            {/* Price block */}
            <div className="flex items-end gap-4 mb-6 p-5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bundle Price</div>
                <div className="text-4xl font-black text-violet-700">
  <Price value={salePrice} />
</div>
                {originalTotal > salePrice && (
                  <div className="text-sm text-gray-400 line-through mt-0.5">
  <Price value={originalTotal} />
</div>
                )}
              </div>
              {saveAmount > 0 && (
                <div className="mb-1">
                  <span className="bg-emerald-500 text-white text-sm font-black px-3 py-1.5 rounded-xl">
  You save <Price value={saveAmount} />
</span>
                </div>
              )}
            </div>

            {/* What's included summary */}
            <div className="mb-6">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Includes {products.length} products
              </div>
              <div className="space-y-2">
                {products.map((p, i) => (
                  <div key={p._id || i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-emerald-500 flex-shrink-0" />
                    <span>{p.name}</span>
                    <span className="ml-auto text-[#0f1b3d] font-semibold">
  <Price value={p.price || 0} />
</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3 mb-5">
              {/* Qty selector */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600">
                  <Minus size={14} />
                </button>
                <span className="w-10 h-12 flex items-center justify-center font-bold text-[#0f1b3d]">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600">
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to cart CTA */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-black text-sm transition-all duration-200 shadow-lg ${
                  added
                    ? "bg-emerald-500 text-white shadow-emerald-200"
                    : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span key="done" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="flex items-center gap-2">
                      <Check size={16} strokeWidth={2.5} /> Bundle Added !
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="flex items-center gap-2">
                      <ShoppingCart size={16} /> Get This Bundle
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Wish */}
              <button onClick={handleWish}
                className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all">
                <Heart size={18} className={wished ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck,  title: "Free Delivery",      sub: "On orders over $50" },
                { icon: Shield, title: "Quality Guaranteed", sub: "100% authentic" },
                { icon: Tag,    title: "Best Price",         sub: `${savePercent}% off retail` },
              ].map(b => (
                <div key={b.title} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl gap-1.5">
                  <b.icon size={16} className="text-violet-500" />
                  <div className="text-xs font-bold text-[#0f1b3d] leading-tight">{b.title}</div>
                  <div className="text-[10px] text-gray-400">{b.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Tabs section ── */}
        <div className="mb-16">
          {/* Tab headers */}
          <div className="flex border-b border-gray-100 gap-0 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-violet-600 text-violet-700 font-bold"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }} transition={{ duration: 0.18 }} className="pt-6">

              {activeTab === "products" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((p, i) => (
                    <BundleProductCard key={p._id || i} product={p} />
                  ))}
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
                  {[
                    { icon: Truck,  title: "Standard Delivery",   body: "3–5 business days. Free on orders over $50. Flat rate of $5.99 below threshold." },
                    { icon: Zap,    title: "Express Delivery",    body: "1–2 business days. Available for select regions. Additional charges apply." },
                    { icon: Package,title: "Return Policy",       body: "Returns accepted within 14 days of delivery. Bundles must be returned complete and unopened." },
                    { icon: Shield, title: "Quality Guarantee",   body: "All products are sourced directly from licensed manufacturers and undergo rigorous quality checks." },
                  ].map(s => (
                    <div key={s.title} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <s.icon size={16} className="text-violet-600" />
                      </div>
                      <div>
                        <div className="font-bold text-[#0f1b3d] mb-1 text-sm">{s.title}</div>
                        <div className="text-gray-500 text-xs leading-relaxed">{s.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "why" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {title:"Maximum Savings",       body: (
  <>
    Save <Price value={saveAmount} /> compared to buying each product individually — that's {savePercent}% off.
  </>
), },
                    {title:"Expert Curated",        body:"Each bundle is hand-picked by our wellness experts to ensure the products work perfectly together." },
                    {title:"One-Click Convenience", body:"Get everything you need in a single purchase, shipped together in one eco-friendly package." },
                    {title:"Quality Assured",       body:"Every product in this bundle is sourced directly from certified manufacturers and lab-tested for purity." },
                    {title:"Perfect Gift",          body:"Beautifully packaged — makes an ideal gift for friends and family who care about their health." },
                    {title:"Easy Returns",          body:"Not satisfied? Return the entire bundle within 14 days for a full refund — no questions asked." },
                  ].map(r => (
                    <div key={r.title} className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
                      <div className="text-3xl mb-3">{r.emoji}</div>
                      <div className="font-bold text-[#0f1b3d] text-sm mb-1.5">{r.title}</div>
                      <div className="text-xs text-gray-500 leading-relaxed">{r.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-purple-700 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-sm font-bold text-violet-300 mb-1">Limited offer</div>
            <h3 className="text-2xl font-black mb-2">{bundle.name}</h3>
            <p className="text-violet-200 text-sm">
  Only <span className="font-black text-white"><Price value={salePrice} /></span> — save <Price value={saveAmount} /> today
</p>
          </div>
          <motion.button whileTap={{ scale:0.97 }} onClick={handleAddToCart}
            className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm transition-all whitespace-nowrap flex-shrink-0 ${
              added ? "bg-emerald-400 text-white" : "bg-white text-violet-700 hover:scale-105 shadow-xl"
            }`}>
            {added ? <><Check size={16}/> Added !</> : <><ShoppingCart size={16}/> Get This Bundle</>}
          </motion.button>
        </div>

      </div>
    </div>
  );
}