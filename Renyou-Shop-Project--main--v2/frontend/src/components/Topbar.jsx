import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown, LayoutGrid, List, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import NotificationBell from "../components/NotificationBell";

const SORT_OPTIONS = [
  { value: 'popular',     label: 'Most Popular'   },
  { value: 'newest',      label: 'Newest'         },
  { value: 'price_asc',   label: 'Price: Low → High' },
  { value: 'price_desc',  label: 'Price: High → Low' },
  { value: 'rating',      label: 'Best Rated'     },
]

/**
 * Topbar used inside every products page — between Navbar and products grid.
 * Props:
 *   breadcrumbs   — [{ label, path? }]
 *   title         — page title
 *   total         — number of results
 *   page          — current page
 *   perPage       — items per page
 *   sort          — current sort value
 *   onSort        — (value) => void
 *   view          — 'grid' | 'list'
 *   onView        — (value) => void
 *   onToggleSidebar — () => void   (mobile only)
 *   sidebarOpen   — bool
 */
export default function Topbar({
  breadcrumbs = [],
  title       = 'All Products',
  total       = 0,
  page        = 1,
  perPage     = 9,
  sort        = 'popular',
  onSort,
  view        = 'grid',
  onView,
  onToggleSidebar,
  sidebarOpen = false,
}) {
  const [sortOpen, setSortOpen] = useState(false)
  const navigate = useNavigate()

  const from = Math.min((page - 1) * perPage + 1, total)
  const to   = Math.min(page * perPage, total)
  const currentSort = SORT_OPTIONS.find(o => o.value === sort) || SORT_OPTIONS[0]

  return (
    <div className="w-full">
      {/* ── Breadcrumbs ── */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 flex-wrap">
          <button
  onClick={() => navigate('/products-list', { replace: false })}
  className="hover:text-violet-600 transition-colors"
>
  Home
</button>
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-gray-300">›</span>
              {b.path ? (
                <button onClick={() => navigate(b.path)} className="hover:text-violet-600 transition-colors">{b.label}</button>
              ) : (
                <span className="text-gray-700 font-medium">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* ── Title + Controls row ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: title + count */}
        <div>
          <h1
  className="text-2xl font-urbanist font-bold leading-tight"
  style={{ color: "var(--color-text)" }}
>{title}</h1>
          {total > 0 && (
            <p
  className="text-sm mt-0.5"
  style={{ color: "var(--color-text-secondary)" }}
>
              Showing {from}–{to} of {total} results
            </p>
          )}
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mobile filter toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium hover:border-violet-400 hover:text-violet-700 transition-all"
style={{
  background: "var(--color-surface)",
  color: "var(--color-text)",
  borderColor: "var(--color-border)",
}}
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
            {sidebarOpen && <X size={13} className="text-red-400" />}
          </button>

<div className="flex items-center gap-3">

          {/* Sort dropdown */}
          <div className="relative">
<button
  onClick={() => setSortOpen(v => !v)}
  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium hover:border-violet-400 hover:text-violet-700 hover:shadow-md transition-all whitespace-nowrap"
  style={{
    background: "var(--color-surface)",
    color: "var(--color-text)",
    borderColor: "var(--color-border)",
    boxShadow: "0 2px 10px rgba(0,0,0,.04)",
  }}
>
              <span>Sort by :</span>
              <span
  className="font-semibold"
  style={{ color: "var(--primary-color)" }}
>{currentSort.label}</span>
              <motion.div animate={{ rotate: sortOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown
  size={15}
  style={{ color: "var(--color-text-secondary)" }}
/>
              </motion.div>
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: -6 }}
                  animate={{ opacity: 1, scale: 1,    y: 0  }}
                  exit={{   opacity: 0, scale: 0.94, y: -6  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl border z-50 overflow-hidden backdrop-blur-xl"
style={{
  background: "var(--color-surface)",
  borderColor: "var(--color-border)",
  boxShadow: "0 20px 50px rgba(0,0,0,.12)",
}}
style={{
  background: "var(--color-surface)",
  borderColor: "var(--color-border)",
}}
                >
{SORT_OPTIONS.map((opt, index) => (
  <div
    key={opt.value}
    className="border-b last:border-b-0"
    style={{
      borderColor: "var(--color-border)",
    }}
  >
    <button
      onClick={() => {
        onSort?.(opt.value);
        setSortOpen(false);
      }}
      className={`
        w-full
        flex
        items-center
        justify-between
        text-left
        px-4
        py-3
        text-sm
        rounded-lg
        transition-all
        duration-200
        ease-out
        ${
          opt.value === sort
            ? "font-semibold"
            : "hover:scale-[1.02] active:scale-[0.99]"
        }
      `}
      style={{
        cursor: "pointer",
        background:
          opt.value === sort
            ? "color-mix(in srgb, var(--primary-color) 12%, var(--color-surface))"
            : "transparent",

        color:
          opt.value === sort
            ? "var(--primary-color)"
            : "var(--color-text)",
      }}
      onMouseEnter={(e) => {
        if (opt.value !== sort) {
          e.currentTarget.style.background =
            "var(--color-surface-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (opt.value !== sort) {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      <span>{opt.label}</span>

      {opt.value === sort && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            color: "var(--primary-color)",
            fontWeight: 700,
          }}
        >
          ✓
        </motion.span>
      )}
    </button>
  </div>
))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>

          {/* View toggle */}
<div
  className="hidden sm:flex items-center border rounded-xl overflow-hidden"
  style={{
    background: "var(--color-surface)",
    borderColor: "var(--color-border)",
  }}
>
  <button
    onClick={() => onView?.("grid")}
    className={`p-2 transition-colors ${
      view === "grid" ? "bg-violet-600" : ""
    }`}
    style={{
      color: view === "grid" ? "#fff" : "var(--color-text-secondary)",
    }}
  >
    <LayoutGrid size={16} />
  </button>

  <button
    onClick={() => onView?.("list")}
    className={`p-2 transition-colors ${
      view === "list" ? "bg-violet-600" : ""
    }`}
    style={{
      color: view === "list" ? "#fff" : "var(--color-text-secondary)",
    }}
  >
    <List size={16} />
  </button>
</div>

             {/* Notification */}
                <NotificationBell />

        </div>
      </div>
    </div>
  )
}
