import { NextResponse } from 'next/server'
import { query, getClient } from '@/lib/db'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'

const VALID_PAYMENTS = ['transferencia', 'efectivo', 'deuna', 'go']
const VALID_STATUSES = ['por_hacer', 'por_entregar', 'entregado', 'cancelado']

export async function GET(req) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    const { rows } = await query(
      `select o.*, to_char(o.estimated_date, 'YYYY-MM-DD') as estimated_date,
              coalesce(json_agg(json_build_object('name', oi.name, 'qty', oi.qty, 'price', oi.price)) filter (where oi.id is not null), '[]') as items
       from orders o
       left join order_items oi on oi.order_id = o.id
       group by o.id
       order by o.created_at desc
       limit 200`,
    )
    return NextResponse.json(
      rows.map((r) => ({
        id: r.code,
        dbId: r.id,
        customer: r.customer,
        items: r.items,
        total: Number(r.total),
        paymentMethod: r.payment_method,
        status: r.status,
        origin: r.origin,
        estimatedDate: r.estimated_date,
        notes: r.notes,
        createdAt: r.created_at,
      })),
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  const admin = await isAdmin(req)
  const client = await getClient()
  try {
    const body = await req.json()
    const { customer, items, total, paymentMethod } = body

    if (!customer?.name || !customer?.phone || !items?.length) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }
    if (!VALID_PAYMENTS.includes(paymentMethod)) {
      return NextResponse.json({ error: 'Método de pago inválido' }, { status: 400 })
    }

    const status = admin && VALID_STATUSES.includes(body.status) ? body.status : 'por_hacer'
    const origin = admin && body.origin ? String(body.origin).slice(0, 20) : 'web'
    const estimatedDate = admin && body.estimatedDate ? body.estimatedDate : null
    const notes =
      admin && body.notes ? String(body.notes).slice(0, 500) : customer.notes || null

    const code = `KY-${Date.now().toString(36).toUpperCase()}`
    await client.query('begin')
    const { rows } = await client.query(
      `insert into orders (code, customer, total, payment_method, status, origin, estimated_date, notes)
       values ($1,$2,$3,$4,$5,$6,$7,$8) returning id, code, created_at`,
      [code, customer, total, paymentMethod, status, origin, estimatedDate, notes],
    )
    const order = rows[0]

    for (const item of items) {
      await client.query(
        `insert into order_items (order_id, product_id, name, qty, price)
         values ($1,$2,$3,$4,$5)`,
        [order.id, item.id || null, item.name, item.qty, item.price],
      )
      if (item.id) {
        await client.query(
          'update products set sales = sales + $1 where id = $2',
          [item.qty, item.id],
        )
      }
    }
    await client.query('commit')

    return NextResponse.json(
      {
        id: order.code,
        total: Number(total),
        paymentMethod,
        customer,
        items,
        status,
        origin,
        estimatedDate,
      },
      { status: 201 },
    )
  } catch (error) {
    await client.query('rollback').catch(() => {})
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
}
