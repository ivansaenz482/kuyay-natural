export const ORDER_STATUSES = [
  { id: 'pendiente', label: 'Pedido recibido', short: 'Recibido', description: 'Registramos tu pedido correctamente.' },
  { id: 'confirmado', label: 'Pago confirmado', short: 'Confirmado', description: 'Verificamos tu pago o coordinamos el cobro.' },
  { id: 'en_camino', label: 'En camino', short: 'En camino', description: 'Tu pedido va rumbo a tu dirección.' },
  { id: 'entregado', label: 'Entregado', short: 'Entregado', description: '¡Disfruta tu pedido Kuyay!' },
]

export const CANCELED = { id: 'cancelado', label: 'Cancelado', short: 'Cancelado' }

export const ALL_ORDER_STATUSES = [...ORDER_STATUSES, CANCELED]

export function statusIndex(status) {
  return ORDER_STATUSES.findIndex((s) => s.id === status)
}

export function statusLabel(status) {
  return ALL_ORDER_STATUSES.find((s) => s.id === status)?.label || status
}

export const PAYMENT_LABELS = {
  transferencia: 'Transferencia bancaria',
  efectivo: 'Efectivo',
  deuna: 'DeUna',
  go: 'GO',
}

export function paymentLabel(id) {
  return PAYMENT_LABELS[id] || id
}
