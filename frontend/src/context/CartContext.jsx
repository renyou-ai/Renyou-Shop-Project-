import { createContext, useContext, useState } from "react";

// Création du contexte
const CartContext = createContext();

// Hook pour utiliser le contexte facilement
export const useCart = () => useContext(CartContext);

// Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Ajouter produit
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  // Supprimer produit
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // Vider panier
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};