import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { formatUSD } from '../lib/whatsapp'
import { cartWhatsAppLink } from '../lib/whatsapp'
import WhatsAppIcon from './WhatsAppIcon'
import CheckoutModal from './CheckoutModal'

export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, count, updateQty, removeItem, clear } = useCart()
  const { numbers } = useSettings()
  const [checkout, setCheckout] = useState(false)

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 z-[60] bg-kuyay-forest/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-kuyay-cream shadow-card"
            >
              <div className="flex items-center justify-between border-b border-kuyay-green/10 px-5 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-kuyay-green" />
                  <h2 className="font-display text-lg font-black text-kuyay-forest">
                    Tu carrito
                  </h2>
                  <span className="rounded-full bg-kuyay-lime/60 px-2 py-0.5 text-xs font-bold text-kuyay-forest">
                    {count}
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  aria-label="Cerrar carrito"
                  className="grid h-9 w-9 place-items-center rounded-full text-kuyay-deep/60 transition hover:bg-kuyay-sand"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-kuyay-lime/40">
                    <ShoppingBag className="h-9 w-9 text-kuyay-green" />
                  </span>
                  <p className="font-display text-xl font-bold text-kuyay-forest">
                    Tu carrito está vacío
                  </p>
                  <p className="text-sm text-kuyay-deep/60">
                    Agrega tus productos favoritos y vuelve aquí para finalizar el pedido.
                  </p>
                  <button onClick={closeCart} className="btn-primary">
                    Explorar productos
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex gap-3 rounded-2xl border border-kuyay-green/10 bg-white/80 p-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-20 shrink-0 rounded-xl object-cover"
                          />
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-kuyay-forest">
                                  {item.name}
                                </p>
                                <p className="text-xs text-kuyay-deep/50">{item.unit}</p>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                aria-label={`Eliminar ${item.name}`}
                                className="text-kuyay-deep/40 transition hover:text-kuyay-berry"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center gap-1 rounded-full border border-kuyay-green/15 bg-white p-1">
                                <button
                                  onClick={() => updateQty(item.id, item.qty - 1)}
                                  aria-label="Menos"
                                  className="grid h-6 w-6 place-items-center rounded-full text-kuyay-forest transition hover:bg-kuyay-lime/50"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                                <button
                                  onClick={() => updateQty(item.id, item.qty + 1)}
                                  aria-label="Más"
                                  className="grid h-6 w-6 place-items-center rounded-full text-kuyay-forest transition hover:bg-kuyay-lime/50"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="font-display text-base font-black text-kuyay-forest">
                                {formatUSD(item.price * item.qty)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <button
                      onClick={clear}
                      className="w-full pt-1 text-center text-xs font-semibold text-kuyay-deep/50 underline-offset-2 hover:underline"
                    >
                      Vaciar carrito
                    </button>
                  </div>

                  <div className="border-t border-kuyay-green/10 bg-white/70 px-5 py-4 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-kuyay-deep/60">Subtotal</span>
                      <span className="font-display text-2xl font-black text-kuyay-forest">
                        {formatUSD(subtotal)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-kuyay-deep/50">
                      Envío coordinado por WhatsApp según tu ubicación.
                    </p>
                    <button
                      onClick={() => setCheckout(true)}
                      className="btn-primary mt-4 w-full"
                    >
                      Finalizar pedido
                    </button>
                    <a
                      href={cartWhatsAppLink(items, subtotal, '', numbers)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn mt-2 w-full bg-[#25D366] text-white hover:bg-[#1ebe5b]"
                    >
                      <WhatsAppIcon className="h-4 w-4" /> Pedir por WhatsApp
                    </a>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal open={checkout} onClose={() => setCheckout(false)} />
    </>
  )
}
