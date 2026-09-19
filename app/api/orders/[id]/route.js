import { NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/repo'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'

const VALID = ['por_hacer', 'por_entregar', 'entregado', 'cancelado']

export async function PUT(req, { params }) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    const { status } = await req.json()
    if (!VALID.includes(status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }
    const order = await updateOrderStatus(Number(params.id), status)
    if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
