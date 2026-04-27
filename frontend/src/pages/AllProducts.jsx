import React from "react";
import Navbar from "../components/Navbar"; // 🔹 nafsou mta3 l'accueil
import { Link } from "react-router-dom";

// 🔹 Imports SVG files men public/assets
import HomeIcon from "/assets/products page/Home.svg";
import FlecheIcon from "/assets/products page/Fleche.svg";
import VSIcon from "/assets/products page/V&S.svg";
import MVIcon from "/assets/products page/MV.svg";

export default function AllProducts() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Navbar nafsou mta3 l'accueil */}
      <Navbar />

      {/* 🔹 Breadcrumb */}
      <div className="flex items-center gap-2 px-6 py-4 text-sm">
        {/* Home */}
        <Link to="/home" className="flex items-center gap-1 text-gray-600 hover:text-violet-600">
          <img src={HomeIcon} alt="Home" className="w-4 h-4" />
          <span>Home</span>
        </Link>

        {/* Fleche */}
        <img src={FlecheIcon} alt=">" className="w-3 h-3" />

        {/* Vitamins & Supplements */}
        <Link to="/products" className="flex items-center gap-1 text-gray-600 hover:text-violet-600">
          <img src={VSIcon} alt="Vitamins & Supplements" className="w-4 h-4" />
          <span>Vitamins & Supplements</span>
        </Link>

        {/* Fleche */}
        <img src={FlecheIcon} alt=">" className="w-3 h-3" />

        {/* MultiVitamins (current page) */}
        <div className="flex items-center gap-1 text-violet-600 font-medium">
          <img src={MVIcon} alt="MultiVitamins" className="w-4 h-4" />
          <span>MultiVitamins</span>
        </div>
      </div>

      {/* 🔹 Content placeholder (ba3d nzidou liste produits) */}
      <div className="flex-1 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">All Products - MultiVitamins</h1>
        <p className="text-gray-500">Here we will display the list of all MultiVitamins products...</p>
      </div>
    </div>
  );
}