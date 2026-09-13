import { motion } from 'framer-motion'

export function StatCard({ icon: Icon, label, value, hint, accent = 'green', delay = 0 }) {
  const accents = {
    green: 'from-kuyay-green to-kuyay-leaf',
    gold: 'from-kuyay-gold to-amber-500',
    berry: 'from-kuyay-berry to-kuyay-rose',
    forest: 'from-kuyay-forest to-kuyay-deep',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-3xl border border-kuyay-green/10 bg-white/80 p-5 shadow-soft backdrop-blur"
    >
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${accents[accent]} opacity-20 blur-xl`} />
      <div className="flex items-center justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${accents[accent]} text-white shadow-soft`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-black text-kuyay-forest">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-kuyay-deep/50">{label}</p>
      {hint && <p className="mt-2 text-xs text-kuyay-deep/45">{hint}</p>}
    </motion.div>
  )
}

export function BarChart({ data = [], valueFormatter = (v) => v, accent = 'from-kuyay-green to-kuyay-fresh' }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="space-y-4">
      {data.map((d, i) => (
        <div key={d.label + i}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 font-semibold text-kuyay-deep/80">
              {d.image && (
                <img src={d.image} alt="" className="h-7 w-7 shrink-0 rounded-lg object-cover" />
              )}
              <span className="truncate">{d.label}</span>
            </span>
            <span className="shrink-0 font-display font-black text-kuyay-forest">
              {valueFormatter(d.value)}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-kuyay-sand">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full bg-gradient-to-r ${accent}`}
            />
          </div>
        </div>
      ))}
      {!data.length && <p className="py-6 text-center text-sm text-kuyay-deep/50">Sin datos aún.</p>}
    </div>
  )
}

export function AreaChart({ data = [], height = 180 }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const width = 100
  const step = data.length > 1 ? width / (data.length - 1) : width
  const points = data.map((d, i) => ({
    x: i * step,
    y: height - (d.value / max) * (height - 30) - 10,
    ...d,
  }))
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-44 w-full">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#52B788" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#52B788" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill="url(#areaFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.8" fill="#123524" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-kuyay-deep/45">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}
