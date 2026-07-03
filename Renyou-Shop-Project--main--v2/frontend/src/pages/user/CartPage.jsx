import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Package, Tag } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import Price from "@shared/currency/Price";
import Footer from "../../components/Footer.jsx";

export default function CartPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const {
    items, removeFromCart, updateQty, clearCart,
    subtotal, discount, shipping, tax, totalPrice,
    coupon, couponError, couponLoading, applyCoupon, removeCoupon,
  } = useCart()

  const [couponCode, setCouponCode] = useState('')

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    await applyCoupon(couponCode.trim())
  }

  const handleRemove = (item) => {
    removeFromCart(item._id)
    toast.info(item.name, 'Removed from cart', { duration: 2200 })
  }

  const handleClear = () => {
    clearCart()
    toast.info('Cart cleared', 'All items have been removed.', { duration: 2200 })
  }

  const handleItemClick = (item) => {
  if (item.isBundle) {
    navigate(`/bundles/${item._id}`)
  } else {
    navigate(`/products/${item._id}`)
  }
}

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <ShoppingCart size={72} className="text-gray-200 mx-auto mb-2" strokeWidth={1.2} />
        </motion.div>
        <h2 className="text-2xl font-urbanist font-bold text-gray-800" style={{ color: "var(--color-text)" }}>Your cart is empty</h2>
        <p className="text-gray-500 text-sm max-w-xs" style={{ color: "var(--color-text-secondary)" }}>Looks like you haven't added anything to your cart yet.</p>
        <button onClick={() => navigate('/products-list')}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all active:scale-95">
          <Package size={16} /> Start Shopping
        </button>
      </div>
    )
  }

  return (
    <div
  className="min-h-screen"
  style={{
    background: "var(--color-background)",
    color: "var(--color-text)",
  }}
>
      <div
  className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
  style={{ color: "var(--color-text)" }}
>
        <div className="flex items-center gap-3 mb-8">
          <button
  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
  }}
>
            <ArrowLeft
  size={16}
  style={{ color: "var(--color-text-secondary)" }}
/>
          </button>
          <h1
  className="text-2xl font-urbanist font-bold"
  style={{ color: "var(--color-text)" }}
>Shopping Cart</h1>
          <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full">{items.length} item{items.length > 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map(item => {

  const itemPrice =
    item.finalPrice ||
    item.salePrice ||
    item.price;

  return (
                <motion.div
  key={item._id || item.id}
  layout
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20, height: 0 }}
  onClick={() => handleItemClick(item)}
  className="rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
style={{
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
}}
>
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100" style={{ borderColor: "var(--color-border)" }}>
  {item.image ? (
    <img
      src={
        item.image.startsWith("http")
          ? item.image
          : `http://localhost:5000${item.image}`
      }
      alt={item.name}
      className="w-full h-full object-contain p-1"
    />
  ) : (
    <span className="text-3xl">🧴</span>
  )}
</div>

                  {/* Info */}
                  
<div className="flex-1 min-w-0">
  <div className="text-[10px] font-bold text-violet-500 uppercase tracking-wide mb-0.5">
    {typeof item.brand === 'object' ? item.brand?.name : item.brand}
  </div>

  <div className="flex items-center gap-2">
    <h3 className="text-sm font-semibold text-gray-800 truncate" style={{ color: "var(--color-text)" }}>
      {item.name}
    </h3>

    {item.isBundle && (
      <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-700 rounded-full">
        Bundle
      </span>
    )}
  </div>

  <div className="text-base font-bold text-gray-900 mt-1">
    <Price value={itemPrice} />
  </div>

  {item.isBundle && item.products?.length > 0 && (
    <>
      <div className="mt-2 text-xs text-gray-500" style={{ color: "var(--color-text-secondary)" }}>
        Contains {item.products.length} products
      </div>

      <div className="mt-1 space-y-1">
        {item.products.map((p) => (
          <div
            key={p._id}
            className="text-[11px] text-gray-400" style={{ color: "var(--color-text-secondary)" }}
          >
            • {p.name}
          </div>
        ))}
      </div>
    </>
  )}

                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-end justify-between gap-2">
                    <button
  onClick={(e) => {
    e.stopPropagation()
    handleRemove(item)
  }}
                      className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
  onClick={(e) => {
    e.stopPropagation()
    updateQty(item._id, item.qty - 1)
  }}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-bold">{item.qty}</span>
                      <button
  onClick={(e) => {
    e.stopPropagation()
    updateQty(item._id, item.qty + 1)
  }}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="text-sm font-bold text-violet-700">
                      <Price value={itemPrice * item.qty} />
                    </div>
                  </div>
                </motion.div>
  );
})}
            </AnimatePresence>

            {/* Clear cart */}
            <button onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium flex items-center gap-1.5 mt-2">
              <Trash2 size={12} /> Clear all items
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl p-6 shadow-sm sticky top-24"
style={{
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
}}>
              <h2 className="text-base font-urbanist font-bold text-gray-900 mb-5" style={{ color: "var(--color-text)" }}>Order Summary</h2>

              {/* Lines */}
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-gray-600" style={{ color: "var(--color-text)" }}>
                  <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span className="font-semibold text-gray-900" style={{ color: "var(--color-text)" }}><Price value={subtotal} /></span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon ({coupon?.code})</span>
                    <span>-<Price value={discount} /></span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600" style={{ color: "var(--color-text-secondary)" }}>
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : 'font-semibold text-gray-900'}>
                    {shipping === 0 ? 'Free' : <Price value={shipping} />}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600" style={{ color: "var(--color-text)" }}>
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-gray-900" style={{ color: "var(--color-text)" }}><Price value={tax} /></span>
                </div>
                {shipping === 0 && (
                  <p className="text-[11px] text-emerald-600">You qualify for free shipping !</p>
                )}
                {shipping > 0 && (
                  <p className="text-[11px] text-gray-400" style={{ color: "var(--color-text-secondary)" }}>Free shipping on orders over $50</p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-gray-900" style={{ color: "var(--color-text)" }}>
                  <span>Total</span>
                  <span><Price value={totalPrice} /></span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block flex items-center gap-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  <Tag size={12} /> Promo Code
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-xs font-bold text-emerald-700 font-mono tracking-widest">{coupon.code}</span>
                    <button
                      onClick={() => { removeCoupon(); toast.info('Coupon removed', null, { duration: 1800 }) }}
                      className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="RENYOU10"
                      className="flex-1 px-3 py-2 rounded-xl text-sm font-mono font-semibold tracking-widest focus:outline-none transition-all uppercase"
style={{
  background: "var(--color-surface)",
  color: "var(--color-text)",
  border: "1px solid var(--color-border)",
}}
                    />
                    <button onClick={handleApplyCoupon} disabled={couponLoading}
                      className="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50 whitespace-nowrap">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
                {coupon && <p className="text-[11px] text-emerald-600 mt-1">✓ Coupon applied ! -{coupon.type === 'percentage'
  ? `${coupon.value}%`
  : <Price value={coupon.value} />
} off</p>}
              </div>

              {/* Checkout */}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/user/checkout')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-violet-200">
                Proceed to Checkout <ArrowRight size={16} />
              </motion.button>

              <button onClick={() => navigate('/products-list')}
                className="w-full text-center text-xs text-gray-400 hover:text-violet-600 transition-colors mt-3 flex items-center justify-center gap-1" style={{ color: "var(--color-text-secondary)" }}> 
                <ArrowLeft size={12} /> Continue Shopping
              </button>
            </motion.div>
          </div>
        </div>
      </div>
                  <Footer />
    </div>
  )
}
