import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AIPopup from "../components/AIPopup";
import { api } from "../services/api.js";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Mic,
  X,
  User,
  Tags,
  Building2,
  History,
  TrendingUp,
    Smile,
  Ghost,
  Bot,
  Crown,
  Cat,
  Dog,
  Bird,
  Fish,
  Rabbit,
  Flower2,
  Leaf,
  Star,
  Gem,
  Flame,
  MoonStar,
  Heart,
  Sparkles,
  Zap,
  Sun,
  Moon
} from "lucide-react";
import Price from "@shared/currency/Price";
import { useThemeValue } from "@shared/theme";
import Logo from "../assets/background/RenyouShop.svg?react";

export default function Navbar({
  
  setAiOpen,
  setPopupPosition,
  setIsMinimized,
  setIsMaximized,
  aiOpen
}) {
  
const navigate = useNavigate();
const { user } = useAuth();

const AVATAR_ICONS = {
  smile: Smile,
  ghost: Ghost,
  bot: Bot,
  crown: Crown,
  cat: Cat,
  dog: Dog,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
  flower: Flower2,
  leaf: Leaf,
  star: Star,
  gem: Gem,
  flame: Flame,
  moon: MoonStar,
  heart: Heart,
  sparkles: Sparkles,
  zap: Zap,
};

const AvatarIcon =
  AVATAR_ICONS[user?.avatar] || Ghost;

const getUserInitial = () => {
  try {
    const raw = localStorage.getItem("user");

    if (!raw || raw === "undefined" || raw === "null") {
      return "A";
    }

    const user = JSON.parse(raw);

    return (
      user?.username?.charAt(0)?.toUpperCase() ||
      user?.email?.charAt(0)?.toUpperCase() ||
      "A"
    );
  } catch (err) {
    console.error("Invalid user in localStorage:", err);
    return "A";
  }
};

const [isLoggedIn, setIsLoggedIn] = useState(false);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setIsLoggedIn(false);

  navigate("/login");
};

  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false); // toggle input
  
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  
  const searchRef = useRef(null); // ref lel box
  const [showAIWindow, setShowAIWindow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState(""); // progressive typing
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState("");
  const [lastAction, setLastAction] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [fromMini, setFromMini] = useState(false);
  const [toMini, setToMini] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const itemRefs = useRef([]);
  const { theme, setAppTheme, restoreTheme } = useThemeValue();
  const dark = theme.mode === "dark";
  console.log(theme);
  console.log(document.documentElement.dataset.theme);
console.log(theme.mode);
console.log(dark);
console.log(
  getComputedStyle(document.documentElement)
    .getPropertyValue("--color-text")
);
  useEffect(() => {
  console.log("Theme changed:", theme);
}, [theme]);

  const [recentSearches, setRecentSearches] = useState(() => {
  return JSON.parse(localStorage.getItem("recentSearches")) || [];
});
const saveSearch = (term) => {
  if (!term.trim()) return;

  const updated = [
    term,
    ...recentSearches.filter((s) => s !== term),
  ].slice(0, 5);

  setRecentSearches(updated);

  localStorage.setItem(
    "recentSearches",
    JSON.stringify(updated)
  );
};

const popularSearches = [
  "Cerave",
  "La Roche Posay",
  "Hair Oil",
  "Vitamin C",
  "Sunscreen"
];

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const startVoiceSearch = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice search is not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "fr-FR";
  recognition.start();

  setIsListening(true);

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    setSearchValue(transcript);
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };
};
  
  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchValue);
  }, 150);

  return () => clearTimeout(timer);
}, [searchValue]);

useEffect(() => {
  if (showSearchModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [showSearchModal]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, displayedText]);
  
  // click user
const handleUserClick = () => {
  setShowUserMenu((prev) => !prev);

  window.dispatchEvent(new Event("closeAdminMenu"));
};

useEffect(() => {
  const handleClose = () => setShowUserMenu(false);

  window.addEventListener("closeUserMenu", handleClose);

  return () => {
    window.removeEventListener("closeUserMenu", handleClose);
  };
}, []);

useEffect(() => {
const handleClickOutside = (e) => {
  if (!userMenuRef.current?.contains(e.target)) {
    setShowUserMenu(false);
  }
};

document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

useEffect(() => {
  const checkAuth = () => {
    setIsLoggedIn(
      !!localStorage.getItem("token") || !!localStorage.getItem("user")
    );
  };

  checkAuth();

  window.addEventListener("storage", checkAuth);

  return () => window.removeEventListener("storage", checkAuth);
}, []);

// close AI with ESC
useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setAiOpen(false);
    }
  };

  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, []);

// ✅ Smartphone auto-detection
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setIsMaximized(true); // mobile → fullscreen
    } else {
      setIsMobile(false);
      setIsMaximized(false); // desktop normal
    }
  };

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  // ✅ Bouton agrandir toggle
  const handleToggleMaximize = () => {
    setIsMaximized((prev) => !prev);
    setIsMinimized(false); // annuler minimisé si agrandi
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      setMessages([...messages, { sender: "human", text: inputValue }]);
      setInputValue("");
      setIsTyping(true);

      // Simuler typing dots
      setTimeout(() => {
        setIsTyping(false);

        const fullText = "Renyou Ai is generating a smart reply...";
        let index = -1;

        const interval = setInterval(() => {
          setDisplayedText((prev) => prev + fullText[index]);
          index++;
          if (index === fullText.length) {
            clearInterval(interval);
            setMessages((prev) => [
              ...prev,
              { sender: "ai", text: fullText },
            ]);
            setDisplayedText(""); // reset
          }
        }, 50); // vitesse d’écriture (50ms par caractère)
      }, 2200);
    }
  };

  const handleKeyDown = (e) => {
  if (!showSuggestions || suggestions.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    setSelectedIndex((prev) =>
      prev < suggestions.length - 1 ? prev + 1 : 0
    );
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    setSelectedIndex((prev) =>
      prev > 0 ? prev - 1 : allItems.length - 1
    );
  }

  if (e.key === "Enter") {
    saveSearch(searchValue);
    e.preventDefault();

    if (selectedIndex >= 0) {
      navigate(`/products/${suggestions[selectedIndex]._id}`);
      setShowSuggestions(false);
      setShowSearchBox(false);
      return;
    }

    navigate(
      `/products-list?query=${encodeURIComponent(searchValue)}`
    );
  }
};

  // ✅ auto-close bel click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
  const checkLogin = () => {
    const logged =
      !!localStorage.getItem("token") ||
      !!localStorage.getItem("user");

    setIsLoggedIn(logged);
  };

  checkLogin();

  window.addEventListener("storage", checkLogin);

  return () => window.removeEventListener("storage", checkLogin);
}, []);

useEffect(() => {
}, [recentSearches]);

useEffect(() => {
  const timer = setTimeout(async () => {

    if (debouncedSearch.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsSearching(true);

      const data = await api.getPublicProducts({
        search: debouncedSearch,
        limit: 5,
      });

      const products = Array.isArray(data)
        ? data
        : data.products || [];

      setSuggestions(products.slice(0, 5));
const categories = [
  ...new Map(
    products
      .filter((p) => p.category)
      .map((p) => [p.category._id, p.category])
  ).values(),
];

const brands = [
  ...new Map(
    products
      .filter((p) => p.brand)
      .map((p) => [p.brand._id, p.brand])
  ).values(),
];

const uniqueCategories = [
  ...new Map(
    categories.map((c) => [c._id, c])
  ).values(),
];


if (uniqueCategories.length > 0) {
  setCategorySuggestions(uniqueCategories);
}

if (brands.length > 0) {
  setBrandSuggestions(brands);
}

      setShowSuggestions(true);
      setIsSearching(false);

    } catch (err) {
      console.error(err);
      setSuggestions([]);
      setIsSearching(false);
    }

  }, 150);

  return () => clearTimeout(timer);
}, [debouncedSearch]);

  return (
      
    <div
  style={{
    backgroundColor: theme.colors.background,
  }}
>

  <header
  className="border shadow-md relative h-[80px]"
  style={{
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  }}
>

        {/* Logo Renyou Shop */}
<div
  onClick={() => navigate("/")}
  className="absolute top-[6px] left-[20px] cursor-pointer transition duration-500 hover:scale-105 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
>
<Logo
  className="w-[190px] h-[60px]"
  style={{
    color: "var(--color-text)",
  }}
/>
</div>

{/* ================= Theme Toggle ================= */}

<div
  style={{
    position: "absolute",

    /* ===== Position ===== */
    top: "2px",      // ▲ up / down
    left: "231px",    // ◀ right / left

    /* Ken t7eb testa3mel right 3oud baddel left b right */
    // right: "40px",

    zIndex: 50,
  }}
>
  <button
    onClick={() =>
      setAppTheme({
        mode: dark ? "light" : "dark",
      })
    }
    className="theme-toggle relative overflow-hidden flex flex-col items-center justify-between"

    style={{
      /* ===========================
         Taille (100% controllable)
      ============================ */

      width: "44px",
      height: "75px",

      borderRadius: "999px",
      padding: "6px",

      border: "1px solid var(--color-border)",

      background: dark
        ? "linear-gradient(180deg,#1F2937,#111827)"
        : "linear-gradient(180deg,#FFFFFF,#EEF2F7)",

      transition: ".45s",
    }}
  >
    {/* Shine */}
    <span className="theme-toggle-shine" />

    {/* Slider */}
    <div
      style={{
        position: "absolute",

        left: "50%",
        transform: "translateX(-50%)",

        width: "34px",
        height: "34px",

        borderRadius: "999px",

        top: dark ? "48px" : "4px",

        background: dark
          ? "linear-gradient(145deg,#374151,#111827)"
          : "linear-gradient(145deg,#ffffff,#f3f4f6)",

        boxShadow:
          "0 10px 22px rgba(0,0,0,.18), inset 0 1px 1px rgba(255,255,255,.55)",

        transition:
          "top .45s cubic-bezier(.22,1,.36,1)",

        pointerEvents: "none",

        zIndex: 0,
      }}
    />

    {/* SUN */}
    <div
      className="theme-icon-wrapper"
      style={{

        zIndex: 2,
      }}
    >
      <Sun
        size={17}
        className="theme-icon-sun"
      />
    </div>

    {/* MOON */}
    <div
      className=""
      style={{
        opacity: dark ? 1 : .45,
        zIndex: 2,
      }}
    >
      <Moon
        size={17}
        className="theme-icon-moon"
      />
    </div>
  </button>
</div>

        {/* Skincare button */}
        <div
          onClick={() => navigate("/products-list?category=6a0afd3ea9a8b0cfea193cf7&page=1")}
          className="absolute top-[18px] left-[290px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal" style={{ color: theme.colors.text }}>
            Skincare
          </span>
        </div>

        {/* Haircare button */}
        <div
          onClick={() => navigate("/products-list?page=1&category=6a0afd3ea9a8b0cfea193cfa")}
          className="absolute top-[18px] left-[425px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal" style={{ color: theme.colors.text }}>
            Haircare
          </span>
        </div>

        {/* Bodycare button */}
        <div
          onClick={() => navigate("/products-list?page=1&category=6a0afd3ea9a8b0cfea193cfc")}
          className="absolute top-[18px] left-[560px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal" style={{ color: theme.colors.text }}>
            Bodycare
          </span>
        </div>

        {/* Brands button */}
        <div
          onClick={() => navigate("/brands")}
          className="absolute top-[18px] left-[705px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal" style={{ color: theme.colors.text }}>
            Brands
          </span>
        </div>

        {/* Offers button */}
        <div
          onClick={() => navigate("/offers")}
          className="absolute top-[18px] left-[810px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal" style={{ color: theme.colors.text }}>
            Offers
          </span>
        </div>

        {/* Learn button */}
        <div
          onClick={() => navigate("/agreements")}
          className="absolute top-[18px] left-[910px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal" style={{ color: theme.colors.text }}>
            Learn
          </span>
        </div>

{/* Renyou AI button */}
<div
onClick={(e) => {
  if (!setPopupPosition) return;

  const rect = e.currentTarget.getBoundingClientRect();

  if (!aiOpen) {
    setPopupPosition({
      x: Math.min(rect.left, window.innerWidth - 450),
      y: rect.bottom - 15,
    });
  }

  setIsMinimized(false); // 🔥 يخرج من bubble
  setAiOpen(true);       // 🔥 يفتح popup
}}
  className="absolute top-[15px] left-[970px] cursor-pointer transition duration-500 hover:scale-105 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
>
  <img
    src="/assets/background/RenyouAi.svg"
    alt="Renyou AI"
    className="w-[260px] h-[44px] object-contain"
  />
</div>

{/* Search button + input toggle */}
<div
  ref={searchRef}
  className="absolute top-[18px] left-[1187px]"
>
  {/* Logo search (NO animation change) */}
  <div
    onClick={() => setShowSearchModal(true)} // toggle input
    className="cursor-pointer transition duration-500 hover:scale-90 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
  >
    <img
      src="/assets/background/Search.svg"
      alt="Search"
      className="w-[35px] h-[35px] object-contain transition-transform duration-300 hover:scale-125 hover:opacity-80 transform origin-center"
    />
  </div>

  {/* Input box contrôlée séparément */}
  {showSearchBox && (
  <div
    className="
      absolute
      top-[45px]
      right-0
      animate-searchBoxIn
      z-[99999]
    "
  >

<svg
  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  viewBox="0 0 24 24"
>
  <path d="M21 21l-4.35-4.35" />
  <circle cx="11" cy="11" r="6" />
</svg>

      <input
        type="text"
        value={searchValue}
        onChange={(e) => {
  setSearchValue(e.target.value);
  setSelectedIndex(-1);
}}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="
w-[320px]
h-[44px]

rounded-2xl
border

bg-white/95
backdrop-blur-md

pl-11
pr-10

text-sm
font-medium
text-gray-700

placeholder:text-gray-400

shadow-xl
shadow-violet-100/50

outline-none
focus:ring-4
focus:ring-violet-200
focus:border-violet-400

transition-all
duration-300
"
  style={{
    backgroundColor: theme.colors.surface,
    color: 	"var(--color-text)",
    borderColor: theme.colors.border,
  }}
      />

{searchValue.trim() === "" && (
  <div
    className="
      absolute
      top-[45px]
      right-0
      w-[320px]
      rounded-2xl
      shadow-2xl
      border
      p-4
      z-[99999]
    "
    style={{
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    }}
  >
    {/* Recent Searches */}
    {recentSearches.length > 0 && (
      <>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-gray-400">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
  <History size={16} />
  <span>Recent Searches</span>
</div>
          </div>

          <button
            onClick={() => {
              setRecentSearches([]);
              localStorage.removeItem("recentSearches");
            }}
            className="
              text-[11px]
              text-red-500
              hover:text-red-600
              font-medium
            "
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {recentSearches.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => setSearchValue(item)}
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-violet-100
                  text-violet-700
                  text-xs
                  hover:bg-violet-200
                "
              >
                <div className="flex items-center gap-1">
  <History size={12} />
  <span>{item}</span>
</div>
              </button>

              <button
                onClick={() => {
                  const updated = recentSearches.filter(
                    (search) => search !== item
                  );

                  setRecentSearches(updated);

                  localStorage.setItem(
                    "recentSearches",
                    JSON.stringify(updated)
                  );
                }}
                className="text-red-500 text-xs"
              >
                <X
  size={18}
  strokeWidth={2.5}
/>
              </button>
            </div>
          ))}
        </div>
      </>
    )}

    {/* Trending Searches */}
    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3">
  <TrendingUp size={16} />
  <span>Trending Searches</span>
</div>

       {/* Recent Searches */}
    <div className="flex flex-wrap gap-2">
      {popularSearches.map((item) => (
        <button
          key={item}
          onClick={() => setSearchValue(item)}
          className="
            px-3
            py-1
            rounded-full
            bg-orange-100
            text-orange-700
            text-xs
            hover:bg-orange-200
            transition-all
          "
        >
          {item}
        </button>
      ))}
    </div>
 
</div>

)}
{showSuggestions && searchValue.trim().length > 0 && (
  <div
    className="
      absolute
      top-[45px]
      right-0
      w-[320px]
      rounded-2xl
      shadow-2xl
      border
      overflow-hidden
      z-[99999]
    "
    style={{
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    }}
  >
    {isSearching && (
  <div className="px-4 py-4 flex items-center gap-3">
    <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>

    <span className="text-sm text-gray-500">
      Searching products...
    </span>
  </div>
)}

  {!isSearching && suggestions.length === 0 && searchValue.trim().length > 1 && (
  <div className="px-4 py-6 text-center">
    <div className="text-gray-400 text-sm">
      No products found
    </div>
  </div>
)}

    {suggestions.map((product, index) => (
  <div
    key={product._id}
    onClick={() => {
      navigate(`/products/${product._id}`);
      setShowSuggestions(false);
      setShowSearchBox(false);
      setSearchValue("");
    }}
    className={`
  group
  flex
  items-center
  gap-3
  px-4
  py-3
  cursor-pointer
  transition-all
  duration-300
  border-b

  ${
    selectedIndex === index
      ? "bg-violet-100"
      : "hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50"
  }
`}
style={{
  borderColor: theme.colors.border,
}}
  >
    <div className="relative">
  <div className="relative">
  <div className="relative">
  <img
    src={
      product.images?.[0] ||
      product.image ||
      "/assets/background/no-image.png"
    }
    alt={product.name}
    className="
      w-14
      h-14
      rounded-xl
      object-cover
      border
    "
    style={{
  borderColor: theme.colors.border,
}}
  />

  {product.discountPercentage > 0 && (
    <div
      className="
        absolute
        -top-1
        -right-1
        bg-red-500
        text-white
        text-[10px]
        px-1.5
        py-0.5
        rounded-full
        font-bold
        shadow-md
      "
    >
      -{product.discountPercentage}%
    </div>
  )}
</div>

  {product.discountPercentage > 0 && (
    <div
      className="
        absolute
        -top-1
        -right-1
        bg-red-500
        text-white
        text-[10px]
        px-1.5
        py-0.5
        rounded-full
        font-bold
        shadow-md
      "
    >
      -{product.discountPercentage}%
    </div>
  )}
</div>

  {product.discountPercentage > 0 && (
    <div
      className="
        absolute
        -top-1
        -right-1
        bg-red-500
        text-white
        text-[10px]
        px-1.5
        py-0.5
        rounded-full
        font-bold
      "
    >
      -{product.discountPercentage}%
    </div>
  )}
</div>

    <div className="flex-1 min-w-0">
  <div
    className="
      font-semibold
      text-gray-800
      truncate
      group-hover:text-violet-700
    "
  >
    {product.name}
  </div>

  <div className="flex items-center gap-2 mt-1">
    <span
      className="
        px-2
        py-[2px]
        text-[10px]
        rounded-full
        bg-violet-100
        text-violet-700
        font-medium
      "
    >
      {product.brand?.name || "Brand"}
    </span>

    <span className="text-xs text-gray-500">
      {product.category?.name || ""}
    </span>
  </div>

  <div className="flex items-center gap-1 mt-1">
  <span className="text-yellow-500">⭐</span>

  <span className="text-xs text-gray-600">
    {product.rating}
  </span>

  <span className="text-xs text-gray-400">
    ({product.reviewCount})
  </span>
</div>

<div className="mt-1">
  {product.stockStatus === "IN_STOCK" ? (
    <span className="text-[11px] text-green-600 font-medium">
      🟢 In Stock
    </span>
  ) : product.stock > 0 ? (
    <span className="text-[11px] text-orange-500 font-medium">
       ⚠️ Low Stock
    </span>
  ) : (
    <span className="text-[11px] text-red-500 font-medium">
      🔴 Out of Stock
    </span>
  )}
</div>
</div>

<div className="text-right">
  <div className="font-bold text-violet-600">
  <Price value={product.finalPrice ?? product.price} />
</div>

{product.discountPercentage > 0 && (
  <div className="text-[11px] text-gray-400 line-through">
    <Price value={product.price} />
  </div>
  )}
</div>
</div>
))}

{categorySuggestions.length > 0 && (
  <div
  className="border-t p-3"
  style={{
    borderColor: theme.colors.border,
  }}
>
    <div className="text-xs font-bold text-gray-400 mb-2">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-2">
  <Tags size={16} />
  <span>Categories</span>
</div>
    </div>

    {categorySuggestions.map((category) => (
  <button
  key={category._id}
  onClick={() => {
    navigate(`/products-list?category=${category._id}`);

    setShowSuggestions(false);
    setShowSearchBox(false);
  }}
  className="
    block
    w-full
    text-left
    py-1
    text-sm
    text-gray-700
    hover:text-violet-600
    hover:bg-violet-50
    rounded-lg
    px-2
    transition-all
    duration-200
  "
>
  
 {category.name}

</button>
))}
  </div>
)}

{brandSuggestions.length > 0 && (
  <div
  className="border-t p-3"
  style={{
    borderColor: theme.colors.border,
  }}
>
    <div className="text-xs font-bold text-gray-400 mb-2">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-2">
  <Building2 size={16} />
  <span>Brands</span>
</div>
    </div>

    {brandSuggestions.map((brand) => (
  <button
    key={brand._id}
    onClick={() => {
      navigate(`/products-list?brand=${brand._id}`);

      setShowSuggestions(false);
      setShowSearchBox(false);
    }}
    className="
      block
      w-full
      text-left
      py-1
      px-2
      text-sm
      text-gray-700
      hover:text-violet-600
      hover:bg-violet-50
      rounded-lg
      transition-all
      duration-200
    "
  >
     {brand.name}
  </button>
))}
  </div>
)}

    <button
  onClick={() => {
    saveSearch(searchValue);
    navigate(
      `/products-list?query=${encodeURIComponent(searchValue)}`
    );
    setShowSuggestions(false);
  }}
  className="
    w-full
    py-3
    px-4
    text-violet-600
    font-semibold
    hover:bg-violet-50
    border-t
    transition-all
    duration-300
  "
  style={{
  borderColor: theme.colors.border,
}}
>
  🔎 View all {suggestions.length} results for "{searchValue}"
</button>
  </div>
)}

<button
  onClick={startVoiceSearch}
  className="
    absolute
    right-10
    top-1/2
    -translate-y-1/2
    text-gray-400
    hover:text-violet-600
  "
>
  {isListening ? "🔴" : "🎤"}
</button>

      {searchValue.trim() !== "" && (
<button
  onClick={() => setSearchValue("")}
  className="
    absolute
    right-4
    top-1/2
    -translate-y-1/2
    transition-all
    duration-200
  "
  style={{
  color: "var(--color-text-secondary)",
}}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = "#ef4444";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = theme.colors.textSecondary;
  }}
>
  <X
    size={18}
    strokeWidth={2.5}
  />
</button>
      )}
    </div>
  )}
</div>


        {/* Cart button */}
        <div
          onClick={() => navigate("/user/cart")}
          className="absolute top-[18px] left-[1237px] cursor-pointer transition duration-500 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <img
            src="/assets/background/Cart.svg"
            alt="Cart"
            className="w-[35px] h-[35px] object-contain"
          />
        </div>

        {/* User button + dropdown */}
<div
  ref={userMenuRef}
  className="absolute top-[16px] left-[1285px]"
>
  {/* Icon */}
  <div
    onClick={handleUserClick}
    className="cursor-pointer transition duration-500 hover:scale-100 hover:opacity-80 active:scale-95 p-1 rounded"
  >
<div
  onClick={(e) => {
    e.stopPropagation();
    handleUserClick();
  }}
  className="cursor-pointer p-1"
>
  {isLoggedIn ? (
    // ✅ Avatar (logged in)
<div
  className="
    w-9 h-9 rounded-full flex items-center justify-center
    bg-gradient-to-tr from-violet-500 to-purple-400
    text-white
    transition duration-300 hover:scale-110 relative
  "
>
  <AvatarIcon size={18} strokeWidth={2.3} />

<span
  className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 rounded-full"
  style={{
    borderColor: "var(--color-surface)",
  }}
></span>
</div>
  ) : (
    // ❌ Not logged → default icon
<User
  size={35}
  strokeWidth={2}
  style={{
    color: "var(--color-text)",
  }}
  className="transition duration-500 hover:scale-95 hover:opacity-80"
/>
  )}
  </div>
</div>

  {/* Dropdown */}
{showUserMenu && (
  <div
    className="absolute right-0 mt-3 w-36 z-[99999] pointer-events-auto backdrop-blur-xl shadow-[0_20px_60px_rgba(139,92,246,0.15)] rounded-3xl border overflow-hidden animate-fadeIn"
style={{
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border)",
  color: "var(--color-text)",
  boxShadow: dark
  ? "0 20px 60px rgba(0,0,0,.45)"
  : "0 20px 60px rgba(139,92,246,.15)",
}}
    onClick={(e) => e.stopPropagation()}
  >

{isLoggedIn ? (
  <>
{/* PROFILE */}
<button
  onClick={() => {
    setShowUserMenu(false);
    navigate("/user/profile");
  }}
  className="user-menu-item"
>
  <svg
    className="w-5 h-5 transition"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>

  <span className="font-medium">
    Profile
  </span>
</button>

    {/* ORDERS */}

<button
  onClick={() => {
    setShowUserMenu(false);
    navigate("/user/orders");
  }}
  className="user-menu-item"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M3 7h18M3 12h18M3 17h18" />
  </svg>

  <span className="font-medium">
    Orders
  </span>
</button>

    {/* SETTINGS */}

<button
  onClick={() => {
    setShowUserMenu(false);
    navigate("/user/settings");
  }}
  className="user-menu-item"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M10.325 4.317a1 1 0 011.35-.447l1.5.75a1 1 0 01.447 1.35l-.3.6a7.97 7.97 0 012.1 2.1l.6-.3a1 1 0 011.35.447l.75 1.5a1 1 0 01-.447 1.35l-.6.3a7.97 7.97 0 010 3.6l.6.3a1 1 0 01.447 1.35l-.75 1.5a1 1 0 01-1.35.447l-.6-.3a7.97 7.97 0 01-2.1 2.1l.3.6a1 1 0 01-.447 1.35l-1.5.75a1 1 0 01-1.35-.447l-.3-.6a7.97 7.97 0 01-3.6 0l-.3.6a1 1 0 01-1.35.447l-1.5-.75a1 1 0 01-.447-1.35l.3-.6a7.97 7.97 0 01-2.1-2.1l-.6.3a1 1 0 01-1.35-.447l-.75-1.5a1 1 0 01.447-1.35l.6-.3a7.97 7.97 0 010-3.6l-.6-.3a1 1 0 01-.447-1.35l.75-1.5a1 1 0 011.35-.447l.6.3a7.97 7.97 0 012.1-2.1l-.3-.6z" />
  </svg>

  <span className="font-medium">
    Settings
  </span>
</button>

    {/* DIVIDER */}
<div
  className="h-px mx-2"
  style={{
    backgroundColor: "var(--color-border)",
  }}
></div>

    {/* LOGOUT */}

<button
  onClick={() => {
    setShowUserMenu(false);
    handleLogout();
  }}
  className="user-menu-item user-menu-item-danger"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
  </svg>

  <span className="font-medium">
    Logout
  </span>
</button>
  </>
) : (

  <>
    {/* Login */}

<button
  onClick={() => {
    setShowUserMenu(false);
    navigate("/login");
  }}
  className="user-menu-item"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M15 12H3m0 0l4-4m-4 4l4 4m6-12h6v16h-6" />
  </svg>

  <span className="font-medium">
    Login
  </span>
</button>

    {/* Divider */}
<div
  className="h-px mx-2"
  style={{
    backgroundColor: "var(--color-border)",
  }}
></div>

    {/* Sign Up */}

<button
  onClick={() => {
    setShowUserMenu(false);
    navigate("/register");
  }}
  className="user-menu-item"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M12 4v16m8-8H4" />
  </svg>

  <span className="font-medium">
    Sign Up
  </span>
</button>
  </>
)}
  </div>
)}
</div>

        {/* Popup animated si input vide */}
        {showPopup && (
          <div
            className="
              absolute 
              top-[72px] left-[60%] -translate-x-8 
              w-[215px] h-[25px] 
              bg-red-500 text-white 
              px-1 py-3 
              rounded-lg shadow-lg 
              flex items-center justify-center
              bounce-custom
            "
          >
            Please enter a search term
          </div>
        )}

        {showSearchModal && (
  <div
  onClick={() => setShowSearchModal(false)}
    className="
      fixed
      inset-0
      bg-black/40
      backdrop-blur-sm
      z-[999999]
      flex
      justify-center
      items-start
      pt-20
    "
  >
    <div
    
onClick={(e) => e.stopPropagation()}
  className="
    max-h-[80vh]

    overflow-y-auto
    overflow-x-auto
    custom-scrollbar
    rounded-2xl
    pr-4
    pl-4
    py-4
    overscroll-contain
  "
  style={{
  backgroundColor: theme.colors.surface,
  color: 	"var(--color-text)",
}}
>
      <button
        onClick={() => setShowSearchModal(false)}
        className="float-right text-xl"
      >
        <X
  size={18}
  strokeWidth={2.5}
/>
      </button>

      <div className="mb-5 flex items-center gap-3">
<div
  className="p-2 rounded-xl transition-colors duration-300"
  style={{
    backgroundColor: "var(--color-surface-hover)",
  }}
>
  <Search
    size={18}
    style={{
      color: "var(--primary-color)",
    }}
  />
</div>

  <div>
    <h2
  className="text-lg font-semibold"
  style={{
  color: "var(--color-text)",
}}
>
      Search Center
    </h2>

    <p
  className="text-xs"
  style={{
  color: "var(--color-text-secondary)",
}}
>
      Products, brands & categories
    </p>
  </div>
</div>

<div className="relative">
<Search
  size={18}
  className="
    absolute
    left-4
    top-1/2
    -translate-y-1/2
  "
  style={{
    color: "var(--color-text-secondary)",
  }}
/>
  <input
    autoFocus
    type="text"
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
onKeyDown={(e) => {
  if (
    (e.key === "ArrowDown" || e.key === "ArrowUp") &&
    suggestions.length === 0
  ) {
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();

    setSelectedIndex((prev) => {
      const next =
        prev < suggestions.length - 1
          ? prev + 1
          : 0;

      itemRefs.current[next]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });

      return next;
    });
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();

    setSelectedIndex((prev) => {
      const next =
        prev > 0
          ? prev - 1
          : suggestions.length - 1;

      itemRefs.current[next]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });

      return next;
    });
  }

  if (e.key === "Enter") {
    e.preventDefault();

    if (
      selectedIndex >= 0 &&
      suggestions[selectedIndex]
    ) {
      navigate(`/products/${suggestions[selectedIndex]._id}`);
    } else if (searchValue.trim()) {
      navigate(
        `/products-list?query=${encodeURIComponent(searchValue)}`
      );
    }

    setShowSearchModal(false);
  }
}}
    placeholder="Search products..."
    className="
      w-full
      h-12
      border
      rounded-xl
      pl-11
      pr-12
      outline-none
      focus:border-violet-500
       placeholder:text-gray-400
    "
style={{
  borderColor: "var(--color-border)",
  backgroundColor: "var(--color-surface)",
  color: "var(--color-text)",
}}
onFocus={(e) => {
  e.currentTarget.style.borderColor = "var(--primary-color)";
}}
onBlur={(e) => {
  e.currentTarget.style.borderColor = "var(--color-border)";
}}
  />

  {isSearching && (
  <div className="mt-3 p-4 text-center">
    <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

<div
  className="text-sm mt-2"
  style={{
  color: "var(--color-text-secondary)",
}}
>
  Searching products...
</div>
  </div>
)}

  {searchValue.trim() !== "" ? (
<button
  onClick={() => setSearchValue("")}
  className="
    absolute
    right-4
    top-1/2
    -translate-y-1/2
    w-7
    h-7
    rounded-full
    flex
    items-center
    justify-center
    transition-all
    duration-200
  "
  style={{
  color: "var(--color-text-secondary)",
}}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = "#ef4444";
    e.currentTarget.style.background = "var(--color-surface-hover)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = "var(--color-text-secondary)";
    e.currentTarget.style.background = "transparent";
  }}
>
    <X
  size={18}
  strokeWidth={2.5}
/>
  </button>
) : (
<button
  onClick={startVoiceSearch}
  className="
    absolute
    right-4
    top-1/2
    -translate-y-1/2
    w-7
    h-7
    rounded-full
    flex
    items-center
    justify-center
    transition-all
    duration-200
  "
  style={{
    color: isListening ? "#ef4444" : "var(--color-text-secondary)",
  }}
  onMouseEnter={(e) => {
    if (!isListening) {
      e.currentTarget.style.color = "#7C3AED";
    }
    e.currentTarget.style.background = "var(--color-surface-hover)";
  }}
  onMouseLeave={(e) => {
    if (!isListening) {
      e.currentTarget.style.color = "var(--color-text-secondary)";
    }
    e.currentTarget.style.background = "transparent";
  }}
>
  <Mic
    size={20}
    strokeWidth={2}
    className={isListening ? "animate-pulse" : ""}
  />
</button>
)}
</div>

{searchValue.trim() !== "" && suggestions.length > 0 && (
  <div
  className="
    search-dropdown
    mt-3
    border
    rounded-2xl
    overflow-hidden
    shadow-lg
    animate-in
    fade-in
    zoom-in-95
    duration-200
  "
  style={{
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-border)",
  }}
>
    {suggestions.map((product, index) => (
<button
  ref={(el) => (itemRefs.current[index] = el)}
  key={product._id}
  onClick={() => {
    navigate(`/products/${product._id}`);
    setShowSearchModal(false);
  }}
  className="
    group
    w-full
    flex
    items-center
    gap-3
    px-4
    py-3
    cursor-pointer
    border-b
    transition-all
    duration-300
    hover:scale-[1.01]
    hover:shadow-md
    text-left
  "
  style={{
    animation: "slideUp 0.25s ease",
    borderColor: "var(--color-border)",
    background:
      selectedIndex === index
        ? "color-mix(in srgb, var(--accent, #7C3AED) 12%, var(--color-surface))"
        : "transparent",
  }}
  onMouseEnter={(e) => {
    if (selectedIndex !== index) {
      e.currentTarget.style.background = "var(--color-surface-hover)";
    }
  }}
  onMouseLeave={(e) => {
    if (selectedIndex !== index) {
      e.currentTarget.style.background = "transparent";
    }
  }}
>
        <div className="relative">
  <img
    src={product.image}
    alt={product.name}
    className="
      w-12
      h-12
      object-cover
      rounded-xl
      border
          transition-transform
    duration-300
    group-hover:scale-105
    "
    style={{
  borderColor: "var(--color-border)",
}}
  />

  {product.discountPercentage > 0 && (
    <div
      className="
        absolute
        -top-1
        -right-1
        bg-red-500
        text-white
        text-[10px]
        px-1.5
        py-0.5
        rounded-full
        font-bold
      "
    >
      -{product.discountPercentage}%
    </div>
  )}
</div>
      
<div className="flex-1">
<div
  className="text-sm font-medium"
  style={{
  color: "var(--color-text)",
}}
>
  {product.name}
</div>

  <div className="flex items-center gap-2 mt-1">
<span
  className="text-xs"
  style={{
  color: "var(--color-text-secondary)",
}}
>
  {product.brand?.name}
</span>

    <span className="text-yellow-500 text-xs">
      ⭐ {product.rating || 0}
    </span>
  </div>

  <div className="mt-1 flex items-center gap-2">
    <span className="font-bold text-violet-600">
  <Price value={product.finalPrice ?? product.price} />
</span>

{product.discountPercentage > 0 && (
<span
  className="text-xs line-through"
  style={{
  color: "var(--color-text-secondary)",
}}
>
  <Price value={product.price} />
</span>
)}
  </div>
<div className="mt-1">
  {product.stockStatus === "IN_STOCK" ? (
    <span className="text-[11px] text-green-600 font-medium">
      🟢 In Stock
    </span>
  ) : product.stock > 0 ? (
    <span className="text-[11px] text-orange-500 font-medium">
      ⚠️ Low Stock
    </span>
  ) : (
    <span className="text-[11px] text-red-500 font-medium">
      🔴 Out of Stock
    </span>
  )}

</div>

</div>
      </button>
    ))}
  </div>
)}

{searchValue.trim() !== "" && (
  <button
    onClick={() => {
      navigate(
        `/products-list?query=${encodeURIComponent(searchValue)}`
      );

      setShowSearchModal(false);
    }}
    className="
      w-full
      mt-3
      py-3
      rounded-xl
      bg-violet-600
      text-white
      font-semibold
      hover:bg-violet-700
      transition-all
    "
  >
    <Search size={18} className="inline mr-2" />
View all results for "{searchValue}"
  </button>
)}

{categorySuggestions.length > 0 && (
  <div className="mt-4">
    <div
  className="text-sm font-bold mb-2"
  style={{
  color: "var(--color-text-secondary)",
}}
>
<div
  className="flex items-center gap-2 text-sm font-bold mb-2"
  style={{
  color: "var(--color-text-secondary)",
}}
>
  <Tags size={16} />
  <span>Categories</span>
</div>
    </div>

    <div className="flex flex-wrap gap-2">
      {[
  ...new Map(
    categorySuggestions.map((c) => [c._id, c])
  ).values(),
].map((category, index) => (
  <button
    key={category._id}
    style={{
    animation: "searchDropdownIn 0.35s ease-out forwards",
    animationDelay: `${index * 60}ms`,
    opacity: 0,
  }}
          onClick={() => {
            navigate(`/products-list?category=${category._id}`);
            setShowSearchModal(false);
          }}
className="
  px-3
  py-1
  rounded-full
  text-sm
  hover:scale-105
  transition-all
  duration-300
"
style={{
  backgroundColor: "color-mix(in srgb, var(--accent, #7C3AED) 12%, var(--color-surface))",
  color: "var(--accent, #7C3AED)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background =
    "color-mix(in srgb, var(--accent, #7C3AED) 20%, var(--color-surface))";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background =
    "color-mix(in srgb, var(--accent, #7C3AED) 12%, var(--color-surface))";
}}
        >
          {category.name}
        </button>
      ))}
    </div>
  </div>
)}

{brandSuggestions.length > 0 && (
  <div className="mt-4">
    <div className="text-sm font-bold text-gray-500 mb-2">
<div
  className="flex items-center gap-2 text-sm font-bold mb-2"
 style={{
  color: "var(--color-text-secondary)",
}}
>
  <Building2 size={16} />
  <span>Brands</span>
</div>
    </div>

    <div className="flex flex-wrap gap-2">
      {brandSuggestions.map((brand, index) => (
        <button
          key={brand._id}
          style={{
    animation: "searchDropdownIn 0.35s ease-out forwards",
    animationDelay: `${index * 60}ms`,
    opacity: 0,
  }}
          onClick={() => {
            navigate(`/products-list?brand=${brand._id}`);
            setShowSearchModal(false);
          }}
className="
  px-3
  py-1
  rounded-full
  text-sm
  hover:scale-105
  transition-all
  duration-300
"
style={{
  backgroundColor: "color-mix(in srgb, var(--success-color, #22C55E) 12%, var(--color-surface))",
  color: "var(--success-color, #22C55E)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background =
    "color-mix(in srgb, var(--success-color, #22C55E) 20%, var(--color-surface))";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background =
    "color-mix(in srgb, var(--success-color, #22C55E) 12%, var(--color-surface))";
}}
        >
          {brand.name}
        </button>
      ))}
    </div>
  </div>
)}



{/* Recent Searches */}
{recentSearches.length > 0 && (
  <div className="mt-6">
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm font-bold text-gray-500">
<div
  className="flex items-center gap-2 text-sm font-bold"
  style={{ color: "var(--color-text-secondary)" }}
>
  <History size={16} />
  <span>Recent Searches</span>
</div>
      </div>

      <button
        onClick={() => {
          setRecentSearches([]);
          localStorage.removeItem("recentSearches");
        }}
className="
  text-xs
  font-medium
  transition-colors
"
style={{ color: "#ef4444" }}
onMouseEnter={(e) => {
  e.currentTarget.style.color = "#dc2626";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.color = "#ef4444";
}}
      >
        Clear All
      </button>
    </div>

    <div className="flex flex-wrap gap-2">
      {recentSearches.map((item, index) => (
        <div
  key={item}
  style={{
    animation: "searchDropdownIn 0.35s ease-out forwards",
    animationDelay: `${index * 60}ms`,
    opacity: 0,
  }}
  className="flex items-center gap-1"
>
          <button
            onClick={() => setSearchValue(item)}
className="
  px-3
  py-1
  rounded-full
  text-sm
  hover:scale-105
  transition-all
  duration-300
"
style={{
  backgroundColor: "color-mix(in srgb, var(--accent, #7C3AED) 12%, var(--color-surface))",
  color: "var(--accent, #7C3AED)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background =
    "color-mix(in srgb, var(--accent, #7C3AED) 20%, var(--color-surface))";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background =
    "color-mix(in srgb, var(--accent, #7C3AED) 12%, var(--color-surface))";
}}
          >
            <div className="flex items-center gap-1">
  <History size={12} />
  <span>{item}</span>
</div>
          </button>

          <button
            onClick={() => {
              const updated = recentSearches.filter(
                (search) => search !== item
              );

              setRecentSearches(updated);

              localStorage.setItem(
                "recentSearches",
                JSON.stringify(updated)
              );
            }}
            className="
  text-red-500
  text-xs

  hover:text-red-700
  hover:scale-110

  transition-all
  duration-300
"
          >
            <X
  size={18}
  strokeWidth={2.5}
/>
          </button>
        </div>
      ))}
    </div>
  </div>
)}

{/* Trending Searches */}
<div className="mt-6">
<div
  className="flex items-center gap-2 text-sm font-bold mb-3"
  style={{ color: "var(--color-text-secondary)" }}
>
  <TrendingUp size={16} />
  <span>Trending Searches</span>
</div>

  <div className="flex flex-wrap gap-2">
    {popularSearches.map((item, index) => (
      <button
        key={item}
        style={{
    animation: "searchDropdownIn 0.35s ease-out forwards",
    animationDelay: `${index * 60}ms`,
    opacity: 0,
  }}
        onClick={() => setSearchValue(item)}
className="
  px-3
  py-1
  rounded-full
  text-sm
  hover:scale-105
  transition-all
  duration-300
"
style={{
  backgroundColor: "color-mix(in srgb, var(--warning-color, #F59E0B) 12%, var(--color-surface))",
  color: "var(--warning-color, #F59E0B)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background =
    "color-mix(in srgb, var(--warning-color, #F59E0B) 20%, var(--color-surface))";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background =
    "color-mix(in srgb, var(--warning-color, #F59E0B) 12%, var(--color-surface))";
}}
      >
         {item}
      </button>
    ))}
  </div>
</div>

    </div>
  </div>
)}

      </header>
    </div>

   
  )
}
