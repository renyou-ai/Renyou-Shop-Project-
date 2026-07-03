/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', "Inter", 'sans-serif'],
        avantgarde: ["ITC Avant Garde Gothic", "sans-serif"],
        'Segoe UI Emoji': ['Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'sans-serif']
      },

      keyframes: {
        // OPEN (popup clean)
        popIn: {
          '0%': { transform: 'scale(0.85) translateY(20px)', opacity: 0 },
          '100%': { transform: 'scale(1) translateY(0)', opacity: 1 },
        },

        // MAXIMIZE
        slideMaximize: {
          '0%': { transform: 'translateX(100%) scale(0.9)', opacity: 0 },
          '100%': { transform: 'translateX(0) scale(1)', opacity: 1 },
        },

        // 🟣 MINIMIZE
        slideMinimize: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateX(0) scale(0.65)', opacity: 0.7 },
        },

        // RESTORE
        smoothBack: {
          '0%': { transform: 'scale(0.9)', opacity: 0.7 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },

        // apparition AI
        messageInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },

        // apparition Human
        messageInRight: {
          '0%': { transform: 'translateX(30px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },

        // Violet foncé glow discret
        violetGlowSoft: {
          '0%': { color: '#6A0DAD', textShadow: '0 0 1px #6A0DAD, 0 0 2px #4B0082' },
          '50%': { color: '#8A2BE2', textShadow: '0 0 3px #8A2BE2, 0 0 6px #4B0082' },
          '100%': { color: '#6A0DAD', textShadow: '0 0 1px #6A0DAD, 0 0 2px #4B0082' },
        },

        // NEW — apparition Search box
        searchBoxIn: {
          '0%': { transform: 'scale(0.9) translateY(-10px)', opacity: 0 },
          '100%': { transform: 'scale(1) translateY(0)', opacity: 1 },
        },

        // NEW — apparition accueil (fade + slide-in)
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },

        // NEW — Navbar mobile menu slide-in/out
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(-100%)', opacity: 0 },
        },

        // NEW — Overlay fade-in/out
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },

            ripple: {
      '0%': { transform: 'scale(0)', opacity: '0.6' },
      '100%': { transform: 'scale(2)', opacity: '0' },
    },
    
      notif: {
        "0%, 100%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.1)" },
      }
  },
  animation: {
    ripple: 'ripple 0.6s linear',

    notif: "notif 1.5s ease-in-out infinite",

    fadeIn: "fadeIn 0.2s ease-in-out",
      "0%": { opacity: 0, transform: "translateY(10px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },

  

smoothMinimize: {
  '0%': {
    transform: 'scale(1) translate(0, 0)',
    opacity: 1,
  },
'80%': {
  transform: 'scale(0.6) translate(70px, 70px)',
  opacity: 0.75,
  },
  '100%': {
    transform: 'scale(0.55) translate(80px, 80px)',
    opacity: 0.7,
  },
},

// NEW — smooth expand (up)
  smoothExpand: {
    '0%': { transform: 'scale(0.6) translateY(20px)', opacity: 0.7 },
    '100%': { transform: 'scale(1) translateY(0)', opacity: 1 },
  },

  // MAX → NORMAL (zoom out clean)
maximizeToNormal: {
  '0%': { transform: 'scale(1.05)', opacity: 1 },
  '100%': { transform: 'scale(1)', opacity: 1 },
},

// NORMAL → MAX (zoom in pro)
normalToMaximize: {
  '0%': { transform: 'scale(0.9)', opacity: 0.8 },
  '100%': { transform: 'scale(1)', opacity: 1 },
},

cornerToBubble: {
  '0%': {
    transform: 'scale(1) translate(0, 0)',
    borderRadius: '12px',
    opacity: 1,
  },
  '60%': {
    transform: 'scale(0.6) translate(60px, 60px)',
    borderRadius: '20px',
    opacity: 0.8,
  },
  '100%': {
    transform: 'scale(0.4) translate(100px, 100px)',
    borderRadius: '999px',
    opacity: 0.7,
  },
},

fromMiniToPopup: {
  '0%': {
    transform: 'scale(0.4) translate(100px, 100px)',
    opacity: 0.5,
    borderRadius: '50%',
  },
  '100%': {
    transform: 'scale(1) translate(0, 0)',
    opacity: 1,
    borderRadius: '0.5rem',
  },
},

fromPopupToMini: {
  '0%': {
    transform: 'scale(1) translate(0, 0)',
    opacity: 1,
    borderRadius: '0.5rem',
  },
  '100%': {
    transform: 'scale(0.4) translate(100px, 100px)',
    opacity: 0.5,
    borderRadius: '50%',
  },
},

// morph to bubble
toBubbleSmooth: {
  '0%': {
    transform: 'scale(1)',
    borderRadius: '12px',
    opacity: 1
  },
  '100%': {
    transform: 'scale(0.4) translateY(120px) translateX(80px)',
    borderRadius: '9999px',
    opacity: 0.8
  },
},

fromBubbleSmooth: {
  '0%': {
    transform: 'scale(0.4) translateY(120px) translateX(80px)',
    borderRadius: '9999px',
    opacity: 0.8
  },
  '100%': {
    transform: 'scale(1)',
    borderRadius: '12px',
    opacity: 1
  },
},

      },

      animation: {
        popIn: 'popIn 0.4s ease-out forwards',
        slideMaximize: 'slideMaximize 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
        slideMinimize: 'slideMinimize 0.35s ease-in-out forwards',
        smoothBack: 'smoothBack 0.35s ease-out forwards',

        messageInLeft: 'messageInLeft 0.4s ease-out forwards',
        messageInRight: 'messageInRight 0.4s ease-out forwards',

        violetGlowSoft: 'violetGlowSoft 5s ease-in-out infinite',

        searchBoxIn: 'searchBoxIn 0.35s ease-out forwards',

        fadeSlideIn: 'fadeSlideIn 0.8s ease-out forwards',

        smoothMinimize: 'smoothMinimize 0.45s cubic-bezier(0.4,0,0.2,1) forwards',
        smoothExpand: 'smoothExpand 0.4s ease-out forwards',

        maximizeToNormal: 'maximizeToNormal 0.35s ease-in-out forwards',
        normalToMaximize: 'normalToMaximize 0.4s cubic-bezier(0.4,0,0.2,1) forwards',

        cornerToBubble: 'cornerToBubble 0.5s cubic-bezier(0.4,0,0.2,1) forwards',

        fromMiniToPopup: 'fromMiniToPopup 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) forwards',

        fromPopupToMini: 'fromPopupToMini 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',

        toBubbleSmooth: 'toBubbleSmooth 0.5s cubic-bezier(0.4,0,0.2,1) forwards',
        fromBubbleSmooth: 'fromBubbleSmooth 0.5s cubic-bezier(0.4,0,0.2,1) forwards',

        // NEW — Navbar animations
        slideInLeft: 'slideInLeft 0.4s ease-out forwards',
        slideOutLeft: 'slideOutLeft 0.4s ease-in forwards',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        fadeOut: 'fadeOut 0.3s ease-in forwards',
      },
    },
  },
  plugins: [
  require("tailwind-scrollbar"),
],
};