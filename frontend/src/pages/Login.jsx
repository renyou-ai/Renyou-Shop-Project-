import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  // ✅ LOGIN NORMAL
  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      alert("Login réussi !");
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      navigate("/products-list");
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion !");
    }
  };

  // ✅ GOOGLE LOGIN (CUSTOM SVG)
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("http://localhost:5000/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: tokenResponse.access_token,
          }),
        });

        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/home");
      } catch (err) {
        console.error("Google login error:", err);
      }
    },
    onError: () => console.log("Google Login Failed"),
  });

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-start bg-gray-100 overflow-hidden">
      
      {/* Background */}
      <img
        src="/assets/LoginPage/LoginBackground.svg"
        alt="Login Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Logo */}
      <div className="relative mt-3 flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="transition duration-300 hover:scale-110 active:scale-95"
        >
          <img
            src="/assets/LoginPage/LogoSection.svg"
            alt="Logo"
            className="w-[300px]"
          />
        </button>
      </div>

      {/* Card */}
      <div className="relative mt-3 bg-white rounded-lg shadow-lg p-6 w-[420px] flex flex-col items-center animate-popIn">
{/* Container Title aligné left */}
<div className="self-start mb-4">
<img
src="/assets/LoginPage/Container.svg"
alt="Login Container Title"
className="w-[280px] h-auto"
/>
</div>

{/* Email */}
<img
src="/assets/LoginPage/LabelEmail.svg"
alt="Email Label"
className="w-[320px] h-auto mb-1 self-start"
/>
<div className="relative w-full mb-4">
{!emailFocused && email === "" && (
<div className="absolute inset-0 flex items-center px-3 text-gray-500 pointer-events-none shadow-inner rounded">
<img
src="/assets/LoginPage/envelope.svg"
alt="Envelope Icon"
className="w-5 h-5 mr-2"
/>
<span>admin@parapharmacy.com</span>
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

{/* Password */}
<img
src="/assets/LoginPage/PassLabel.svg"
alt="Password Label"
className="w-[320px] h-auto mb-1 self-start"
/>
<div className="relative w-full mb-4">
{!passFocused && password === "" && (
<div className="absolute inset-0 flex items-center px-3 text-gray-500 pointer-events-none shadow-inner rounded">
<img
src="/assets/LoginPage/lock.svg"
alt="Lock Icon"
className="w-5 h-5 mr-2"
/>
<img
            src="/assets/LoginPage/les8points.svg"
            alt="8 Points"
            className="h-4"
          />
        </div>
)}
<input
type={showPassword ? "text" : "password"}
value={password}
onFocus={() => setPassFocused(true)}
onBlur={() => setPassFocused(false)}
onChange={(e) => setPassword(e.target.value)}
className="w-full h-[40px] border px-3 rounded bg-transparent text-black shadow-inner pr-10 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:scale-100"
/>
{/* Toggle show/hide password */}
<button
type="button"
onClick={() => setShowPassword(!showPassword)}
className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
>
{showPassword ? (
<img
src="/assets/LoginPage/crossed-eye.svg"
alt="Hide Password"
className="w-5 h-5"
/>
) : (
<img
src="/assets/LoginPage/eye.svg"
alt="Show Password"
className="w-5 h-5"
/>
)}
</button>
</div>

{/* Options */}
<div className="flex justify-between items-center w-full mb-4">
<div className="flex items-center">
<input
type="checkbox"
checked={rememberMe}
onChange={(e) => setRememberMe(e.target.checked)}
className="mr-2"
/>
<img
src="/assets/LoginPage/RememberMe.svg"
alt="Remember Me"
className="h-[20px] object-contain"
/>
</div>
{/* Forgot Password */}
<button
onClick={() => navigate("/forgot-password-request")}
className="group flex flex-col items-center focus:outline-none transition duration-300 ease-in-out
transform hover:scale-105 active:scale-95 cursor-pointer"
>
<img
src="/assets/LoginPage/ForgotPass.svg"
alt="Forgot Password"
className="h-[20px] object-contain"
/>
{/* Souligné animé kif Login link */}
<div className="w-0 h-[2px] bg-violet-500 transition-all duration-300 ease-in-out group-hover:w-full"></div>
</button>

</div>

{/* Sign In */}
<button
onClick={handleLogin}
className="mb-4 focus:outline-none transition duration-300 ease-in-out
transform hover:scale-105 active:scale-95 cursor-pointer"
>
<img
src="/assets/LoginPage/SignInButton.svg"
alt="Sign In Button"
className="w-[300px] h-[45px] object-contain"
/>
</button>

{/* Sign Up */}
<button
onClick={() => navigate("/register")}
className="mb-4 focus:outline-none transition duration-300 ease-in-out
transform hover:scale-105 active:scale-95 cursor-pointer"
>
<img
src="/assets/LoginPage/SignUpButton.svg"
alt="Sign Up Button"
className="w-[300px] h-[45px] object-contain"
/>
</button>

{/* Divider */}
<img
src="/assets/LoginPage/Divider.svg"
alt="Divider"
className="w-full h-auto mb-[-8px]"
/>

        {/* 🔥 GOOGLE SVG BUTTON (CUSTOM) */}
        <button
          onClick={() => loginGoogle()}
          className="mb-2 focus:outline-none"
        >
          <img
            src="/assets/LoginPage/SignGoogle.svg"
            alt="Google Sign In"
            className="w-[350px] h-[45px] object-contain relative top-[10px]
                       transition duration-300 ease-in-out
                       hover:scale-105 active:scale-95 cursor-pointer"
          />
        </button>

      </div>

      {/* Footer */}
<div className="absolute bottom-4 flex justify-center gap-6">
<button onClick={() => alert("Technical Support")}>
<img
src="/assets/LoginPage/TechSuppFooter.svg"
alt="Technical Support"
className="h-[18px] cursor-pointer transition duration-300 ease-in-out
hover:scale-105 active:scale-95"
/>
</button>
<button onClick={() => alert("Privacy Policy")}>
<img
src="/assets/LoginPage/PrivacyPolicyFooter.svg"
alt="Privacy Policy"
className="h-[18px] cursor-pointer transition duration-300 ease-in-out
hover:scale-105 active:scale-95"
/>
</button>
</div>
</div>
);
}