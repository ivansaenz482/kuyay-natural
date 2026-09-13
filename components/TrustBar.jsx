import { Leaf, ShieldCheck, Snowflake, Truck } from 'lucide-react'

const ITEMS = [
  { icon: Leaf, text: '100% natural, sin conservantes' },
  { icon: Snowflake, text: 'Cadena de frío garantizada' },
  { icon: ShieldCheck, text: 'Cultivos probióticos vivos' },
  { icon: Truck, text: 'Entrega local el mismo día' },
  { icon: Leaf, text: 'Hecho con amor en Ecuador' },
]

export default function TrustBar() {
  const loop = [...ITEMS, ...ITEMS]
  return (
    <div className="relative border-y border-kuyay-green/10 bg-kuyay-forest py-4">
      <div className="mask-fade-x flex overflow-hidden">
        <div className="flex min-w-full shrink-0 animate-marquee items-center gap-10 pr-10">
          {loop.map((item, i) => (
            <div key={i} className="flex shrink-0 items-center gap-2.5">
              <item.icon className="h-4 w-4 text-kuyay-lime" />
              <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-white/85">
                {item.text}
              </span>
              <span className="ml-8 h-1.5 w-1.5 rounded-full bg-kuyay-gold/70" />
            </div>
          ))}
        </div>
        <div
          aria-hidden
          className="flex min-w-full shrink-0 animate-marquee items-center gap-10 pr-10"
        >
          {loop.map((item, i) => (
            <div key={i} className="flex shrink-0 items-center gap-2.5">
              <item.icon className="h-4 w-4 text-kuyay-lime" />
              <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-white/85">
                {item.text}
              </span>
              <span className="ml-8 h-1.5 w-1.5 rounded-full bg-kuyay-gold/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
