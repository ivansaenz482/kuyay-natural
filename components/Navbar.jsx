'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Leaf, Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const LINKS = [
  { href: '/#productos', label: 'Productos' },
  { href: '/#beneficios', label: 'Beneficios' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { count, openCart } = useCart()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`container-x mt-3 flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
          scrolled ? 'glass shadow-soft' : 'border border-transparent bg-transparent'
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-kuyay-forest shadow-soft ring-2 ring-kuyay-lime/60">
            <img src="/images/logo.jpeg" alt="Kuyay Natural" className="h-full w-full object-cover" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-lg font-black tracking-tight text-kuyay-forest">
              Kuyay
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-kuyay-leaf">
              Natural
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-kuyay-deep/70 transition hover:bg-kuyay-lime/40 hover:text-kuyay-forest"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative grid h-11 w-11 place-items-center rounded-full bg-kuyay-forest text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-kuyay-deep"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-kuyay-gold px-1 text-[10px] font-black text-kuyay-forest"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            className="grid h-11 w-11 place-items-center rounded-full border border-kuyay-green/15 bg-white/70 text-kuyay-forest lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="container-x lg:hidden"
          >
            <div className="glass mt-2 flex flex-col gap-1 rounded-3xl p-3 shadow-card">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-kuyay-deep transition hover:bg-kuyay-lime/40"
                >
                  <Leaf className="h-4 w-4 text-kuyay-leaf" />
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
