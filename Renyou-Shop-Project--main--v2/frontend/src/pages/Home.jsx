import Navbar from "../components/Navbar";
import IAsearchSection from "../components/IAsearchSection";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import axios from "axios";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { api } from "../services/api.js";
import Price from "@shared/currency/Price";
import RatingStars from "../components/RatingStars";
import { useThemeValue } from "@shared/theme/useThemeValue";


/* ════════════════════════════════════════════════
   Produits réels — Best Sellers (référence: sec1.png)
════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════
   Produits réels — New Arrivals (référence: sec2.png)
════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════
   Marques réelles — fonts, couleurs et logos originaux
   de chaque fabricant (référence: Container.png)
════════════════════════════════════════════════ */

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

const BRANDS = [
  {
    id: "6a0afd3ea9a8b0cfea193d03",
    slug: "bioskin-solutions",
    name: "BioSkin Solutions",
  },
  {
    id: "6a0afd3ea9a8b0cfea193d06",
    slug: "healthwise-inc",
    name: "HealthWise Inc",
  },
  {
    id: "6a0afd3ea9a8b0cfea193d05",
    slug: "medtech-global",
    name: "MedTech Global",
  },
  {
    id: "6a0afd3ea9a8b0cfea193d04",
    slug: "nutracorp-labs",
    name: "NutraCorp Labs",
  },
  {
    id: "6a0afd3ea9a8b0cfea193d07",
    slug: "purelab",
    name: "PureLab",
  },
];


/* ════════════════════════════════════════════════
   Avis clients — What Our Customers Say
   (référence: Group3599.png)
════════════════════════════════════════════════ */
const REVIEWS = [
  {
    name: "Sarah Jenkins",    initials: "SJ", label: "Verified Buyer", rating: 5, color: "#7C3AED",
    text: "Fastest delivery I've ever experienced. The pharmacist even called to confirm my prescription details before shipping. Highly recommended!",
  },
  {
    name: "Michael Torres",   initials: "MT", label: "Verified Buyer", rating: 5, color: "#059669",
    text: "RenyouApp makes refilling my monthly prescriptions completely hassle-free. The interface is clean, and the tracking updates are accurate.",
  },
  {
    name: "Elena Martinez",   initials: "EM", label: "Verified Buyer", rating: 5, color: "#f4742a",
    text: "I found all my specific skincare brands in one place. The 20% discount on my first order was just the cherry on top! Great service.",
  },
  {
    name: "Karim Ben Ali",    initials: "KB", label: "Verified Buyer", rating: 5, color: "#2563EB",
    text: "Qualité exceptionnelle des produits. La livraison était ultra-rapide et l'emballage était parfait. Je recommande sans hésitation.",
  },
  {
    name: "Leila Mansouri",   initials: "LM", label: "Verified Buyer", rating: 4, color: "#db2777",
    text: "Super application, très facile à utiliser. Les prix sont compétitifs et la sélection de marques est impressionnante.",
  },
  {
    name: "Omar Trabelsi",    initials: "OT", label: "Verified Buyer", rating: 5, color: "#0891b2",
    text: "Le service client est réactif et professionnel. J'ai eu un problème avec ma commande et il a été résolu en moins de 2 heures.",
  },
];


/* ════════════════════════════════════════════════
   Carte produit Home
════════════════════════════════════════════════ */
function HomeProductCard({ product, navigate, badge, dark }) {
  const { addToCart } = useCart();
  const { toggle, isWished } = useWishlist();
  const toast = useToast();
  const [imgError, setImgError] = useState(false);
  const wished = isWished(product._id);


  const handleAdd = (e) => {
  e.stopPropagation();


  addToCart({
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    brand: product.brand?.name || product.brand,
  });


  toast.cart(
    product.name,
    "Added to your cart",
    {
      image: product.image,
      duration: 2500,
    }
  );
};


  const handleWish = (e) => {
    e.stopPropagation();
    const wasWished = wished;
    toggle({ _id: product._id, name: product.name, price: product.price, image: product.image, brand: product.brand });
    if (!wasWished) toast.success(product.name, "Added to wishlist", { duration: 2000 });
  };


  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
  `Bonjour, je suis intéressé(e) par "${product.name}" (${Number(product.price || 0).toFixed(2)}$).`
);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };


  return (
    <div
      onClick={() => navigate(`/user/products/${product._id}`)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
  dark
    ? "bg-[#1b2433] border border-slate-700"
    : "bg-white border border-gray-100"
}`}
    >
      {/* Wishlist heart */}
      <button
        onClick={handleWish}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:scale-110 ${
  dark ? "bg-[#2d3748]" : "bg-white/90"
}`}
      >
        <Heart size={14} className={wished ? "fill-red-500 text-red-500" : "text-gray-300"} />
      </button>


      {/* Image */}
      <div
  className={`aspect-square flex items-center justify-center overflow-hidden ${
    dark ? "bg-[#243041]" : "bg-gray-50"
  }`}
>
        {!imgError && product.image ? (
          <img
  src={product.image}
  alt={product.name}
  onError={() => setImgError(true)}
  className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
/>
        ) : (
          <div className="text-5xl">🧴</div>
        )}
      </div>


      {/* Infos */}
      <div className="p-4">
{badge && (
  <span
    className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md mb-1.5"
    style={{
      background: dark ? "#243041" : "#fff7ed",
      color: "#f4742a",
      border: dark ? "1px solid #475569" : "1px solid #fed7aa",
    }}
  >
    {badge}
  </span>
)}
        {!badge && product.brand && (
          <div
  className="text-[10px] font-semibold uppercase tracking-wide mb-1"
  style={{
    color: dark
      ? "var(--color-text-secondary)"
      : "#9CA3AF",
  }}
>{product.brand?.name || product.brand}</div>
        )}
        <h3
  className="text-sm font-semibold leading-snug mb-1.5 line-clamp-1"
  style={{ color: "var(--color-text)" }}
>{product.name}</h3>


<div className="mb-2">
  <RatingStars
    rating={product.rating}
    reviewCount={product.reviewCount}
    size={12}
  />
</div>


        <div className="flex items-center justify-between">
          <span
  className="text-base font-bold"
  style={{ color: "var(--color-text)" }}
>
  <Price value={product.price} />
</span>
          <div className="flex items-center gap-1.5">
<button
  onClick={handleWhatsApp}
  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
  style={{
    background: dark ? "#243041" : "#f0fdf4",
    border: dark ? "1px solid #475569" : "1px solid #bbf7d0",
  }}
  title="Commander sur WhatsApp"
>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green-500">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              title="Add to Cart"
            >
              <span className="text-white text-lg leading-none font-light -mt-0.5">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function Home() {
  const navigate = useNavigate();
  const { theme } = useThemeValue();
  const dark = theme.mode === "dark";
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const [aiOpen, setAiOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [fromMini, setFromMini] = useState(false);
  const [toMini, setToMini] = useState(false);


  const [bestSellers, setBestSellers] = useState([]);


  const [newArrivals, setNewArrivals] = useState([]);


  useEffect(() => {
  const loadProducts = async () => {
    try {


const featuredProducts = await api.getFeaturedProducts();
setBestSellers(featuredProducts); // Best Sellers = les plus vendus


const response = await api.getPublicProducts({
  limit: 100,
});


const products = response.products || [];


      // New Arrivals = les plus récents
const latestProducts = [...products]
  .sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
  .filter(
    p => !featuredProducts?.some(fp => fp._id === p._id)
  )
  .slice(0, 4);

setNewArrivals(latestProducts);


    } catch (err) {
      console.error(err);
    }
  };


  loadProducts();
}, []);


  // Auto-scroll chaque 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { clientWidth } = carouselRef.current;
        const newIndex = activeIndex + 1 >= 2 ? 0 : activeIndex + 1;
        setActiveIndex(newIndex);
        carouselRef.current.scrollTo({
          left: newIndex * clientWidth,
          behavior: "smooth",
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex]);


  useEffect(() => {
  if (isHovering || isDragging) return;


  const interval = setInterval(() => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const newIndex = activeIndex + 1 >= 2 ? 0 : activeIndex + 1;


      setActiveIndex(newIndex);


      carouselRef.current.scrollTo({
        left: newIndex * clientWidth,
        behavior: "smooth",
      });
    }
  }, 4000);


  return () => clearInterval(interval);
}, [activeIndex, isHovering, isDragging]);


const handleTouchStart = (e) => {
  setTouchStartX(e.touches[0].clientX);
};


const handleTouchMove = (e) => {
  setTouchEndX(e.touches[0].clientX);
};


const handleTouchEnd = () => {
  const distance = touchStartX - touchEndX;


  if (distance > 50) {
    // swipe left
    goToSlide((activeIndex + 1) % 2);
  } else if (distance < -50) {
    // swipe right
    goToSlide((activeIndex - 1 + 2) % 2);
  }
};


useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };


  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  // Update active index quand user scroll manuellement
  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const newIndex = Math.round(scrollLeft / clientWidth);
      setActiveIndex(newIndex);
    }
  };


  // Click dots
  const goToSlide = (index) => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      carouselRef.current.scrollTo({
        left: index * clientWidth,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };


  // Drag logic
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };


  const handleMouseLeave = () => {
    setIsDragging(false);
  };


  const handleMouseUp = () => {
    setIsDragging(false);
  };


  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; // vitesse drag
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };


  return (
    <div
  className="animate-fadeSlideIn min-h-screen flex flex-col"
  style={{
    background: "var(--color-background)",
    color: "var(--color-text)",
  }}
>


{/* Carousel Section */}
<section
  className="relative h-[113vh] overflow-hidden top-3"
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
>


  <div
    ref={carouselRef}


    onScroll={handleScroll}


    // 🖱️ DESKTOP DRAG
    onMouseDown={(e) => {
      setIsDragging(true);
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setScrollLeft(carouselRef.current.scrollLeft);
    }}
    onMouseUp={() => setIsDragging(false)}
    onMouseLeave={() => setIsDragging(false)}
    onMouseMove={(e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carouselRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }}


    // 📱 MOBILE SWIPE
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}


    className="flex w-full h-full overflow-x-scroll scroll-smooth snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
  >


    {/* SLIDE 1 */}
    <div className="w-full flex-shrink-0 snap-center">
      <img
      src="/assets/background/Rectangle1.png"
        className="w-full h-full object-cover"
      />
    </div>


    {/* SLIDE 2 */}
    <div className="w-full flex-shrink-0 snap-center">
      <img
        src="/assets/background/Rectangle2.png"
        className="w-full h-full object-cover"
      />
    </div>


  </div>


  {/* DOTS */}
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
    {[0, 1].map((index) => (
      <button
        key={index}
        onClick={() => goToSlide(index)}
        className={`w-3 h-3 rounded-full transition ${
          activeIndex === index
            ? "bg-violet-600 scale-110"
            : "bg-gray-400"
        }`}
      />
    ))}
  </div>


</section>


{/* IA Search */}
<div className="flex justify-center mt-10">
  <IAsearchSection />
</div>


{/* Start diagnosis section */}
<div className="mt-10 flex flex-col items-start gap-6">


  {/* 🖼️ IMAGE فقط */}
  <h2
  className="text-[28px] font-bold translate-x-[10px]"
  style={{ color: "var(--color-text)" }}
>
  How it works
</h2>
<img
  src="/assets/background/Rectangle4.png"
  alt="diagnosis"
  className="
    w-full
    h-[450px]
    rounded-2xl
    object-cover
    object-[center_-15px]
    transition
    duration-300
    hover:scale-[1.01]
  "
/>
  {/* SVG BUTTON ONLY */}
  <button
    onClick={() => navigate("/diagnostics?start=true")}
className={`
  group
  relative
  w-[180px] sm:w-[240px]
  left-6 top-[-20px]
  transition
  duration-300
  hover:scale-105
  active:scale-95
  ${dark ? "drop-shadow-[0_0_20px_rgba(139,92,246,0.35)]" : ""}
`}
  >
    {/* SVG */}
    <img
      src="/assets/background/StartD.svg"
      alt="Start diagnosis"
      className="
        w-full
        h-auto
        drop-shadow-md
        transition
        duration-300
        group-hover:drop-shadow-[0_0_12px_rgba(139,92,246,0.7)]
      "
    />


    {/* ✨ subtle glow animation */}
    <div
      className="
        absolute inset-0
        rounded-xl
        opacity-0
        group-hover:opacity-100
        transition
        duration-300
        bg-gradient-to-r from-violet-500/20 to-purple-500/20
        blur-xl
        -z-10
      "
    />
  </button>


</div>


<div className="h-20"></div>


      {/* ════════════════════════════════════════════════
          BEST SELLERS — design identique à Section.png,
          produits 100% réels (catalogue Renyou)
      ════════════════════════════════════════════════ */}
      <section
  className="w-full rounded-2xl transition-all duration-300"
  style={{
    background: dark ? "#16202d" : "transparent",
    padding: dark ? "24px" : "0",
  }}
>
        <div className="flex items-center justify-between mb-6">
          <h2
  className="text-[28px] font-bold translate-x-[10px]"
  style={{ color: "var(--color-text)" }}
>Best Sellers</h2>
          <button
            onClick={() => navigate("/products-list")}
            className="font-semibold text-sm hover:underline underline-offset-4 transition flex items-center gap-1 group"
style={{
  color: dark ? "#fb923c" : "#f4742a",
}}
          >
            View All Products
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>


        <div
  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5"
  style={{
    borderTop: dark ? "1px solid #334155" : "none",
    paddingTop: dark ? "20px" : "0",
  }}
>
  {bestSellers.map((p) => (
<HomeProductCard
  key={p._id}
  product={p}
  navigate={navigate}
  dark={dark}
/>
  ))}
</div>
      </section>


      <div className="h-20"></div>


      {/* ═══════════════════════════════════════════════
          BANNIÈRE PROMO — design fidèle à Background1.png
          (fond mint gauche + image produits droite)
          Bouton "Shop Now" vraie navigation vers /products-list
      ═══════════════════════════════════════════════ */}
      <div className="w-full rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[200px] md:min-h-[220px]">
        {/* Côté gauche — texte sur fond mint */}
<div
  className="flex-1 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-10 md:py-12"
  style={{
    background: "var(--color-surface)",
    borderRight: dark ? "1px solid #334155" : "none",
  }}
>


  {/* Badge */}
  <div className="w-full flex justify-center ml-[-45px] mr-[12px] mt-[18px] mb-[47px]">
<span
  className="
    inline-flex items-center gap-2
    px-4 py-2
    rounded-full
    text-xs font-bold tracking-[0.2em]
    uppercase
    shadow-sm
  "
  style={{
    background: dark ? "#243041" : "#ffffff",
    color: "#f4742a",
    border: dark ? "1px solid #475569" : "1px solid #fed7aa",
  }}
>
      Limited Offer
    </span>
  </div>


  <h2
  className="text-[30px] md:text-[40px] font-black leading-tight mb-4"
  style={{
    color: "var(--color-text)",
  }}
>
    Get 20% Off Your First Order
  </h2>


  <p
  className="text-base mb-8 max-w-xl"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
    Use code{" "}
    <span className="text-[#f4742a] font-bold tracking-wide">HEALTH20</span>{" "}
    at checkout. Valid for new customers only.
  </p>


  <button
    onClick={() => navigate("/products-list")}
    className="
      self-start flex items-center gap-2
      bg-[#f4742a] hover:bg-[#e06520]
      text-white font-bold
      px-7 py-3 rounded-xl
      transition-all duration-200
      hover:scale-105 active:scale-95
      shadow-md hover:shadow-lg hover:shadow-orange-200
    "
  >
    Shop Now
  </button>


</div>


        {/* Côté droit — image produits sur fond teal (identique à Background1.png) */}
        <div
  className="flex-1 overflow-hidden flex items-center justify-center min-h-[180px] md:min-h-0"
  style={{
    background: dark ? "#243041" : "#5ba89e",
  }}
>
          <img
            src="/assets/background/Background1.png"
            alt="Renyou Health Products"
            className="w-full h-full object-cover object-left"
            style={{ objectPosition: "right center" }}
          />
        </div>
      </div>


      <div className="h-20"></div>


      {/* ════════════════════════════════════════════════
          NEW ARRIVALS — design identique à Section1.png,
          produits 100% réels (catalogue Renyou)
      ════════════════════════════════════════════════ */}
      <section
  className="w-full rounded-2xl transition-all duration-300"
  style={{
    background: dark ? "#16202d" : "transparent",
    padding: dark ? "24px" : "0",
  }}
>
        <div className="flex items-center justify-between mb-6">
          <h2
  className="text-[28px] font-bold translate-x-[10px]"
  style={{ color: "var(--color-text)" }}
>New Arrivals</h2>
<button
  onClick={() => navigate("/products-list")}
  className="font-semibold text-sm hover:underline underline-offset-4 transition flex items-center gap-1 group"
  style={{
    color: dark ? "#fb923c" : "#f4742a",
  }}
>
  Shop now
  <span className="transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
</button>
        </div>


<div
  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5"
  style={{
    borderTop: dark ? "1px solid #334155" : "none",
    paddingTop: dark ? "20px" : "0",
  }}
>
  {newArrivals.map((p) => (
    <HomeProductCard
      key={p._id}
      product={p}
      navigate={navigate}
      badge="NEW ARRIVAL"
      dark={dark}
    />
  ))}
</div>
      </section>


      <div className="h-20"></div>


      {/* ════════════════════════════════════════════════
          NOS MARQUES — design fidèle à Container.png
          logos originaux avec polices et couleurs fabricant
      ════════════════════════════════════════════════ */}
      <section
  className="w-full rounded-2xl transition-all duration-300"
style={{
  background: dark ? "#111827" : "#ffffff",
  padding: "24px",
  border: `1px solid ${dark ? "#334155" : "#E5E7EB"}`,
}}
>
        <h2
  className="text-[28px] font-bold translate-x-[10px] translate-y-[-12px]"
  style={{ color: "var(--color-text)" }}
>Nos marques</h2>


        <div
  className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar pb-2"
style={{
  borderTop: `1px solid ${dark ? "#334155" : "#E5E7EB"}`,
  borderBottom: `1px solid ${dark ? "#334155" : "#E5E7EB"}`,
  paddingTop: "12px",
  paddingBottom: "12px",
}}
>
          {BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/products-list?brand=${b.id}&page=1`)}
              title={b.name}
className="
  flex-shrink-0
  flex items-center justify-center
  h-52 px-6
  rounded-2xl
  transition-all
  duration-300
  hover:scale-105
  cursor-pointer
"
style={{
  background: dark ? "#1B2433" : "transparent",
  border: dark ? "1px solid #334155" : "1px solid transparent",
  opacity: dark ? 0.9 : 0.6,
}}
onMouseEnter={(e) => {
  e.currentTarget.style.opacity = "1";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.opacity = dark ? "0.9" : "0.6";
}}
            >
              <BrandLogo
  id={b.slug}
  size="md"
  dark={dark}
/>
            </button>
          ))}
        </div>
        
      </section>


      <div className="h-10"></div>
      {/* ════════════════════════════════════════════════
          WHAT OUR CUSTOMERS SAY
          Titre fixe + défilement horizontal infini (générique)
          Design fidèle à Group3599.png (fond rose poudré)
      ════════════════════════════════════════════════ */}
      <section
        className="w-full rounded-2xl overflow-hidden py-14"
        style={{
background: dark
  ? "#1b2433"
  : "linear-gradient(135deg,#fde8e0 0%,#fef0ea 50%,#fde8e0 100%)"
}}
      >
        {/* Titre fixe */}
        <h2
          className="text-center text-[32px] md:text-[42px] font-black text-[#0f1b3d] mb-12 px-6"
          style={{
color:"var(--color-text)"
}}
        >
          What Our Customers Say
        </h2>


        {/* Track animé — inject keyframes via style tag */}
        <style>{`
          @keyframes marqueeX {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marqueeX 32s linear infinite;
          }
          .marquee-track:hover { animation-play-state: paused; }
        `}</style>


        <div className="overflow-hidden w-full">
          <div className="marquee-track">
            {/* 2× les cards (seamless loop) */}
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[320px] mx-3 rounded-2xl p-6 shadow-sm ${
  dark
    ? "bg-[#243041] border border-slate-700"
    : "bg-white"
}`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s < r.rating ? "#f4742a" : "#E5E7EB"}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>


                {/* Review text */}
                <p
  className="text-sm leading-relaxed mb-5 line-clamp-4"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
                  "{r.text}"
                </p>


                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: r.color }}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <div
  className="text-sm font-bold"
  style={{
    color: "var(--color-text)",
  }}
>{r.name}</div>
                    <div
  className="text-[11px]"
  style={{
    color: "var(--color-text-secondary)",
  }}
>{r.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="h-20"></div>
<div
  className="rounded-2xl overflow-hidden"
  style={{
    border: dark ? "1px solid #334155" : "none",
  }}
>
  <img
    src={
      dark
        ? "/assets/background/Overlay-dark.png"
        : "/assets/background/Overlay.png"
    }
    alt="Overlay"
    className="w-full cursor-pointer transition-all duration-300"
  />
</div>
      <div className="h-20"></div>


      <Footer />




{/* ✅ AI SYSTEM GLOBAL (OUTSIDE NAVBAR) */}


{aiOpen && (
  <AIPopup setAiOpen={setAiOpen} isMinimized={isMinimized}>


    {/* POPUP */}
    <div
      className={`
        fixed
        z-[10000]
        ${dark
  ? "bg-[#1b2433] border border-slate-700"
  : "bg-white border border-gray-300"} rounded-lg flex flex-col


        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]


        ${isMobile ? "w-[100%] h-[100%] top-0 left-0 rounded-none" : ""}
        ${!isMobile && isMaximized ? "w-[95%] h-[95%] top-[2.5%] left-[2.5%]" : ""}
        ${!isMinimized && !isMaximized ? "w-[420px] h-[520px] bottom-[20px] right-[20px]" : ""}


        ${fromMini ? "animate-fromBubbleSmooth origin-bottom-right" : ""}
        ${toMini ? "animate-toBubbleSmooth origin-bottom-right" : ""}


        ${isMinimized && !toMini ? "hidden" : ""}


        shadow-2xl
      `}
    >


      {/* HEADER */}
      <div
            className={`flex items-center bg-[#ECE4FF] h-[35px] px-2 relative ${!isMobile ? "cursor-move" : ""}`}
    >


        {!isMinimized && (
          <span
            className="absolute left-1/2 -translate-x-1/2 font-semibold tracking-wide animate-violetGlowSoft transition-all duration-500"
          >
            Renyou Ai toujours prêt à répondre.
          </span>
        )}


        {/* MINIMIZE */}
        <button
          onClick={() => {
            setToMini(true);
            setTimeout(() => {
              setIsMinimized(true);
              setIsMaximized(false);
              setToMini(false);
            }, 500);
          }}
        >
          -
        </button>


        {/* MAXIMIZE */}
        <button
          onClick={() => {
            setIsMaximized(prev => !prev);
            setIsMinimized(false);
          }}
          className="absolute right-[40px]"
        >
          {isMaximized ? "🗗" : "🗖"}
        </button>


        {/* CLOSE */}
        <button
          onClick={() => setAiOpen(false)}
          className="absolute right-[10px]"
        >
          🗙
        </button>


      </div>


      {/* CHAT */}
      {!isMinimized && (
        <div
  className="flex-1 overflow-y-auto p-3"
  style={{
    background: dark ? "#243041" : "#f9fafb",
    color: "var(--color-text)",
  }}
>
          CHAT HERE
        </div>
      )}


    </div>


  </AIPopup>
)}


{/* ✅ BUBBLE FIXED PERFECT */}
{aiOpen && isMinimized && (
  <div
    onClick={() => {
      setFromMini(true);
      setIsMinimized(false);
      setTimeout(() => setFromMini(false), 500);
    }}
className={`
  fixed
  bottom-[80px]
  right-[20px]

  w-[60px] h-[60px]

  z-[11000]

  ${
    dark ? "bg-[#243041]" : "bg-[#ECE4FF]"
  }

  rounded-full
  flex items-center justify-center

  shadow-[0_10px_30px_rgba(0,0,0,0.25)]
  backdrop-blur-md

  animate-bubbleIn
  hover:scale-110
  transition
  cursor-pointer
`}
  >
    🤖
  </div>
)}


    </div>
  );
}