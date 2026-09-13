'use client'

import { useMemo } from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import TrustBar from './TrustBar'
import ProductCarousel from './ProductCarousel'
import ProductGrid from './ProductGrid'
import Benefits from './Benefits'
import Story from './Story'
import Testimonials from './Testimonials'
import Contact from './Contact'
import ShareSection from './ShareSection'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'
import { useCatalog } from '../context/CatalogContext'

export default function StoreHome() {
  const { products } = useCatalog()
  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 6), [products])

  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <ProductCarousel products={featured} />
        <ProductGrid />
        <Benefits />
        <Story />
        <Testimonials />
        <Contact />
        <ShareSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
