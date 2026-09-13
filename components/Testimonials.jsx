'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

export default function Testimonials() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
  }, [])

  if (!reviews.length) return null

  return (
    <section className="relative overflow-hidden bg-kuyay-green py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-10 mix-blend-overlay" />
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip border-white/20 bg-white/10 text-kuyay-lime">Clientes felices</span>
          <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
            Historias que nos inspiran
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.12 }}
              className="relative rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl"
            >
              <Quote className="h-8 w-8 text-kuyay-lime/70" />
              <blockquote className="mt-4 text-sm leading-relaxed text-white/85">
                “{r.text}”
              </blockquote>
              <div className="mt-5 flex items-center gap-1">
                {Array.from({ length: r.rating || 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-kuyay-gold text-kuyay-gold" />
                ))}
              </div>
              <figcaption className="mt-3">
                <span className="block font-bold text-white">{r.name}</span>
                {r.role && <span className="text-xs text-white/60">{r.role}</span>}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
