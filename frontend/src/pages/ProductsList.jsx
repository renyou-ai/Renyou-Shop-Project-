import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

// 🔹 Imports SVG (head bar)
import ShowingIcon from "/assets/products page/Products/Showing.svg";
import SortByIcon from "/assets/products page/Products/SortBy.svg";
import SortByBoxIcon from "/assets/products page/Products/SortByBox.svg";
import FlecheIcon from "/assets/products page/Products/Fleche.svg";

// 🔹 Imports SVG (products)
import AddToCartIcon from "/assets/products page/Products/AddToCart.svg";
import FavorisIcon from "/assets/products page/Products/Favoris.svg";
import P1 from "/assets/products page/Products/P1.svg";
import P2 from "/assets/products page/Products/P2.svg";
import P3 from "/assets/products page/Products/P3.svg";
import P4 from "/assets/products page/Products/P4.svg";
import P5 from "/assets/products page/Products/P5.svg";
import P6 from "/assets/products page/Products/P6.svg";
import P7 from "/assets/products page/Products/P7.svg";
import P8 from "/assets/products page/Products/P8.svg";
import P9 from "/assets/products page/Products/P9.svg";

// 🔹 Imports SVG (pagination)
import PrevIcon from "/assets/products page/Products/Prev.svg";
import Page1Icon from "/assets/products page/Products/1.svg";
import Page2Icon from "/assets/products page/Products/2.svg";
import Page3Icon from "/assets/products page/Products/3.svg";
import ThreeDotsIcon from "/assets/products page/Products/3pts.svg";
import NextIcon from "/assets/products page/Products/Next.svg";

export default function ProductsList() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Most Popular");
  const [favorites, setFavorites] = useState({});
  const toggleFavorite = (id) =>
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));

  const products = [
    { id: 1, img: P1 },
    { id: 2, img: P2 },
    { id: 3, img: P3 },
    { id: 4, img: P4 },
    { id: 5, img: P5 },
    { id: 6, img: P6 },
    { id: 7, img: P7 },
    { id: 8, img: P8 },
    { id: 9, img: P9 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Navbar */}
      <Navbar />

      {/* 🔹 Breadcrumb */}
      <div className="flex items-center gap-2 px-6 py-4 text-sm">
        <Link to="/home" className="text-gray-600 hover:text-violet-600">
          Home
        </Link>
        <span className="text-gray-400">{">"}</span>
        <span className="text-gray-600">Vitamins & Supplements</span>
        <span className="text-gray-400">{">"}</span>
        <span className="text-violet-600 font-medium">MultiVitamins</span>
      </div>

      {/* 🔹 Content (2 colonnes) */}
      <div className="flex flex-1 px-6 py-4">
        {/* Bloc gauche (filters) */}
        <aside className="w-64 p-4">
  
{/* Category */}
<div className="mb-6">
<img
src="/assets/products page/Category/Category.svg"
alt="Category"
className="mb-6"
/>
<div className="space-y-2">
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" defaultChecked />
<img src="/assets/products page/Category/MVs.svg" alt="Multivitamins" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Category/VitaminC.svg" alt="Vitamin C" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Category/VitaminD.svg" alt="Vitamin D" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Category/Omega3.svg" alt="Omega 3" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Category/Minerals.svg" alt="Minerals" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Category/Pre.svg" alt="Pre & Probiotics" />
</label>
</div>
</div>

{/* Trait séparateur */}
<hr className="border-gray-200 my-5" />

{/* Brand */}
<div className="mb-6">
<img
src="/assets/products page/Brand/Brand.svg"
alt="Brand"
className="mb-6"
/>
<div className="space-y-2">
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Brand/Centrum.svg" alt="Centrum" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Brand/NatureMade.svg" alt="Nature Made" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Brand/Solgar.svg" alt="Solgar" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Brand/NOWFoods.svg" alt="NOW Foods" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Brand/OLLY.svg" alt="OLLY" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Brand/Garden.svg" alt="Garden of Life" />
</label>
</div>
</div>

{/* Trait séparateur */}
<hr className="border-gray-200 my-5" />

{/* Price Range */}
<div className="mb-6">
<img
src="/assets/products page/Price Range/Price.svg"
alt="Price Range"
className="mb-6"
/>
<div className="flex items-center space-x-2">

{/* Min price */}
<div className="relative">
<img
src="/assets/products page/Price Range/Box.svg"
alt="Min Price Box"
/>
<div className="absolute inset-y-0 left-2 flex items-center">
<img
src="/assets/products page/Price Range/$.svg"
alt="Dollar"
className="w-4 h-4"
/>
</div>
<input
type="number"
placeholder="Min"
min="0"
step="1"
className="absolute inset-0 pl-8 w-full h-full bg-transparent outline-none text-violet-600"
/>
</div>

{/* Tiret */}
<img
src="/assets/products page/Price Range/-.svg"
alt="Separator"
className="w-4 h-4"
/>

{/* Max price */}
<div className="relative">
<img
src="/assets/products page/Price Range/Box.svg"
alt="Max Price Box"
/>
<div className="absolute inset-y-0 left-2 flex items-center">
<img
src="/assets/products page/Price Range/$.svg"
alt="Dollar"
className="w-4 h-4"
/>
</div>
<input
type="number"
placeholder="Max"
min="0"
step="1"
className="absolute inset-0 pl-8 w-full h-full bg-transparent outline-none text-violet-600"
/>
</div>

</div>
</div>

{/* Trait séparateur */}
<hr className="border-gray-200 my-5" />

{/* Rating */}
<div className="mb-6">
<img
src="/assets/products page/Rating/Rating.svg"
alt="Rating"
className="mb-6"
/>
<div className="space-y-2">
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Rating/4stars.svg" alt="4 stars and up" />
</label>
<label className="flex items-center space-x-2 accent-violet-600">
<input type="checkbox" />
<img src="/assets/products page/Rating/3stars.svg" alt="3 stars and up" />
</label>
</div>
</div>
        </aside>

        {/* Bloc droit (products section) */}
        <main className="flex-1 p-6">
{/* Head bar */}
<div className="flex justify-between items-center border-b pb-4">
  {/* Showing */}
  <div className="flex items-center gap-2">
    <img src={ShowingIcon} alt="Showing" className="w-[150px] h-6" /> 
    {/* 🔹 taille contrôlée b w-6 h-6 */}
  </div>

  {/* SortBy */}
  <div className="flex items-center gap-2">
    <img src={SortByIcon} alt="SortBy" className="w-[45px] h-6" /> 
    {/* 🔹 taille contrôlée b w-6 h-6 */}

    {/* SortBy Box avec dropdown */}
    <div className="relative">
      <button
  onClick={() => setOpen(!open)}
  className="relative flex items-center w-40 h-8 border rounded px-2 hover:border-violet-600 transition"
>
  <span className="px-1 py-2 text-[14px] font-medium font-inter cursor-pointer">
    {selected}
  </span>
  <img
    src={FlecheIcon}
    alt="Dropdown"
    className="w-4 h-4 ml-auto"
  />
</button>


      {/* Dropdown menu */}
{open && (
  <ul className="absolute right-0 mt-1 w-40 bg-white border rounded shadow-lg z-10">
    {["Most Popular", "Price Low → High", "Price High → Low"].map((option) => (
      <li
        key={option}
        onClick={() => {
          setSelected(option);
          setOpen(false);
        }}
        className="px-3 py-2 text-[14px] font-medium font-inter hover:bg-violet-100 cursor-pointer"
      >
        {option}
      </li>
    ))}
  </ul>
)}

    </div>
  </div>
</div>


          {/* Products grid */}
          <div className="grid grid-cols-3 gap-6 py-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="relative flex flex-col items-center border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <img src={p.img} alt={`Product ${p.id}`} className="w-full" />

                {/* Favoris */}
<button
  onClick={() => toggleFavorite(p.id)}
  className="absolute top-5 right-[15px] cursor-pointer"
>
  <svg
    viewBox="0 0 24 24"
    className={`w-7 h-7 transition duration-300 ${
      favorites[p.id] ? "scale-125" : "scale-100"
    }`}
    fill={favorites[p.id] ? "#ff3040" : "none"}
    stroke="#262626"
    strokeWidth="2"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
      2 6 4 4 6.5 4 
      c1.74 0 3.41 0.81 4.5 2.09 
      C12.09 4.81 13.76 4 15.5 4 
      18 4 20 6 20 8.5 
      c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
</button>


                {/* Add to Cart */}
                <button className="mt-4 mb-4">
                  <img
                    src={AddToCartIcon}
                    alt="Add to Cart"
                    className="w-[280px] hover:scale-105 transition"
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-5 py-10">
            <img src={PrevIcon} alt="Prev" className="w-15 h-6 cursor-pointer hover:scale-110 transition" />
            <img src={Page1Icon} alt="Page1" className="w-15 h-6 cursor-pointer bg-violet-200 rounded hover:bg-violet-400 transition" />
            <img src={Page2Icon} alt="Page2" className="w-15 h-6 cursor-pointer hover:bg-violet-200 rounded transition" />
            <img src={Page3Icon} alt="Page3" className="w-15 h-6 cursor-pointer hover:bg-violet-200 rounded transition" />
            <img src={ThreeDotsIcon} alt="..." className="w-15 h-6" />
            <img src={NextIcon} alt="Next" className="w-15 h-6 cursor-pointer hover:scale-110 transition" />
          </div>
        </main>
      </div>
    </div>
  );
}