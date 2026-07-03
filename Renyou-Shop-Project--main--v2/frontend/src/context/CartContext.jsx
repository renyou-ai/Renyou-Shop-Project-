// PATH: frontend/src/context/CartContext.jsx

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api } from "../services/api.js";


const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items,       setItems]       = useState(() => {
    try { return JSON.parse(localStorage.getItem("renyou_cart") || "[]"); } catch { return []; }
  });
  const [isCartOpen,  setIsCartOpen]  = useState(false);
  const [coupon,      setCoupon]      = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("renyou_cart", JSON.stringify(items));
  }, [items]);

  // Add item or increment qty
  const addToCart = useCallback((product, qty = 1) => {
  setItems((prev) => {
    const productId = product._id || product.id;

    const exists = prev.find(
      (i) => (i._id || i.id) === productId
    );

    if (exists) {
      return prev.map((i) =>
        (i._id || i.id) === productId
          ? { ...i, qty: i.qty + qty }
          : i
      );
    }

    return [
      ...prev,
      {
        ...product,
        _id: productId,
        qty,
      },
    ];
  });
}, []);

  // Remove item entirely
  const removeFromCart = useCallback((id) => {
  setItems((prev) =>
    prev.filter((i) => (i._id || i.id) !== id)
  );
}, []);

  // Update qty directly
  const updateQty = useCallback((id, qty) => {
  if (qty < 1) return;

  setItems((prev) =>
    prev.map((i) =>
      (i._id || i.id) === id
        ? { ...i, qty }
        : i
    )
  );
}, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
    setCouponError("");
  }, []);

  // Validate promo code against real API
  const subtotal = items.reduce(
  (s, i) =>
    s +
    (i.finalPrice || i.salePrice || i.price) * i.qty,
  0
);

  const applyCoupon = useCallback(async (code) => {
  if (!code?.trim()) return;

  try {
    setCouponLoading(true);
    setCouponError("");

    const data = await api.getCoupons();

    const found = (data.coupons || data || []).find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase()
    );

    if (!found) {
      setCouponError("Invalid promo code");
      return;
    }

    if (found.status !== "ACTIVE") {
      setCouponError("This promo code is inactive");
      return;
    }

    if (
      found.expiresAt &&
      new Date(found.expiresAt) < new Date()
    ) {
      setCouponError("This promo code has expired");
      return;
    }

    if (
      found.minPurchase &&
      subtotal < found.minPurchase
    ) {
      setCouponError(
        `Minimum purchase is $${found.minPurchase}`
      );
      return;
    }

    setCoupon(found);

  } catch (err) {
    console.error(err);
    setCouponError("Could not validate coupon");
  } finally {
    setCouponLoading(false);
  }
}, [subtotal]);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError("");
  }, []);

  // Create real order via API
  const checkout = useCallback(async (shippingData) => {
    const orderPayload = {
      items: items.map((i) => ({
  product: i._id || i.id,
  productName: i.name,
  quantity: i.qty,
  price: i.finalPrice || i.salePrice || i.price,
  image: i.image,
  isBundle: i.isBundle || false,
})),
      couponCode: coupon?.code,
      shippingAddress: shippingData?.address,
      paymentMethod: shippingData?.paymentMethod || "COD",
    };

    const order = await api.createOrder(orderPayload);
    clearCart();
    return order;
  }, [items, coupon, clearCart]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const discount = coupon
  ? coupon.discountType === "percentage"
    ? subtotal * (coupon.discountValue / 100)
    : Math.min(coupon.discountValue, subtotal)
  : 0;
  const shipping   = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const tax        = (subtotal - discount) * 0.08;
  const totalPrice = subtotal - discount + shipping + tax;

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQty, clearCart,
      totalItems, subtotal, discount, shipping, tax, totalPrice,
      isCartOpen, setIsCartOpen,
      coupon, couponError, couponLoading, applyCoupon, removeCoupon,
      checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}