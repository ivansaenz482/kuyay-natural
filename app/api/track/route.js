import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req) {
  try {
    let path = '/'
    try {
      const body = await req.json()
      path = body?.path || '/'
    } catch {
      /* sin body */
    }
    await query('insert into page_views (path) values ($1)', [path])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
