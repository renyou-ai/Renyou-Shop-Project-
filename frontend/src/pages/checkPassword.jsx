import { useNavigate } from "react-router-dom";

export default function CheckPassword() {
  const navigate = useNavigate();

  const handleOpenEmailApp = () => {
    // Ici tnajjem t7ot logique bch y7el email app (par ex. mailto:)
    window.location.href = "mailto:";
  };

  const handleResendLink = () => {
    alert("Lien de réinitialisation renvoyé !");
    // Ici tnajjem t7ot axios.post("/api/auth/resend-link") si t7eb
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-start bg-gray-100 overflow-hidden">
      {/* Background */}
      <img
        src="/assets/check password page/CheckBackground.svg"
        alt="Check Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Rectangle blanc centré */}
      <div className="relative mt-10 bg-white rounded-lg shadow-lg p-6 w-[420px] flex flex-col items-center animate-popIn">
        
        {/* Logo Renyou */}
        <img
          src="/assets/check password page/RenyouLogo.svg"
          alt="Renyou Logo"
          className="w-[200px] h-auto mb-4"
        />

        {/* Container Title */}
        <img
          src="/assets/check password page/EmailCheckTitle.svg"
          alt="Email Check Title"
          className="w-[250px] h-auto mb-6"
        />

        {/* Open Email App Button */}
        <button onClick={handleOpenEmailApp} className="mb-4">
          <img
            src="/assets/check password page/CheckButton.svg"
            alt="Open Email App"
            className="w-[250px] h-[45px] object-contain"
          />
        </button>

        {/* Resend Link Button */}
        <button onClick={handleResendLink} className="mb-4">
          <img
            src="/assets/check password page/ResendButton.svg"
            alt="Resend Link"
            className="w-[250px] h-[45px] object-contain"
          />
        </button>

        {/* Back to Login Button */}
        <button onClick={() => navigate("/login")} className="mb-2">
          <img
            src="/assets/check password page/BackButton.svg"
            alt="Back to Login"
            className="w-[200px] h-[40px] object-contain"
          />
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 flex justify-center">
        <img
          src="/assets/check password page/Footer.svg"
          alt="Footer"
          className="h-[20px] object-contain"
        />
      </div>
    </div>
  );
}