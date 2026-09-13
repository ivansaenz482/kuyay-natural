import Providers from '@/components/Providers'
import ProductDetailClient from '@/components/ProductDetailClient'

export const dynamic = 'force-dynamic'

export default function ProductPage() {
  return (
    <Providers>
      <ProductDetailClient />
    </Providers>
  )
}
