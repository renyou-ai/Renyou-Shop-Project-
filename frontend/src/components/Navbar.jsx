import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
         !!localStorage.getItem("token") || !!localStorage.getItem("user"));

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

  const [searchValue, setSearchValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false); // ✅ toggle input
  const searchRef = useRef(null); // ✅ ref lel box
  const [showAIWindow, setShowAIWindow] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState(""); // ✅ progressive typing

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, displayedText]);
  
  // ✅ click user
const handleUserClick = () => {
  setShowUserMenu((prev) => !prev);
};

useEffect(() => {
  const handleClickOutside = (e) => {
    if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
      setShowUserMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

// ✅ Smartphone auto-detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMinimized(true);   // smartphone mode → fullscreen
        setIsMaximized(false);  // éviter conflit
      } else {
        setIsMinimized(false);  // desktop mode → 60% agrandi
      }
    };
    handleResize(); // lancer une fois au mount
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
    if (e.key === "Enter") {
      if (searchValue.trim() === "") {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2500);
      } else {
        navigate(`/search?query=${encodeURIComponent(searchValue)}`);
      }
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

  return (
    <div className="bg-[#ECE4FF]">
      <header className="bg-[#ECE4FF] border border-white shadow-md relative h-[80px]">

        {/* Logo Renyou Shop */}
        <div
          onClick={() => navigate("/")}
          className="absolute top-[6px] left-[20px] cursor-pointer transition duration-500 hover:scale-105 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <img
            src="/assets/background/RenyouShop.svg"
            alt="Renyou Shop Logo"
            className="w-[190px] h-[60px] object-contain"
          />
        </div>

        {/* Skincare button */}
        <div
          onClick={() => navigate("/skincare")}
          className="absolute top-[18px] left-[290px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal text-[#000000]">
            Skincare
          </span>
        </div>

        {/* Haircare button */}
        <div
          onClick={() => navigate("/haircare")}
          className="absolute top-[18px] left-[425px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal text-[#000000]">
            Haircare
          </span>
        </div>

        {/* Bodycare button */}
        <div
          onClick={() => navigate("/bodycare")}
          className="absolute top-[18px] left-[560px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal text-[#000000]">
            Bodycare
          </span>
        </div>

        {/* Brands button */}
        <div
          onClick={() => navigate("/brands")}
          className="absolute top-[18px] left-[705px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal text-[#000000]">
            Brands
          </span>
        </div>

        {/* Offers button */}
        <div
          onClick={() => navigate("/offers")}
          className="absolute top-[18px] left-[810px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal text-[#000000]">
            Offers
          </span>
        </div>

        {/* Learn button */}
        <div
          onClick={() => navigate("/learn")}
          className="absolute top-[18px] left-[910px] cursor-pointer transition duration-300 hover:scale-125 hover:opacity-80 active:scale-95 pointer-events-auto p-1 rounded"
        >
          <span className="text-[28px] font-urbanist font-normal text-[#000000]">
            Learn
          </span>
        </div>

        {/* Renyou AI button */}
        <div
          onClick={() => setShowAIWindow(true)}
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
  className="absolute top-[19px] left-[1187px] flex flex-col items-center"
>
  {/* Logo search (NO animation change) */}
  <div
    onClick={() => setShowSearchBox(!showSearchBox)} // ✅ toggle input
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
    <div className="relative mt-[5px] animate-searchBoxIn">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="
          mt-1
          ml-[-155px]
          w-[500px]
          sm:w-[150px]
          md:w-[250px]
          lg:w-[300px]
          h-[25px]
          leading-[30px]
          max-w-[175px]
          min-w-[0px]
          transition-all
          duration-300
          ease-in-out
          rounded-full
          border border-gray-300
          px-3 py-0
          focus:outline-none
          focus:border-blue-500
          shadow-md
          tracking-wide
          caret-blue-600
        "
      />
      {searchValue.trim() !== "" && (
        <button
          onClick={() => setSearchValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition duration-300"
        >
          ✕
        </button>
      )}
    </div>
  )}
</div>


        {/* Cart button */}
        <div
          onClick={() => navigate("/cart")}
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
  className="absolute top-[18px] left-[1285px]"
>
  {/* Icon */}
  <div
    onClick={handleUserClick}
    className="cursor-pointer transition duration-500 hover:scale-125 hover:opacity-80 active:scale-95 p-1 rounded"
  >
    <img
      src="/assets/background/User.svg"
      alt="User"
      className="w-[35px] h-[35px] object-contain"
    />
  </div>

  {/* Dropdown */}
{showUserMenu && (
  <div className="absolute right-0 mt-3 w-36 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fadeIn">

    {isLoggedIn ? (
      <>
        {/* Profile */}
        <button
          onClick={() => navigate("/user")}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition group"
        >
          {/* Icon */}
          <svg
            className="w-5 h-5 text-gray-500 group-hover:text-violet-600 transition"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          <span className="font-medium group-hover:text-violet-600 transition">
            Profile
          </span>
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-200 mx-2"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 transition group"
        >
          {/* Icon */}
          <svg
            className="w-5 h-5 group-hover:scale-110 transition"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V3" />
          </svg>

          <span className="font-medium">
            Logout
          </span>
        </button>
      </>
    ) : (
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition group"
      >
        {/* Icon */}
        <svg
          className="w-5 h-5 text-gray-500 group-hover:text-violet-600 transition"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M15 12H3m0 0l4-4m-4 4l4 4m6-12h6v16h-6" />
        </svg>

        <span className="font-medium group-hover:text-violet-600 transition">
          Login
        </span>
      </button>
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

{/* ✅ Fenetre IA */}
{showAIWindow && (
  <div
    className={`
      fixed bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col z-50

      will-change-transform
      transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]

      ${isMinimized ? "animate-slideMinimize" : ""}
      ${isMaximized ? "animate-slideMaximize" : ""}
      ${!isMinimized && !isMaximized ? "animate-smoothBack" : ""}
    `}
    style={{
      width: isMinimized ? "200px" : isMaximized ? "95%" : "420px",
      height: isMinimized ? "35px" : isMaximized ? "95%" : "520px",
      bottom: isMinimized ? "0" : isMaximized ? "2.5%" : "5px",
      right: isMinimized ? "0" : isMaximized ? "2.5%" : "5px",
      left: isMaximized ? "2.5%" : "auto",
      top: isMaximized ? "2.5%" : "auto",
    }}
  >
    
{/* Header fenetre IA */}
<div className="flex items-center bg-[#ECE4FF] h-[35px] rounded-t-lg px-2 relative">
  {!isMinimized && (
    <span
      className="
        absolute font-semibold tracking-wide 
        animate-violetGlowSoft 
        transition-all duration-500 ease-in-out
      "
      style={{
        top: isMaximized ? "-4px" : "5px",
        left: "42.56%",
        transform: "translateX(-50%)",
        fontSize: isMaximized ? "24px" : "14px",
      }}
    >
      Renyou Ai toujours prêt à répondre.
    </span>
  )}

      {/* ✅ Icône minimiser */}
      <button
        onClick={() => {
          setIsMinimized(!isMinimized);
          setIsMaximized(false);
        }}
        className="
          absolute top-[6px] right-[70px] cursor-pointer 
          hover:scale-110 hover:animate-scaleBounce
          transition-all duration-300
        "
        style={{
          fontWeight: "bold",
          fontSize: "30px",
          lineHeight: "0.9",
        }}
      >
        {"-"}
      </button>

      {/* ✅ Icône agrandir/réduire */}
      <button
        onClick={() => {
          setIsMaximized(!isMaximized);
          setIsMinimized(false);
        }}
        className="
          absolute top-[6px] right-[40px] text-lg cursor-pointer 
          hover:scale-110 hover:animate-scaleBounce
          transition-all duration-300
        "
      >
        {isMaximized ? "🗗" : "🗖"}
      </button>

      {/* ✅ Icône fermer */}
      <button
        onClick={() => setShowAIWindow(false)}
        className="
          absolute top-[6px] right-[10px] text-lg cursor-pointer 
          hover:scale-110 hover:animate-scaleBounce
          transition-all duration-300
        "
      >
        {"🗙"}
      </button>
    </div>

{/* ✅ Fenetre IA - Mode minimisé extrême */}
{showAIWindow && isMinimized && (
  <div
    className="fixed bg-[#ECE4FF] border border-gray-300 shadow-lg rounded-lg flex items-center z-50 animate-[fadeIn_0.3s_ease-in-out]"
    style={{
      width: "200px",
      height: "44px",
      bottom: "-10px",
      right: "0px",
    }}
  >

  {/* Agrandir */}
  <button
    onClick={() => {
      setIsMaximized(true);
      setIsMinimized(false);
    }}
    style={{
      position: "absolute",
      top: "5px",
      left: "55px", // ✅ placement manuel
      fontSize: "20px",
    }}
    className="cursor-pointer hover:scale-110 transition-transform"
  >
    {"🗖"}
  </button>

  {/* Fermer */}
  <button
    onClick={() => setShowAIWindow(false)}
    style={{
      position: "absolute",
      top: "5px",
      left: "130px", // ✅ placement manuel
      fontSize: "20px",
    }}
    className="cursor-pointer hover:scale-110 transition-transform"
  >
    {"🗙"}
  </button>
</div>
)}


{/* Corps fenetre IA dynamique */}
<div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-4" ref={chatRef}>
  {messages.map((msg, index) => (
    <div key={index} className="relative w-full">
      {msg.sender === "human" && (
        <div className="flex justify-end">
          <div className="relative w-[70%] animate-messageInRight">
            <img src="/assets/IA/HumanBox.svg" alt="Human Box" className="w-full h-auto" />
            <div
              className="absolute text-black font-medium px-3 py-2"
              style={{
                top: "0px",
                left: "0px",
                fontSize: isMaximized ? "20px" : "14px", // ✅ taille dynamique
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
        </div>
      )}

      {msg.sender === "ai" && (
        <div className="flex justify-start">
          <div className="relative w-[70%] animate-messageInLeft">
            <img src="/assets/IA/AIBox.svg" alt="AI Box" className="w-full h-auto min-h-[60px]" />
            <div
              className="absolute text-indigo-900 font-medium px-3 py-2"
              style={{
                top: "0px",
                left: "0px",
                fontSize: isMaximized ? "22px" : "15px", // ✅ taille dynamique
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
        </div>
      )}
    </div>
  ))}


      {/* Typing dots animation */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="relative w-[70%]">
            <img src="/assets/IA/AIBox.svg" alt="AI Box" className="w-full min-h-[60px]" />
            <div className="absolute text-indigo-600 font-medium animate-fadeIn flex items-center px-3 py-2"
                    style={{
          top: "0px",
          left: "0px",
          fontSize: "15px",
          whiteSpace: "nowrap",
        }}
        >
              Renyou Ai is typing
              <span className="ml-1 animate-bounce">.</span>
              <span className="ml-1 animate-bounce delay-150">.</span>
              <span className="ml-1 animate-bounce delay-300">.</span>
            </div>
          </div>
        </div>
      )}

      {/* Message AI avec bounceFade dots */}
      {displayedText && (
        <div className="flex justify-start">
          <div className="relative w-[70%]">
            <img src="/assets/IA/AIBox.svg" alt="AI Box" className="w-full min-h-[60px]" />
            <div className="absolute text-indigo-900 font-medium animate-fadeIn flex items-center px-3 py-2"
            style={{
          top: "0px",
          left: "0px",
          fontSize: "15px",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
        >
              {displayedText}
              <span className="ml-1 animate-bounceFade">.</span>
              <span className="ml-1 animate-bounceFade delay-150">.</span>
              <span className="ml-1 animate-bounceFade delay-300">.</span>
            </div>
          </div>
        </div>
  )}
</div>

{/* Input box principal basé sur HumanType.svg + bouton logo séparé */}
    <div className="p-2 bg-[#ECE4FF] rounded-b-lg flex items-center">
      <div className="relative flex-1 flex items-center">
        {/* Background HumanType */}
        <img src="/assets/IA/HumanType.svg" alt="Human Input" className="w-full" />

        {/* Zone input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Posez votre question..."
          className="absolute left-3 right-12 h-[40px] bg-transparent focus:outline-none focus:border-blue-500"
          style={{
    fontSize: isMaximized ? "30px" : "14px", // ✅ taille dynamique input
  }}
        />

{/* Logo HumanTypeLogo comme bouton envoyer */}
<button
  onClick={handleSendMessage}
  className="absolute flex items-center justify-center rounded-full hover:scale-110 active:scale-95 transition-transform shadow-md"
  style={{
    position: "absolute",
    top: isMaximized ? "0px" : "-39px",     // ✅ position verticale dynamique
    left: isMaximized ? "1200px" : "379px",   // ✅ position horizontale dynamique
    width: isMaximized ? "60px" : "30px",  // ✅ taille dynamique
    height: "auto",
  }}
>
  <img
    src="/assets/IA/HumanTypeLogo.svg"
    alt="Send Logo"
    style={{
      width: isMinimized ? "28px" : "58px",   // ✅ logo responsive
      height: isMinimized ? "28px" : "50px",
      marginLeft: isMinimized ? "40px" : "-20px",
      marginTop: isMinimized ? "0px" : "32px",
    }}
  />
</button>

      </div>
    </div>
  </div>
)}

      </header>
    </div>
  );
}