'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { CartProvider } from '../context/CartContext'
import { CatalogProvider } from '../context/CatalogContext'
import { SettingsProvider } from '../context/SettingsContext'
import CartDrawer from './CartDrawer'
import Toast from './Toast'
import { getVisitorId, isAdminBrowser } from '../lib/visitor'

const VISIT_DAY_KEY = 'kuyay_visit_day'

function PageViewTracker() {
  const pathname = usePathname()
  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    if (isAdminBrowser()) return

    const visitorId = getVisitorId()
    if (!visitorId) return

    const today = new Date().toISOString().slice(0, 10)
    try {
      if (window.localStorage.getItem(VISIT_DAY_KEY) === today) return
    } catch {
      /* sin localStorage */
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, visitorId }),
    })
      .then((res) => {
        if (res.ok) {
          try {
            window.localStorage.setItem(VISIT_DAY_KEY, today)
          } catch {
            /* sin localStorage */
          }
        }
      })
      .catch(() => {})
  }, [pathname])
  return null
}

export default function Providers({ children }) {
  return (
    <SettingsProvider>
      <CatalogProvider>
        <CartProvider>
          <PageViewTracker />
          {children}
          <CartDrawer />
          <Toast />
        </CartProvider>
      </CatalogProvider>
    </SettingsProvider>
  )
}
