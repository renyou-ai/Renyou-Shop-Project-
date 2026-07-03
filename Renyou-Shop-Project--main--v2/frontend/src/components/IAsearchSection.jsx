import React, { useState, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function IAsearchSection() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const [results, setResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");



  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

const intervalRef = useRef(null);

const formatText = (text) => {
  if (!text) return "";

  let formatted = text;

  // 🧼 clean markdown bold
  formatted = formatted.replace(/\*\*/g, "");

  // 🧼 REMOVE AI emojis (important 🔥)
  formatted = formatted.replace(/🌞+/g, "");
  formatted = formatted.replace(/🌙+/g, "");

  // ✨ TITLES
  formatted = formatted
.replace(
  /Step-by-step guide:/gi,
  "<br/><br/><h2 class='text-xl font-bold text-violet-700'>Step-by-step Guide</h2>"
)
.replace(
  /Here's a.*?:/gi,
  "<br/><br/><h2 class='text-xl font-bold text-violet-700'>Skincare Routine</h2>"
)
.replace(
  /Understanding Your Skin Type:?/gi,
  "<br/><br/><h2 class='text-xl font-bold text-pink-600'>Skin Types</h2>"
)

  // 🌞 SECTIONS
  formatted = formatted
.replace(
  /Morning Routine:?/gi,
  "<br/><br/><h3 class='text-lg font-bold text-orange-500'>Morning Routine</h3>"
)
.replace(
  /Evening Routine:?/gi,
  "<br/><br/><h3 class='text-lg font-bold text-indigo-500'>Evening Routine</h3>"
)

formatted = formatted.replace(
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,
  ""
);

  // NUMBERED LIST
  formatted = formatted.replace(
    /(\d+)\.\s+([^\n]+)/g,
    "<div class='ml-4'><strong>$1.</strong> $2</div>"
  );

  // 🔸 BULLETS
  formatted = formatted.replace(
    /•\s?([^\n]+)/g,
    "<div class='ml-6'>• $1</div>"
  );

  formatted = formatted.replace(
    /-\s([^\n]+)/g,
    "<div class='ml-6'>• $1</div>"
  );

  // 📏 line breaks
  formatted = formatted.replace(/\n{2,}/g, "<br/><br/>");
  formatted = formatted.replace(/\n/g, "<br/>");

  // 🧼 FIX colon
  formatted = formatted.replace(/:\s*$/gm, ":");

  return formatted.trim();
};

const typeText = (text) => {
  const formatted = formatText(text);

  setIsTyping(true);
  setDisplayedText("");

  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

let index = 0;
const chunkSize = 1; // yekteb 4 caractères kol marra

intervalRef.current = setInterval(() => {
  index += chunkSize;

  setDisplayedText(formatted.slice(0, index));

  if (index >= formatted.length) {
    clearInterval(intervalRef.current);
    setDisplayedText(formatted);
    setIsTyping(false);
  }
}, 24); // asra3 barcha
};

const highlightText = (text) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");

  return text.replace(
    regex,
    `<span class="text-violet-600 font-bold">$1</span>`
  );
};

<div className="mt-8 w-full max-w-[900px] px-4">

  {/* typing dots */}
  {isTyping && (
    <div className="flex justify-center gap-2 mb-4">
      <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-150"></span>
      <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-300"></span>
    </div>
  )}

  {/* texte en cours */}
  {displayedText && (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border animate-fadeIn whitespace-pre-line text-gray-700">
      {displayedText}
    </div>
  )}

</div>

  // 🔥 Placeholder animé
  const placeholders = [
    "Ask about skincare...",
    "Find the best products...",
    "Search with AI...",
    "What do you need today ?"
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");

  // 🔥 Suggestions
  const [suggestions, setSuggestions] = useState([]);

  // 🔍 SEARCH
const handleSearch = async () => {
  if (query.trim() === "") return;

  setIsLoading(true);
  setResults("");
  setDisplayedText("");
  setExpanded(false);

  try {
    const res = await fetch("http://localhost:5000/api/ai/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();

if (data.result) {
  typeText(data.result);
} else {
  setResults("❌ Error: " + data.error);
}

  } catch (err) {
    console.error(err);
    setResults("❌ Server error");
  } finally {
    setIsLoading(false);
  }
};

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(displayedText);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (err) {
    console.error(err);
  }
};

  // 🔥 typing placeholder effect
  useEffect(() => {
    let index = 0;
    const currentText = placeholders[placeholderIndex];

    const interval = setInterval(() => {
      setTypedPlaceholder(currentText.slice(0, index));
      index++;

      if (index > currentText.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 1500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [placeholderIndex]);

  // suggestions dynamique
  useEffect(() => {
if (!showSuggestions) {
  setSuggestions([]);
  return;
}

const data = [
  "Best skincare routine",
  "Top hair products",
  "Anti acne solutions",
  "Hydrating creams"
];

let filtered;

if (query.trim() === "") {
  filtered = data;
} else {
  filtered = data.filter((item) =>
    item.toLowerCase().startsWith(query.toLowerCase())
  );
}

setSuggestions(filtered);
  }, [query, showSuggestions]);

  // click outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const MAX_LENGTH = 500;

const isLong = displayedText.length > MAX_LENGTH;

  return (
<section className="relative w-screen left-1/2 -translate-x-1/2 flex flex-col items-center py-12 overflow-hidden">

      {/* Scoped keyframes for the blur blob — self-contained, no config changes needed */}
      <style>{`
        @keyframes blurDrift {
          0%   { transform: translate(0px, -50%) scale(1); }
          25%  { transform: translate(-18px, calc(-50% - 14px)) scale(1.05); }
          50%  { transform: translate(10px, calc(-50% + 16px)) scale(0.97); }
          75%  { transform: translate(-12px, calc(-50% + 6px)) scale(1.03); }
          100% { transform: translate(0px, -50%) scale(1); }
        }
        .animate-blurDrift {
          animation: blurDrift 14s ease-in-out infinite;
        }
      `}</style>

      {/* Title */}
      <img
        src="/assets/background/IASection/IASectionTitle.svg"
        alt="IA Section Title"
        className="w-[600px] h-auto mb-8 object-contain"
      />

{/* Box IA */}
<div
  ref={inputRef}
  className="relative flex flex-col items-center justify-center"
>
  {/* Blur blob — premium ambient glow behind the box */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -z-10 right-[-120px] top-1/2 -translate-y-1/2 w-[520px] h-[420px] animate-blurDrift"
    style={{
      background:
        "radial-gradient(circle at 35% 35%, rgba(255,138,76,0.55) 0%, rgba(255,138,76,0) 55%), radial-gradient(circle at 65% 65%, rgba(91,68,201,0.55) 0%, rgba(91,68,201,0) 60%)",
      filter: "blur(60px)",
    }}
  />

  {/* Box (background) */}
  <img
    src="/assets/background/IASection/BoxIA.svg"
    alt="Box IA"
    className="w-[900px] h-auto object-contain"
  />

  {/* INPUT */}
<input
  type="text"
  value={query}
  onChange={(e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  }}

onFocus={() => {
  setFocused(true);
  setShowSuggestions(true);
}}

onKeyDown={(e) => {
  if (e.key === "ArrowDown") {
    setSelectedIndex((prev) =>
      prev < suggestions.length - 1 ? prev + 1 : 0
    );
  }

  else if (e.key === "ArrowUp") {
    setSelectedIndex((prev) =>
      prev > 0 ? prev - 1 : suggestions.length - 1
    );
  }

  else if (e.key === "Enter") {
    if (selectedIndex >= 0) {
      setQuery(suggestions[selectedIndex]);
    }

    setShowSuggestions(false);
    handleSearch();
  }
}}

    placeholder={typedPlaceholder}
    className={`
      absolute left-0 top-0 w-full h-full
      bg-transparent outline-none px-[20px] pr-[220px]
      text-[18px] text-black
      transition-all duration-300
      ${focused ? "ring-2 ring-violet-500 rounded-lg" : ""}
    `}
  />

  {/* X (clear input) */}
  {query && (
    <button
      onClick={() => setQuery("")}
      className="absolute right-[218px] top-[43px] -translate-y-1/2 text-gray-500 hover:text-red-500 text-xl"
    >
      ✕
    </button>
  )}

  {/* Button IA */}
  <button
    onClick={handleSearch}
    className="absolute right-6 top-[43px] -translate-y-1/2 hover:scale-105 transition"
  >
    <img
      src="/assets/background/IASection/ButtonIA.svg"
      alt="Button IA"
      className="w-[180px] cursor-pointer"
    />
  </button>

 {/* Suggestions */}
{showSuggestions && suggestions.length > 0 && (
  <div className="absolute top-full mt-[-10px] w-full max-w-[900px] bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-0 z-50 flex flex-col gap-2 border border-violet-100 animate-fadeIn
  ">
    {suggestions.map((s, i) => (
      <div
        key={i}
        onClick={() => {
          setQuery(s);
          setSuggestions([]);
          setShowSuggestions(false);
          setFocused(false);
          setSelectedIndex(-1);
          inputRef.current?.focus();
        }}
        className={`
          cursor-pointer px-4 py-3 rounded-xl flex items-center
          font-urbanist text-[20px] md:text-[24px]

          transition-all duration-300 ease-out

          ${
            i === selectedIndex
              ? "bg-violet-100 text-violet-700"
              : "text-[#667085] hover:bg-violet-50 hover:text-violet-700 hover:translate-x-2 hover:shadow-md"
          }

          active:scale-95
        `}
      >
      {/* Icon */}
<span className="mr-3 w-2.5 h-2.5 rounded-full bg-violet-500 inline-block"></span>

      {/* Highlight */}
<span
  dangerouslySetInnerHTML={{
    __html: highlightText(s),
  }}
/>
      </div>
    ))}
  </div>
)}
</div>

{/* AI Results */}
<div className="mt-8 w-full max-w-[900px] px-4"/>

  {/* typing dots */}
{/* Typing indicator */}
{(isLoading || isTyping) && (
  <div className="flex items-center gap-2 mb-3 px-2">
    <div className="flex gap-1">
      <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"></span>
      <span
        className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
        style={{ animationDelay: "0.15s" }}
      ></span>
      <span
        className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
        style={{ animationDelay: "0.3s" }}
      ></span>
    </div>

    <span className="text-sm text-gray-500 font-medium">
      Renyou AI is typing...
    </span>
  </div>
)}

{/* typing text */}
{displayedText && (
  <div
  className="
    bg-[var(--color-surface)]
    backdrop-blur-xl
    p-8 md:p-10
    rounded-3xl
    shadow-xl
    border border-[var(--color-border)]
    animate-fadeIn
    transition-all duration-300
  "
>
    
    <div className="relative">

<div className="flex justify-end mb-4">
  <button
    onClick={handleCopy}
    aria-label={copied ? "Copied" : "Copy"}
    className="
      flex items-center gap-2
      px-3 py-1.5
      rounded-lg
      text-sm
      transition-all duration-200
      hover:bg-[var(--color-surface-secondary)]
    "
    style={{
      color: copied
        ? "#10b981"
        : "var(--color-text-secondary)",
    }}
  >
    {copied ? (
      <>
        <Check size={16} />
        Copied
      </>
    ) : (
      <>
        <Copy size={16} />
        Copy
      </>
    )}
  </button>
</div>

      {/* text */}
<div
  className={`
    text-[17px] md:text-[18px]
    leading-8
    tracking-[0.01em]
    text-[var(--color-text)]

    [&_h2]:text-2xl
    [&_h2]:font-bold
    [&_h2]:mb-5

    [&_h3]:text-xl
    [&_h3]:font-semibold
    [&_h3]:mt-6
    [&_h3]:mb-3

    [&_strong]:font-semibold

    [&_ul]:ml-6
    [&_li]:mb-2

    transition-all duration-300
    ${expanded ? "max-h-[5000px]" : "max-h-[180px]"}
    overflow-hidden
  `}
        dangerouslySetInnerHTML={{ __html: formatText(displayedText) }}
      />

      {/* fade */}
{!expanded && displayedText.length > MAX_LENGTH && (
  <div
    className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none rounded-b-3xl"
  />
)}
    </div>

    {/* button */}
{isLong && (
  <div className="flex justify-center mt-6">
    <button
      onClick={() => setExpanded(!expanded)}
      className="
        px-5 py-2.5
        rounded-full
        border border-violet-200
        bg-[var(--color-surface)]
        text-violet-600
        font-semibold
        text-sm
        shadow-sm
        hover:bg-violet-50
        hover:border-violet-400
        transition-all
        duration-300
      "
    >
      {expanded ? "Show less ↑" : "Show more ↓"}
    </button>
  </div>
)}

  </div>
)}

{/* Suggestions buttons */}
<div className="flex flex-row gap-6 mt-10">
  {/* Discover à gauche */}
  <img
    src="/assets/background/IASection/DiscoverButton.svg"
    alt="Discover Button"
    className="w-[300px] h-auto object-contain cursor-pointer hover:scale-105 transition"
  />

  {/* Find à droite */}
  <img
    src="/assets/background/IASection/FindButton.svg"
    alt="Find Button"
    className="w-[350px] h-auto object-contain cursor-pointer hover:scale-105 transition"
  />
</div>

      {/* Footer IA */}
      <div className="flex flex-col items-center mt-8">
        <img
          src="/assets/background/IASection/FooterIA.svg"
          alt="Footer IA"
          className="w-[300px] h-auto object-contain mb-2"
        />
      </div>

{/* Footer IA 2 as animated button */}
<div
  className="flex flex-col items-center mt-8 relative"
  style={{
    top: "-54px",   // tnajjem tbaddel valeur
    left: "117px",  // tnajjem tbaddel valeur
    position: "relative",
  }}
>
  <button
    onClick={() => navigate("/agreements")}
    className="w-[36px] h-auto flex items-center justify-center 
               transition-transform duration-300 ease-in-out 
               hover:scale-110 active:scale-95"
  >
    <img
      src="/assets/background/IASection/Footer2.svg"
      alt="Footer 2"
      className="w-[36px] h-auto object-contain"
    />
  </button>
</div>      

    </section>
  );
}