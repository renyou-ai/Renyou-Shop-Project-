import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgot = async () => {
    try {
      await axios.post("/api/auth/forgot-password", { email });
      alert("Lien de réinitialisation envoyé !");
    } catch (err) {
      alert("Erreur lors de l'envoi !");
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background image du design forgot password */}
      <img
        src="/assets/login page/ForgotPage.png"
        alt="Forgot Password Design"
        className="w-full h-full object-cover"
      />

      {/* Zone input email */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="absolute top-[45%] left-[35%] w-[30%] h-10 border px-2 bg-transparent text-black"
        placeholder="Votre email"
      />

      {/* Bouton envoyer */}
      <button
        onClick={handleForgot}
        className="absolute top-[55%] left-[35%] w-[30%] h-10 bg-purple-600 text-white rounded"
      >
        Envoyer lien
      </button>
    </div>
  );
}