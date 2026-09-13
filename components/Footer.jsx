'use client'

import Link from 'next/link'
import { ArrowUpRight, Code2, Lock } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { WHATSAPP_NUMBERS } from '../lib/whatsapp'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-kuyay-forest pt-16 pb-8 text-white/70">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-kuyay-fresh/20 blur-3xl" />
      <div className="container-x relative">
        <div className="grid gap-10 pb-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full ring-2 ring-kuyay-lime/50">
                <img src="/images/logo.jpeg" alt="Kuyay Natural" className="h-full w-full object-cover" />
              </span>
              <div>
                <p className="font-display text-xl font-black text-white">Kuyay Natural</p>
                <p className="text-xs uppercase tracking-[0.25em] text-kuyay-lime">Hecho con amor</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Kéfir artesanal, queso crema probiótico y frutas deshidratadas. Alimentos vivos,
              naturales y sin conservantes, elaborados en pequeños lotes.
            </p>
            <div className="mt-5 flex gap-2">
              {WHATSAPP_NUMBERS.map((num) => (
                <a
                  key={num}
                  href={`https://wa.me/${num}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Kuyay"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-[#25D366]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">Tienda</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="/#productos" className="transition hover:text-kuyay-lime">Productos</a></li>
              <li><a href="/#destacados" className="transition hover:text-kuyay-lime">Más vendidos</a></li>
              <li><a href="/#beneficios" className="transition hover:text-kuyay-lime">Beneficios</a></li>
              <li><a href="/#nosotros" className="transition hover:text-kuyay-lime">Nosotros</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">Atención</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="/#contacto" className="transition hover:text-kuyay-lime">Contacto</a></li>
              <li><Link href="/seguimiento" className="transition hover:text-kuyay-lime">Seguir mi pedido</Link></li>
              <li>Pago por transferencia</li>
              <li>Pago en efectivo</li>
              <li>
                <Link href="/admin" className="inline-flex items-center gap-1.5 transition hover:text-kuyay-lime">
                  <Lock className="h-3.5 w-3.5" /> Panel admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <a
          href="https://ivansaenz482.github.io/ivan-teneta-web/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-white/10 via-white/5 to-transparent p-5 transition hover:border-kuyay-lime/40 sm:p-6"
        >
          <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-kuyay-gold/20 blur-2xl transition group-hover:bg-kuyay-gold/30" />
          <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-kuyay-lime/20 text-kuyay-lime ring-1 ring-kuyay-lime/30">
                <Code2 className="h-6 w-6" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-kuyay-gold">
                  Publicidad
                </p>
                <p className="font-display text-lg font-black text-white">
                  Página creada por Iván Teneta
                </p>
                <p className="text-xs text-white/60">
                  ¿Quieres una web como esta para tu negocio? Contáctame.
                </p>
              </div>
            </div>
            <span className="btn-gold shrink-0">
              Ver mi sitio
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </a>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Kuyay Natural. Todos los derechos reservados.</p>
          <p className="text-white/40">100% natural · Sin conservantes · Hecho en Ecuador</p>
        </div>
      </div>
    </footer>
  )
}
