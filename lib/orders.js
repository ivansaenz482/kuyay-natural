export const ORDER_STATUSES = [
  {
    id: 'por_hacer',
    label: 'Por hacer',
    short: 'Por hacer',
    description: 'Estamos preparando tu pedido. Los productos naturales demoran aproximadamente 3 días.',
  },
  {
    id: 'por_entregar',
    label: 'Por entregar',
    short: 'Por entregar',
    description: 'Tu pedido está listo. Coordinamos la entrega por WhatsApp.',
  },
  {
    id: 'entregado',
    label: 'Entregado',
    short: 'Entregado',
    description: '¡Disfruta tu pedido Kuyay!',
  },
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
  efectivo: 'Pago al recibir el pedido',
  deuna: 'DeUna',
  go: 'GO',
}

export function paymentLabel(id) {
  return PAYMENT_LABELS[id] || id
}
