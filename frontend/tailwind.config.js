/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
      },

      keyframes: {
        // 🟢 OPEN (popup clean)
        popIn: {
          '0%': { transform: 'scale(0.85) translateY(20px)', opacity: 0 },
          '100%': { transform: 'scale(1) translateY(0)', opacity: 1 },
        },

        // 🔵 MAXIMIZE
        slideMaximize: {
          '0%': { transform: 'translateX(100%) scale(0.9)', opacity: 0 },
          '100%': { transform: 'translateX(0) scale(1)', opacity: 1 },
        },

        // 🟣 MINIMIZE
        slideMinimize: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateX(0) scale(0.65)', opacity: 0.7 },
        },

        // 🟡 RESTORE
        smoothBack: {
          '0%': { transform: 'scale(0.9)', opacity: 0.7 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },

        // 🟠 apparition AI
        messageInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },

        // 🔴 apparition Human
        messageInRight: {
          '0%': { transform: 'translateX(30px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },

        // ✨ Violet foncé glow discret
        violetGlowSoft: {
          '0%': { color: '#6A0DAD', textShadow: '0 0 1px #6A0DAD, 0 0 2px #4B0082' },
          '50%': { color: '#8A2BE2', textShadow: '0 0 3px #8A2BE2, 0 0 6px #4B0082' },
          '100%': { color: '#6A0DAD', textShadow: '0 0 1px #6A0DAD, 0 0 2px #4B0082' },
        },

        // 🟢 NEW — apparition Search box
        searchBoxIn: {
          '0%': { transform: 'scale(0.9) translateY(-10px)', opacity: 0 },
          '100%': { transform: 'scale(1) translateY(0)', opacity: 1 },
        },

        // 🟢 NEW — apparition accueil (fade + slide-in)
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },

        // 🟢 NEW — Navbar mobile menu slide-in/out
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(-100%)', opacity: 0 },
        },

        // 🟢 NEW — Overlay fade-in/out
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
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

        // 🟢 NEW — Navbar animations
        slideInLeft: 'slideInLeft 0.4s ease-out forwards',
        slideOutLeft: 'slideOutLeft 0.4s ease-in forwards',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        fadeOut: 'fadeOut 0.3s ease-in forwards',
      },
    },
  },
  plugins: [],
};