import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Package, Star, Globe, Award } from "lucide-react";
import { useThemeValue } from "@shared/theme";
import Footer from "../components/Footer";

/* ─── Brand logos identiques à Container.png / brands.png ─── */
const BrandLogo = ({ id, size = "md", dark = false }) => {
  const primaryText = dark ? "#F8FAFC" : "#1a1a2e";
const secondaryText = dark ? "#CBD5E1" : "#666";
const mutedText = dark ? "#94A3B8" : "#888";
  const s = size === "lg" ? { name: 26, sub: 10 } : { name: 16, sub: 8 };
  if (id === "bioskin-solutions") return (
    <div className="flex flex-col items-center leading-none">
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5">
          <div className={`${size==="lg"?"w-4 h-4":"w-3 h-3"} rounded-full bg-[#8B1A2F]`}/>
          <div className={`${size==="lg"?"w-4 h-4":"w-3 h-3"} rounded-full bg-[#C0392B]`}/>
        </div>
        <span style={{ fontFamily:"'Arial Narrow',Arial,sans-serif", fontWeight:700, fontSize:`${s.name}px`, color: dark ? "#ffffff" : "#1a1a2e", letterSpacing:"0.04em" }}>
          BIOSKIN SOLUTIONS
        </span>
      </div>
      <span style={{ fontFamily:"Arial,sans-serif", fontSize:`${s.sub}px`, color: mutedText, letterSpacing:"0.15em", marginTop:"1px" }}>LABORATOIRES</span>
    </div>
  );
  if (id === "healthwise-inc") return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        <div className={`${size==="lg"?"w-5 h-5":"w-4 h-4"} bg-[#C0392B]`}/>
        <div className={`${size==="lg"?"w-5 h-5":"w-4 h-4"} bg-[#2C3E50]`}/>
      </div>
      <div>
        <div style={{ fontFamily:"'Impact',Haettenschweiler,sans-serif", fontWeight:700, fontSize:`${s.name}px`, 
color: dark ? "#ffffff" : "#1a1a2e", lineHeight:1, letterSpacing:"0.04em" }}>HEALTHWISE</div>
        <div style={{ fontFamily:"Arial,sans-serif", fontSize:`${s.sub}px`, color: secondaryText, letterSpacing:"0.2em", marginTop:"1px" }}>LOVE YOUR HEALTH</div>
      </div>
    </div>
  );
  if (id === "medtech-global") return (
    <div className="text-center">
      <div style={{ fontFamily:"Georgia,serif", fontWeight:400, fontSize:`${s.sub+2}px`, color: secondaryText, letterSpacing:"0.25em", textTransform:"uppercase" }}>MEDTECH</div>
      <div style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:`${s.name}px`, 
color: dark ? "#ffffff" : "#1a1a2e", lineHeight:1, borderTop:"1.5px solid #1a1a2e", borderBottom:"1.5px solid #1a1a2e", padding:"1px 4px", marginTop:"2px" }}>GLOBAL</div>
      <div style={{ fontFamily:"Georgia,serif", fontSize:`${s.sub}px`, color: secondaryText, letterSpacing:"0.15em", marginTop:"2px" }}>PARIS</div>
    </div>
  );
  if (id === "nutracorp-labs") return (
    <div>
      <div style={{ fontFamily:"'Arial Black',Gadget,sans-serif", fontWeight:900, fontSize:`${s.name}px`, 
color: dark ? "#ffffff" : "#1a1a2e", letterSpacing:"-0.02em", lineHeight:1 }}>NUTRACORP</div>
      <div style={{ fontFamily:"Arial,sans-serif", fontSize:`${s.sub}px`, color:"#777", letterSpacing:"0.25em", marginTop:"1px" }}>LABORATOIRE DERMATOLOGIQUE</div>
    </div>
  );
  if (id === "purelab") return (
    <div className="text-center">
      <div style={{ fontFamily:"Georgia,'Times New Roman',serif", fontSize:`${s.sub+1}px`, color:"#C9826B", letterSpacing:"0.3em", textTransform:"uppercase" }}>EAU THERMALE</div>
      <div style={{ fontFamily:"Georgia,'Times New Roman',serif", fontStyle:"italic", fontWeight:600, fontSize:`${s.name+4}px`, color:"#C9826B", lineHeight:1.1 }}>PureLab</div>
    </div>
  );
  return (
  <span className={`font-bold ${dark ? "text-white" : "text-gray-700"}`}>
    {id}
  </span>
);
};

/* ─── Brand data ─────────────────────────────────────── */
const BRANDS = [
  {
    id: "bioskin-solutions",
    mongoId: "6a0afd3ea9a8b0cfea193d03",
    name: "BioSkin Solutions",
    country: "France",
    flag: "https://flagcdn.com/fr.svg",
    tagline: "Advanced skincare formulas for healthy, radiant skin.",
    description: "BioSkin Solutions is a French dermatological laboratory specialising in clinically-tested skincare. Every formula is developed in partnership with dermatologists to deliver visible results for all skin types.",
    productCount: 4,
    categories: ["Skincare", "Anti-Aging", "Hydration"],
    featured: true,
    color: "#C0392B",
    rating: 4.8,
  },
  {
    id: "healthwise-inc",
    mongoId: "6a0afd3ea9a8b0cfea193d06",
    name: "HealthWise Inc",
    country: "Canada",
    flag: "https://flagcdn.com/ca.svg",
    tagline: "Trusted wellness products for everyday health.",
    description: "HealthWise Inc brings science-backed nutritional supplements and wellness products from Canada. Their products are manufactured under GMP-certified conditions for guaranteed purity and potency.",
    productCount: 1,
    categories: ["Supplements", "Probiotics", "Vitamins"],
    featured: false,
    color: "#2563EB",
    rating: 4.7,
  },
  {
    id: "medtech-global",
    mongoId: "6a0afd3ea9a8b0cfea193d05",
    name: "MedTech Global",
    country: "Germany",
    flag: "https://flagcdn.com/de.svg",
    tagline: "Medical-grade innovation backed by research and expertise.",
    description: "MedTech Global is a German precision health company delivering medical-grade devices and formulations. With over two decades of R&D investment, their products meet the strictest EU medical standards.",
    productCount: 2,
    categories: ["Medical Devices", "Diagnostics", "Healthcare"],
    featured: true,
    color: "#1a1a2e",
    rating: 4.9,
  },
  {
    id: "nutracorp-labs",
    mongoId: "6a0afd3ea9a8b0cfea193d04",
    name: "NutraCorp Labs",
    country: "USA",
    flag: "https://flagcdn.com/us.svg",
    tagline: "Science-based nutritional and beauty solutions.",
    description: "NutraCorp Labs is a US-based nutraceutical company focused on bridging the gap between nutrition and beauty. Their supplements are independently third-party tested for quality assurance.",
    productCount: 3,
    categories: ["Nutraceuticals", "Energy", "Beauty Supplements"],
    featured: false,
    color: "#1a1a2e",
    rating: 4.6,
  },
  {
    id: "purelab",
    mongoId: "6a0afd3ea9a8b0cfea193d07",
    name: "PureLab",
    country: "Tunisia",
    flag: "https://flagcdn.com/tn.svg",
    tagline: "Clean beauty products crafted with premium ingredients.",
    description: "PureLab is a Tunisian clean beauty brand committed to formulating effective, safe and sustainable products. Free from harmful chemicals, their range caters to sensitive skin and eco-conscious consumers.",
    productCount: 5,
    categories: ["Clean Beauty", "Baby Care", "Skincare"],
    featured: true,
    color: "#C9826B",
    rating: 4.8,
  },
];

/* ─── Brand Card ─────────────────────────────────────── */
function BrandCard({ brand, onClick, dark }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{
  y: -6,
  transition: { duration: 0.25 }
}}
      transition={{ duration: 0.25 }}
      onClick={onClick}
className="group rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
style={{
  background: dark ? "#111827" : "#ffffff",
  border: `1px solid ${dark ? "#374151" : "#f3f4f6"}`,
}}
    >
      {/* Color accent top bar */}
      <div className="h-1.5" style={{ background: brand.color }} />

      {/* Logo area */}
      <div
  className="flex items-center justify-center h-36 px-6 border-b"
  style={{
    background: dark ? "#1F2937" : "#F9FAFB",
    borderColor: dark ? "#374151" : "#F3F4F6",
  }}
>
        <div className="opacity-80
group-hover:opacity-100
scale-90
group-hover:scale-110
transition-all
duration-300">
          <BrandLogo
  id={brand.id}
  size="md"
  dark={dark}
/>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <img
  src={brand.flag}
  alt={brand.country}
  className="w-5 h-4 rounded-sm object-cover"
/>

<span>{brand.country}</span>
          </div>
          {brand.featured && (
            <span className="text-[10px] font-bold bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Award size={9} /> Featured
            </span>
          )}
        </div>

        <h3 className="font-black text-[#0f1b3d] dark:text-white text-base mb-1">{brand.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">{brand.tagline}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {brand.categories.slice(0, 2).map(c => (
            <span
  key={c}
  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
  style={{
    background: dark ? "#1F2937" : "#F3F4F6",
    color: dark ? "#D1D5DB" : "#6B7280",
  }}
>{c}</span>
          ))}
        </div>

        <div
  className="flex items-center justify-between pt-4 border-t"
  style={{
    borderColor: dark ? "#374151" : "#F3F4F6",
  }}
>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Package size={11} className="text-violet-400" />
              {brand.productCount} products
            </span>
            <span className="flex items-center gap-1">
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              {brand.rating}
            </span>
          </div>
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            Explore <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Brand Detail Modal ─────────────────────────────── */
function BrandModal({ brand, onClose, dark }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="h-2" style={{ background: brand.color }} />
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex-1">
            <div className="mb-5 opacity-90">
              <BrandLogo
  id={brand.id}
  size="lg"
  dark={dark}
/>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
  <Globe size={13} className="text-violet-500 dark:text-violet-400" /> <img
  src={brand.flag}
  alt={brand.country}
  className="w-5 h-4 rounded-sm object-cover"
/>

<span>{brand.country}</span></span>
              <span className="flex items-center gap-1.5">
  <Package size={13} className="text-violet-500 dark:text-violet-400" />
  {brand.productCount} products
</span>
              <span className="flex items-center gap-1.5"><Star size={13} className="fill-yellow-400 text-yellow-400"/> {brand.rating}</span>
            </div>
          </div>
          <button
  onClick={onClose}
  className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 transition-all ml-4 flex-shrink-0"
>
            ✕
          </button>
        </div>

        <div className="px-8 py-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">{brand.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {brand.categories.map(c => (
              <span key={c} className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 px-3 py-1.5 rounded-full">{c}</span>
            ))}
          </div>

          <button
            onClick={() => { onClose(); navigate(`/products-list?brand=${brand.mongoId}`); }}
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl transition-all hover:shadow-lg hover:shadow-violet-200 active:scale-98 flex items-center justify-center gap-2"
          >
            Explore {brand.name} Products
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main BrandsPage ────────────────────────────────── */
export default function BrandsPage() {
  const navigate = useNavigate();

  const { theme } = useThemeValue();
  const dark = theme.mode === "dark";
  console.log("Theme =", theme);
console.log("Dark =", dark);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const FILTERS = [
  { id: "all", label: "All Brands" },
  { id: "featured", label: "Featured" },

  {
    id: "Tunisia",
    label: "Tunisia",
    flag: "https://flagcdn.com/tn.svg"
  },

  {
    id: "France",
    label: "France",
    flag: "https://flagcdn.com/fr.svg"
  },

  {
    id: "Germany",
    label: "Germany",
    flag: "https://flagcdn.com/de.svg"
  },

  {
    id: "USA",
    label: "USA",
    flag: "https://flagcdn.com/us.svg"
  },

  {
    id: "Canada",
    label: "Canada",
    flag: "https://flagcdn.com/ca.svg"
  }
];

  const filtered = BRANDS.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.country.toLowerCase().includes(search.toLowerCase()) ||
      b.categories.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "all" ? true
      : filter === "featured" ? b.featured
      : b.country === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div
  className="min-h-screen"
  style={{
    background: dark ? "#0f172a" : "#f9fafb",
  }}
>

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-semibold mb-5">
               {BRANDS.length} Premium Brands
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4">
            Our Partner Brands
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-violet-200 text-lg max-w-2xl mx-auto mb-8">
            Trusted manufacturers from around the world, selected for quality, safety and effectiveness.
          </motion.p>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { value: `${BRANDS.length}+`, label: "Partner Brands" },
              { value: `${BRANDS.reduce((a, b) => a + b.productCount, 0)}+`, label: "Products" },
              { value: "5", label: "Countries" },
              { value: "100%", label: "Quality Verified" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="text-violet-300 text-sm">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search brands, countries, categories..."
className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm focus:outline-none transition-all"
style={{
  background: dark ? "#111827" : "#ffffff",
  color: dark ? "#ffffff" : "#111827",
  border: `1px solid ${dark ? "#374151" : "#E5E7EB"}`,
}}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {FILTERS.map(f => (
            <button
  key={f.id}
  onClick={() => setFilter(f.id)}
className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
  filter === f.id
    ? "bg-violet-600 text-white shadow-md"
    : ""
}`}
style={
  filter === f.id
    ? {}
    : {
        background: dark ? "#111827" : "#ffffff",
        color: dark ? "#D1D5DB" : "#4B5563",
        border: `1px solid ${dark ? "#374151" : "#E5E7EB"}`,
      }
}
>
  <div className="flex items-center gap-2">
    {f.flag && (
      <img
        src={f.flag}
        alt={f.label}
        className="w-4 h-3 rounded-sm object-cover"
      />
    )}
    <span>{f.label}</span>
  </div>
</button>
          ))}
        </div>

        {/* Brand logos marquee strip — fidèle à Container.png */}
        <div
  className="rounded-2xl p-6 mb-10 overflow-hidden"
  style={{
    background: dark ? "#111827" : "#ffffff",
    border: `1px solid ${dark ? "#374151" : "#f3f4f6"}`,
  }}
>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Nos marques</p>
          <style>{`
            @keyframes scrollBrands { from{transform:translateX(0)} to{transform:translateX(-50%)} }
            .brands-track { display:flex; width:max-content; animation:scrollBrands 20s linear infinite; }
            .brands-track:hover { animation-play-state:paused; }
          `}</style>
          <div className="overflow-hidden">
            <div className="brands-track">
              {[...BRANDS, ...BRANDS].map((b, i) => (
                <button key={i} onClick={() => setSelected(b)}
                  className="flex-shrink-0 flex items-center justify-center h-12 px-10 opacity-60 hover:opacity-100 transition-all hover:scale-105 cursor-pointer">
                  <BrandLogo
  id={b.id}
  size="md"
  dark={dark}
/>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500 font-medium">
            {filtered.length} brand{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(b => (
                <BrandCard
  key={b.id}
  brand={b}
  dark={dark}
  onClick={() => setSelected(b)}
/>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">No brands found</h3>
              <p className="text-gray-400 text-sm">Try a different search term or filter.</p>
              <button onClick={() => { setSearch(""); setFilter("all"); }}
                className="mt-4 px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl text-sm hover:bg-violet-700 transition-all">
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-violet-600 to-purple-700 text-white p-10 text-center">
          <h3 className="text-2xl font-black mb-3">Want to Partner with Renyou ?</h3>
          <p className="text-violet-200 text-sm mb-6 max-w-lg mx-auto">
            Are you a brand looking to reach health-conscious customers in Tunisia and beyond? Get in touch with our partnerships team.
          </p>
          <a href="mailto:partners@renyouapp.com"
className="inline-flex items-center gap-2 font-bold px-7 py-3 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
style={{
  background: dark ? "#111827" : "#ffffff",
  color: dark ? "#ffffff" : "#7C3AED",
  border: `1px solid ${dark ? "#374151" : "transparent"}`,
}}>
            Contact Our Team
            <ChevronRight size={16} />
          </a>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
  <BrandModal
    brand={selected}
    dark={dark}
    onClose={() => setSelected(null)}
  />
)}
      </AnimatePresence>
        <Footer />
    </div>
  );
}
