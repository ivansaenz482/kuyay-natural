'use client'

import { Clock } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function OrderNotice({ variant = 'banner', className = '' }) {
  const { orderNotice } = useSettings()
  if (!orderNotice?.enabled || !orderNotice?.text) return null

  if (variant === 'banner') {
    return (
      <div className="border-y border-kuyay-gold/40 bg-kuyay-gold/15">
        <div className="container-x flex items-center justify-center gap-3 py-3 text-center">
          <Clock className="h-4 w-4 shrink-0 text-kuyay-forest" />
          <p className="text-sm font-semibold leading-snug text-kuyay-forest">{orderNotice.text}</p>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div
        className={`flex items-start gap-3 rounded-2xl border border-kuyay-gold/40 bg-kuyay-gold/15 p-4 ${className}`}
      >
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-kuyay-forest" />
        <p className="text-sm font-semibold leading-relaxed text-kuyay-forest">{orderNotice.text}</p>
      </div>
    )
  }

  return (
    <div
      className={`flex items-start gap-2 rounded-xl bg-kuyay-gold/20 px-3 py-2 text-xs font-semibold leading-relaxed text-kuyay-forest ${className}`}
    >
      <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{orderNotice.text}</span>
    </div>
  )
}
