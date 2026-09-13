'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Download, Share2 } from 'lucide-react'

const SHARE_URL = 'https://kuyay-natural.vercel.app'
const QR_SRC = '/qr-kuyay.png'

export default function ShareSection() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard no disponible */
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kuyay Natural',
          text: 'Kéfir artesanal, queso crema y frutas deshidratadas. 100% natural 🌿',
          url: SHARE_URL,
        })
      } catch {
        /* cancelado */
      }
    } else {
      copy()
    }
  }

  return (
    <section className="relative py-20 sm:py-24">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="relative overflow-hidden rounded-[2.5rem] border border-kuyay-green/10 bg-gradient-to-br from-kuyay-forest via-kuyay-deep to-kuyay-green p-8 shadow-card sm:p-12"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-kuyay-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-kuyay-fresh/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="chip border-white/20 bg-white/10 text-kuyay-lime">
                <Share2 className="h-3.5 w-3.5" /> Comparte
              </span>
              <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                Comparte Kuyay con un escaneo
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                Apunta la cámara al código QR o comparte el enlace. Ideal para ferias, emprendimientos
                y para que tus clientes te encuentren al instante.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={nativeShare} className="btn-gold">
                  <Share2 className="h-4 w-4" /> Compartir enlace
                </button>
                <button
                  onClick={copy}
                  className="btn border border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Enlace copiado' : 'Copiar enlace'}
                </button>
                <a
                  href={QR_SRC}
                  download="qr-kuyay-natural.png"
                  className="btn border border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4" /> Descargar QR
                </a>
              </div>

              <p className="mt-5 break-all rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-semibold text-kuyay-lime">
                {SHARE_URL}
              </p>
            </div>

            <div className="mx-auto w-full max-w-xs">
              <div className="animate-float rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-card backdrop-blur-xl">
                <img
                  src={QR_SRC}
                  alt="Código QR de Kuyay Natural"
                  className="w-full rounded-2xl bg-white"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
