import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, Share2, ChevronRight,
  Truck, Shield, Minus, Plus, MessageSquare, Check, Star
} from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { api } from '../../services/api.js'
import SkeletonCard from '../../components/SkeletonCard.jsx'
import ProductCard from '../../components/ProductCard.jsx'
import { useToast } from "../../context/ToastContext.jsx";
import RatingStars from "../../components/RatingStars";
import ProductImageZoom from "../../components/common/ProductImageZoom";
import { useTheme } from "../../context/ThemeContext";
import Footer from "../../components/Footer.jsx";

import { useWishlist } from '../../context/WishlistContext.jsx'
import { Price } from "@shared/currency";

const TABS = ['Description', 'Ingredients', 'How to Use', 'Reviews']

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product,   setProduct]   = useState(null)
  const [related,   setRelated]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty,       setQty]       = useState(1)
  const [activeTab, setActiveTab] = useState('Description')
  const { toggle, isWished } = useWishlist()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [added,     setAdded]     = useState(false)
  const [imgError,  setImgError]  = useState(false)
  const { dark } = useTheme();
  
  const toast = useToast();
  const wished = isWished(product?._id);

  // Load product
  useEffect(() => {
    if (!id) return
    setLoading(true)
    setImgError(false)
    setActiveImg(0)
    setQty(1)
    setAdded(false)

    api.getPublicProduct(id)
  .then(data => {
    setProduct(data);

    if (data?.category?._id || data?.category) {
      const catId = data.category?._id || data.category;
      return api.getPublicProducts({
        category: catId,
        limit: 4
      });
    }
  })
  .catch(err => {
    console.error('PRODUCT ERROR:', err);
  })
      .then(data => {
        if (data) {
          const items = Array.isArray(data) ? data : data.products || []
          setRelated(items.filter(p => p._id !== id).slice(0, 4))
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
  if (!product || outOfStock) return;

  addToCart(product, qty);

  toast.cart(
  "Added to cart",
  `${product.name} added successfully`,
  {
    image: product.image || product.images?.[0],
    action: {
      label: "View Cart",
      onClick: () => navigate("/cart")
    }
  }
);

  setAdded(true);
  setTimeout(() => setAdded(false), 2500);
};

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            {[80, 60, 40, 100, 60, 40].map((w, i) => (
              <div key={i} className={`h-4 bg-gray-100 rounded animate-pulse`} style={{ width: `${w}%` }}/>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
        <div className="text-5xl"></div>
        <h2 className="text-2xl font-black text-[#0f1b3d] dark:text-white">Product not found</h2>
        <button onClick={() => navigate('/products-list')}
          className="px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all">
          Back to Products
        </button>
      </div>
    )
  }

  const handleWishlist = () => {
  if (!product) return;

  const alreadyWished = isWished(product._id);

  toggle(product);

  if (alreadyWished) {
    toast.info(
      "Removed from wishlist",
      product.name,
      {
        image: product.image || product.images?.[0]
      }
    );
  } else {
    toast.success(
      "Added to wishlist",
      product.name,
      {
        image: product.image || product.images?.[0]
      }
    );
  }
};

  const {
  name = '',
  description = '',
  ingredients = '',
  howToUse = '',
  price = 0,
  finalPrice = price,
  image,
  images = [],
  brand,
  category,
  rating = 0,
  reviewCount = 0,
  stockStatus = 'IN_STOCK',
  tags = [],
  badge,
  sku,
} = product

  const allImages = images.length > 0 ? images : image ? [image] : []
const hasDiscount = finalPrice < price;

const discountPct = hasDiscount
  ? Math.round((1 - finalPrice / price) * 100)
  : 0;

  const outOfStock  = stockStatus === 'OUT_OF_STOCK'
  const brandName   = typeof brand === 'object' ? brand?.name : brand
  const catName     = typeof category === 'object' ? category?.name : category

  // Breadcrumb
  const breadcrumbs = [
    { label: 'Home', path: '/products-list' },
    ...(catName ? [{ label: catName, path: `/products-list?category=${category?._id || category}` }] : []),
    { label: name.slice(0, 30) + (name.length > 30 ? '...' : '') },
  ]

  const tabContent = {
    Description:  description || 'No description available.',
    Ingredients:  ingredients || 'Ingredients information not available.',
    'How to Use': howToUse   || 'Usage instructions not available.',
    Reviews:      null,
  }

  return (
    <div
  className="min-h-screen"
  style={{
    background: "var(--color-background)",
    color: "var(--color-text)",
  }}
>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8 flex-wrap">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-gray-300"/>}
              {b.path
                ? <button onClick={() => navigate(b.path)} className="hover:text-violet-600 transition-colors">{b.label}</button>
                : <span className="text-gray-900 dark:text-white font-medium">
  {b.label}
</span>}
            </span>
          ))}
        </nav>

        {/* ── Product main section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

          {/* Left: Image gallery */}
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <motion.div
              key={activeImg}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
className="
relative
aspect-square
rounded-2xl
overflow-hidden
flex
items-center
justify-center
"
style={{
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
}}
            >
              {/* Badges */}
              {badge && (
                <span className={`absolute top-4 left-4 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full z-10 ${
                  badge === 'BEST SELLER' ? 'bg-amber-500' : badge === 'NEW' ? 'bg-emerald-500' : 'bg-violet-600'
                }`}>{badge}</span>
              )}
              {/* HNA Tصلَح el mochkela: nchoufou ken discountPct akber men 0 */}
              {discountPct > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                  -{discountPct}%
                </span>
              )}

              {allImages.length > 0 && !imgError ? (
                <ProductImageZoom
                  src={allImages[activeImg]}
                  alt={name}
                  className="w-full max-h-[500px] object-contain mx-auto"
                />
              ) : (
                <div className="text-8xl">🧴</div>
              )}

              {/* Wishlist */}
              <button onClick={handleWishlist}
                className="
absolute
top-4
right-4
w-9
h-9
rounded-full
backdrop-blur-sm
shadow-md
flex
items-center
justify-center
hover:scale-110
transition-all
"
style={{
  background: "color-mix(in srgb, var(--color-surface) 90%, transparent)",
}}>
                <Heart size={16} className={wished ? 'fill-red-500 text-red-500' : 'text-gray-400'}/>
              </button>
            </motion.div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i
? 'border-violet-500 shadow-md'
: 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                    }`}>
                    <img src={img} alt={`${name} ${i+1}`} className="w-full h-full object-contain p-1"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col">
            {brandName && (
              <div className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-1">{brandName}</div>
            )}

            <h1
  className="text-2xl sm:text-3xl font-urbanist font-bold leading-tight mb-3"
  style={{
    color: "var(--color-text)",
  }}
>
  {name}
</h1>

            <div className="mb-4">
              <RatingStars
                rating={rating}
                reviewCount={reviewCount}
                size={15}
              />
            </div>

            <div className="flex items-baseline gap-3 mb-4">
<Price
  value={finalPrice}
  as="strong"
  className="text-3xl font-bold"
  style={{
    color: "var(--color-text)",
  }}
/>

              {hasDiscount && (
                <Price
                  value={price}
                  className="text-lg text-gray-400 line-through"
                />
              )}

              {hasDiscount && (
                <span className="bg-red-50 text-red-600 text-sm font-semibold px-2 py-0.5 rounded-lg">
                  {discountPct}% OFF
                </span>
              )}
            </div>

{/* Stock */}
<div className="flex items-center mb-5">
  <span
    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
      outOfStock
        ? "bg-red-50 text-red-600"
        : "bg-emerald-50 text-emerald-700"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        outOfStock ? "bg-red-500" : "bg-emerald-500"
      }`}
    />
    {outOfStock ? "Out of Stock" : "In Stock"}
  </span>
</div>

{description && (
  <p
    className="text-sm leading-relaxed mb-6 line-clamp-3"
    style={{
      color: "var(--color-text-secondary)",
    }}
  >
    {description}
  </p>
)}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
              <div
  className="flex items-center rounded-xl overflow-hidden"
  style={{
    border: "1px solid var(--color-border)",
    background: "var(--color-surface)",
  }}
>
                <button
  onClick={() => setQty(q => Math.max(1, q - 1))}
  className="w-10 h-11 flex items-center justify-center transition-colors"
  style={{
    color: "var(--color-text-secondary)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "var(--color-surface-hover)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
  }}
>
                  <Minus size={15}/>
                </button>
                <span
  className="w-10 h-11 flex items-center justify-center text-sm font-bold"
  style={{
    color: "var(--color-text)",
  }}
>
  {qty}
</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-10 h-11 flex items-center justify-center transition-colors"
style={{
  color: "var(--color-text-secondary)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background = "var(--color-surface-hover)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background = "transparent";
}}>
                  <Plus size={15}/>
                </button>
              </div>

  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={handleAddToCart}
    disabled={outOfStock}
    className="
      flex-1
      h-14
      rounded-2xl
      font-bold
      flex
      items-center
      justify-center
      gap-3
      transition-all
      duration-50
    "
    style={{
      background: outOfStock
        ? "#9ca3af"
        : "linear-gradient(135deg,#7C3AED,#A855F7)",
      color: "#fff",
      boxShadow: outOfStock
        ? "none"
        : "0 10px 25px rgba(124,58,237,.25)",
    }}
  >
    {added ? (
      <>
        <Check size={20} />
        Added to Cart
      </>
    ) : (
      <>
        <ShoppingCart size={20} />
        Add to Cart
      </>
    )}
  </motion.button>

              <a href={`https://wa.me/?text=${encodeURIComponent(name)}`} target="_blank" rel="noopener noreferrer"
                className="
w-12
h-12
sm:w-11
sm:h-11
flex
items-center
justify-center
rounded-xl
border
transition-all
hover:scale-105
"
style={{
  border: "1px solid var(--color-border)",
  background: "var(--color-surface)",
}}>
                <svg className="w-5 h-5 fill-green-500" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>

              <button onClick={handleWishlist}
                className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-all">
                <Heart size={17} className={wished ? 'fill-red-500 text-red-500' : 'text-gray-400'}/>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-5 border-t border-gray-100">
<div
  className="flex items-start gap-3 p-3 rounded-xl"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
  }}
>
                <Truck size={18} className="text-violet-600 mt-0.5 flex-shrink-0"/>
                <div>
                  <div
  className="text-sm font-semibold"
  style={{
    color: "var(--color-text)",
  }}
>
  Free Standard Delivery
</div>
                  <div
  className="text-xs"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
  Order within 2 hours to get it by tomorrow
</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                <Shield size={18} className="text-violet-600 mt-0.5 flex-shrink-0"/>
                <div>
                  <div
  className="text-sm font-semibold"
  style={{
    color: "var(--color-text)",
  }}
>
  100% Authentic Products
</div>
                  <div
  className="text-xs"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
  Sourced directly from licensed manufacturers
</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-16">
          <div
  className="flex border-b gap-0 overflow-x-auto scrollbar-hide"
  style={{
    borderColor: "var(--color-border)",
  }}
>
            {TABS.map(tab => (
<button
  key={tab}
  onClick={() => setActiveTab(tab)}
  className="px-5 py-3 text-sm font-medium whitespace-nowrap transition-all -mb-px"
  style={{
    borderBottom:
      activeTab === tab
        ? "2px solid var(--primary-color)"
        : "2px solid transparent",
    color:
      activeTab === tab
        ? "var(--primary-color)"
        : "var(--color-text-secondary)",
  }}
>
  {tab}
  {tab === "Reviews" && reviewCount > 0 ? ` (${reviewCount})` : ""}
</button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="py-6"
            >
              {activeTab !== 'Reviews' ? (
                <div
  className="prose prose-sm max-w-none leading-relaxed"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
                  {tabContent[activeTab]?.split('\n').map((line, i) => (
                    <p
                      key={i}
                      className={
                        line.startsWith('•') || line.startsWith('-')
                          ? 'flex gap-2 items-start'
                          : ''
                      }
                    >
                      {line || <br />}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border border-violet-100 dark:border-gray-700 rounded-3xl p-10 text-center shadow-sm">
                    <div className="w-20 h-20 mx-auto rounded-full bg-violet-100 flex items-center justify-center mb-5">
                      <MessageSquare size={34} className="text-violet-600" />
                    </div>
                    <h3 className="text-2xl font-black text-[#0f1b3d] dark:text-white">Share Your Experience</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                      Your feedback helps other customers make informed decisions and improves our products.
                    </p>
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="group inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-105 transition-all duration-300"
                    >
                      <Star size={18} />
                      Write a Review
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {showReviewForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div
  className="rounded-3xl p-6 w-full max-w-md"
  style={{
    background: "var(--color-surface)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
  }}
>
                <h3
  className="text-xl font-bold mb-4"
  style={{
    color: "var(--color-text)",
  }}
>
  Write a Review
</h3>
<input
  type="text"
  placeholder="Your name"
  value={reviewName}
  onChange={(e) => setReviewName(e.target.value)}
  className="w-full rounded-xl p-3 mb-3"
  style={{
    background: "var(--color-surface)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
  }}
/>
<textarea
  placeholder="Your review"
  value={reviewComment}
  onChange={(e) => setReviewComment(e.target.value)}
  rows={4}
  className="w-full rounded-xl p-3 mb-3"
  style={{
    background: "var(--color-surface)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
  }}
/>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowReviewForm(false)} className="px-4 py-2 rounded-xl"
style={{
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
  background: "var(--color-surface)",
}}>
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowReviewForm(false)
                    }}
                    className="px-4 py-2 bg-violet-600 text-white rounded-xl"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Frequently Bought Together ── */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Frequently Bought Together</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => (
                <ProductCard key={p._id} product={p} view="grid"/>
              ))}
            </div>
          </div>
        )}
      </div>
            <Footer />
    </div>
  )
}