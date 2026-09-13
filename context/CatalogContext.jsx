'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ])
      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      setProducts(Array.isArray(productsData) ? productsData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch {
      setProducts([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const registerView = useCallback(async (id) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, views: (p.views || 0) + 1 } : p)))
    try {
      await fetch(`/api/products/${id}/view`, { method: 'POST' })
    } catch {
      /* silencioso */
    }
  }, [])

  const value = useMemo(
    () => ({ products, categories, loading, refresh, registerView }),
    [products, categories, loading, refresh, registerView],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog debe usarse dentro de CatalogProvider')
  return ctx
}
