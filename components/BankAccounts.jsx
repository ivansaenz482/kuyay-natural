'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyRow({ label, value }) {
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
        <button
          type="button"
          onClick={copy}
          aria-label={`Copiar ${label}`}
          className="text-kuyay-deep/40 transition hover:text-kuyay-green"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-kuyay-green" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </dd>
    </div>
  )
}

export default function BankAccounts({ accounts = [] }) {
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
