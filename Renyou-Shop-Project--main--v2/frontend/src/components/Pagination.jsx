import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i)
    else if (pages[pages.length - 1] !== '...') pages.push('...')
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-violet-400 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        <ChevronLeft size={16}/>
      </button>

      {pages.map((p, i) => p === '...'
        ? <span key={`d${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        : (
          <motion.button key={p} whileTap={{ scale: 0.93 }}
            onClick={() => onPage(p)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
              p === page
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'border border-gray-200 text-gray-700 hover:border-violet-400 hover:text-violet-600'
            }`}>
            {p}
          </motion.button>
        )
      )}

      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-violet-400 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        <ChevronRight size={16}/>
      </button>
    </div>
  )
}
