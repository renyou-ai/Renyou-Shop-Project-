import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleNavigate = (path) => {

  // ken deja fi nafs page
  if (window.location.pathname === path) {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    return;
  }

  // navigate normal
  navigate(path);

  // scroll top ba3d navigation
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 50);
};

const showCustomToast = (type, message) => {
  setToastType(type);
  setToastMessage(message);
  setShowToast(true);

  setTimeout(() => {
    setShowToast(false);
  }, 4000);
};

const handleSubscribe = () => {

  if (!email.trim()) {
    showCustomToast(
      "error",
      "❌ Veuillez saisir votre adresse e-mail."
    );
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showCustomToast(
      "error",
      "⚠️ Adresse e-mail invalide."
    );
    return;
  }

  showCustomToast(
    "success",
    "✅ Merci pour votre inscription !"
  );

  setEmail("");
};

  return (
    <footer className="relative w-full mt-20 overflow-x-hidden overflow-y-hidden">

      {/* Background */}
      <img
        src="/assets/footer/FooterBack.svg"
        alt="footer bg"
        className="w-full object-cover"
      />

      {/* CONTENT */}
      <div className="absolute top-0 left-0 w-full h-full px-6 md:px-10 py-12 md:py-16 flex flex-col md:flex-row justify-between gap-10">

        {/* ================= BLOCK 1 ================= */}
        <div className="flex flex-col gap-3 items-start 
          translate-x-[368px] translate-y-[75px]">

          <img
            src="/assets/footer/Espace.svg"
            onClick={() => handleNavigate("/products-list")}
            className="cursor-pointer hover:scale-105 transition"
          />

          <img
            src="/assets/footer/MesC.svg"
            onClick={() => handleNavigate("/user/orders")}
            className="cursor-pointer hover:scale-105 transition"
          />

          <img
            src="/assets/footer/Nouv.svg"
            onClick={() => handleNavigate("/products-list")}
            className="cursor-pointer hover:scale-105 transition"
          />

          <img
            src="/assets/footer/Meill.svg"
            onClick={() => handleNavigate("/products-list")}
            className="cursor-pointer hover:scale-105 transition"
          />

          <img
            src="/assets/footer/Condi.svg"
            onClick={() => handleNavigate("/agreements")}
            className="cursor-pointer hover:scale-105 transition"
          />

          <a href="mailto:partners@renyouapp.com">
  <img
    src="/assets/footer/Contact.svg"
    alt="Contact"
    className="cursor-pointer hover:scale-105 transition"
  />
</a>
        </div>

        {/* ================= BLOCK 2 ================= */}
        <div className="flex flex-col gap-3 items-start
          translate-x-[228px] translate-y-[75px]">

          <img
            src="/assets/footer/Visage.svg"
            onClick={() => handleNavigate("/products-list?category=6a0afd3ea9a8b0cfea193cf7&page=1")}
            className="cursor-pointer hover:scale-105 transition"
          />

          <img
            src="/assets/footer/Cheveux.svg"
            onClick={() => handleNavigate("/products-list?category=6a0afd3ea9a8b0cfea193cfa&page=1")}
            className="cursor-pointer hover:scale-105 transition"
          />

          <img
            src="/assets/footer/Corps.svg"
            onClick={() => handleNavigate("/products-list?category=6a0afd3ea9a8b0cfea193cfc&page=1")}
            className="cursor-pointer hover:scale-105 transition"
          />

          <img
            src="/assets/footer/Beaute.svg"
            onClick={() => handleNavigate("/products-list")}
            className="cursor-pointer hover:scale-105 transition"
          />

          <img
            src="/assets/footer/bebe.svg"
            onClick={() => handleNavigate("/products-list?category=6a0afd3ea9a8b0cfea193cfb&page=1")}
            className="cursor-pointer hover:scale-105 transition"
          />

          <img
            src="/assets/footer/Service.svg"
            onClick={() => handleNavigate("/products-list?category=6a0afd3ea9a8b0cfea193cf7&page=1")}
            className="cursor-pointer hover:scale-105 transition"
          />
        </div>

        {/* ================= BLOCK 3 ================= */}
        <div className="flex flex-col gap-6 items-start
          translate-x-[115px] translate-y-[200px]"> 

{/* INPUT + BUTTON */}
<div className="flex items-center gap-4 relative">

  {/* TOAST */}
  {showToast && (
    <div
      className={`
        absolute
        -top-[-130px]
        left-[0px]
        z-50
        flex items-center justify-between
        gap-4
        min-w-[280px]
        max-w-[95vw]
        px-4 py-3
        rounded-2xl
        backdrop-blur-md
        shadow-2xl
        border
        animate-in fade-in slide-in-from-top-2 duration-300

        ${
          toastType === "success"
            ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
            : "bg-red-500/15 border-red-400/40 text-red-300"
        }
      `}
    >
      <span className="text-sm md:text-[15px] font-medium leading-relaxed">
        {toastMessage}
      </span>

      <button
        onClick={() => setShowToast(false)}
        className="
          text-lg
          leading-none
          opacity-70
          hover:opacity-100
          transition
        "
      >
        ×
      </button>
    </div>
  )}

{/* INPUT BOX */}
<div
  ref={inputRef}
  className="
    relative
    w-[260px]
    md:w-[320px]
    h-[52px]

    rounded-[19px]          /* ROUNDNESS */
    overflow-hidden

    border border-white/20  /* BORDER */
    bg-white/95             /* BACKGROUND */

    shadow-[0_8px_30px_rgba(0,0,0,0.12)]  /* SHADOW */

    transition-all duration-300

    hover:border-violet-300/60
  "
>

    {/* BOX */}
    <img
      src="/assets/footer/InputBox.svg"
      className="w-full"
    />

    {/* INPUT */}
<input
  type="email"
  value={email}
  placeholder="Votre adresse e-mail"
  onChange={(e) => setEmail(e.target.value)}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  }}
  className="
    absolute inset-0
    w-full h-full
    bg-transparent
    outline-none

    pl-3
    pr-32

    text-black
    text-sm md:text-base

    rounded-[22px]

    overflow-hidden
    text-ellipsis
    whitespace-nowrap
  "
/>
  </div>

  {/* SEND BUTTON */}
  <img
    src="/assets/footer/Button.svg"
    onClick={handleSubscribe}
    className="
      w-[90px] md:w-[120px]
      translate-x-[-137px]
      cursor-pointer
      hover:scale-105
      active:scale-95
      transition
      duration-200
      select-none
    "
  />
</div>

          {/* SOCIALS */}
          <div className="flex gap-4 mt-0">

            <a
              href="https://facebook.com/fb.allodm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/footer/FB.svg"
                className="w-[35px] md:w-[40px] hover:scale-110 transition"
              />
            </a>

            <a
              href="https://instagram.com/allodm_tun"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/footer/INSTA.svg"
                className="w-[35px] md:w-[40px] hover:scale-110 transition"
              />
            </a>

          </div>
        </div>

      </div>
    </footer>
  );
}