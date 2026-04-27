import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  const handleRequest = async () => {
    try {
      await axios.post("/api/auth/forgot-password-request", { email });
      alert("Lien de réinitialisation envoyé !");
    } catch (err) {
      alert("Erreur lors de l'envoi !");
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-start bg-gray-100 overflow-hidden">
      {/* Background */}
      <img
        src="/assets/forgot password request page/ForgotBackground.svg"
        alt="Forgot Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Rectangle blanc centré */}
      <div className="relative mt-10 bg-white rounded-lg shadow-lg p-6 w-[420px] flex flex-col items-center animate-popIn">
        
        {/* Logo Renyou */}
        <img
          src="/assets/forgot password request page/RenyouLogo.svg"
          alt="Renyou Logo"
          className="w-[200px] h-auto mb-4"
        />

        {/* Container Title */}
        <img
          src="/assets/forgot password request page/ForgotTitle.svg"
          alt="Forgot Title"
          className="w-[320px] h-auto mb-6"
        />

        {/* Email Label */}
        <img
          src="/assets/forgot password request page/EmailLabel.svg"
          alt="Email Label"
          className="w-[400px] h-auto mb-2 self-start"
        />

        {/* Email Input */}
        <div className="relative w-full mb-6">
          {!emailFocused && email === "" && (
            <div className="absolute inset-0 flex items-center px-3 text-gray-500 pointer-events-none shadow-inner rounded">
              <img
                src="/assets/forgot password request page/envelope.svg"
                alt="Envelope Icon"
                className="w-5 h-4 mr-2"
              />
              <span>Enter your email</span>
            </div>
          )}
          <input
            type="email"
            value={email}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[40px] border px-3 rounded bg-transparent text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 focus:scale-100"
          />
        </div>

        {/* Send Reset Link Button */}
        <button onClick={handleRequest} className="mb-4">
          <img
            src="/assets/forgot password request page/ForgotButton.svg"
            alt="Send Reset Link"
            className="w-[320px] h-[70px] object-contain transition duration-300 ease-in-out 
             hover:scale-105 active:scale-95 cursor-pointer"
          />
        </button>

        {/* Back to Login Button */}
        <button onClick={() => navigate("/login")} className="mb-2">
          <img
            src="/assets/forgot password request page/BackButton.svg"
            alt="Back to Login"
            className="w-[420px] h-[70px] object-contain transition duration-300 ease-in-out 
             hover:scale-105 active:scale-95 cursor-pointer"
          />
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 flex justify-center">
        <img
          src="/assets/forgot password request page/Footer.svg"
          alt="Footer"
          className="h-[20px] object-contain"
        />
      </div>
    </div>
  );
}