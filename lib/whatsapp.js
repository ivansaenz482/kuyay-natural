export const formatUSD = (value) =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(
    Number(value) || 0,
  )

// Valores por defecto (se pueden cambiar desde el panel admin)
export const DEFAULT_NUMBERS = [
  process.env.NEXT_PUBLIC_WHATSAPP_PRIMARY || '593991028834',
  process.env.NEXT_PUBLIC_WHATSAPP_SECONDARY || '593994395266',
].filter(Boolean)

export const DEFAULT_BANK = {
  banco: process.env.NEXT_PUBLIC_BANK_NAME || 'Banco Pichincha',
  tipo: process.env.NEXT_PUBLIC_BANK_TYPE || 'Cuenta de Ahorros',
  numero: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '2200000000',
  titular: process.env.NEXT_PUBLIC_BANK_HOLDER || 'Kuyay Natural',
  identificacion: process.env.NEXT_PUBLIC_BANK_ID || '1790000000001',
}

// Compatibilidad: WHATSAPP_NUMBERS / BANK
export const WHATSAPP_NUMBERS = DEFAULT_NUMBERS
export const BANK = DEFAULT_BANK

const phoneOf = (numbers) => (numbers && numbers[0]) || DEFAULT_NUMBERS[0]

export function productWhatsAppLink(product, qty = 1, numbers = DEFAULT_NUMBERS) {
  const message = [
    '¡Hola Kuyay Natural! 🌿',
    '',
    'Quiero este producto:',
    `• ${qty} x ${product.name} (${product.unit || 'unidad'})`,
    `• Precio: ${formatUSD(product.price)} c/u`,
    qty > 1 ? `• Subtotal: ${formatUSD(product.price * qty)}` : '',
    '',
    '¿Está disponible para entrega?',
  ]
    .filter((line) => line !== '')
    .join('\n')
  return `https://wa.me/${phoneOf(numbers)}?text=${encodeURIComponent(message)}`
}

export function cartWhatsAppLink(items, total, extra = '', numbers = DEFAULT_NUMBERS) {
  const lines = items.map(
    (i) => `• ${i.qty} x ${i.name} (${formatUSD(i.price)} c/u) — ${formatUSD(i.price * i.qty)}`,
  )
  const message = [
    '¡Hola Kuyay Natural! 🌿 Quiero hacer este pedido:',
    '',
    ...lines,
    '',
    `TOTAL: ${formatUSD(total)}`,
    extra,
  ]
    .filter((line) => line !== '')
    .join('\n')
  return `https://wa.me/${phoneOf(numbers)}?text=${encodeURIComponent(message)}`
}

export function orderWhatsAppLink(order, numbers = DEFAULT_NUMBERS) {
  const c = order.customer || {}
  const lines = (order.items || []).map(
    (i) => `• ${i.qty} x ${i.name} (${formatUSD(i.price)} c/u) — ${formatUSD(i.price * i.qty)}`,
  )
  const message = [
    '¡Hola Kuyay Natural! 🌿 Quiero confirmar este pedido:',
    '',
    `Código: ${order.id}`,
    `Cliente: ${c.name || ''}`,
    c.phone ? `WhatsApp: ${c.phone}` : '',
    c.city ? `Ciudad: ${c.city}` : '',
    c.address ? `Dirección: ${c.address}` : '',
    c.notes ? `Notas: ${c.notes}` : '',
    '',
    'Productos:',
    ...lines,
    '',
    `TOTAL: ${formatUSD(order.total)}`,
    `Pago: ${order.paymentMethod === 'transferencia' ? 'Transferencia bancaria' : 'Efectivo'}`,
    '',
    '¿Me confirman la entrega? ¡Gracias!',
  ]
    .filter((line) => line !== '')
    .join('\n')
  return `https://wa.me/${phoneOf(numbers)}?text=${encodeURIComponent(message)}`
}

export function contactWhatsAppLink(numbers = DEFAULT_NUMBERS, text = '¡Hola Kuyay Natural! 🌿 Quiero hacer un pedido.') {
  return `https://wa.me/${phoneOf(numbers)}?text=${encodeURIComponent(text)}`
}
