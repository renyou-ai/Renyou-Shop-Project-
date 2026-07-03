// PATH: backend/controllers/cartController.js
import Cart from "../models/Cart.js";
import mongoose from "mongoose";

// ── Helper: populate cart fully ───────────────────────────────────
const populateCart = (query) =>
  query
    .populate("items.product", "name price salePrice images stockStatus sku slug brand category")
    .populate("coupon", "code type value minOrderAmount");

// ═══════════════════════════════════════════════════════════════════
// GET /api/cart
// Returns the current user's cart (creates one if it doesn't exist)
// ═══════════════════════════════════════════════════════════════════
export const getCart = async (req, res) => {
  try {
    let cart = await populateCart(
      Cart.findOne({ user: req.user.id })
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
      cart = await populateCart(Cart.findById(cart._id));
    }

    // Filter out items whose product was deleted
    const validItems = cart.items.filter((i) => i.product !== null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    return res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        coupon: cart.coupon,
        couponCode: cart.couponCode,
        couponDiscount: cart.couponDiscount,
        subtotal: cart.subtotal,
        total: cart.total,
        itemCount: cart.itemCount,
      },
    });
  } catch (err) {
    console.error("getCart:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════
// POST /api/cart/add
// Body: { productId, quantity? }
// ═══════════════════════════════════════════════════════════════════
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: "productId is required" });
    }

    const Product = mongoose.models.Product;
    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    if (product.stockStatus === "OUT_OF_STOCK") {
      return res.status(400).json({ success: false, error: "Product is out of stock" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );

    if (existingIndex >= 0) {
      // Already in cart — increment quantity
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        priceAtAdd: product.price,
        salePriceAtAdd: product.salePrice || null,
      });
    }

    await cart.save();

    const populated = await populateCart(Cart.findById(cart._id));

    return res.json({
      success: true,
      message: "Item added to cart",
      cart: {
        _id: populated._id,
        items: populated.items,
        coupon: populated.coupon,
        couponCode: populated.couponCode,
        couponDiscount: populated.couponDiscount,
        subtotal: populated.subtotal,
        total: populated.total,
        itemCount: populated.itemCount,
      },
    });
  } catch (err) {
    console.error("addToCart:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════
// PUT /api/cart/update
// Body: { productId, quantity }
// quantity = 0 → removes item
// ═══════════════════════════════════════════════════════════════════
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, error: "productId and quantity required" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }

    const idx = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );

    if (idx < 0) {
      return res.status(404).json({ success: false, error: "Item not in cart" });
    }

    if (Number(quantity) <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = Number(quantity);
    }

    await cart.save();

    const populated = await populateCart(Cart.findById(cart._id));

    return res.json({
      success: true,
      message: "Cart updated",
      cart: {
        _id: populated._id,
        items: populated.items,
        coupon: populated.coupon,
        couponCode: populated.couponCode,
        couponDiscount: populated.couponDiscount,
        subtotal: populated.subtotal,
        total: populated.total,
        itemCount: populated.itemCount,
      },
    });
  } catch (err) {
    console.error("updateCartItem:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════
// DELETE /api/cart/remove/:productId
// ═══════════════════════════════════════════════════════════════════
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }

    const before = cart.items.length;
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );

    if (cart.items.length === before) {
      return res.status(404).json({ success: false, error: "Item not found in cart" });
    }

    await cart.save();

    const populated = await populateCart(Cart.findById(cart._id));

    return res.json({
      success: true,
      message: "Item removed",
      cart: {
        _id: populated._id,
        items: populated.items,
        coupon: populated.coupon,
        couponCode: populated.couponCode,
        couponDiscount: populated.couponDiscount,
        subtotal: populated.subtotal,
        total: populated.total,
        itemCount: populated.itemCount,
      },
    });
  } catch (err) {
    console.error("removeFromCart:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════
// DELETE /api/cart/clear
// Empties the cart (keeps the cart document, removes all items + coupon)
// ═══════════════════════════════════════════════════════════════════
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.json({ success: true, message: "Cart already empty" });
    }

    cart.items = [];
    cart.coupon = null;
    cart.couponCode = null;
    cart.couponDiscount = 0;
    await cart.save();

    return res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error("clearCart:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════
// POST /api/cart/coupon
// Body: { code }  — apply a promo code to the cart
// ═══════════════════════════════════════════════════════════════════
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: "Coupon code is required" });
    }

    const Coupon = mongoose.models.Coupon;
    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      active: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, error: "Code promo invalide ou expiré" });
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: "Ce code promo a expiré" });
    }

    let cart = await populateCart(Cart.findOne({ user: req.user.id }));
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: "Votre panier est vide" });
    }

    const subtotal = cart.subtotal;

    // Check minimum order amount
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `Montant minimum requis: ${coupon.minOrderAmount} TND`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === "fixed") {
      discount = coupon.value;
    } else if (coupon.type === "free_shipping") {
      discount = 0; // handled at checkout
    }

    discount = Math.min(discount, subtotal); // cannot exceed subtotal

    cart.coupon = coupon._id;
    cart.couponCode = coupon.code;
    cart.couponDiscount = Math.round(discount * 100) / 100;
    await cart.save();

    const populated = await populateCart(Cart.findById(cart._id));

    return res.json({
      success: true,
      message: `Code "${coupon.code}" appliqué — ${coupon.type === "percentage" ? coupon.value + "%" : coupon.value + " TND"} de réduction`,
      cart: {
        _id: populated._id,
        items: populated.items,
        coupon: populated.coupon,
        couponCode: populated.couponCode,
        couponDiscount: populated.couponDiscount,
        subtotal: populated.subtotal,
        total: populated.total,
        itemCount: populated.itemCount,
      },
    });
  } catch (err) {
    console.error("applyCoupon:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════
// DELETE /api/cart/coupon
// Remove applied coupon
// ═══════════════════════════════════════════════════════════════════
export const removeCoupon = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }

    cart.coupon = null;
    cart.couponCode = null;
    cart.couponDiscount = 0;
    await cart.save();

    const populated = await populateCart(Cart.findById(cart._id));

    return res.json({
      success: true,
      message: "Code promo retiré",
      cart: {
        _id: populated._id,
        items: populated.items,
        coupon: null,
        couponCode: null,
        couponDiscount: 0,
        subtotal: populated.subtotal,
        total: populated.total,
        itemCount: populated.itemCount,
      },
    });
  } catch (err) {
    console.error("removeCoupon:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ═══════════════════════════════════════════════════════════════════
// [ADMIN] GET /api/cart/admin/all
// Returns all carts with user info — for admin dashboard analytics
// ═══════════════════════════════════════════════════════════════════
export const adminGetAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("user", "fullName email")
      .populate("items.product", "name price salePrice images sku")
      .populate("coupon", "code value type")
      .sort({ updatedAt: -1 })
      .lean();

    const enriched = carts.map((cart) => {
      const subtotal = cart.items.reduce((sum, item) => {
        const price = item.salePriceAtAdd ?? item.priceAtAdd;
        return sum + price * item.quantity;
      }, 0);
      return {
        ...cart,
        subtotal,
        total: Math.max(0, subtotal - (cart.couponDiscount || 0)),
        itemCount: cart.items.reduce((s, i) => s + i.quantity, 0),
      };
    });

    return res.json({
      success: true,
      total: enriched.length,
      carts: enriched,
    });
  } catch (err) {
    console.error("adminGetAllCarts:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};
