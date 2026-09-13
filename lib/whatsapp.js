export const formatUSD = (value) =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(
    Number(value) || 0,
  )

export const WHATSAPP_NUMBERS = [
  process.env.NEXT_PUBLIC_WHATSAPP_PRIMARY || '593991028834',
  process.env.NEXT_PUBLIC_WHATSAPP_SECONDARY || '593994395266',
].filter(Boolean)

export function productWhatsAppLink(product, numberIndex = 0) {
  const phone = WHATSAPP_NUMBERS[numberIndex] || WHATSAPP_NUMBERS[0]
  const message = [
    '¡Hola Kuyay Natural! 🌿',
    '',
    'Quiero este producto:',
    `• ${product.name} (${product.unit || 'unidad'})`,
    `• Precio: ${formatUSD(product.price)}`,
    '',
    '¿Está disponible para entrega?',
  ].join('\n')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function cartWhatsAppLink(items, total, extra = '') {
  const phone = WHATSAPP_NUMBERS[0]
  const lines = items.map((i) => `• ${i.qty} x ${i.name} — ${formatUSD(i.price * i.qty)}`)
  const message = [
    '¡Hola Kuyay Natural! 🌿 Quiero confirmar este pedido:',
    '',
    ...lines,
    '',
    `Total: ${formatUSD(total)}`,
    extra,
  ]
    .filter(Boolean)
    .join('\n')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export const BANK = {
  banco: process.env.NEXT_PUBLIC_BANK_NAME || 'Banco Pichincha',
  tipo: process.env.NEXT_PUBLIC_BANK_TYPE || 'Cuenta de Ahorros',
  numero: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '2200000000',
  titular: process.env.NEXT_PUBLIC_BANK_HOLDER || 'Kuyay Natural',
  identificacion: process.env.NEXT_PUBLIC_BANK_ID || '1790000000001',
}
