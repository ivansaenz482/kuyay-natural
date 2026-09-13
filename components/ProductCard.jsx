import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, Minus, Plus, ShoppingBag, Star } from 'lucide-react'
import { useState } from 'react'
import { formatUSD, productWhatsAppLink } from '../lib/whatsapp'
import { useCart } from '../context/CartContext'
import WhatsAppIcon from './WhatsAppIcon'

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group card relative flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/producto/${product.slug}`} aria-label={product.name}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kuyay-forest/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.badge && (
            <span className="rounded-full bg-kuyay-forest/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-kuyay-lime backdrop-blur">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-kuyay-gold px-3 py-1 text-[11px] font-black text-kuyay-forest">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-kuyay-forest backdrop-blur">
          <Star className="h-3 w-3 fill-kuyay-gold text-kuyay-gold" />
          {product.rating?.toFixed(1)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-kuyay-leaf">
          {product.unit}
        </span>
        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-kuyay-forest">
          <Link href={`/producto/${product.slug}`} className="hover:text-kuyay-green">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-kuyay-deep/60">
          {product.short}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-black text-kuyay-forest">
                {formatUSD(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm font-semibold text-kuyay-deep/35 line-through">
                  {formatUSD(product.oldPrice)}
                </span>
              )}
            </div>
            <span className="mt-0.5 flex items-center gap-1 text-[11px] text-kuyay-deep/45">
              <Eye className="h-3 w-3" /> {product.views?.toLocaleString('es-EC')} vistas
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-kuyay-green/15 bg-white p-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Quitar uno"
              className="grid h-7 w-7 place-items-center rounded-full text-kuyay-forest transition hover:bg-kuyay-lime/50"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-5 text-center text-sm font-bold text-kuyay-forest">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              aria-label="Agregar uno"
              className="grid h-7 w-7 place-items-center rounded-full text-kuyay-forest transition hover:bg-kuyay-lime/50"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button
            onClick={() => {
              addItem(product, qty)
              setQty(1)
            }}
            className="btn-primary w-full"
          >
            <ShoppingBag className="h-4 w-4" />
            Agregar al carrito
          </button>
          <a
            href={productWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar ${product.name} por WhatsApp`}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </motion.article>
  )
}
