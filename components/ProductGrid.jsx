'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { useCatalog } from '../context/CatalogContext'

export default function ProductGrid() {
  const { products, categories, loading } = useCatalog()
  const [category, setCategory] = useState('all')

  const tabs = useMemo(
    () => [
      { id: 'all', label: 'Todo', emoji: '🌿' },
      ...categories.map((c) => ({ id: c.slug, label: c.name, emoji: c.emoji || '🌿' })),
    ],
    [categories],
  )

  const filtered = useMemo(
    () => (category === 'all' ? products : products.filter((p) => p.category === category)),
    [products, category],
  )

  return (
    <section id="productos" className="relative py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">Catálogo Kuyay</span>
          <h2 className="section-title mt-4">Productos vivos, hechos a mano</h2>
          <p className="mt-4 text-base leading-relaxed text-kuyay-deep/65">
            Elige tus favoritos, agrégalos al carrito y paga por transferencia o en efectivo.
            También puedes pedir por WhatsApp con un solo clic.
          </p>
        </div>

        <div className="no-scrollbar mt-10 flex justify-start gap-2 overflow-x-auto pb-2 sm:justify-center">
          {tabs.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                category === c.id
                  ? 'text-white'
                  : 'border border-kuyay-green/15 bg-white/70 text-kuyay-deep/70 hover:border-kuyay-green/40'
              }`}
            >
              {category === c.id && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-kuyay-green shadow-soft"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <span>{c.emoji}</span>
                {c.label}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card h-96 animate-pulse bg-kuyay-sand/60" />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}
