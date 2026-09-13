'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'kuyay:cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* noop */
    }
  }, [items])

  const notify = useCallback((message) => {
    setToast(message)
    window.clearTimeout(notify._t)
    notify._t = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const addItem = useCallback(
    (product, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id)
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, 99) } : i,
          )
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            image: product.images?.[0],
            qty,
          },
        ]
      })
      notify(`${product.name} agregado al carrito`)
      setIsOpen(true)
    },
    [notify],
  )

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, Math.min(qty, 99)) } : i))
        .filter((i) => i.qty > 0),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((acc, i) => acc + i.qty, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.qty * i.price, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      toast,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQty,
      clear,
    }),
    [items, count, subtotal, isOpen, toast, addItem, removeItem, updateQty, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
