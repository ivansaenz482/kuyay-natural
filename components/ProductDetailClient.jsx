'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'
import ProductCard from './ProductCard'
import WhatsAppIcon from './WhatsAppIcon'
import { formatUSD, productWhatsAppLink } from '../lib/whatsapp'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'

export default function ProductDetailClient() {
  const params = useParams()
  const slug = params?.slug
  const { products, registerView } = useCatalog()
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)

  const product = useMemo(() => products.find((p) => p.slug === slug), [products, slug])
  const related = useMemo(
    () => products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4),
    [products, product],
  )

  useEffect(() => {
    if (product) registerView(product.id)
    setActive(0)
    setQty(1)
  }, [product?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="grid min-h-screen place-items-center px-6 pt-24 text-center">
          <div>
            <h1 className="font-display text-3xl font-black text-kuyay-forest">
              Producto no encontrado
            </h1>
            <p className="mt-2 text-sm text-kuyay-deep/60">
              El producto que buscas no está disponible.
            </p>
            <Link href="/" className="btn-primary mt-6">
              Volver a la tienda
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const images = product.images?.length ? product.images : ['/images/logo.jpeg']
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0

  const go = (dir) => setActive((i) => (i + dir + images.length) % images.length)

  return (
    <div className="relative">
      <Navbar />
      <main className="pt-28 sm:pt-36">
        <div className="container-x">
          <nav className="flex items-center gap-2 text-xs font-semibold text-kuyay-deep/50">
            <Link href="/" className="hover:text-kuyay-green">Inicio</Link>
            <span>/</span>
            <Link href="/#productos" className="hover:text-kuyay-green">Productos</Link>
            <span>/</span>
            <span className="text-kuyay-green">{product.name}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-kuyay-green/10 shadow-card">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active}
                    src={images[active]}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => go(-1)}
                      aria-label="Imagen anterior"
                      className="glass absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-kuyay-forest transition hover:bg-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => go(1)}
                      aria-label="Imagen siguiente"
                      className="glass absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-kuyay-forest transition hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {discount > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-kuyay-gold px-3 py-1 text-xs font-black text-kuyay-forest">
                    -{discount}% hoy
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {images.map((img, i) => (
                    <button
                      key={img + i}
                      onClick={() => setActive(i)}
                      aria-label={`Ver imagen ${i + 1}`}
                      className={`h-20 w-20 overflow-hidden rounded-2xl border-2 transition ${
                        active === i ? 'border-kuyay-green' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                {product.badge && (
                  <span className="rounded-full bg-kuyay-forest px-3 py-1 text-xs font-bold uppercase tracking-wider text-kuyay-lime">
                    {product.badge}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm font-bold text-kuyay-forest">
                  <Star className="h-4 w-4 fill-kuyay-gold text-kuyay-gold" />
                  {product.rating?.toFixed(1)}
                  <span className="font-normal text-kuyay-deep/50">({product.reviews} reseñas)</span>
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-black leading-tight text-kuyay-forest sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm font-bold uppercase tracking-widest text-kuyay-leaf">
                {product.unit}
              </p>

              <div className="mt-5 flex items-end gap-3">
                <span className="font-display text-4xl font-black text-kuyay-forest">
                  {formatUSD(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="pb-1 text-lg font-semibold text-kuyay-deep/35 line-through">
                    {formatUSD(product.oldPrice)}
                  </span>
                )}
              </div>

              <p className="mt-5 text-base leading-relaxed text-kuyay-deep/70">
                {product.description}
              </p>

              {product.benefits?.length > 0 && (
                <ul className="mt-6 grid grid-cols-2 gap-3">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm font-semibold text-kuyay-deep/80">
                      <Leaf className="h-4 w-4 shrink-0 text-kuyay-fresh" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {product.ingredients && (
                <p className="mt-5 rounded-2xl border border-kuyay-green/10 bg-white/70 p-4 text-sm text-kuyay-deep/65">
                  <span className="font-bold text-kuyay-forest">Ingredientes: </span>
                  {product.ingredients}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 rounded-full border border-kuyay-green/15 bg-white p-1.5">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Menos"
                    className="grid h-9 w-9 place-items-center rounded-full text-kuyay-forest transition hover:bg-kuyay-lime/50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-kuyay-forest">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    aria-label="Más"
                    className="grid h-9 w-9 place-items-center rounded-full text-kuyay-forest transition hover:bg-kuyay-lime/50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={() => addItem(product, qty)} className="btn-primary flex-1">
                  <ShoppingBag className="h-4 w-4" /> Agregar al carrito
                </button>
                <a
                  href={productWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-[#25D366] text-white hover:bg-[#1ebe5b]"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Consultar
                </a>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-kuyay-green/10 bg-white/70 p-3">
                  <Truck className="h-5 w-5 text-kuyay-green" />
                  <span className="text-xs font-semibold text-kuyay-deep/70">
                    Entrega local el mismo día
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-kuyay-green/10 bg-white/70 p-3">
                  <ShieldCheck className="h-5 w-5 text-kuyay-green" />
                  <span className="text-xs font-semibold text-kuyay-deep/70">
                    Sin conservantes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="py-20">
              <h2 className="font-display text-2xl font-black text-kuyay-forest sm:text-3xl">
                También te puede gustar
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
