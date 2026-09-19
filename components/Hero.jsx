'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

const STATS = [
  { value: '+2.500', label: 'Botellas entregadas' },
  { value: '100%', label: 'Natural y artesanal' },
  { value: '4.9★', label: 'Valoración de clientes' },
]

export default function Hero() {
  const { hero, topNotice } = useSettings()
  const heroImage = hero?.image || '/images/kefir-natural.jpeg'
  const rawPrice = String(hero?.price || '').trim()
  const priceLabel = rawPrice ? (rawPrice.startsWith('$') ? rawPrice : `$${rawPrice}`) : ''
  const hasTopNotice = Boolean(topNotice?.enabled && topNotice?.text)

  return (
    <section
      className={`relative overflow-hidden pb-20 sm:pb-28 ${
        hasTopNotice ? 'pt-40 sm:pt-48' : 'pt-32 sm:pt-40'
      }`}
    >
      {/* Fondo con imagen real de producto */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/variedad.jpeg"
          alt="Productos Kuyay Natural"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-kuyay-forest/95 via-kuyay-deep/85 to-kuyay-green/70" />
        <div className="absolute inset-0 bg-grain opacity-[0.15] mix-blend-overlay" />
      </div>

      {/* Blobs decorativos */}
      <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 animate-blob rounded-full bg-kuyay-fresh/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 -z-10 h-80 w-80 animate-blob rounded-full bg-kuyay-gold/30 blur-3xl [animation-delay:3s]" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-kuyay-lime backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            100% Hecho con amor
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Probióticos vivos,
            <br />
            <span className="text-gradient">sabor de verdad.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Kéfir artesanal, queso crema probiótico y frutas deshidratadas sin azúcar añadida.
            Fermentados lentamente, sin conservantes y directo a tu puerta.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a href="#productos" className="btn-gold group text-base">
              Ver productos
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#nosotros"
              className="btn border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              Nuestra historia
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-black text-white sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Tarjeta flotante de producto */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="animate-float">
            <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-2 shadow-card backdrop-blur-xl">
              <img
                src={heroImage}
                alt="Kéfir artesanal natural Kuyay"
                className="h-[26rem] w-full rounded-[1.6rem] object-cover"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass absolute -left-4 top-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-soft sm:-left-8"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-kuyay-lime/60 text-kuyay-forest">
              <Star className="h-5 w-5 fill-kuyay-gold text-kuyay-gold" />
            </span>
            <div>
              <p className="text-sm font-black text-kuyay-forest">Lactobacillus vivos</p>
              <p className="text-xs text-kuyay-deep/60">Sin conservantes</p>
            </div>
          </motion.div>

          {priceLabel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="glass absolute -right-3 bottom-12 rounded-2xl px-4 py-3 shadow-soft sm:-right-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-kuyay-deep/50">
                Desde
              </p>
              <p className="font-display text-2xl font-black text-kuyay-forest">{priceLabel}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
