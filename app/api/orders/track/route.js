import { NextResponse } from 'next/server'
import { getOrderByCode } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Falta el código de pedido' }, { status: 400 })
  try {
    const order = await getOrderByCode(code.trim())
    if (!order) return NextResponse.json({ error: 'No encontramos ese pedido' }, { status: 404 })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
