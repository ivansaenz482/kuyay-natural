import { motion } from 'framer-motion'
import { Award, Heart, Leaf, Users } from 'lucide-react'

const PILLARS = [
  { icon: Heart, value: 'Hecho con amor', label: 'Cada lote, a mano' },
  { icon: Leaf, value: 'Ingredientes reales', label: 'Sin conservantes' },
  { icon: Users, value: 'Comunidad local', label: 'Productores de Ecuador' },
  { icon: Award, value: 'Calidad artesanal', label: 'Pequeños lotes' },
]

export default function Story() {
  return (
    <section id="nosotros" className="relative py-20 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <span className="chip">Nuestra historia</span>
          <h2 className="section-title mt-4">Del grano vivo a tu mesa</h2>
          <p className="mt-5 text-base leading-relaxed text-kuyay-deep/70">
            Kuyay nace del amor por lo natural. Empezamos en una cocina pequeña, con granos de
            kéfir cuidados como un tesoro, y hoy llevamos probióticos vivos a cientos de hogares.
          </p>
          <p className="mt-4 text-base leading-relaxed text-kuyay-deep/70">
            No usamos conservantes, colorantes ni azúcar añadida. Solo leche fresca, frutas reales
            y tiempo: la receta honesta que hace que cada producto se sienta casero, porque lo es.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.value}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-kuyay-green/10 bg-white/70 p-4 backdrop-blur"
              >
                <p.icon className="h-6 w-6 text-kuyay-leaf" />
                <p className="mt-3 font-display text-base font-bold text-kuyay-forest">{p.value}</p>
                <p className="text-xs text-kuyay-deep/55">{p.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
          <img
            src="/images/queso-crema-1.jpeg"
            alt="Queso crema de kéfir"
            className="col-span-1 row-span-2 h-full w-full rounded-[2rem] object-cover shadow-soft"
          />
          <img
            src="/images/frutas-mix-2.jpeg"
            alt="Mix de frutas deshidratadas"
            className="h-44 w-full rounded-[2rem] object-cover shadow-soft sm:h-56"
          />
          <img
            src="/images/kefir-frutos-rojos.jpeg"
            alt="Kéfir de frutos rojos"
            className="h-44 w-full rounded-[2rem] object-cover shadow-soft sm:h-56"
          />
        </div>
      </div>
    </section>
  )
}
