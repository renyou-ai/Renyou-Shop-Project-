import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PackageOpen } from 'lucide-react'
import Topbar      from '../components/Topbar.jsx'
import Sidebar     from '../components/Sidebar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Pagination  from '../components/Pagination.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import Footer from '../components/Footer.jsx'
import { api } from '../services/api.js'

const PER_PAGE = 9
const MAX_PRICE = 2000

// Map sort value to query param
const SORT_MAP = {
  popular:    '',
  newest:     'newest',
  price_asc:  'price_asc',
  price_desc: 'price_desc',
  rating:     'rating',
}

export default function ProductsList({ category = '', tag = '' }) {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── State ──
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [brands,     setBrands]     = useState([])
  const [total,      setTotal]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [view,       setView]       = useState('grid')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Filters from URL
  const page       = parseInt(searchParams.get('page')  || '1',  10)
  const sort       = searchParams.get('sort')    || 'popular'
  const catFilter  = searchParams.get('category') || ''
  const brandFilter= searchParams.get('brand')    || ''
  const priceMin = parseFloat(searchParams.get("priceMin") || "0");
  const priceMax = parseFloat(searchParams.get("priceMax") || String(MAX_PRICE));
  const ratingFilter = searchParams.get('rating') ? parseInt(searchParams.get('rating')) : null
  const query      = searchParams.get('query') || ''

  const inStockFilter = searchParams.get('inStock') === 'true'
  const filters = { category: catFilter, brand: brandFilter, priceMin, priceMax, rating: ratingFilter, tag, inStock: inStockFilter }

  // Count active filters
  const activeCount = [catFilter, brandFilter, ratingFilter, query, tag,
    inStockFilter ? 'stock' : '',
    priceMin > 0 ? 'price' : '', priceMax < MAX_PRICE ? 'price' : ''].filter(Boolean).length

  // ── Fetch metadata (categories + brands) once ──
  useEffect(() => {
    Promise.all([
      api.getCategories().catch(() => []),
      api.getBrands().catch(() => []),
    ]).then(([cats, brds]) => {
      setCategories(Array.isArray(cats) ? cats : [])
      setBrands(Array.isArray(brds) ? brds : [])
    })
  }, [])

  // ── Fetch products ──
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: PER_PAGE,
        ...(catFilter  && { category: catFilter  }),
        ...(brandFilter && { brand:    brandFilter }),
        ...(priceMin > 0   && { priceMin }),
        ...(priceMax < MAX_PRICE && { priceMax }),
        ...(inStockFilter && { stockStatus: 'IN_STOCK' }),
        ...(ratingFilter   && { rating: ratingFilter }),
        ...(sort !== 'popular' && { sort: SORT_MAP[sort] }),
        ...(query  && { search: query  }),
        ...(category && { categoryName: category }),
        ...(tag    && { tag }),
      }
      const data = await api.getPublicProducts(params)
      // Support both { products, total } and plain array
      if (Array.isArray(data)) {
        setProducts(data)
        setTotal(data.length)
      } else {
        setProducts(data.products || [])
        setTotal(data.total || 0)
      }
    } catch (err) {
      console.error('Failed to fetch products:', err.message)
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, sort, catFilter, brandFilter, priceMin, priceMax, ratingFilter, query, category, tag, inStockFilter])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // ── Filter handler ──
  const handleFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === '' || value === null || value === undefined || value === false) next.delete(key)
    else next.set(key, String(value))
    next.set('page', '1')
    setSearchParams(next)
  }

  const handleReset = () => {
    const next = new URLSearchParams()
    if (query) next.set('query', query)
    setSearchParams(next)
  }

  const handleSort = val => {
    const next = new URLSearchParams(searchParams)
    next.set('sort', val)
    next.set('page', '1')
    setSearchParams(next)
  }

  const handlePage = p => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Build breadcrumbs & title ──
  const pageTitle = (() => {
    if (query)    return `Search: "${query}"`
    if (category) return category
    const cat = categories.find(c => c._id === catFilter)
    return cat?.name || 'All Products'
  })()

  const breadcrumbs = (() => {
    if (category) return [{ label: category }]
    if (catFilter) {
      const cat = categories.find(c => c._id === catFilter)
      return [{ label: cat?.name || 'Category' }]
    }
    if (query) return [{ label: 'Search' }]
    return []
  })()

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <div
  className="min-h-screen"
  style={{
    background: "var(--color-background)",
    color: "var(--color-text)",
  }}
>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Topbar */}
        <div className="mb-6">
          <Topbar
            breadcrumbs={breadcrumbs}
            title={pageTitle}
            total={total}
            page={page}
            perPage={PER_PAGE}
            sort={sort}
            onSort={handleSort}
            view={view}
            onView={setView}
            onToggleSidebar={() => setSidebarOpen(v => !v)}
            sidebarOpen={sidebarOpen}
          />
        </div>

        {/* Main layout: Sidebar + Products */}
        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          <Sidebar
            categories={categories}
            brands={brands}
            filters={filters}
            onFilter={handleFilter}
            onReset={handleReset}
            activeCount={activeCount}
            mobileOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Products area */}
          <div className="flex-1 min-w-0">

            {/* Loading skeletons */}
            {loading && (
              <div className={`grid gap-4 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                {Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i}/>)}
              </div>
            )}

            {/* Empty state */}
            {!loading && products.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center">
                <PackageOpen
  size={56}
  className="mb-4"
  style={{ color: "var(--color-border)" }}
/>
                <h3 className="text-lg font-semibold mb-1"
style={{ color: "var(--color-text)" }}>No products found</h3>
                <p className="text-sm mb-6"
style={{ color: "var(--color-text-secondary)" }}>Try adjusting your filters or search term.</p>
                <button onClick={handleReset}
                  className="px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all active:scale-95">
                  Clear filters
                </button>
              </motion.div>
            )}

            {/* Products grid / list */}
            {!loading && products.length > 0 && (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${sort}-${page}-${catFilter}-${view}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`grid gap-4 ${
                      view === 'list'
                        ? 'grid-cols-1'
                        : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    }`}
                  >
                    {products.map((p, i) => (
                      <motion.div key={p._id || i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.28 }}>
                        <ProductCard product={p} view={view}/>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                <Pagination page={page} totalPages={totalPages} onPage={handlePage}/>
              </>
            )}
          </div>
        </div>
      </div>
            <Footer />
    </div>
  )
}
