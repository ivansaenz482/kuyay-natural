import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from 'lucide-react'
import Link from 'next/link'
import { formatUSD, productWhatsAppLink } from '../lib/whatsapp'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import WhatsAppIcon from './WhatsAppIcon'

export default function ProductCarousel({ products = [] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const { addItem } = useCart()
  const { numbers } = useSettings()
  const total = products.length

  const go = useCallback(
    (dir) => {
      if (!total) return
      setIndex((i) => (i + dir + total) % total)
    },
    [total],
  )

  useEffect(() => {
    if (paused || total <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 5500)
    return () => clearInterval(id)
  }, [paused, total])

  if (!total) return null
  const product = products[index % total]
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0

  return (
    <section id="destacados" className="relative overflow-hidden bg-kuyay-forest py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-kuyay-fresh/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-kuyay-gold/20 blur-3xl" />

      <div className="container-x relative">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip border-white/20 bg-white/10 text-kuyay-lime">Lo más pedido</span>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
              Los favoritos de la casa
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Siguiente"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className="grid items-center gap-10 lg:grid-cols-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-white/15 shadow-card">
            <AnimatePresence mode="wait">
              <motion.img
                key={product.id}
                src={product.images?.[0]}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-kuyay-forest/60 to-transparent" />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-kuyay-gold px-3 py-1 text-xs font-black uppercase tracking-wider text-kuyay-forest">
                {product.badge}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 text-kuyay-lime">
                <span className="flex items-center gap-1 text-sm font-bold">
                  <Star className="h-4 w-4 fill-kuyay-gold text-kuyay-gold" />
                  {product.rating?.toFixed(1)}
                </span>
                <span className="text-sm text-white/50">·</span>
                <span className="text-sm font-semibold text-white/60">
                  {product.reviews} reseñas
                </span>
              </div>

              <h3 className="mt-4 font-display text-3xl font-black leading-tight text-white sm:text-4xl">
                {product.name}
              </h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                {product.description}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {product.benefits?.slice(0, 4).map((b) => (
                  <li
                    key={b}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-kuyay-lime"
                  >
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div>
                  <span className="font-display text-4xl font-black text-white">
                    {formatUSD(product.price)}
                  </span>
                  {discount > 0 && (
                    <span className="ml-3 text-sm font-bold text-kuyay-gold">-{discount}% hoy</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => addItem(product, 1)} className="btn-gold">
                    <ShoppingBag className="h-4 w-4" /> Agregar
                  </button>
                  <a
                    href={productWhatsAppLink(product, 1, numbers)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
              <Link
                href={`/producto/${product.slug}`}
                className="mt-5 inline-block text-sm font-bold text-kuyay-lime underline-offset-4 hover:underline"
              >
                Ver detalle del producto →
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIndex(i)}
              aria-label={`Ir a ${p.name}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === index ? 'w-10 bg-kuyay-gold' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
