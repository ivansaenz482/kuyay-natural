'use client'

import { useState } from 'react'
import { Check, Clock, Copy, MapPin, Phone } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { formatPhone } from '../lib/whatsapp'
import WhatsAppIcon from './WhatsAppIcon'

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* noop */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copiar"
      className="text-kuyay-deep/40 transition hover:text-kuyay-green"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-kuyay-green" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

export default function Contact() {
  const { numbers, bankAccounts } = useSettings()
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

              <div className="mt-8 rounded-2xl border border-kuyay-green/10 bg-kuyay-sand/50 p-5">
                <p className="text-sm font-bold text-kuyay-forest">Métodos de pago</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-kuyay-green shadow-soft">
                    Transferencia bancaria
                  </span>
                  <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-kuyay-green shadow-soft">
                    Efectivo
                  </span>
                </div>

                {bankAccounts?.length > 0 && (
                  <div id="pagos" className="mt-5 scroll-mt-32 border-t border-kuyay-green/10 pt-4">
                    <p className="text-sm font-bold text-kuyay-forest">
                      Cuentas para transferencia
                    </p>
                    <p className="mt-1 text-xs text-kuyay-deep/50">
                      Transfiere a cualquiera de estas cuentas y envíanos el comprobante por WhatsApp.
                    </p>

                    <div className="mt-3 space-y-3">
                      {bankAccounts.map((a, i) => (
                        <div key={i} className="rounded-2xl bg-white p-4 shadow-soft">
                          <p className="text-sm font-bold text-kuyay-forest">
                            {a.banco || 'Cuenta bancaria'}
                            {bankAccounts.length > 1 ? ` #${i + 1}` : ''}
                          </p>
                          <dl className="mt-2 space-y-1.5 text-sm text-kuyay-deep/70">
                            {a.tipo && (
                              <div className="flex justify-between gap-3">
                                <dt>Tipo</dt>
                                <dd className="font-semibold text-kuyay-forest">{a.tipo}</dd>
                              </div>
                            )}
                            {a.numero && (
                              <div className="flex justify-between gap-3">
                                <dt>Cuenta</dt>
                                <dd className="flex items-center gap-2 font-semibold text-kuyay-forest">
                                  {a.numero}
                                  <CopyButton value={a.numero} />
                                </dd>
                              </div>
                            )}
                            {a.titular && (
                              <div className="flex justify-between gap-3">
                                <dt>Titular</dt>
                                <dd className="font-semibold text-kuyay-forest">{a.titular}</dd>
                              </div>
                            )}
                            {a.identificacion && (
                              <div className="flex justify-between gap-3">
                                <dt>RUC / CI</dt>
                                <dd className="flex items-center gap-2 font-semibold text-kuyay-forest">
                                  {a.identificacion}
                                  <CopyButton value={a.identificacion} />
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      ))}
                    </div>

                    {whatsapp && (
                      <a
                        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                          '¡Hola Kuyay Natural! 🌿 Ya realicé la transferencia, les envío el comprobante.',
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn mt-4 w-full bg-[#25D366] text-white hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
                      >
                        <WhatsAppIcon className="h-4 w-4" /> Enviar comprobante por WhatsApp
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
