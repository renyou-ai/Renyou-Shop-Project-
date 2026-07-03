import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('renyou_wishlist')) || [] }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('renyou_wishlist', JSON.stringify(items))
  }, [items])

  
const toggle = useCallback((product) => {
  if (!product?._id) return;

  setItems(prev => {
    const exists = prev.some(i => i._id === product._id);

    return exists
      ? prev.filter(i => i._id !== product._id)
      : [...prev, product];
  });
}, []);

  const isWished = useCallback((id) => items.some(i => i._id === id), [items])
  const clear    = useCallback(() => setItems([]), [])

  return (
    <WishlistContext.Provider value={{ items, toggle, isWished, clear, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider')
  return ctx
}
