'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_BANK, DEFAULT_NUMBERS } from '../lib/whatsapp'

const DEFAULTS = { numbers: DEFAULT_NUMBERS, bank: DEFAULT_BANK }

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
        bank: data.bank || DEFAULT_BANK,
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
