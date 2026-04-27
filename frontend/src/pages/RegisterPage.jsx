import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [skinType, setSkinType] = useState("");
  const [agree, setAgree] = useState(false);

  const handleRegister = async () => {
    try {
      const res = await axios.post("/api/auth/register", {
        fullName,
        email,
        password,
        confirmPassword,
        skinType,
        agree,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert("Erreur lors de l'inscription !");
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-start bg-gray-100 overflow-hidden">
      {/* Background */}
      <img
        src="/assets/register page/RegisterBackground.svg"
        alt="Register Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

{/* Logo Renyou (top center, bigger & clearer, clickable) */}
<div className="relative mt-3 flex justify-center">
  <button
    onClick={() => navigate("/")}
    className="focus:outline-none transition duration-300 ease-in-out 
               transform hover:scale-110 hover:drop-shadow-lg active:scale-95 cursor-pointer"
  >
    <img
      src="/assets/LoginPage/LogoSection.svg"
      alt="Renyou Logo"
      className="w-[300px] h-auto object-contain cursor-pointer"
    />
  </button>
</div>


      {/* Rectangle blanc principal */}
      <div className="relative mt-1.5 bg-white rounded-lg shadow-lg p-0 w-[350px] flex flex-col items-center animate-popIn">
        
        {/* Register Up Logo */}
        <img
          src="/assets/register page/RegisterUpLogo.svg"
          alt="Register Up Logo"
          className="w-full h-auto mb-[-25px] relative top-[0px]"
        />

        {/* Register Title */}
        <img
          src="/assets/register page/RegisterTitle.svg"
          alt="Register Title"
          className="w-[300px] h-auto mb-2 relative top-[-10px]"
        />

        {/* Full Name */}
        <img
          src="/assets/register page/FullNameLabel.svg"
          alt="Full Name Label"
          className="w-[75px] h-auto mb-2.5 relative left-[12px] self-start"
        />
        <div className="relative w-full mb-4">
          {!fullName && (
            <div className="absolute inset-0 flex items-center px-3 text-gray-500 pointer-events-none">
              <img
                src="/assets/register page/Person.svg"
                alt="Person Icon"
                className="w-5 h-5 mr-2 relative top-[3px]"
              />
              <span>Jhon Doe</span>
            </div>
          )}
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-[30px] border px-3 rounded bg-transparent text-black shadow-inner
                 transition duration-300 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:scale-100"
          />
        </div>

        {/* Email */}
        <img
          src="/assets/register page/AddressLabel.svg"
          alt="Email Label"
          className="w-[100px] h-auto mb-4 relative left-[12px] self-start"
        />
        <div className="relative w-full mb-4">
          {!email && (
            <div className="absolute inset-0 flex items-center px-3 text-gray-500 pointer-events-none">
              <img
                src="/assets/register page/envelope.svg"
                alt="Envelope Icon"
                className="w-5 h-5 mr-2"
              />
              <span>name@example.com</span>
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[30px] border px-3 rounded bg-transparent text-black shadow-inner
                 transition duration-300 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:scale-100"
          />
        </div>

       {/* Password + Confirm Password side by side */}
<div className="flex w-full gap-3 mb-4">
  {/* Password */}
  <div className="flex-1">
    <img
      src="/assets/register page/PassLabel.svg"
      alt="Password Label"
      className="w-[75px] h-auto mb-4 relative left-[12px] self-start"
    />
    <div className="relative w-full">
      {!password && (
        <div className="absolute inset-0 flex items-center px-3 text-gray-500 pointer-events-none">
          <img
            src="/assets/register page/lock.svg"
            alt="Lock Icon"
            className="w-5 h-5 mr-2"
          />
          <img
            src="/assets/register page/les8points.svg"
            alt="8 Points"
            className="h-4"
          />
        </div>
      )}
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full h-[30px] border px-3 rounded bg-transparent text-black shadow-inner
         transition duration-300 ease-in-out
         focus:outline-none focus:ring-2 focus:ring-violet-500 focus:scale-100"
      />
      {/* Eye toggle */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1 cursor-pointer"
      >
        <img
          src={
            showPassword
              ? "/assets/register page/crossed-eye.svg"
              : "/assets/register page/eye.svg"
          }
          alt="Toggle Password Visibility"
          className="w-5 h-5"
        />
      </button>
    </div>
  </div>

  {/* Confirm Password */}
  <div className="flex-1">
    <img
      src="/assets/register page/ConfirmPassLabel.svg"
      alt="Confirm Password Label"
      className="w-[135px] h-auto mb-4 relative left-[12px] self-start"
    />
    <div className="relative w-full">
      {!confirmPassword && (
        <div className="absolute inset-0 flex items-center px-3 text-gray-500 pointer-events-none">
          <img
            src="/assets/register page/ReTypePassLogo.svg"
            alt="ReType Icon"
            className="w-5 h-5 mr-2"
          />
          <img
            src="/assets/register page/les8points.svg"
            alt="8 Points"
            className="h-4"
          />
        </div>
      )}
      <input
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full h-[30px] border px-3 rounded bg-transparent text-black shadow-inner
         transition duration-300 ease-in-out
         focus:outline-none focus:ring-2 focus:ring-violet-500 focus:scale-100"
      />
      {/* Eye toggle */}
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute right-2 top-1 cursor-pointer"
      >
        <img
          src={
            showConfirmPassword
              ? "/assets/register page/crossed-eye.svg"
              : "/assets/register page/eye.svg"
          }
          alt="Toggle Confirm Password Visibility"
          className="w-5 h-5"
        />
      </button>
    </div>
  </div>
</div>

{/* Skin Type */}
<div className="flex items-center mb-4">
  <img
    src="/assets/register page/TellUs.svg"
    alt="Tell Us Label"
    className="h-[17px] mr-[10px] relative left-[-36px] self-start"
  />
  <img
    src="/assets/register page/OPTIONAL.svg"
    alt="Optional Label"
    className="h-[17px] ml-[10px] relative right-[50px]"
  />
</div>

        <div className="relative w-full mb-4">
          {!skinType && (
            <div className="absolute inset-0 flex items-center px-3 text-gray-500 pointer-events-none">
              <img
                src="/assets/register page/SkinLogo.svg"
                alt="Skin Logo"
                className="w-5 h-5 mr-2"
              />
              <span>Choose your skin type</span>
            </div>
          )}
          <select
            value={skinType}
            onChange={(e) => setSkinType(e.target.value)}
            className="w-full h-[30px] border px-3 rounded bg-white text-black shadow-inner 
               transition duration-300 ease-in-out 
               focus:outline-none focus:ring-2 focus:ring-violet-500 focus:scale-100"
          >
            <option value=""></option>
            <option value="dry">Dry</option>
            <option value="oily">Oily</option>
            <option value="normal">Normal</option>
            <option value="combination">Combination</option>
          </select>
        </div>

        {/* Agree Checkbox */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mr-2 w-4 h-3.5"
          />
          <img
            src="/assets/register page/Iagree.svg"
            alt="I Agree"
            className="h-[13px]"
          />
        </div>

        {/* Create Account Button */}
<button
  onClick={handleRegister}
  className="mb-1 focus:outline-none transition duration-300 ease-in-out 
             transform hover:scale-105 active:scale-95"
>
  <img
    src="/assets/register page/RegisterButton.svg"
    alt="Create Account"
    className="w-[360px] h-[50px] object-contain cursor-pointer"
  />
</button>

        {/* Already have account */}
        <div className="flex items-center mb-4">
          <img
            src="/assets/register page/Already.svg"
            alt="Already Text"
            className="h-[16px] mr-2"
          />
          <button onClick={() => navigate("/login")}
  className="group focus:outline-none"
>
  <img
    src="/assets/register page/LoginLink.svg"
    alt="Login Link"
    className="h-[16px] cursor-pointer transition duration-300 ease-in-out 
               group-hover:scale-105 group-hover:opacity-90"
  />
  {/* Souligné animé */}
  <div className="w-0 h-[2px] bg-violet-500 transition-all duration-300 ease-in-out group-hover:w-full"></div>
</button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 flex justify-center">
        <img
          src="/assets/register page/Footer.svg"
          alt="Footer"
          className="h-[10px] object-contain"
        />
      </div>
    </div>
  );
}