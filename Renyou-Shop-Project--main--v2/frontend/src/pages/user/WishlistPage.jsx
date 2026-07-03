import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowLeft, Sparkles } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import ProductCard from '../../components/ProductCard.jsx'
import Footer from "../../components/Footer.jsx";

export default function WishlistPage() {
  const navigate = useNavigate()
  const { items, toggle, clear } = useWishlist()
  const { addToCart } = useCart()
  const toast = useToast()

  const handleMoveToCart = (product) => {
    addToCart(product)
    toggle(product)
    toast.cart(product.name, 'Moved to your cart', { image: product.image, duration: 2500 })
  }

  const handleAddAllToCart = () => {
  if (!items.length) return;

  items.forEach((p) => addToCart(p));

  const count = items.length;

  clear();

  toast.success(
    "Added to cart!",
    `${count} item${count > 1 ? "s" : ""} moved from your wishlist.`,
    { duration: 3000 }
  );
}

  const handleClearAll = () => {
  if (!items.length) return;

  clear();

  toast.info(
    "Wishlist cleared",
    "All saved items have been removed.",
    { duration: 2200 }
  );
};

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring' }}>
          <Heart size={72} className="text-gray-600 mx-auto mb-2" strokeWidth={1.2}/>
        </motion.div>
        <h2 className="text-2xl font-urbanist font-bold text-white">Your wishlist is empty</h2>
        <p className="text-gray-400 text-sm max-w-xs">Save products you love and come back to them later.</p>
        <button onClick={() => navigate('/products-list')}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all active:scale-95">
          <Sparkles size={16}/> Discover Products
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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl border border-gray-700 bg-gray-900 flex items-center justify-center hover:border-violet-500 transition-all">
              <ArrowLeft size={16} className="text-white"/>
            </button>
            <div>
<h1
  className="text-2xl font-urbanist font-bold"
  style={{ color: "var(--color-text)" }}
>
  My Wishlist
</h1>
              <p className="text-sm text-gray-400">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
  onClick={handleAddAllToCart}
  disabled={!items.length}
  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all
  ${
    !items.length
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-violet-600 text-white hover:bg-violet-700 active:scale-95'
  }`}
>
              <ShoppingCart size={14}/> Add All to Cart
            </button>
            <button onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 border border-red-800 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-900/20 transition-all">
              <Trash2 size={14}/> Clear All
            </button>
          </div>
        </div>

        <AnimatePresence>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((product, i) => (
              <motion.div key={product._id}
                layout
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, scale:0.9 }}
                transition={{ delay: i * 0.05 }}
                className="relative h-full">
                {/* Remove button */}
                <button
  onClick={(e) => {
  e.stopPropagation();

  toggle(product);

  toast.info(
    "Removed from wishlist",
    `${product.name} removed successfully`,
    { duration: 2200 }
  );
}}
  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-gray-900 border border-gray-700 shadow-md flex items-center justify-center hover:bg-red-900/20 transition-all hover:scale-110"
>
                  <Heart size={14} className="fill-red-500 text-red-500"/>
                </button>
                <ProductCard product={product} view="grid"/>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
              <Footer />
    </div>
  )
}
