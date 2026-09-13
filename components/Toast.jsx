import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Toast() {
  const { toast } = useCart()
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2"
        >
          <div className="glass-dark flex items-center gap-3 rounded-full px-5 py-3 shadow-card">
            <CheckCircle2 className="h-5 w-5 text-kuyay-lime" />
            <span className="text-sm font-semibold text-white">{toast}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
