import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src="/assets/products/ProductsPage.png"
        alt="Products Page"
        className="absolute top-5 left-0 w-full h-full object-cover"
      />

      <button
        onClick={() => navigate("/cart")}
        className="absolute bottom-[10%] left-[40%] w-[20%] h-10 text-transparent underline"
      >
        Aller au Panier
      </button>
    </div>
  );
}