import { Suspense } from 'react'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import OrderTracking from '@/components/OrderTracking'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Seguimiento de pedido · Kuyay Natural',
}

export default function SeguimientoPage() {
  return (
    <Providers>
      <Navbar />
      <main className="pt-36 sm:pt-40">
        <Suspense fallback={<div className="container-x py-24 text-center text-kuyay-deep/50">Cargando…</div>}>
          <OrderTracking />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
    </Providers>
  )
}
