import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer token depuis URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassFocused, setNewPassFocused] = useState(false);
  const [confirmPassFocused, setConfirmPassFocused] = useState(false);

  const handleReset = async () => {
    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert("Erreur lors de la réinitialisation !");
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-start bg-gray-100 overflow-hidden">
      {/* Background */}
      <img
        src="/assets/reset password page/ResetBackground.svg"
        alt="Reset Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Rectangle blanc centré */}
      <div className="relative mt-10 bg-white rounded-lg shadow-lg p-6 w-[420px] flex flex-col items-center animate-popIn">
        
        {/* Logo Renyou */}
        <img
          src="/assets/reset password page/RenyouLogo.svg"
          alt="Renyou Logo"
          className="w-[200px] h-auto mb-4"
        />

        {/* Container Title */}
        <img
          src="/assets/reset password page/ResetTitle.svg"
          alt="Reset Title"
          className="w-[250px] h-auto mb-6"
        />

        {/* New Password Label */}
        <img
          src="/assets/reset password page/NewPassLabel.svg"
          alt="New Password Label"
          className="w-[150px] h-auto mb-1 self-start"
        />

        {/* New Password Input */}
        <div className="relative w-full mb-6">
          {!newPassFocused && newPassword === "" && (
            <div className="absolute inset-0 flex items-center px-3 text-gray-500 pointer-events-none shadow-inner rounded">
              <span>Enter new password</span>
            </div>
          )}
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onFocus={() => setNewPassFocused(true)}
            onBlur={() => setNewPassFocused(false)}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full h-[40px] border px-3 rounded bg-transparent text-black shadow-inner pr-10"
          />
          {/* Toggle show/hide password */}
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showNewPassword ? (
              <img
                src="/assets/reset password page/crossed-eye.svg"
                alt="Hide Password"
                className="w-5 h-5"
              />
            ) : (
              <img
                src="/assets/reset password page/eye.svg"
                alt="Show Password"
                className="w-5 h-5"
              />
            )}
          </button>
        </div>

        {/* Confirm New Password Input */}
        <div className="relative w-full mb-6">
          {!confirmPassFocused && confirmPassword === "" && (
            <div className="absolute inset-0 flex items-center px-3 text-gray-500 pointer-events-none shadow-inner rounded">
              <span>Confirm your new password</span>
            </div>
          )}
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onFocus={() => setConfirmPassFocused(true)}
            onBlur={() => setConfirmPassFocused(false)}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-[40px] border px-3 rounded bg-transparent text-black shadow-inner pr-10"
          />
          {/* Toggle show/hide password */}
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showConfirmPassword ? (
              <img
                src="/assets/reset password page/crossed-eye.svg"
                alt="Hide Password"
                className="w-5 h-5"
              />
            ) : (
              <img
                src="/assets/reset password page/eye.svg"
                alt="Show Password"
                className="w-5 h-5"
              />
            )}
          </button>
        </div>

        {/* Reset Password Button */}
        <button onClick={handleReset} className="mb-4">
          <img
            src="/assets/reset password page/ResetPassButton.svg"
            alt="Reset Password"
            className="w-[250px] h-[45px] object-contain"
          />
        </button>

        {/* Back to Login Button */}
        <button onClick={() => navigate("/login")} className="mb-2">
          <img
            src="/assets/reset password page/BackButton.svg"
            alt="Back to Login"
            className="w-[200px] h-[40px] object-contain"
          />
        </button>
      </div>
    </div>
  );
}