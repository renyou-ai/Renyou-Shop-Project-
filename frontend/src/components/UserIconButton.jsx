import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function UserIconButton() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérification automatique du token
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("authToken");
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
      navigate("/products-list"); // connecté → products-list
    } else {
      navigate("/login"); // sinon → login
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="flex items-center space-x-4">
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