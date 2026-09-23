'use client'

import { Clock, MapPin, Phone } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { formatPhone } from '../lib/whatsapp'
import WhatsAppIcon from './WhatsAppIcon'

export default function Contact() {
  const { numbers } = useSettings()
  const whatsapp = numbers[0]
  return (
    <section id="contacto" className="relative py-20 sm:py-28">
      <div className="container-x">
        <div className="overflow-hidden rounded-[2.5rem] border border-kuyay-green/10 bg-white/70 shadow-card backdrop-blur">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[20rem]">
              <img
                src="/images/variedad.jpeg"
                alt="Productos Kuyay Natural"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kuyay-forest/90 to-kuyay-forest/30" />
              <div className="relative flex h-full flex-col justify-end p-8 sm:p-10">
                <h3 className="font-display text-3xl font-black text-white">
                  Hagamos tu pedido juntos
                </h3>
                <p className="mt-3 max-w-sm text-sm text-white/80">
                  Escríbenos por WhatsApp y te ayudamos a elegir tu combo ideal. Entregas locales y
                  envíos coordinados.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {numbers.map((num) => (
                    <a
                      key={num}
                      href={`https://wa.me/${num}?text=${encodeURIComponent(
                        '¡Hola Kuyay Natural! 🌿 Quiero hacer un pedido.',
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bg-[#25D366] text-white hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      {formatPhone(num)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <span className="chip">Contacto</span>
              <h3 className="mt-4 font-display text-2xl font-black text-kuyay-forest">
                Estamos para ayudarte
              </h3>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-kuyay-lime/50 text-kuyay-forest">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-kuyay-forest">WhatsApp / Llamadas</p>
                    {numbers.map((n) => (
                      <p key={n} className="text-sm text-kuyay-deep/60">
                        {formatPhone(n)}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-kuyay-lime/50 text-kuyay-forest">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-kuyay-forest">Horario de atención</p>
                    <p className="text-sm text-kuyay-deep/60">Lunes a sábado · 8:00 a 19:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-kuyay-lime/50 text-kuyay-forest">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-kuyay-forest">Entrega</p>
                    <p className="text-sm text-kuyay-deep/60">
                      Entregas locales y envíos coordinados a todo el país.
                    </p>
                  </div>
                </div>
              </div>

              <div id="pagos" className="mt-8 scroll-mt-32 rounded-2xl border border-kuyay-green/10 bg-kuyay-sand/50 p-5">
                <p className="text-sm font-bold text-kuyay-forest">Métodos de pago</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-kuyay-green shadow-soft">
                    Transferencia bancaria
                  </span>
                  <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-kuyay-green shadow-soft">
                    Efectivo
                  </span>
                </div>
                <p className="mt-4 text-xs text-kuyay-deep/55">
                  Escríbenos y con gusto te compartimos las formas de pago y los datos de las
                  cuentas bancarias.
                </p>
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                      '¡Hola Kuyay Natural! 🌿 Quisiera conocer las formas de pago y los datos de las cuentas bancarias, por favor.',
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn mt-4 w-full bg-[#25D366] text-white hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Solicitar formas de pago
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
