'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { X } from 'lucide-react'
import { WHATSAPP_NUMBERS } from '../lib/whatsapp'
import WhatsAppIcon from './WhatsAppIcon'

const LABELS = ['Pedidos · +593 99 102 8834', 'Consultas · +593 99 439 5266']

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-5 z-[55] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          WHATSAPP_NUMBERS.map((num, i) => (
            <motion.a
              key={num}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              href={`https://wa.me/${num}?text=${encodeURIComponent(
                '¡Hola Kuyay Natural! 🌿 Quiero hacer un pedido.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass flex items-center gap-2.5 rounded-full py-2.5 pl-3 pr-4 shadow-card transition hover:-translate-y-0.5"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366] text-white">
                <WhatsAppIcon className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-kuyay-forest">{LABELS[i] || `+${num}`}</span>
            </motion.a>
          ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        aria-label="Contactar por WhatsApp"
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-card"
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="w" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <WhatsAppIcon className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
