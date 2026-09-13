import Link from 'next/link'
import { Lock } from 'lucide-react'
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

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Kuyay Natural. Todos los derechos reservados.</p>
          <p className="text-white/40">100% natural · Sin conservantes · Hecho en Ecuador</p>
        </div>
      </div>
    </footer>
  )
}
