import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useRef } from "react";

function UserIconButton() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showNotif, setShowNotif] = useState(false);

  const notifRef = useRef();

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (notifRef.current && !notifRef.current.contains(e.target)) {
      setShowNotif(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  // Vérification automatique du token
  useEffect(() => {
    const token = localStorage.getItem("token");;

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("token");;
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      navigate("/products");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="flex items-center space-x-4">

  <div ref={notifRef} className="relative mr-4">

  <button
    onClick={() => setShowNotif((prev) => !prev)}
    className="relative p-2 rounded-full hover:bg-gray-100 transition"
  >
    {/* Bell icon */}
    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.16V11a6 6 0 10-12 0v3.16c0 .53-.21 1.04-.59 1.41L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
    </svg>

    {/* badge */}
    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
  </button>

  {/* dropdown */}
  {showNotif && (
    <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border p-3 z-50 animate-fadeIn origin-top-right">
      <p className="text-sm text-gray-600">No notifications yet 🔔</p>
    </div>
  )}
</div>

      {/* Bouton user icon */}
      <button onClick={handleClick}>
        <img src="/assets/navbar/user.svg" alt="User Icon" />
      </button>

      {/* Bouton logout visible si connecté */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="text-sm font-bold text-violet-600 hover:text-violet-800"
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default UserIconButton;