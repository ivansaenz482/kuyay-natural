import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Banknote, Building2, Check, Copy, ExternalLink, Smartphone, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { formatUSD, orderWhatsAppLink } from '../lib/whatsapp'
import WhatsAppIcon from './WhatsAppIcon'

const PAYMENT_LABELS = {
  transferencia: 'por transferencia',
  efectivo: 'en efectivo',
  deuna: 'con DeUna',
  go: 'con GO',
}

const initialForm = { name: '', phone: '', address: '', city: '', notes: '' }

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* noop */
    }
  }
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-kuyay-deep/60">{label}</dt>
      <dd className="flex items-center gap-2 font-semibold text-kuyay-forest">
        {value}
        <button type="button" onClick={copy} aria-label={`Copiar ${label}`} className="text-kuyay-deep/40 transition hover:text-kuyay-green">
          {copied ? <Check className="h-3.5 w-3.5 text-kuyay-green" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </dd>
    </div>
  )
}

function BankAccounts({ accounts = [] }) {
  if (!accounts.length) return null
  return (
    <div className="space-y-3">
      {accounts.map((a, i) => (
        <div key={i} className="rounded-2xl border border-kuyay-green/15 bg-white/80 p-4 text-left">
          <p className="mb-2 text-sm font-bold text-kuyay-forest">
            {a.banco || 'Cuenta bancaria'} {accounts.length > 1 ? `#${i + 1}` : ''}
          </p>
          <dl className="space-y-1.5 text-sm text-kuyay-deep/70">
            {a.tipo && <CopyRow label="Tipo" value={a.tipo} />}
            {a.numero && <CopyRow label="Cuenta" value={a.numero} />}
            {a.titular && <CopyRow label="Titular" value={a.titular} />}
            {a.identificacion && <CopyRow label="RUC/CI" value={a.identificacion} />}
          </dl>
        </div>
      ))}
    </div>
  )
}

function WalletDetails({ method, config, total }) {
  if (!config) return null
  return (
    <div className="rounded-2xl border border-kuyay-green/15 bg-white/80 p-5 text-left">
      <p className="text-sm font-bold text-kuyay-forest">Pago con {method}</p>
      {config.note && <p className="mt-1 text-xs text-kuyay-deep/60">{config.note}</p>}
      <dl className="mt-3 space-y-1.5 text-sm text-kuyay-deep/70">
        {config.phone && <CopyRow label="Número" value={config.phone} />}
        <div className="flex justify-between gap-3 border-t border-kuyay-green/10 pt-2">
          <dt>Total a pagar</dt>
          <dd className="font-display text-lg font-black text-kuyay-forest">{formatUSD(total)}</dd>
        </div>
      </dl>
      {config.link && (
        <a href={config.link} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 w-full">
          <ExternalLink className="h-4 w-4" /> Abrir {method}
        </a>
      )}
    </div>
  )
}

export default function CheckoutModal({ open, onClose }) {
  const { items, subtotal, clear, closeCart } = useCart()
  const { numbers, bankAccounts, payment: paymentCfg } = useSettings()
  const [form, setForm] = useState(initialForm)
  const [payment, setPayment] = useState('transferencia')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)
  const [error, setError] = useState('')

  const methods = useMemo(() => {
    const list = [
      {
        id: 'transferencia',
        title: 'Transferencia bancaria',
        desc: bankAccounts.length > 1 ? `${bankAccounts.length} cuentas disponibles` : 'Datos de la cuenta al confirmar',
        icon: Building2,
      },
      { id: 'efectivo', title: 'Efectivo', desc: 'Pagas al recibir tu pedido.', icon: Banknote },
    ]
    if (paymentCfg?.deuna?.enabled) {
      list.push({ id: 'deuna', title: 'DeUna', desc: 'Paga con la app DeUna.', icon: Smartphone })
    }
    if (paymentCfg?.go?.enabled) {
      list.push({ id: 'go', title: 'GO', desc: 'Paga con la app GO.', icon: Smartphone })
    }
    return list
  }, [bankAccounts, paymentCfg])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const reset = () => {
    setForm(initialForm)
    setPayment('transferencia')
    setDone(null)
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address) {
      setError('Completa nombre, WhatsApp y dirección de entrega.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
          total: subtotal,
          paymentMethod: payment,
        }),
      })
      const order = await res.json()
      if (!res.ok) throw new Error(order.error || 'No se pudo registrar el pedido')
      setDone(order)
      clear()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-kuyay-forest/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-kuyay-cream shadow-card sm:rounded-[2rem]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-kuyay-green/10 bg-kuyay-cream/95 px-6 py-4 backdrop-blur">
              <h2 className="font-display text-xl font-black text-kuyay-forest">
                {done ? '¡Pedido registrado!' : 'Finalizar pedido'}
              </h2>
              <button
                onClick={handleClose}
                aria-label="Cerrar"
                className="grid h-9 w-9 place-items-center rounded-full text-kuyay-deep/60 transition hover:bg-kuyay-sand"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {done ? (
              <div className="p-6 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-kuyay-lime/50"
                >
                  <BadgeCheck className="h-11 w-11 text-kuyay-green" />
                </motion.span>
                <p className="mt-5 font-display text-2xl font-black text-kuyay-forest">
                  Gracias, {done.customer.name.split(' ')[0]}
                </p>
                <p className="mt-2 text-sm text-kuyay-deep/65">
                  Tu pedido <span className="font-bold text-kuyay-green">{done.id}</span> fue
                  registrado {PAYMENT_LABELS[done.paymentMethod] || ''}.
                </p>

                <div className="mt-5 space-y-3">
                  {done.paymentMethod === 'transferencia' && <BankAccounts accounts={bankAccounts} />}
                  {done.paymentMethod === 'deuna' && (
                    <WalletDetails method="DeUna" config={paymentCfg?.deuna} total={done.total} />
                  )}
                  {done.paymentMethod === 'go' && (
                    <WalletDetails method="GO" config={paymentCfg?.go} total={done.total} />
                  )}
                </div>

                <a
                  href={orderWhatsAppLink(done, numbers)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mt-5 w-full bg-[#25D366] py-4 text-base text-white hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
                >
                  <WhatsAppIcon className="h-5 w-5" /> Enviar pedido por WhatsApp
                </a>
                <a href={`/seguimiento?code=${done.id}`} className="btn-ghost mt-2 w-full">
                  Rastrear mi pedido
                </a>
                <button
                  onClick={() => {
                    closeCart()
                    handleClose()
                  }}
                  className="btn-ghost mt-2 w-full"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5 p-6">
                <div className="rounded-2xl border border-kuyay-green/10 bg-white/70 p-4">
                  <p className="text-sm font-bold text-kuyay-forest">
                    {items.length} producto(s) en tu pedido
                  </p>
                  <p className="mt-1 font-display text-2xl font-black text-kuyay-green">
                    {formatUSD(subtotal)}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="name">Nombre completo *</label>
                    <input id="name" className="input" value={form.name} onChange={set('name')} placeholder="Ej. María Fernández" />
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">WhatsApp *</label>
                    <input id="phone" className="input" value={form.phone} onChange={set('phone')} placeholder="099 999 9999" />
                  </div>
                  <div>
                    <label className="label" htmlFor="city">Ciudad</label>
                    <input id="city" className="input" value={form.city} onChange={set('city')} placeholder="Quito" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="address">Dirección de entrega *</label>
                    <input id="address" className="input" value={form.address} onChange={set('address')} placeholder="Calle, número, referencia" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="notes">Notas (opcional)</label>
                    <textarea id="notes" rows={2} className="input resize-none" value={form.notes} onChange={set('notes')} placeholder="Indicaciones para la entrega" />
                  </div>
                </div>

                <div>
                  <p className="label">Método de pago</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {methods.map((m) => {
                      const active = payment === m.id
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPayment(m.id)}
                          className={`relative rounded-2xl border p-4 text-left transition ${
                            active
                              ? 'border-kuyay-green bg-kuyay-lime/30 shadow-soft'
                              : 'border-kuyay-green/15 bg-white/70 hover:border-kuyay-green/40'
                          }`}
                        >
                          <m.icon className={`h-6 w-6 ${active ? 'text-kuyay-green' : 'text-kuyay-deep/50'}`} />
                          <p className="mt-2 text-sm font-bold text-kuyay-forest">{m.title}</p>
                          <p className="mt-0.5 text-xs text-kuyay-deep/55">{m.desc}</p>
                          {active && <BadgeCheck className="absolute right-3 top-3 h-5 w-5 text-kuyay-green" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {payment === 'transferencia' && bankAccounts.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-kuyay-deep/50">
                      Cuentas disponibles
                    </p>
                    <BankAccounts accounts={bankAccounts} />
                  </div>
                )}
                {payment === 'deuna' && <WalletDetails method="DeUna" config={paymentCfg?.deuna} total={subtotal} />}
                {payment === 'go' && <WalletDetails method="GO" config={paymentCfg?.go} total={subtotal} />}
                {payment === 'efectivo' && (
                  <div className="rounded-2xl border border-kuyay-green/15 bg-kuyay-sand/60 p-4 text-xs text-kuyay-deep/70">
                    Pagas en efectivo al recibir tu pedido. Coordinamos la entrega por WhatsApp.
                  </div>
                )}

                {error && (
                  <p className="rounded-xl bg-kuyay-berry/10 px-4 py-2.5 text-sm font-semibold text-kuyay-berry">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={submitting || !items.length} className="btn-primary w-full">
                  {submitting ? 'Procesando…' : `Confirmar pedido · ${formatUSD(subtotal)}`}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
