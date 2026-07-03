import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, X, Star, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Slider from "@radix-ui/react-slider";

const MAX_PRICE = 2000;

const RATINGS = [
  { value: 5, label: '5 stars only' },
  { value: 4, label: '4 stars & up' },
  { value: 3, label: '3 stars & up' },
  { value: 2, label: '2 stars & up' },
]

function Section({ id, label, open, onToggle, children, count = 0 }) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between py-3.5 px-1 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">{label}</span>
          {count > 0 && (
            <span className="bg-violet-400/30 text-violet-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{count}</span>
          )}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-white/50 group-hover:text-white/80 transition-colors"/>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterCheckbox({ label, sub, checked, onChange, count }) {
  return (
    <label
      className={`flex items-center gap-3 py-2 px-3 rounded-xl cursor-pointer transition-all duration-150 group
        ${checked ? 'bg-white/15 ring-1 ring-white/20' : 'hover:bg-white/8'}`}
    >
      <div
        className={`w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-md border-2 flex items-center justify-center transition-all
          ${checked
            ? 'bg-violet-400 border-violet-400'
            : 'border-white/30 group-hover:border-white/60 bg-white/5'}`}
        onClick={onChange}
      >
        {checked && (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        )}
      </div>
      <div className="flex-1 min-w-0" onClick={onChange}>
        <div className={`text-sm transition-colors leading-tight ${checked ? 'text-white font-semibold' : 'text-white/75 group-hover:text-white/90'}`}>
          {label}
        </div>
        {sub && <div className="text-[11px] text-white/40 mt-0.5">{sub}</div>}
      </div>
      {count != null && (
        <span className="text-[11px] text-white/40 flex-shrink-0">({count})</span>
      )}
    </label>
  )
}

export default function Sidebar({
  categories   = [],
  brands       = [],
  filters      = {},
  onFilter,
  onReset,
  activeCount  = 0,
  mobileOpen   = false,
  onClose,
}) {
  const [open, setOpen] = useState({ category: true, brand: true, price: true, rating: true })
  const [priceMin, setPriceMin] = useState(filters.priceMin ?? 0)
  const [priceMax, setPriceMax] = useState(filters.priceMax ?? MAX_PRICE)
  const [minPriceInput, setMinPriceInput] = useState(
  String(filters.priceMin ?? "")
)

const [maxPriceInput, setMaxPriceInput] = useState(
  filters.priceMax && filters.priceMax < MAX_PRICE
    ? String(filters.priceMax)
    : ""
)
  const [dragging, setDragging] = useState(null)

useEffect(() => {
  const min = filters.priceMin ?? 0;
  const max = filters.priceMax ?? MAX_PRICE;

  setPriceMin(min);
  setPriceMax(max);

  setMinPriceInput(min > 0 ? String(min) : "");

  setMaxPriceInput(
    max < MAX_PRICE ? String(max) : ""
  );
}, [filters.priceMin, filters.priceMax]);

  const toggle = id => setOpen(p => ({ ...p, [id]: !p[id] }))

const applyPrice = (
  min = priceMin,
  max = priceMax
) => {
  min = Number(min) || 0;
  max = Number(max) || MAX_PRICE;

  // validation
  if (min < 0) min = 0;
  if (max < min) max = min;

  setPriceMin(min);
  setPriceMax(max);

  onFilter?.("priceMin", min > 0 ? min : undefined);
  onFilter?.("priceMax", max < MAX_PRICE ? max : undefined);
};

  const catActiveCount  = filters.category ? 1 : 0
  const brandActiveCount = filters.brand   ? 1 : 0

  const content = (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
            <SlidersHorizontal size={15} className="text-white"/>
          </div>
          <span className="text-base font-urbanist font-bold text-white">Filters</span>
          {activeCount > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="bg-violet-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={onReset}
              className="flex items-center gap-1.5 text-xs text-violet-300 hover:text-white transition-colors font-medium px-2 py-1 rounded-lg hover:bg-white/10">
              <RotateCcw size={11}/> Reset
            </button>
          )}
          {onClose && (
            <button onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <X size={15} className="text-white"/>
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable sections ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-0 pr-2"
      
      >

        {/* Category */}
        <Section id="category" label="Category" open={open.category} onToggle={toggle} count={catActiveCount}>
          <div className="space-y-0.5">
            {/* All option */}
            <FilterCheckbox
              label="All Categories"
              checked={!filters.category}
              onChange={() => onFilter?.('category', '')}
            />
            {categories.map(cat => (
              <FilterCheckbox
                key={cat._id}
                label={`${cat.icon ? cat.icon + ' ' : ''}${cat.name}`}
                count={cat.productCount}
                checked={filters.category === cat._id}
                onChange={() => onFilter?.('category', filters.category === cat._id ? '' : cat._id)}
              />
            ))}
            {categories.length === 0 && (
              <div className="flex items-center gap-2 py-3 px-3">
                <div className="w-4 h-4 bg-white/10 rounded animate-pulse"/>
                <div className="h-3 bg-white/10 rounded flex-1 animate-pulse"/>
              </div>
            )}
          </div>
        </Section>

        {/* Brand */}
        <Section id="brand" label="Brand" open={open.brand} onToggle={toggle} count={brandActiveCount}>
          <div className="space-y-0.5">
            <FilterCheckbox
              label="All Brands"
              checked={!filters.brand}
              onChange={() => onFilter?.('brand', '')}
            />
            {brands.map(b => (
              <FilterCheckbox
                key={b._id}
                label={b.name}
                count={b.productCount}
                checked={filters.brand === b._id}
                onChange={() => onFilter?.('brand', filters.brand === b._id ? '' : b._id)}
              />
            ))}
            {brands.length === 0 && (
              <div className="flex items-center gap-2 py-3 px-3">
                <div className="w-4 h-4 bg-white/10 rounded animate-pulse"/>
                <div className="h-3 bg-white/10 rounded flex-1 animate-pulse"/>
              </div>
            )}
          </div>
        </Section>

        {/* Price Range — unlimited */}
        <Section id="price" label="Price Range" open={open.price} onToggle={toggle}>
          <div className="px-1 pt-1">
            {/* Manual inputs */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <div className="text-[10px] text-white/50 mb-1 font-semibold tracking-wide">MIN PRICE</div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 text-xs font-semibold pointer-events-none">$</span>
                  <input
                    type="text" inputMode="decimal" min={0} max={MAX_PRICE}
value={minPriceInput}

onChange={(e) => {
  const value = e.target.value
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");

  setMinPriceInput(value);
}}

onBlur={() => {
  const value = parseFloat(minPriceInput || 0);
  const finalValue = isNaN(value) ? 0 : value;

  setPriceMin(finalValue);
  applyPrice(finalValue, priceMax);
}}

onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.currentTarget.blur();
  }
}}
                    className="w-full bg-white/10 border border-white/15 rounded-xl pl-5 pr-2 py-2 text-sm font-bold text-white text-center focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div className="w-3 h-px bg-white/20 mt-5 flex-shrink-0"/>
              <div className="flex-1">
                <div className="text-[10px] text-white/50 mb-1 font-semibold tracking-wide">MAX PRICE</div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 text-xs font-semibold pointer-events-none">$</span>
                  <input
                    type="number" min={0}
value={maxPriceInput}

onChange={(e) => {
  const value = e.target.value
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");

  setMaxPriceInput(value);
}}

onBlur={() => {
  const value =
    maxPriceInput === ""
      ? MAX_PRICE
      : parseFloat(maxPriceInput);

  const finalValue = isNaN(value)
    ? MAX_PRICE
    : value;

  setPriceMax(finalValue);
  applyPrice(priceMin, finalValue);
}}

onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.currentTarget.blur();
  }
}}
                    className="w-full bg-white/10 border border-white/15 rounded-xl pl-5 pr-2 py-2 text-sm font-bold text-white text-center focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all placeholder:text-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Dual range sliders */}
            <div className="relative mb-4">
              <div className="relative h-2 bg-white/15 rounded-full mx-1">
                {/* Active track */}
                <div className="absolute h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"
                  style={{
                    left: `${(priceMin / MAX_PRICE) * 100}%`,
                    right: `${100 - (priceMax / MAX_PRICE) * 100}%`,
                  }}/>
              </div>
              {/* Min thumb */}
              <input type="range" min={0} max={MAX_PRICE} step={0.1} value={priceMin}
                onChange={(e) => {
  const value = Math.min(+e.target.value, priceMax - 10);

  setPriceMin(value);
  setMinPriceInput(value > 0 ? String(value) : "");
}}
                onMouseUp={applyPrice} onTouchEnd={applyPrice}
                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer" style={{ zIndex: 3 }}/>
              {/* Max thumb */}
              <input type="range" min={0} max={MAX_PRICE} step={0.1} value={priceMax}
                onChange={(e) => {
  const value = Math.max(+e.target.value, priceMin + 10);

  setPriceMax(value);
  setMaxPriceInput(value < MAX_PRICE ? String(value) : "");
}}
                onMouseUp={applyPrice} onTouchEnd={applyPrice}
                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer" style={{ zIndex: 4 }}/>
              {/* Thumb visuals */}
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-violet-500 pointer-events-none transition-all"
                style={{ left: `calc(${(priceMin / MAX_PRICE) * 100}% - 8px)` }}/>
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-violet-500 pointer-events-none transition-all"
                style={{ left: `calc(${(priceMax / MAX_PRICE) * 100}% - 8px)` }}/>
            </div>

            {/* Quick presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Under $25',   min: 0,   max: 25   },
                { label: '$25 – $50',   min: 25,  max: 50   },
                { label: '$50 – $100',  min: 50,  max: 100  },
                { label: '$100 – $200', min: 100, max: 200  },
                { label: '$200+',       min: 200, max: MAX_PRICE },
                { label: 'Any Price',   min: 0,   max: MAX_PRICE },
              ].map(p => (
                <button key={p.label}
                  onClick={() => {
                    setPriceMin(p.min); setPriceMax(p.max)
                    onFilter?.('priceMin', p.min > 0 ? p.min : undefined)
                    onFilter?.('priceMax', p.max < MAX_PRICE ? p.max : undefined)
                  }}
                  className={`text-[11px] font-medium px-2 py-1.5 rounded-lg transition-all ${
                    priceMin === p.min && priceMax === p.max
                      ? 'bg-violet-400/30 text-violet-200 ring-1 ring-violet-400/40'
                      : 'bg-white/8 text-white/60 hover:bg-white/15 hover:text-white'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Rating */}
        <Section id="rating" label="Customer Rating" open={open.rating} onToggle={toggle} count={filters.rating ? 1 : 0}>
          <div className="space-y-0.5">
            <FilterCheckbox
              label="All Ratings"
              checked={!filters.rating}
              onChange={() => onFilter?.('rating', null)}
            />
            {RATINGS.map(r => (
              <label key={r.value}
                className={`flex items-center gap-3 py-2 px-3 rounded-xl cursor-pointer transition-all group
                  ${filters.rating === r.value ? 'bg-white/15 ring-1 ring-white/20' : 'hover:bg-white/8'}`}
                onClick={() => onFilter?.('rating', filters.rating === r.value ? null : r.value)}>
                <div className={`w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-md border-2 flex items-center justify-center transition-all
                  ${filters.rating === r.value ? 'bg-violet-400 border-violet-400' : 'border-white/30 group-hover:border-white/60 bg-white/5'}`}>
                  {filters.rating === r.value && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12}
                      className={i < r.value ? 'fill-yellow-400 text-yellow-400' : 'fill-white/15 text-white/15'}/>
                  ))}
                  <span className={`text-xs ml-1 transition-colors ${filters.rating === r.value ? 'text-white font-semibold' : 'text-white/60 group-hover:text-white/80'}`}>
                    {r.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </Section>

        {/* In Stock toggle */}
        <div className="py-4 px-1 border-t border-white/10">
          <div
            onClick={() => onFilter?.('inStock', !filters.inStock)}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 select-none group border
              ${filters.inStock 
                ? 'bg-gradient-to-r from-violet-500/15 to-purple-500/15 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                : 'bg-white/5 border-transparent hover:bg-white/8'}`}
          >
            <div className="flex flex-col gap-0.5">
              <span className={`text-sm transition-colors ${filters.inStock ? 'text-white font-semibold' : 'text-white/80 group-hover:text-white'}`}>
                In Stock Only
              </span>
              <span className="text-[11px] text-white/40 group-hover:text-white/50 transition-colors">
                Hide unavailable items
              </span>
            </div>

            {/* Premium Custom Switch Container */}
            <div className={`w-11 h-6 rounded-full relative transition-all duration-300 p-0.5 overflow-hidden
              ${filters.inStock ? 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.4)]' : 'bg-white/15'}`}
          >
              {/* Glow effect inside switch when active */}
              {filters.inStock && (
                <motion.div 
                  layoutId="switchGlow"
                  className="absolute inset-0 bg-white/20 blur-[2px]"
                  transition={{ duration: 0.2 }}
                />
              )}
              
              {/* Knob */}
              <motion.div 
                animate={{ x: filters.inStock ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center relative z-10"
              >
                {/* Micro icon when active */}
                {filters.inStock && (
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active filters summary ── */}
      <AnimatePresence>
        {activeCount > 0 && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
            className="flex-shrink-0 mt-3 p-3 bg-white/8 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/70">Active filters</span>
              <button onClick={onReset} className="text-[11px] text-violet-300 hover:text-white transition-colors">Clear all</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filters.category && categories.find(c=>c._id===filters.category) && (
                <span className="inline-flex items-center gap-1 bg-violet-500/20 text-violet-200 text-[11px] font-medium px-2 py-1 rounded-lg">
                  {categories.find(c=>c._id===filters.category)?.icon} {categories.find(c=>c._id===filters.category)?.name}
                  <button onClick={() => onFilter?.('category', '')} className="ml-0.5 hover:text-white"><X size={10}/></button>
                </span>
              )}
              {filters.brand && brands.find(b=>b._id===filters.brand) && (
                <span className="inline-flex items-center gap-1 bg-violet-500/20 text-violet-200 text-[11px] font-medium px-2 py-1 rounded-lg">
                  {brands.find(b=>b._id===filters.brand)?.name}
                  <button onClick={() => onFilter?.('brand', '')} className="ml-0.5 hover:text-white"><X size={10}/></button>
                </span>
              )}
              {filters.rating && (
                <span className="inline-flex items-center gap-1 bg-violet-500/20 text-violet-200 text-[11px] font-medium px-2 py-1 rounded-lg">
                  ⭐ {filters.rating}+
                  <button onClick={() => onFilter?.('rating', null)} className="ml-0.5 hover:text-white"><X size={10}/></button>
                </span>
              )}
              {(filters.priceMin > 0 || (filters.priceMax && filters.priceMax < MAX_PRICE)) && (
                <span className="inline-flex items-center gap-1 bg-violet-500/20 text-violet-200 text-[11px] font-medium px-2 py-1 rounded-lg">
                  ${filters.priceMin||0} – {filters.priceMax >= MAX_PRICE ? '∞' : `$${filters.priceMax}`}
                  <button onClick={() => { onFilter?.('priceMin', undefined); onFilter?.('priceMax', undefined) }} className="ml-0.5 hover:text-white"><X size={10}/></button>
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const sidebarInner = (
    <div className="relative h-full rounded-2xl overflow-hidden">
      {/* Glass background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2d1f5e] via-[#1f1545] to-[#1a1535] rounded-2xl"/>
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl pointer-events-none"/>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-600/15 rounded-full blur-2xl pointer-events-none"/>
      <div className="relative z-10 h-full pt-5 pb-5 pl-5 pr-1 flex flex-col">
        {content}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-[240px] flex-shrink-0 sticky top-[88px] h-[calc(100vh-100px)]">
        {sidebarInner}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}/>
            <motion.div
              initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }}
              transition={{ type:'spring', stiffness:300, damping:30 }}
              className="fixed left-0 top-0 bottom-0 w-[300px] z-50 p-3 lg:hidden shadow-2xl"
            >
              <div className="h-full">{sidebarInner}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
