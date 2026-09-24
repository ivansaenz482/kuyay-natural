'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Lock, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { bankAccountsMessage } from '../lib/whatsapp'
import BankAccounts from './BankAccounts'
import WhatsAppIcon from './WhatsAppIcon'

export default function PaymentSection() {
  const { bankAccounts, payment } = useSettings()
  const [revealed, setRevealed] = useState(false)

  const share = async () => {
    const text = bankAccountsMessage(bankAccounts)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Cuentas Kuyay Natural', text })
        return
      } catch {
        /* el usuario canceló o no está disponible */
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const methods = [
    'Transferencia bancaria',
    'Pago al recibir el pedido',
    payment?.deuna?.enabled && 'DeUna',
    payment?.go?.enabled && 'GO',
  ].filter(Boolean)

  return (
    <section id="pagos" className="relative scroll-mt-32 py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto">Pagos</span>
          <h2 className="section-title mt-4">Formas de pago</h2>
          <p className="mt-4 text-sm text-kuyay-deep/60 sm:text-base">
            Presiona el botón para ver los datos bancarios. Puedes copiarlos o enviártelos por
            WhatsApp y realizar tu transferencia cuando quieras.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {methods.map((m) => (
              <span
                key={m}
                className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-kuyay-green shadow-soft"
              >
                {m}
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <div className="pointer-events-none select-none blur-md" aria-hidden>
                  <BankAccounts accounts={bankAccounts} />
                </div>
                <div className="absolute inset-0 grid place-items-center rounded-2xl bg-kuyay-cream/75 px-6 text-center backdrop-blur-[2px]">
                  <div>
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-kuyay-forest text-kuyay-lime">
                      <Lock className="h-7 w-7" />
                    </span>
                    <p className="mt-4 font-display text-xl font-black text-kuyay-forest">
                      Cuentas protegidas
                    </p>
                    <p className="mt-1.5 text-sm text-kuyay-deep/60">
                      Toca el botón para ver los datos bancarios y realizar tu pago.
                    </p>
                    <button onClick={() => setRevealed(true)} className="btn-primary mt-5">
                      <Eye className="h-4 w-4" /> Ver cuentas para transferir
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <BankAccounts accounts={bankAccounts} />

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    onClick={share}
                    className="btn bg-[#25D366] text-white hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Enviar cuentas por WhatsApp
                  </button>
                  <button onClick={() => setRevealed(false)} className="btn-ghost">
                    <Lock className="h-4 w-4" /> Ocultar cuentas
                  </button>
                </div>

                <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-kuyay-deep/50">
                  <ShieldCheck className="h-4 w-4 text-kuyay-green" /> Envía tu comprobante por
                  WhatsApp al finalizar el pedido.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
