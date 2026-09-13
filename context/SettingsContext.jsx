'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_BANK, DEFAULT_NUMBERS } from '../lib/whatsapp'

const EMPTY_SOCIAL = { instagram: '', facebook: '', tiktok: '', youtube: '', x: '' }

const EMPTY_METHOD = { enabled: true, phone: '', link: '', note: '' }

const DEFAULTS = {
  numbers: DEFAULT_NUMBERS,
  bankAccounts: [DEFAULT_BANK],
  payment: { deuna: { ...EMPTY_METHOD }, go: { ...EMPTY_METHOD } },
  social: EMPTY_SOCIAL,
}

const SettingsContext = createContext({ ...DEFAULTS, refresh: () => {} })

export function SettingsProvider({ children }) {
  const [state, setState] = useState(DEFAULTS)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) return
      const data = await res.json()
      setState({
        numbers: [data.whatsappPrimary, data.whatsappSecondary].filter(Boolean),
        bankAccounts: Array.isArray(data.bankAccounts) && data.bankAccounts.length ? data.bankAccounts : [DEFAULT_BANK],
        payment: {
          deuna: { ...EMPTY_METHOD, ...(data.payment?.deuna || {}) },
          go: { ...EMPTY_METHOD, ...(data.payment?.go || {}) },
        },
        social: { ...EMPTY_SOCIAL, ...(data.social || {}) },
      })
    } catch {
      /* mantiene los valores por defecto */
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(() => ({ ...state, refresh }), [state, refresh])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
