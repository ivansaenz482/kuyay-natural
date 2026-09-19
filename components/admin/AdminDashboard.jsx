'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  DollarSign,
  Eye,
  ImagePlus,
  KeyRound,
  LayoutDashboard,
  Leaf,
  Loader2,
  LogOut,
  Package,
  Pencil,
  Plus,
  Quote,
  Settings,
  ShoppingCart,
  Star,
  Tags,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react'
import { AreaChart, BarChart, StatCard } from './Charts'
import { SOCIAL_FIELDS } from '../SocialLinks'
import { formatUSD } from '../../lib/whatsapp'
import { ALL_ORDER_STATUSES, paymentLabel } from '../../lib/orders'
import { authClient } from '../../lib/auth-client'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'categories', label: 'Categorías', icon: Tags },
  { id: 'testimonials', label: 'Testimonios', icon: Quote },
  { id: 'settings', label: 'Ajustes', icon: Settings },
  { id: 'security', label: 'Seguridad', icon: KeyRound },
]

const EMPTY_PRODUCT = {
  name: '',
  slug: '',
  categoryId: '',
  price: '',
  oldPrice: '',
  unit: '',
  badge: '',
  rating: 5,
  reviews: 0,
  stock: 0,
  featured: false,
  active: true,
  short: '',
  description: '',
  benefitsText: '',
  ingredients: '',
  images: [],
}

const datePlus = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const EMPTY_ORDER = {
  customer: { name: '', phone: '', address: '', city: '', notes: '' },
  items: [{ productId: '', name: '', qty: 1, price: '' }],
  paymentMethod: 'transferencia',
  status: 'por_hacer',
  estimatedDate: datePlus(3),
  notes: '',
}

/* ------------------------------- Login ------------------------------- */
function LoginScreen({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await authClient.signIn.email({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message || 'Credenciales incorrectas.')
      return
    }
    onSuccess()
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-kuyay-forest px-5">
      <img src="/images/variedad.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-br from-kuyay-forest via-kuyay-deep to-kuyay-green/60" />
      <div className="absolute inset-0 bg-grain opacity-10 mix-blend-overlay" />

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-sm rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-card backdrop-blur-xl"
      >
        <span className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-2xl ring-2 ring-kuyay-lime/50">
          <img src="/images/logo.jpeg" alt="Kuyay Natural" className="h-full w-full object-cover" />
        </span>
        <h1 className="mt-5 text-center font-display text-2xl font-black text-white">
          Panel Administrador
        </h1>
        <p className="mt-1 text-center text-sm text-white/60">Kuyay Natural · acceso restringido</p>

        <label className="mt-7 block text-xs font-bold uppercase tracking-wider text-kuyay-lime" htmlFor="email">
          Correo
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@kuyaynatural.com"
          autoFocus
          className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-kuyay-lime focus:ring-4 focus:ring-kuyay-lime/20"
        />

        <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-kuyay-lime" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-kuyay-lime focus:ring-4 focus:ring-kuyay-lime/20"
        />

        {error && (
          <p className="mt-3 rounded-xl bg-kuyay-berry/20 px-4 py-2 text-xs font-semibold text-white">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-gold mt-5 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ingresar'}
        </button>

        <Link href="/" className="mt-4 block text-center text-xs font-semibold text-white/60 hover:text-kuyay-lime">
          ← Volver a la tienda
        </Link>
      </motion.form>
    </div>
  )
}

/* ------------------------------- Modal ------------------------------- */
function Modal({ open, onClose, title, children, wide }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-kuyay-forest/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-kuyay-cream shadow-card sm:rounded-[2rem] ${
              wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'
            }`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-kuyay-green/10 bg-kuyay-cream/95 px-6 py-4 backdrop-blur">
              <h3 className="font-display text-lg font-black text-kuyay-forest">{title}</h3>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="grid h-9 w-9 place-items-center rounded-full text-kuyay-deep/60 transition hover:bg-kuyay-sand"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* --------------------------- Image uploader -------------------------- */
function ImageUploader({ images, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const upload = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      files.forEach((f) => formData.append('files', f))
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al subir')
      onChange([...images, ...data.urls])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = (url) => onChange(images.filter((u) => u !== url))
  const makeCover = (url) => onChange([url, ...images.filter((u) => u !== url)])

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={url + i} className="group relative h-24 w-24 overflow-hidden rounded-2xl border border-kuyay-green/15">
            <img src={url} alt="" className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1 top-1 rounded-full bg-kuyay-gold px-2 py-0.5 text-[9px] font-black text-kuyay-forest">
                Portada
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-kuyay-forest/70 opacity-0 transition group-hover:opacity-100">
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(url)}
                  title="Usar como portada"
                  className="grid h-7 w-7 place-items-center rounded-full bg-white text-kuyay-forest"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(url)}
                title="Eliminar"
                className="grid h-7 w-7 place-items-center rounded-full bg-kuyay-berry text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="grid h-24 w-24 place-items-center rounded-2xl border-2 border-dashed border-kuyay-green/30 text-kuyay-green transition hover:border-kuyay-green hover:bg-kuyay-lime/20"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <span className="flex flex-col items-center gap-1 text-[10px] font-bold">
              <ImagePlus className="h-5 w-5" />
              Subir fotos
            </span>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => upload(e.target.files)}
      />
      <p className="mt-2 text-xs text-kuyay-deep/50">
        Puedes subir todas las fotos que quieras (JPG, PNG, WEBP). La primera es la portada.
      </p>
      {error && <p className="mt-2 text-xs font-semibold text-kuyay-berry">{error}</p>}
    </div>
  )
}

/* ------------------------------ Admin -------------------------------- */
export default function AdminDashboard() {
  const { data: session, isPending } = authClient.useSession()
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(false)

  const [productModal, setProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT)
  const [savingProduct, setSavingProduct] = useState(false)

  const [categoryModal, setCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', emoji: '🌿', sortOrder: 0 })
  const [savingCategory, setSavingCategory] = useState(false)

  const [testimonialModal, setTestimonialModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [testimonialForm, setTestimonialForm] = useState({ name: '', role: '', text: '', rating: 5, sortOrder: 0, active: true, imageUrl: '' })
  const [testimonialImagePreview, setTestimonialImagePreview] = useState('')
  const [uploadingTestimonialImage, setUploadingTestimonialImage] = useState(false)
  const [savingTestimonial, setSavingTestimonial] = useState(false)

  const [orderModal, setOrderModal] = useState(false)
  const [orderForm, setOrderForm] = useState(EMPTY_ORDER)
  const [savingOrder, setSavingOrder] = useState(false)
  const [orderFilter, setOrderFilter] = useState('todos')

  const [settingsForm, setSettingsForm] = useState({
    whatsappPrimary: '',
    whatsappSecondary: '',
    bankAccounts: [],
    deunaEnabled: true,
    deunaPhone: '',
    deunaLink: '',
    deunaNote: '',
    goEnabled: true,
    goPhone: '',
    goLink: '',
    goNote: '',
    socialInstagram: '',
    socialFacebook: '',
    socialTiktok: '',
    socialYoutube: '',
    socialX: '',
    heroPrice: '',
    heroImage: '',
    orderNoticeEnabled: true,
    orderNotice: '',
    topNoticeEnabled: true,
    topNotice: '',
  })
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState(null)
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false)

  const [security, setSecurity] = useState({ current: '', next: '', confirm: '', msg: null })

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/orders'),
        fetch('/api/products?all=true'),
        fetch('/api/categories'),
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (ordersRes.ok) setOrders(await ordersRes.json())
      if (productsRes.ok) setProducts(await productsRes.json())
      if (categoriesRes.ok) setCategories(await categoriesRes.json())
      const testimonialsRes = await fetch('/api/testimonials?all=true')
      if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json())

      const settingsRes = await fetch('/api/settings')
      if (settingsRes.ok) {
        const s = await settingsRes.json()
        setSettingsForm({
          whatsappPrimary: s.whatsappPrimary || '',
          whatsappSecondary: '',
          bankAccounts: Array.isArray(s.bankAccounts) && s.bankAccounts.length
            ? s.bankAccounts
            : [{ banco: '', tipo: '', numero: '', titular: '', identificacion: '' }],
          deunaEnabled: s.payment?.deuna?.enabled ?? true,
          deunaPhone: s.payment?.deuna?.phone || '',
          deunaLink: s.payment?.deuna?.link || '',
          deunaNote: s.payment?.deuna?.note || '',
          goEnabled: s.payment?.go?.enabled ?? true,
          goPhone: s.payment?.go?.phone || '',
          goLink: s.payment?.go?.link || '',
          goNote: s.payment?.go?.note || '',
          socialInstagram: s.social?.instagram || '',
          socialFacebook: s.social?.facebook || '',
          socialTiktok: s.social?.tiktok || '',
          socialYoutube: s.social?.youtube || '',
          socialX: s.social?.x || '',
          heroPrice: s.hero?.price ?? '',
          heroImage: s.hero?.image || '',
          orderNoticeEnabled: s.orderNotice?.enabled ?? true,
          orderNotice: s.orderNotice?.text ?? '',
          topNoticeEnabled: s.topNotice?.enabled ?? true,
          topNotice: s.topNotice?.text ?? '',
        })
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.user) loadAll()
  }, [session?.user, loadAll])

  const dailyData = useMemo(() => {
    if (!stats?.daily) return []
    return stats.daily.map((d) => ({
      label: new Date(d.date + 'T00:00:00').toLocaleDateString('es-EC', { weekday: 'short' }).slice(0, 3),
      value: Number(d.views),
    }))
  }, [stats])

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-kuyay-cream">
        <Loader2 className="h-8 w-8 animate-spin text-kuyay-green" />
      </div>
    )
  }

  if (!session?.user) return <LoginScreen onSuccess={loadAll} />

  /* -------- Product handlers -------- */
  const openNewProduct = () => {
    setEditingProduct(null)
    setProductForm({ ...EMPTY_PRODUCT, categoryId: categories[0]?.id || '' })
    setProductModal(true)
  }

  const openEditProduct = (p) => {
    setEditingProduct(p)
    setProductForm({
      ...p,
      oldPrice: p.oldPrice ?? '',
      benefitsText: (p.benefits || []).join(', '),
    })
    setProductModal(true)
  }

  const saveProduct = async (e) => {
    e.preventDefault()
    setSavingProduct(true)
    const payload = {
      name: productForm.name,
      slug: productForm.slug,
      categoryId: productForm.categoryId || null,
      price: Number(productForm.price) || 0,
      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
      unit: productForm.unit,
      badge: productForm.badge,
      rating: Number(productForm.rating) || 5,
      reviews: Number(productForm.reviews) || 0,
      stock: Number(productForm.stock) || 0,
      featured: Boolean(productForm.featured),
      active: productForm.active !== false,
      short: productForm.short,
      description: productForm.description,
      benefits: productForm.benefitsText
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean),
      ingredients: productForm.ingredients,
      images: productForm.images,
    }
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
    const res = await fetch(url, {
      method: editingProduct ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSavingProduct(false)
    if (res.ok) {
      setProductModal(false)
      loadAll()
    } else {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'No se pudo guardar el producto')
    }
  }

  const deleteProduct = async (p) => {
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    await fetch(`/api/products/${p.id}`, { method: 'DELETE' })
    loadAll()
  }

  /* -------- Category handlers -------- */
  const openNewCategory = () => {
    setEditingCategory(null)
    setCategoryForm({ name: '', emoji: '🌿', sortOrder: categories.length + 1 })
    setCategoryModal(true)
  }
  const openEditCategory = (c) => {
    setEditingCategory(c)
    setCategoryForm({ name: c.name, emoji: c.emoji || '🌿', sortOrder: c.sortOrder ?? 0 })
    setCategoryModal(true)
  }
  const saveCategory = async (e) => {
    e.preventDefault()
    setSavingCategory(true)
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
    const res = await fetch(url, {
      method: editingCategory ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryForm),
    })
    setSavingCategory(false)
    if (res.ok) {
      setCategoryModal(false)
      loadAll()
    } else {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'No se pudo guardar la categoría')
    }
  }
  const deleteCategory = async (c) => {
    if (!confirm(`¿Eliminar la categoría "${c.name}"?`)) return
    await fetch(`/api/categories/${c.id}`, { method: 'DELETE' })
    loadAll()
  }

  /* -------- Order status -------- */
  const updateStatus = async (dbId, status) => {
    setOrders((prev) => prev.map((o) => (o.dbId === dbId ? { ...o, status } : o)))
    const res = await fetch(`/api/orders/${dbId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) loadAll()
  }

  /* -------- Pedido manual -------- */
  const openNewOrder = () => {
    setOrderForm({
      ...EMPTY_ORDER,
      customer: { name: '', phone: '', address: '', city: '', notes: '' },
      items: [{ productId: '', name: '', qty: 1, price: '' }],
      estimatedDate: datePlus(3),
    })
    setOrderModal(true)
  }
  const addOrderItem = () => {
    setOrderForm((f) => ({ ...f, items: [...f.items, { productId: '', name: '', qty: 1, price: '' }] }))
  }
  const updateOrderItem = (index, patch) => {
    setOrderForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    }))
  }
  const removeOrderItem = (index) => {
    setOrderForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }))
  }
  const pickOrderProduct = (index, productId) => {
    const p = products.find((x) => String(x.id) === String(productId))
    updateOrderItem(index, { productId, name: p?.name || '', price: p ? p.price : '' })
  }
  const orderTotal = orderForm.items.reduce(
    (sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0),
    0,
  )
  const saveOrder = async (e) => {
    e.preventDefault()
    const items = orderForm.items
      .filter((it) => it.name && Number(it.qty) > 0)
      .map((it) => ({
        id: it.productId || null,
        name: it.name,
        qty: Number(it.qty),
        price: Number(it.price) || 0,
      }))
    if (!orderForm.customer.name || !orderForm.customer.phone || !items.length) {
      alert('Completa el nombre, el WhatsApp y al menos un producto.')
      return
    }
    setSavingOrder(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: orderForm.customer,
          items,
          total: orderTotal,
          paymentMethod: orderForm.paymentMethod,
          status: orderForm.status,
          origin: 'manual',
          estimatedDate: orderForm.estimatedDate || null,
          notes: orderForm.notes,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudo guardar el pedido')
      setOrderModal(false)
      loadAll()
    } catch (err) {
      alert(err.message)
    } finally {
      setSavingOrder(false)
    }
  }

  const filteredOrders =
    orderFilter === 'todos'
      ? orders
      : orders.filter((o) => (o.status || 'por_hacer') === orderFilter)

  /* -------- Testimonials -------- */
  const openNewTestimonial = () => {
    setEditingTestimonial(null)
    setTestimonialForm({ name: '', role: '', text: '', rating: 5, sortOrder: testimonials.length + 1, active: true, imageUrl: '' })
    setTestimonialImagePreview('')
    setTestimonialModal(true)
  }
  const openEditTestimonial = (t) => {
    setEditingTestimonial(t)
    setTestimonialForm({ ...t })
    setTestimonialImagePreview(t.imageUrl || '')
    setTestimonialModal(true)
  }
  const handleTestimonialImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingTestimonialImage(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'testimonios')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudo subir la imagen')
      const url = data.urls?.[0]
      setTestimonialForm((f) => ({ ...f, imageUrl: url }))
      setTestimonialImagePreview(url)
    } catch (err) {
      alert(err.message)
    } finally {
      setUploadingTestimonialImage(false)
      e.target.value = ''
    }
  }
  const removeTestimonialImage = () => {
    setTestimonialForm((f) => ({ ...f, imageUrl: '' }))
    setTestimonialImagePreview('')
  }
  const saveTestimonial = async (e) => {
    e.preventDefault()
    setSavingTestimonial(true)
    const url = editingTestimonial ? `/api/testimonials/${editingTestimonial.id}` : '/api/testimonials'
    const res = await fetch(url, {
      method: editingTestimonial ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonialForm),
    })
    setSavingTestimonial(false)
    if (res.ok) {
      setTestimonialModal(false)
      loadAll()
    } else {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'No se pudo guardar el testimonio')
    }
  }
  const deleteTestimonial = async (t) => {
    if (!confirm(`¿Eliminar el testimonio de "${t.name}"?`)) return
    await fetch(`/api/testimonials/${t.id}`, { method: 'DELETE' })
    loadAll()
  }

  /* -------- Settings -------- */
  const handleHeroImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingHeroImage(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'portada')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudo subir la imagen')
      setSettingsForm((f) => ({ ...f, heroImage: data.urls?.[0] || '' }))
    } catch (err) {
      alert(err.message)
    } finally {
      setUploadingHeroImage(false)
      e.target.value = ''
    }
  }
  const saveSettings = async (e) => {
    e.preventDefault()
    setSavingSettings(true)
    setSettingsMsg(null)
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whatsappPrimary: settingsForm.whatsappPrimary,
        whatsappSecondary: settingsForm.whatsappSecondary,
        bankAccounts: settingsForm.bankAccounts,
        deuna: {
          enabled: settingsForm.deunaEnabled,
          phone: settingsForm.deunaPhone,
          link: settingsForm.deunaLink,
          note: settingsForm.deunaNote,
        },
        go: {
          enabled: settingsForm.goEnabled,
          phone: settingsForm.goPhone,
          link: settingsForm.goLink,
          note: settingsForm.goNote,
        },
        socialInstagram: settingsForm.socialInstagram,
        socialFacebook: settingsForm.socialFacebook,
        socialTiktok: settingsForm.socialTiktok,
        socialYoutube: settingsForm.socialYoutube,
        socialX: settingsForm.socialX,
        heroPrice: settingsForm.heroPrice,
        heroImage: settingsForm.heroImage,
        orderNoticeEnabled: settingsForm.orderNoticeEnabled,
        orderNotice: settingsForm.orderNotice,
        topNoticeEnabled: settingsForm.topNoticeEnabled,
        topNotice: settingsForm.topNotice,
      }),
    })
    setSavingSettings(false)
    setSettingsMsg(
      res.ok
        ? { type: 'ok', text: 'Ajustes guardados. Los cambios se ven en la tienda al instante.' }
        : { type: 'error', text: 'No se pudieron guardar los ajustes.' },
    )
    if (res.ok) loadAll()
  }

  /* -------- Security -------- */
  const changePassword = async (e) => {
    e.preventDefault()
    if (security.next.length < 6) {
      setSecurity((s) => ({ ...s, msg: { type: 'error', text: 'La nueva clave debe tener al menos 6 caracteres.' } }))
      return
    }
    if (security.next !== security.confirm) {
      setSecurity((s) => ({ ...s, msg: { type: 'error', text: 'Las contraseñas no coinciden.' } }))
      return
    }
    const { error } = await authClient.changePassword({
      currentPassword: security.current,
      newPassword: security.next,
    })
    setSecurity({
      current: '',
      next: '',
      confirm: '',
      msg: error
        ? { type: 'error', text: error.message || 'No se pudo cambiar la contraseña.' }
        : { type: 'ok', text: 'Contraseña actualizada correctamente.' },
    })
  }

  return (
    <div className="min-h-screen bg-kuyay-cream">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="border-b border-kuyay-green/10 bg-kuyay-forest p-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl ring-2 ring-kuyay-lime/40">
              <img src="/images/logo.jpeg" alt="" className="h-full w-full object-cover" />
            </span>
            <div>
              <p className="font-display text-lg font-black">Kuyay</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-kuyay-lime">Admin</p>
            </div>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto lg:mt-10 lg:flex-col lg:overflow-visible">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  tab === t.id ? 'bg-kuyay-lime/20 text-kuyay-lime' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 hidden lg:block">
            <p className="mb-2 px-4 text-xs text-white/40">{session.user.email}</p>
            <button
              onClick={() => authClient.signOut()}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
            <Link
              href="/"
              className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Leaf className="h-4 w-4" /> Ver tienda
            </Link>
          </div>
        </aside>

        {/* Contenido */}
        <main className="flex-1 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-black text-kuyay-forest sm:text-3xl">
                {TABS.find((t) => t.id === tab)?.label}
              </h1>
              <p className="mt-1 text-sm text-kuyay-deep/55">Resumen de tu tienda Kuyay Natural</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadAll} className="btn-ghost">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Actualizar'}
              </button>
              <button onClick={() => authClient.signOut()} className="btn-primary lg:hidden">
                <LogOut className="h-4 w-4" /> Salir
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-7"
            >
              {/* -------------------- DASHBOARD -------------------- */}
              {tab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={Eye} label="Vistas totales" value={(stats?.totalViews ?? 0).toLocaleString('es-EC')} hint={`${stats?.todayViews ?? 0} hoy · ${stats?.weekViews ?? 0} esta semana`} accent="green" />
                    <StatCard icon={DollarSign} label="Ingresos registrados" value={formatUSD(stats?.revenue ?? 0)} hint={`${stats?.ordersCount ?? 0} pedidos`} accent="gold" delay={0.05} />
                    <StatCard icon={Package} label="Productos activos" value={stats?.productsCount ?? 0} hint="En catálogo" accent="forest" delay={0.1} />
                    <StatCard icon={TrendingUp} label="Categorías" value={categories.length} hint="Organización de la tienda" accent="berry" delay={0.15} />
                  </div>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-3xl border border-kuyay-green/10 bg-white/80 p-6 shadow-soft">
                      <div className="mb-5 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-kuyay-green" />
                        <h2 className="font-display text-lg font-black text-kuyay-forest">Productos más vendidos</h2>
                      </div>
                      <BarChart
                        data={(stats?.topSold || []).map((p) => ({ label: p.name, value: p.sales, image: p.image }))}
                        valueFormatter={(v) => `${v} u.`}
                      />
                    </div>

                    <div className="rounded-3xl border border-kuyay-green/10 bg-white/80 p-6 shadow-soft">
                      <div className="mb-5 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-kuyay-berry" />
                        <h2 className="font-display text-lg font-black text-kuyay-forest">Productos más vistos</h2>
                      </div>
                      <BarChart
                        data={(stats?.topViewed || []).map((p) => ({ label: p.name, value: p.views, image: p.image }))}
                        accent="from-kuyay-berry to-kuyay-rose"
                        valueFormatter={(v) => `${v.toLocaleString('es-EC')} vistas`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-3xl border border-kuyay-green/10 bg-white/80 p-6 shadow-soft">
                      <h2 className="mb-4 font-display text-lg font-black text-kuyay-forest">
                        Visitas de la página · últimos 7 días
                      </h2>
                      <AreaChart data={dailyData} />
                    </div>

                    <div className="rounded-3xl border border-kuyay-green/10 bg-white/80 p-6 shadow-soft">
                      <h2 className="mb-4 font-display text-lg font-black text-kuyay-forest">Pedidos recientes</h2>
                      <div className="space-y-3">
                        {(stats?.recentOrders || []).map((o) => (
                          <div key={o.id} className="flex items-center justify-between rounded-2xl bg-kuyay-sand/50 px-4 py-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-kuyay-forest">{o.customer?.name || 'Cliente'}</p>
                              <p className="text-xs text-kuyay-deep/50">{o.id} · {o.paymentMethod}</p>
                            </div>
                            <span className="shrink-0 font-display font-black text-kuyay-green">{formatUSD(o.total)}</span>
                          </div>
                        ))}
                        {!stats?.recentOrders?.length && (
                          <p className="py-6 text-center text-sm text-kuyay-deep/50">Aún no hay pedidos registrados.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------- PEDIDOS -------------------- */}
              {tab === 'orders' && (
                <div>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {[
                        ['todos', 'Todos'],
                        ['por_hacer', 'Por hacer'],
                        ['por_entregar', 'Por entregar'],
                        ['entregado', 'Entregado'],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          onClick={() => setOrderFilter(id)}
                          className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                            orderFilter === id
                              ? 'bg-kuyay-forest text-kuyay-lime'
                              : 'bg-kuyay-sand/70 text-kuyay-deep/60 hover:bg-kuyay-sand'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <button onClick={openNewOrder} className="btn-primary">
                      <Plus className="h-4 w-4" /> Nuevo pedido
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-kuyay-green/10 bg-white/80 shadow-soft">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[860px] text-left text-sm">
                        <thead className="bg-kuyay-sand/60 text-xs uppercase tracking-wider text-kuyay-deep/55">
                          <tr>
                            <th className="px-5 py-3">Pedido</th>
                            <th className="px-5 py-3">Cliente</th>
                            <th className="px-5 py-3">Productos</th>
                            <th className="px-5 py-3">Pago</th>
                            <th className="px-5 py-3">Entrega</th>
                            <th className="px-5 py-3">Total</th>
                            <th className="px-5 py-3">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((o) => (
                            <tr key={o.id} className="border-t border-kuyay-green/10">
                              <td className="px-5 py-4">
                                <p className="font-bold text-kuyay-forest">{o.id}</p>
                                <span
                                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                    o.origin === 'manual'
                                      ? 'bg-kuyay-forest/10 text-kuyay-forest'
                                      : 'bg-kuyay-lime/50 text-kuyay-forest'
                                  }`}
                                >
                                  {o.origin === 'manual' ? 'Manual' : 'Web'}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <p className="font-semibold text-kuyay-deep">{o.customer?.name}</p>
                                <p className="text-xs text-kuyay-deep/50">{o.customer?.phone}</p>
                              </td>
                              <td className="px-5 py-4 text-kuyay-deep/70">
                                {o.items?.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                              </td>
                              <td className="px-5 py-4">
                                <span className="rounded-full bg-kuyay-lime/50 px-3 py-1 text-xs font-bold text-kuyay-forest">
                                  {paymentLabel(o.paymentMethod)}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-kuyay-deep/70">
                                {o.estimatedDate
                                  ? new Date(`${o.estimatedDate}T00:00:00`).toLocaleDateString('es-EC', {
                                      day: '2-digit',
                                      month: 'short',
                                    })
                                  : '—'}
                              </td>
                              <td className="px-5 py-4 font-display font-black text-kuyay-green">
                                {formatUSD(o.total)}
                              </td>
                              <td className="px-5 py-4">
                                <select
                                  value={o.status || 'por_hacer'}
                                  onChange={(e) => updateStatus(o.dbId, e.target.value)}
                                  className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold outline-none ring-1 ring-inset focus:ring-2 ${
                                    o.status === 'cancelado'
                                      ? 'bg-kuyay-berry/15 text-kuyay-berry ring-kuyay-berry/30'
                                      : o.status === 'entregado'
                                      ? 'bg-kuyay-green/15 text-kuyay-green ring-kuyay-green/30'
                                      : o.status === 'por_entregar'
                                      ? 'bg-kuyay-gold/25 text-kuyay-forest ring-kuyay-gold/40'
                                      : 'bg-kuyay-lime/40 text-kuyay-forest ring-kuyay-green/20'
                                  }`}
                                >
                                  {ALL_ORDER_STATUSES.map((s) => (
                                    <option key={s.id} value={s.id}>{s.short || s.label}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                          {!filteredOrders.length && (
                            <tr>
                              <td colSpan={7} className="px-5 py-10 text-center text-kuyay-deep/50">
                                Sin pedidos en esta vista.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------- PRODUCTOS -------------------- */}
              {tab === 'products' && (
                <div>
                  <div className="mb-5 flex justify-end">
                    <button onClick={openNewProduct} className="btn-primary">
                      <Plus className="h-4 w-4" /> Nuevo producto
                    </button>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((p) => (
                      <div key={p.id} className="rounded-3xl border border-kuyay-green/10 bg-white/80 p-4 shadow-soft">
                        <div className="flex gap-4">
                          <img src={p.images?.[0] || '/images/logo.jpeg'} alt={p.name} className="h-20 w-20 rounded-2xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-kuyay-forest">{p.name}</p>
                            <p className="text-xs text-kuyay-deep/50">{p.unit} · {p.categoryName || 'Sin categoría'}</p>
                            <p className="mt-1 font-display text-lg font-black text-kuyay-green">{formatUSD(p.price)}</p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-xl bg-kuyay-sand/60 py-2">
                            <p className="font-display font-black text-kuyay-forest">{p.sales || 0}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-kuyay-deep/45">Vendidos</p>
                          </div>
                          <div className="rounded-xl bg-kuyay-sand/60 py-2">
                            <p className="font-display font-black text-kuyay-forest">{p.views || 0}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-kuyay-deep/45">Vistas</p>
                          </div>
                          <div className="rounded-xl bg-kuyay-sand/60 py-2">
                            <p className="font-display font-black text-kuyay-forest">{p.stock ?? 0}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-kuyay-deep/45">Stock</p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => openEditProduct(p)} className="btn-ghost flex-1 !px-3 !py-2 text-xs">
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </button>
                          <button
                            onClick={() => deleteProduct(p)}
                            className="grid h-9 w-9 place-items-center rounded-full border border-kuyay-berry/20 text-kuyay-berry transition hover:bg-kuyay-berry hover:text-white"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* -------------------- CATEGORIAS -------------------- */}
              {tab === 'categories' && (
                <div>
                  <div className="mb-5 flex justify-end">
                    <button onClick={openNewCategory} className="btn-primary">
                      <Plus className="h-4 w-4" /> Nueva categoría
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {categories.map((c) => (
                      <div key={c.id} className="flex items-center gap-4 rounded-3xl border border-kuyay-green/10 bg-white/80 p-4 shadow-soft">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-kuyay-lime/50 text-2xl">
                          {c.emoji || '🌿'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-kuyay-forest">{c.name}</p>
                          <p className="text-xs text-kuyay-deep/50">{c.productCount} productos · /{c.slug}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditCategory(c)}
                            className="grid h-9 w-9 place-items-center rounded-full border border-kuyay-green/20 text-kuyay-green transition hover:bg-kuyay-green hover:text-white"
                            aria-label="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteCategory(c)}
                            className="grid h-9 w-9 place-items-center rounded-full border border-kuyay-berry/20 text-kuyay-berry transition hover:bg-kuyay-berry hover:text-white"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* -------------------- TESTIMONIOS -------------------- */}
              {tab === 'testimonials' && (
                <div>
                  <div className="mb-5 flex justify-end">
                    <button onClick={openNewTestimonial} className="btn-primary">
                      <Plus className="h-4 w-4" /> Nuevo testimonio
                    </button>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {testimonials.map((t) => (
                      <div key={t.id} className="flex flex-col rounded-3xl border border-kuyay-green/10 bg-white/80 p-5 shadow-soft">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: t.rating || 5 }).map((_, s) => (
                            <Star key={s} className="h-4 w-4 fill-kuyay-gold text-kuyay-gold" />
                          ))}
                          {!t.active && (
                            <span className="ml-auto rounded-full bg-kuyay-deep/10 px-2 py-0.5 text-[10px] font-bold uppercase text-kuyay-deep/50">
                              Oculto
                            </span>
                          )}
                        </div>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-kuyay-deep/70">“{t.text}”</p>
                        <div className="mt-4">
                          <p className="font-bold text-kuyay-forest">{t.name}</p>
                          {t.role && <p className="text-xs text-kuyay-deep/50">{t.role}</p>}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => openEditTestimonial(t)} className="btn-ghost flex-1 !px-3 !py-2 text-xs">
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </button>
                          <button
                            onClick={() => deleteTestimonial(t)}
                            className="grid h-9 w-9 place-items-center rounded-full border border-kuyay-berry/20 text-kuyay-berry transition hover:bg-kuyay-berry hover:text-white"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {!testimonials.length && (
                      <p className="col-span-full py-10 text-center text-kuyay-deep/50">
                        Aún no hay testimonios. Crea el primero.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* -------------------- AJUSTES -------------------- */}
              {tab === 'settings' && (
                <div className="max-w-2xl">
                  <form onSubmit={saveSettings} className="rounded-3xl border border-kuyay-green/10 bg-white/80 p-6 shadow-soft">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-kuyay-forest text-kuyay-lime">
                        <Settings className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="font-display text-lg font-black text-kuyay-forest">
                          Números de WhatsApp
                        </h2>
                        <p className="text-xs text-kuyay-deep/50">
                          Este es el único número de la tienda: recibe todos los pedidos y consultas.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 max-w-sm">
                      <div>
                        <label className="label">WhatsApp de la tienda</label>
                        <input
                          className="input"
                          inputMode="numeric"
                          value={settingsForm.whatsappPrimary}
                          onChange={(e) => setSettingsForm((f) => ({ ...f, whatsappPrimary: e.target.value }))}
                          placeholder="593967598834"
                        />
                        <p className="mt-1 text-xs text-kuyay-deep/45">
                          Formato: código de país + número, sin espacios (ej. 593967598834)
                        </p>
                      </div>
                    </div>

                    {settingsForm.whatsappPrimary && (
                      <a
                        href={`https://wa.me/${settingsForm.whatsappPrimary.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-kuyay-green underline-offset-2 hover:underline"
                      >
                        Probar el número de pedidos →
                      </a>
                    )}

                    <div className="mt-8 border-t border-kuyay-green/10 pt-6">
                      <h3 className="font-display text-base font-black text-kuyay-forest">
                        Portada (inicio)
                      </h3>
                      <p className="mt-1 text-xs text-kuyay-deep/50">
                        Imagen y precio que se muestran al inicio de la página. Deja el precio vacío para ocultarlo.
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label">Precio (vacío = ocultar)</label>
                          <input
                            className="input"
                            value={settingsForm.heroPrice}
                            onChange={(e) => setSettingsForm((f) => ({ ...f, heroPrice: e.target.value }))}
                            placeholder="6.50"
                          />
                        </div>
                        <div>
                          <label className="label">Imagen de portada</label>
                          <div className="flex items-center gap-3">
                            <label className="btn-ghost cursor-pointer gap-2">
                              {uploadingHeroImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                              {uploadingHeroImage ? 'Subiendo…' : 'Subir imagen'}
                              <input type="file" accept="image/*" className="hidden" onChange={handleHeroImage} disabled={uploadingHeroImage} />
                            </label>
                            {settingsForm.heroImage && (
                              <img src={settingsForm.heroImage} alt="Portada" className="h-14 w-14 rounded-xl object-cover" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-kuyay-green/10 pt-6">
                      <h3 className="font-display text-base font-black text-kuyay-forest">
                        Aviso superior (primera línea de la página)
                      </h3>
                      <p className="mt-1 text-xs text-kuyay-deep/50">
                        Aparece arriba de todo en la tienda, como primer mensaje para quien entra.
                      </p>
                      <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-kuyay-deep">
                        <input
                          type="checkbox"
                          checked={settingsForm.topNoticeEnabled !== false}
                          onChange={(e) => setSettingsForm((f) => ({ ...f, topNoticeEnabled: e.target.checked }))}
                        />
                        Mostrar el aviso superior
                      </label>
                      <div className="mt-3">
                        <label className="label">Texto del aviso</label>
                        <textarea
                          className="input resize-none"
                          rows={2}
                          value={settingsForm.topNotice}
                          onChange={(e) => setSettingsForm((f) => ({ ...f, topNotice: e.target.value }))}
                          placeholder="Kéfir y frescos: bajo pedido ~3 días. Deshidratados y té: inmediatos."
                        />
                        <p className="mt-1 text-xs text-kuyay-deep/45">
                          Si lo dejas vacío, el aviso no se mostrará.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-kuyay-green/10 pt-6">
                      <h3 className="font-display text-base font-black text-kuyay-forest">
                        Aviso de pedidos (bajo pedido)
                      </h3>
                      <p className="mt-1 text-xs text-kuyay-deep/50">
                        Se muestra en el inicio, la ficha de cada producto, el carrito y el checkout.
                      </p>
                      <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-kuyay-deep">
                        <input
                          type="checkbox"
                          checked={settingsForm.orderNoticeEnabled !== false}
                          onChange={(e) => setSettingsForm((f) => ({ ...f, orderNoticeEnabled: e.target.checked }))}
                        />
                        Mostrar el aviso en la tienda
                      </label>
                      <div className="mt-3">
                        <label className="label">Texto del aviso</label>
                        <textarea
                          className="input resize-none"
                          rows={3}
                          value={settingsForm.orderNotice}
                          onChange={(e) => setSettingsForm((f) => ({ ...f, orderNotice: e.target.value }))}
                          placeholder="Nuestros productos son naturales y se elaboran bajo pedido. Demoran aproximadamente 3 días..."
                        />
                        <p className="mt-1 text-xs text-kuyay-deep/45">
                          Si lo dejas vacío, el aviso no se mostrará.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-kuyay-green/10 pt-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display text-base font-black text-kuyay-forest">
                          Cuentas bancarias
                        </h3>
                        <button
                          type="button"
                          onClick={() => setSettingsForm((s) => ({
                            ...s,
                            bankAccounts: [...s.bankAccounts, { banco: '', tipo: '', numero: '', titular: '', identificacion: '' }],
                          }))}
                          className="btn-ghost !px-3 !py-2 text-xs"
                        >
                          <Plus className="h-3.5 w-3.5" /> Agregar cuenta
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-kuyay-deep/50">
                        Puedes tener varias cuentas; el cliente las verá al pagar por transferencia.
                      </p>
                      <div className="mt-4 space-y-4">
                        {settingsForm.bankAccounts.map((a, i) => (
                          <div key={i} className="rounded-2xl border border-kuyay-green/10 bg-kuyay-sand/40 p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-xs font-bold uppercase tracking-wider text-kuyay-deep/50">
                                Cuenta #{i + 1}
                              </p>
                              {settingsForm.bankAccounts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setSettingsForm((s) => ({ ...s, bankAccounts: s.bankAccounts.filter((_, idx) => idx !== i) }))}
                                  className="text-kuyay-berry transition hover:text-kuyay-rose"
                                  aria-label="Eliminar cuenta"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {[
                                ['banco', 'Banco'],
                                ['tipo', 'Tipo de cuenta'],
                                ['numero', 'Número de cuenta'],
                                ['titular', 'Titular'],
                                ['identificacion', 'RUC / Cédula'],
                              ].map(([field, label]) => (
                                <div key={field} className={field === 'identificacion' ? 'sm:col-span-2' : ''}>
                                  <label className="label">{label}</label>
                                  <input
                                    className="input"
                                    value={a[field] || ''}
                                    onChange={(e) => setSettingsForm((s) => ({
                                      ...s,
                                      bankAccounts: s.bankAccounts.map((acc, idx) => (idx === i ? { ...acc, [field]: e.target.value } : acc)),
                                    }))}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 border-t border-kuyay-green/10 pt-6">
                      <h3 className="font-display text-base font-black text-kuyay-forest">
                        Pagos con DeUna y GO
                      </h3>
                      <p className="mt-1 text-xs text-kuyay-deep/50">
                        Activa las apps y agrega el número o enlace de pago. Se mostrarán en el checkout.
                      </p>

                      {[
                        ['deuna', 'DeUna'],
                        ['go', 'GO'],
                      ].map(([key, label]) => (
                        <div key={key} className="mt-4 rounded-2xl border border-kuyay-green/10 bg-kuyay-sand/40 p-4">
                          <label className="flex items-center gap-2 text-sm font-bold text-kuyay-forest">
                            <input
                              type="checkbox"
                              checked={Boolean(settingsForm[`${key}Enabled`])}
                              onChange={(e) => setSettingsForm((s) => ({ ...s, [`${key}Enabled`]: e.target.checked }))}
                            />
                            Aceptar pago con {label}
                          </label>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="label">Número / teléfono</label>
                              <input
                                className="input"
                                value={settingsForm[`${key}Phone`] || ''}
                                onChange={(e) => setSettingsForm((s) => ({ ...s, [`${key}Phone`]: e.target.value }))}
                                placeholder="0999999999"
                              />
                            </div>
                            <div>
                              <label className="label">Enlace de pago (opcional)</label>
                              <input
                                className="input"
                                value={settingsForm[`${key}Link`] || ''}
                                onChange={(e) => setSettingsForm((s) => ({ ...s, [`${key}Link`]: e.target.value }))}
                                placeholder="https://..."
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="label">Mensaje para el cliente</label>
                              <input
                                className="input"
                                value={settingsForm[`${key}Note`] || ''}
                                onChange={(e) => setSettingsForm((s) => ({ ...s, [`${key}Note`]: e.target.value }))}
                                placeholder={`Paga con ${label} desde tu app.`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 border-t border-kuyay-green/10 pt-6">
                      <h3 className="font-display text-base font-black text-kuyay-forest">
                        Redes sociales
                      </h3>
                      <p className="mt-1 text-xs text-kuyay-deep/50">
                        Pega el enlace completo de cada red. Las que dejes vacías no se muestran.
                      </p>
                      <div className="mt-4 space-y-4">
                        {SOCIAL_FIELDS.map((f) => {
                          const fieldKey = `social${f.key.charAt(0).toUpperCase()}${f.key.slice(1)}`
                          return (
                            <div key={f.key} className="flex items-center gap-3">
                              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-kuyay-lime/40 text-kuyay-forest">
                                <f.Icon className="h-5 w-5" />
                              </span>
                              <div className="flex-1">
                                <label className="label">{f.label}</label>
                                <input
                                  className="input"
                                  value={settingsForm[fieldKey] || ''}
                                  onChange={(e) => setSettingsForm((s) => ({ ...s, [fieldKey]: e.target.value }))}
                                  placeholder={f.placeholder}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {settingsMsg && (
                      <p className={`mt-5 rounded-xl px-4 py-2.5 text-sm font-semibold ${settingsMsg.type === 'ok' ? 'bg-kuyay-lime/40 text-kuyay-forest' : 'bg-kuyay-berry/10 text-kuyay-berry'}`}>
                        {settingsMsg.text}
                      </p>
                    )}

                    <button type="submit" disabled={savingSettings} className="btn-primary mt-5 w-full">
                      {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar ajustes'}
                    </button>
                  </form>
                </div>
              )}

              {/* -------------------- SEGURIDAD -------------------- */}
              {tab === 'security' && (
                <div className="max-w-lg">
                  <form onSubmit={changePassword} className="rounded-3xl border border-kuyay-green/10 bg-white/80 p-6 shadow-soft">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-kuyay-forest text-kuyay-lime">
                        <KeyRound className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="font-display text-lg font-black text-kuyay-forest">Cambiar contraseña</h2>
                        <p className="text-xs text-kuyay-deep/50">Protege el acceso a tu panel administrador.</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="label" htmlFor="cur">Contraseña actual</label>
                        <input id="cur" type="password" className="input" value={security.current} onChange={(e) => setSecurity((s) => ({ ...s, current: e.target.value }))} />
                      </div>
                      <div>
                        <label className="label" htmlFor="new">Nueva contraseña</label>
                        <input id="new" type="password" className="input" value={security.next} onChange={(e) => setSecurity((s) => ({ ...s, next: e.target.value }))} />
                      </div>
                      <div>
                        <label className="label" htmlFor="conf">Confirmar nueva contraseña</label>
                        <input id="conf" type="password" className="input" value={security.confirm} onChange={(e) => setSecurity((s) => ({ ...s, confirm: e.target.value }))} />
                      </div>
                    </div>

                    {security.msg && (
                      <p className={`mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold ${security.msg.type === 'ok' ? 'bg-kuyay-lime/40 text-kuyay-forest' : 'bg-kuyay-berry/10 text-kuyay-berry'}`}>
                        {security.msg.text}
                      </p>
                    )}

                    <button type="submit" className="btn-primary mt-5 w-full">Actualizar contraseña</button>
                  </form>

                  <p className="mt-4 text-xs text-kuyay-deep/50">
                    La contraseña se guarda cifrada mediante Better Auth. Usuario actual: <span className="font-bold">{session.user.email}</span>
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modal producto */}
      <Modal open={productModal} onClose={() => setProductModal(false)} title={editingProduct ? 'Editar producto' : 'Nuevo producto'} wide>
        <form onSubmit={saveProduct} className="space-y-4">
          <div>
            <label className="label">Fotos del producto</label>
            <ImageUploader images={productForm.images} onChange={(images) => setProductForm((f) => ({ ...f, images }))} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Nombre *</label>
              <input className="input" required value={productForm.name} onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Categoría</label>
              <select className="input" value={productForm.categoryId || ''} onChange={(e) => setProductForm((f) => ({ ...f, categoryId: e.target.value }))}>
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Presentación / unidad</label>
              <input className="input" value={productForm.unit || ''} onChange={(e) => setProductForm((f) => ({ ...f, unit: e.target.value }))} placeholder="Botella 1L" />
            </div>
            <div>
              <label className="label">Precio (USD) *</label>
              <input className="input" type="number" step="0.01" min="0" required value={productForm.price} onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))} />
            </div>
            <div>
              <label className="label">Precio anterior (opcional)</label>
              <input className="input" type="number" step="0.01" min="0" value={productForm.oldPrice} onChange={(e) => setProductForm((f) => ({ ...f, oldPrice: e.target.value }))} />
            </div>
            <div>
              <label className="label">Etiqueta</label>
              <input className="input" value={productForm.badge || ''} onChange={(e) => setProductForm((f) => ({ ...f, badge: e.target.value }))} placeholder="Más vendido" />
            </div>
            <div>
              <label className="label">Stock</label>
              <input className="input" type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm((f) => ({ ...f, stock: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descripción corta</label>
              <input className="input" value={productForm.short || ''} onChange={(e) => setProductForm((f) => ({ ...f, short: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descripción completa</label>
              <textarea className="input resize-none" rows={3} value={productForm.description || ''} onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Beneficios (separados por coma)</label>
              <input className="input" value={productForm.benefitsText} onChange={(e) => setProductForm((f) => ({ ...f, benefitsText: e.target.value }))} placeholder="Sin conservantes, Probiótico vivo" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Ingredientes</label>
              <input className="input" value={productForm.ingredients || ''} onChange={(e) => setProductForm((f) => ({ ...f, ingredients: e.target.value }))} />
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-kuyay-deep">
              <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm((f) => ({ ...f, featured: e.target.checked }))} />
              Destacado en el carrusel
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-kuyay-deep">
              <input type="checkbox" checked={productForm.active !== false} onChange={(e) => setProductForm((f) => ({ ...f, active: e.target.checked }))} />
              Visible en la tienda
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setProductModal(false)} className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={savingProduct} className="btn-primary flex-1">
              {savingProduct ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar producto'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal categoria */}
      <Modal open={categoryModal} onClose={() => setCategoryModal(false)} title={editingCategory ? 'Editar categoría' : 'Nueva categoría'}>
        <form onSubmit={saveCategory} className="space-y-4">
          <div>
            <label className="label">Nombre *</label>
            <input className="input" required value={categoryForm.name} onChange={(e) => setCategoryForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Emoji</label>
              <input className="input" value={categoryForm.emoji} onChange={(e) => setCategoryForm((f) => ({ ...f, emoji: e.target.value }))} />
            </div>
            <div>
              <label className="label">Orden</label>
              <input className="input" type="number" value={categoryForm.sortOrder} onChange={(e) => setCategoryForm((f) => ({ ...f, sortOrder: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setCategoryModal(false)} className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={savingCategory} className="btn-primary flex-1">
              {savingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar categoría'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal testimonio */}
      <Modal open={testimonialModal} onClose={() => setTestimonialModal(false)} title={editingTestimonial ? 'Editar testimonio' : 'Nuevo testimonio'}>
        <form onSubmit={saveTestimonial} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Nombre *</label>
              <input className="input" required value={testimonialForm.name} onChange={(e) => setTestimonialForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Rol / descripción</label>
              <input className="input" value={testimonialForm.role || ''} onChange={(e) => setTestimonialForm((f) => ({ ...f, role: e.target.value }))} placeholder="Cliente frecuente" />
            </div>
          </div>
          <div>
            <label className="label">Comentario *</label>
            <textarea className="input resize-none" rows={4} required value={testimonialForm.text} onChange={(e) => setTestimonialForm((f) => ({ ...f, text: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Estrellas (1-5)</label>
              <input className="input" type="number" min="1" max="5" value={testimonialForm.rating} onChange={(e) => setTestimonialForm((f) => ({ ...f, rating: e.target.value }))} />
            </div>
            <div>
              <label className="label">Orden</label>
              <input className="input" type="number" value={testimonialForm.sortOrder} onChange={(e) => setTestimonialForm((f) => ({ ...f, sortOrder: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Foto del cliente (opcional)</label>
            <div className="flex items-center gap-3">
              <label className="btn-ghost cursor-pointer gap-2">
                {uploadingTestimonialImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {uploadingTestimonialImage ? 'Subiendo…' : 'Subir imagen'}
                <input type="file" accept="image/*" className="hidden" onChange={handleTestimonialImage} disabled={uploadingTestimonialImage} />
              </label>
              {testimonialImagePreview && (
                <>
                  <img src={testimonialImagePreview} alt="Vista previa" className="h-14 w-14 rounded-xl object-cover" />
                  <button type="button" onClick={removeTestimonialImage} className="text-xs font-semibold text-red-600 hover:underline">Quitar</button>
                </>
              )}
            </div>
          </div>
          <input type="hidden" name="folder" value="testimonios" />
          <label className="flex items-center gap-2 text-sm font-semibold text-kuyay-deep">
            <input type="checkbox" checked={testimonialForm.active !== false} onChange={(e) => setTestimonialForm((f) => ({ ...f, active: e.target.checked }))} />
            Visible en la tienda
          </label>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setTestimonialModal(false)} className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={savingTestimonial} className="btn-primary flex-1">
              {savingTestimonial ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar testimonio'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal nuevo pedido */}
      <Modal open={orderModal} onClose={() => setOrderModal(false)} title="Nuevo pedido manual" wide>
        <form onSubmit={saveOrder} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Nombre *</label>
              <input className="input" required value={orderForm.customer.name} onChange={(e) => setOrderForm((f) => ({ ...f, customer: { ...f.customer, name: e.target.value } }))} />
            </div>
            <div>
              <label className="label">WhatsApp *</label>
              <input className="input" required value={orderForm.customer.phone} onChange={(e) => setOrderForm((f) => ({ ...f, customer: { ...f.customer, phone: e.target.value } }))} placeholder="099 999 9999" />
            </div>
            <div>
              <label className="label">Ciudad</label>
              <input className="input" value={orderForm.customer.city} onChange={(e) => setOrderForm((f) => ({ ...f, customer: { ...f.customer, city: e.target.value } }))} />
            </div>
            <div>
              <label className="label">Dirección</label>
              <input className="input" value={orderForm.customer.address} onChange={(e) => setOrderForm((f) => ({ ...f, customer: { ...f.customer, address: e.target.value } }))} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">Productos *</label>
              <button type="button" onClick={addOrderItem} className="btn-ghost !px-3 !py-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Agregar
              </button>
            </div>
            <div className="space-y-2">
              {orderForm.items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 items-center gap-2">
                  <select
                    className="input col-span-5"
                    value={it.productId}
                    onChange={(e) => pickOrderProduct(i, e.target.value)}
                  >
                    <option value="">Personalizado…</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    className="input col-span-3"
                    placeholder="Producto"
                    value={it.name}
                    onChange={(e) => updateOrderItem(i, { name: e.target.value, productId: '' })}
                  />
                  <input
                    className="input col-span-1"
                    type="number"
                    min="1"
                    title="Cantidad"
                    value={it.qty}
                    onChange={(e) => updateOrderItem(i, { qty: e.target.value })}
                  />
                  <input
                    className="input col-span-2"
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={it.price}
                    onChange={(e) => updateOrderItem(i, { price: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeOrderItem(i)}
                    disabled={orderForm.items.length === 1}
                    className="col-span-1 grid h-9 w-9 place-items-center rounded-full border border-kuyay-berry/20 text-kuyay-berry transition hover:bg-kuyay-berry hover:text-white disabled:opacity-30"
                    aria-label="Quitar producto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-kuyay-sand/60 px-4 py-3">
              <span className="text-sm font-bold text-kuyay-forest">Total</span>
              <span className="font-display text-xl font-black text-kuyay-green">{formatUSD(orderTotal)}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Pago</label>
              <select className="input" value={orderForm.paymentMethod} onChange={(e) => setOrderForm((f) => ({ ...f, paymentMethod: e.target.value }))}>
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
                <option value="deuna">DeUna</option>
                <option value="go">GO</option>
              </select>
            </div>
            <div>
              <label className="label">Estado</label>
              <select className="input" value={orderForm.status} onChange={(e) => setOrderForm((f) => ({ ...f, status: e.target.value }))}>
                {ALL_ORDER_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Entrega estimada</label>
              <input className="input" type="date" value={orderForm.estimatedDate} onChange={(e) => setOrderForm((f) => ({ ...f, estimatedDate: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="label">Notas</label>
            <textarea className="input resize-none" rows={2} value={orderForm.notes} onChange={(e) => setOrderForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Indicaciones internas o del cliente" />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setOrderModal(false)} className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={savingOrder} className="btn-primary flex-1">
              {savingOrder ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar pedido'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
