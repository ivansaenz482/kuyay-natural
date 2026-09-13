import { motion } from 'framer-motion'
import { HeartHandshake, Leaf, ShieldCheck, Sparkles, Snowflake, Utensils } from 'lucide-react'

const BENEFITS = [
  {
    icon: Leaf,
    title: 'Fermentación artesanal',
    text: 'Granos de kéfir vivos y fermentación lenta, sin atajos ni conservantes.',
  },
  {
    icon: ShieldCheck,
    title: 'Probióticos vivos',
    text: 'Millones de Lactobacillus y bacterias benéficas para tu flora intestinal.',
  },
  {
    icon: Utensils,
    title: 'Digestión ligera',
    text: 'Naturalmente bajo en lactosa, ideal para estómagos sensibles.',
  },
  {
    icon: HeartHandshake,
    title: 'Hecho con amor',
    text: 'Producción local, en pequeños lotes y con ingredientes de verdad.',
  },
  {
    icon: Snowflake,
    title: 'Frescura garantizada',
    text: 'Cadena de frío cuidada desde nuestra cocina hasta tu puerta.',
  },
  {
    icon: Sparkles,
    title: 'Sabor que enamora',
    text: 'Cremoso, equilibrado y delicioso. Saludable nunca supo tan bien.',
  },
]

export default function Benefits() {
  return (
    <section id="beneficios" className="relative overflow-hidden bg-kuyay-sand/50 py-20 sm:py-28">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem] shadow-card">
              <img
                src="/images/kefir-pulpa.jpeg"
                alt="Kéfir con pulpa de frutos rojos"
                className="h-[30rem] w-full object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass absolute -bottom-6 left-6 right-6 rounded-3xl p-5 shadow-card sm:left-10 sm:right-10"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-kuyay-forest text-kuyay-lime">
                  <Leaf className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-display text-lg font-black text-kuyay-forest">
                    Sin azúcar añadida
                  </p>
                  <p className="text-sm text-kuyay-deep/60">
                    Solo fruta real, leche fresca y cultivos vivos.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div>
            <span className="chip">Por qué Kuyay</span>
            <h2 className="section-title mt-4">
              Bienestar natural que se nota desde el primer sorbo
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-kuyay-deep/65">
              En Kuyay Natural creemos que la salud empieza en el intestino. Por eso elaboramos
              alimentos probióticos de forma artesanal, cuidando cada detalle.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06 }}
                  className="group flex gap-3 rounded-2xl border border-kuyay-green/10 bg-white/70 p-4 backdrop-blur transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-kuyay-lime/50 text-kuyay-forest transition group-hover:bg-kuyay-green group-hover:text-white">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-kuyay-forest">{b.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-kuyay-deep/60">{b.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
