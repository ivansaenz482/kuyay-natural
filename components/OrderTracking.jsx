'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  ChefHat,
  CircleDashed,
  Loader2,
  PackageCheck,
  Search,
  XCircle,
} from 'lucide-react'
import { ORDER_STATUSES, statusIndex, paymentLabel } from '../lib/orders'
import { formatUSD } from '../lib/whatsapp'

const ICONS = [ChefHat, PackageCheck, CheckCircle2]

export default function OrderTracking() {
  const searchParams = useSearchParams()
  const [code, setCode] = useState(searchParams.get('code') || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lookup = useCallback(async (value) => {
    const clean = (value || '').trim()
    if (!clean) {
      setError('Escribe tu código de pedido (ej. KY-ABC123).')
      setOrder(null)
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/orders/track?code=${encodeURIComponent(clean)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No encontramos ese pedido')
      setOrder(data)
    } catch (err) {
      setOrder(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initial = searchParams.get('code')
    if (initial) lookup(initial)
  }, [searchParams, lookup])

  const currentIndex = order ? statusIndex(order.status) : -1
  const canceled = order?.status === 'cancelado'

  return (
    <div className="container-x max-w-3xl py-16 sm:py-24">
      <div className="text-center">
        <span className="chip">Seguimiento</span>
        <h1 className="section-title mt-4">Rastrea tu pedido</h1>
        <p className="mt-3 text-sm text-kuyay-deep/60">
          Ingresa el código que te dimos al confirmar tu compra.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          lookup(code)
        }}
        className="mx-auto mt-8 flex max-w-md gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-kuyay-deep/40" />
          <input
            className="input pl-11 uppercase"
            placeholder="KY-XXXXXX"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
        </button>
      </form>

      {error && (
        <p className="mx-auto mt-4 max-w-md rounded-xl bg-kuyay-berry/10 px-4 py-2.5 text-center text-sm font-semibold text-kuyay-berry">
          {error}
        </p>
      )}

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-3xl border border-kuyay-green/10 bg-white/80 p-6 shadow-soft sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-kuyay-deep/50">
                Pedido
              </p>
              <p className="font-display text-2xl font-black text-kuyay-forest">{order.id}</p>
              <p className="text-sm text-kuyay-deep/60">Hola, {order.customer?.name || 'cliente'} 👋</p>
            </div>
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider ${
                canceled ? 'bg-kuyay-berry text-white' : 'bg-kuyay-lime/60 text-kuyay-forest'
              }`}
            >
              {canceled ? 'Cancelado' : ORDER_STATUSES[currentIndex]?.label || order.status}
            </span>
          </div>

          {canceled ? (
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-kuyay-berry/10 p-5 text-kuyay-berry">
              <XCircle className="h-6 w-6 shrink-0" />
              <p className="text-sm font-semibold">
                Este pedido fue cancelado. Si crees que es un error, escríbenos por WhatsApp.
              </p>
            </div>
          ) : (
            <ol className="mt-10 space-y-0">
              {ORDER_STATUSES.map((s, i) => {
                const Icon = ICONS[i] || CircleDashed
                const done = i <= currentIndex
                const active = i === currentIndex
                return (
                  <li key={s.id} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < ORDER_STATUSES.length - 1 && (
                      <span
                        className={`absolute left-[22px] top-11 h-full w-0.5 ${
                          i < currentIndex ? 'bg-kuyay-fresh' : 'bg-kuyay-green/15'
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
                        done ? 'bg-kuyay-green text-white' : 'bg-kuyay-sand text-kuyay-deep/40'
                      } ${active ? 'ring-4 ring-kuyay-fresh/25' : ''}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="pt-1.5">
                      <p className={`text-sm font-bold ${done ? 'text-kuyay-forest' : 'text-kuyay-deep/45'}`}>
                        {s.label}
                      </p>
                      <p className="text-xs text-kuyay-deep/55">{s.description}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}

          <div className="mt-8 border-t border-kuyay-green/10 pt-6">
            <p className="text-sm font-bold text-kuyay-forest">Resumen del pedido</p>
            <ul className="mt-3 space-y-2 text-sm text-kuyay-deep/70">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-3">
                  <span>{i.qty} x {i.name}</span>
                  <span className="font-semibold">{formatUSD(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-kuyay-green/10 pt-3">
              <span className="text-sm font-bold text-kuyay-forest">Total</span>
              <span className="font-display text-lg font-black text-kuyay-green">
                {formatUSD(order.total)}
              </span>
            </div>
            <p className="mt-2 text-xs text-kuyay-deep/50">
              Pago: {paymentLabel(order.paymentMethod)}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
