import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Price from "@shared/currency/Price";
import RatingStars from "./RatingStars";

import ProductImageZoom from "./common/ProductImageZoom";

const BADGE_COLORS = {
  'BEST SELLER': 'bg-amber-500',
  'NEW':         'bg-emerald-500',
  'SALE':        'bg-red-500',
  'RX REQUIRED': 'bg-blue-600',
  'OFFER':       'bg-orange-500',
}

export default function ProductCard({ product, view = 'grid' }) {
  const navigate    = useNavigate()
  const { addToCart }    = useCart()
  const { toggle, isWished } = useWishlist()
  const toast = useToast()
  const [added,    setAdded]    = useState(false)
  const [imgError, setImgError] = useState(false)
  

  if (!product) return null

  const { _id, name='Product', price=0, salePrice, image, brand, rating=0, reviewCount=0, stockStatus='IN_STOCK', tags=[], badge } = product
  const displayBadge = badge
  const badgeColor   = BADGE_COLORS[displayBadge?.toUpperCase()] || 'bg-violet-600'
  const discountPct  = salePrice && price > salePrice ? Math.round((1 - salePrice/price)*100) : null
  const finalPrice   = salePrice || price
  const outOfStock   = stockStatus === 'OUT_OF_STOCK'
  const wished       = isWished(_id)
  const brandName    = typeof brand === 'object' ? brand?.name : brand

  const handleAdd = e => {
    e.stopPropagation()
    if (outOfStock) return
    addToCart(product)
    setAdded(true)
    toast.cart(name, 'Added to your cart', { image, duration: 3000, action: { label: 'View Cart', onClick: () => navigate('/user/cart') } })
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWish = e => {
    e.stopPropagation()
    const wasWished = wished
    toggle(product)
    if (!wasWished) toast.success(name, 'Added to wishlist', { duration: 2200 })
  }

  /* LIST */
  if (view === 'list') {
    return (
      <motion.div
layout
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
whileHover={{
  y: -2,
  scale: 1.01,
}}
transition={{ duration: 0.25 }}
        onClick={() => navigate(`/user/products/${_id}`)}
        className="product-card flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-lg"

style={{
  background: "var(--color-surface)",
  borderColor: "var(--color-border)",
  boxShadow: "0 6px 24px rgba(0,0,0,.06)",
}}>
        <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden"
style={{
  background:
    "color-mix(in srgb, var(--color-surface) 92%, var(--color-border))",
}}>
          {!imgError && image
            ? <ProductImageZoom
  src={image}
  alt={name}
  className="w-full h-full object-contain p-3 transition-transform duration-300 hover:scale-105"
/>
            : <div className="w-full h-full flex items-center justify-center text-4xl">🧴</div>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wide mb-0.5"
style={{ color: "var(--color-primary)" }}>{brandName}</div>
          <h3 className="text-base font-bold line-clamp-2"
style={{ color: "var(--color-text)" }}>
  {name}
</h3>
<div className="mt-1">
  <RatingStars
    rating={rating}
    reviewCount={reviewCount}
    size={11}
  />
</div>
          <div className="flex items-center gap-3 mt-3">
<Price
  value={finalPrice}
  className="text-xl font-black"
  style={{ color: "var(--color-text)" }}
/>

{salePrice && (
  <Price
    value={price}
    className="text-sm line-through"
style={{ color: "var(--color-text-secondary)" }}
  />
)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <button onClick={handleWish} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
style={{
  background: "var(--color-surface-hover)",
}}>
            <Heart size={14} className={wished ? "fill-red-500 text-red-500" : ""}
style={!wished ? { color: "var(--color-text-secondary)" } : {}}/>
          </button>
          <button onClick={handleAdd} disabled={outOfStock}
            className={`btn-cart w-32 ${outOfStock ? 'btn-cart-disabled' : added ? 'btn-cart-success' : 'btn-cart-primary'}`}>
            <ShoppingCart size={14}/>
            {added ? 'Added !' : outOfStock ? 'Out of stock' : 'Add to Cart'}
          </button>
        </div>
      </motion.div>
    )
  }

  /* GRID */
  return (
    <motion.div layout initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} whileHover={{ y:-4 }} transition={{ duration:0.25 }}
      onClick={() => navigate(`/user/products/${_id}`)}
      className="product-card group relative flex flex-col h-full cursor-pointer transition-colors"
style={{
  background: "var(--color-surface)",
  borderColor: "var(--color-border)",
}}>
      <div
  className="relative overflow-hidden rounded-t-2xl aspect-square flex items-center justify-center p-4"
  style={{
    background: "color-mix(in srgb, var(--color-surface) 92%, var(--color-border))",
  }}
>
        {displayBadge && <span className={`product-badge ${badgeColor}`}>{displayBadge}</span>}
        {discountPct  && <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">-{discountPct}%</span>}
        <button onClick={handleWish}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:scale-110 z-10"
          style={{ top: displayBadge ? 36 : 12, right: 12 }}>
          <Heart size={14} className={wished ? 'fill-red-500 text-red-500' : 'text-gray-400'}/>
        </button>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 shadow translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Eye size={12}/> Quick View
          </div>
        </div>
        {!imgError && image
          ? <img
  src={image}
  alt={name}
  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
/>
          : <div className="w-full h-full flex items-center justify-center text-5xl">🧴</div>}
      </div>
      <div className="flex flex-col flex-1 p-3">
        <div className="text-[10px] font-semibold text-violet-500 uppercase tracking-wide mb-0.5">{brandName || 'RENYOU'}</div>
        <h3
  className="text-sm font-semibold leading-snug mb-1.5 line-clamp-2 min-h-[40px]"
  style={{ color: "var(--color-text)" }}
>
  {name}
</h3>
<div className="mb-2">
  <RatingStars
    rating={rating}
    reviewCount={reviewCount}
    size={11}
  />
</div>
        <div className="mt-auto">
        <div className="flex items-baseline gap-1.5 mb-3">
<Price
  value={finalPrice}
  className="text-base font-bold"
  style={{ color: "var(--color-text)" }}
/>

{salePrice && (
  <Price
    value={price}
    className="text-sm text-gray-400 line-through"
  />
)}
        </div>
        <motion.button onClick={handleAdd} disabled={outOfStock} whileTap={!outOfStock ? { scale: 0.95 } : {}}
          className={`btn-cart text-sm w-full ${outOfStock ? 'btn-cart-disabled' : added ? 'btn-cart-success' : 'btn-cart-primary'}`}>
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="added" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                className="flex items-center gap-2">
                <Check size={15} strokeWidth={2.5}/> Added !
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                className="flex items-center gap-2">
                <ShoppingCart size={14}/> {outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
