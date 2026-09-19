import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req) {
  try {
    let path = '/'
    let visitorId = ''
    try {
      const body = await req.json()
      path = body?.path || '/'
      visitorId = String(body?.visitorId || '').slice(0, 64)
    } catch {
      /* sin body */
    }

    // Sin identificador de visitante no se cuenta (evita bots y recargas)
    if (!visitorId) return NextResponse.json({ ok: true })

    await query(
      `insert into page_views (path, visitor_id)
       select $1, $2
       where not exists (
         select 1 from page_views
         where visitor_id = $2 and created_at >= date_trunc('day', now())
       )`,
      [path, visitorId],
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
