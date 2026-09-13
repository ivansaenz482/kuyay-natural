'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { CartProvider } from '../context/CartContext'
import { CatalogProvider } from '../context/CatalogContext'
import { SettingsProvider } from '../context/SettingsContext'
import CartDrawer from './CartDrawer'
import Toast from './Toast'

function PageViewTracker() {
  const pathname = usePathname()
  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {})
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
