export const formatUSD = (value) =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(
    Number(value) || 0,
  )

export const WHATSAPP_NUMBERS = [
  process.env.NEXT_PUBLIC_WHATSAPP_PRIMARY || '593991028834',
  process.env.NEXT_PUBLIC_WHATSAPP_SECONDARY || '593994395266',
].filter(Boolean)

export function productWhatsAppLink(product, qty = 1) {
  const phone = WHATSAPP_NUMBERS[0]
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
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

// El numero [0] es el WhatsApp de PEDIDOS (recibe todos los pedidos)
export function cartWhatsAppLink(items, total, extra = '') {
  const phone = WHATSAPP_NUMBERS[0]
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
    .filter(Boolean)
    .join('\n')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function orderWhatsAppLink(order) {
  const phone = WHATSAPP_NUMBERS[0]
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
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export const BANK = {
  banco: process.env.NEXT_PUBLIC_BANK_NAME || 'Banco Pichincha',
  tipo: process.env.NEXT_PUBLIC_BANK_TYPE || 'Cuenta de Ahorros',
  numero: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '2200000000',
  titular: process.env.NEXT_PUBLIC_BANK_HOLDER || 'Kuyay Natural',
  identificacion: process.env.NEXT_PUBLIC_BANK_ID || '1790000000001',
}
