import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IAsearchSection({
  aiInputStyle = { top: "5.7rem", left: "1rem", width: "23.5rem", height: "3rem" },
  aiButtonStyle = { top: "6.3rem", left: "25.1rem", width: "7.2rem", height: "1.9rem" },
  routineButtonStyle = { top: "9.8rem", left: "3.8rem", width: "11rem", height: "1.7rem" },
  matchButtonStyle = { top: "9.8rem", left: "16rem", width: "14rem", height: "1.7rem" }
}) {
  const [aiQuery, setAiQuery] = useState("");
  const navigate = useNavigate();

  const handleAiSearch = () => {
    if (!aiQuery.trim()) {
      alert("⚠️ Champ vide !");
    } else {
      alert(`✨ Renyou Ai searching : "${aiQuery}"`);
    }
  };

  return (
    <div className="relative w-full">
      <img
        src="/assets/background/IAsearchSection.png"
        alt="IA Search Section"
        className="w-full"
      />

      {/* Box rectangle lbidha → input AI search */}
      <div
        style={{ position: "absolute", ...aiInputStyle }}
        className="border bg-white flex items-center px-2"
      >
        <input
          type="text"
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          placeholder="I want to minimise my pores"
          className="w-full outline-none"
        />
      </div>

      {/* Box bleu Ask Renyou Ai → cliquable */}
      <div
        onClick={handleAiSearch}
        style={{ position: "absolute", ...aiButtonStyle }}
        className="bg-transparent text-transparent flex items-center justify-center cursor-pointer rounded"
      >
        Ask Renyou Ai
      </div>

      {/* Bouton Discover your routine */}
      <div
        onClick={() => navigate("/routine")}
        style={{ position: "absolute", ...routineButtonStyle }}
        className="bg-transparent text-transparent flex items-center justify-center cursor-pointer rounded"
      >
        Discover your routine
      </div>

      {/* Bouton Find me match-perfect products */}
      <div
        onClick={() => navigate("/products-match")}
        style={{ position: "absolute", ...matchButtonStyle }}
        className="bg-transparent text-transparent flex items-center justify-center cursor-pointer rounded"
      >
        Find me match-perfect products
      </div>
    </div>
  );
}