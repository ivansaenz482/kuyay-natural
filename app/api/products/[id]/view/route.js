import { NextResponse } from 'next/server'
import { registerProductView } from '@/lib/repo'

export async function POST(req, { params }) {
  try {
    let visitorId = ''
    try {
      const body = await req.json()
      visitorId = String(body?.visitorId || '').slice(0, 64)
    } catch {
      /* sin body */
    }
    if (visitorId) await registerProductView(Number(params.id), visitorId)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
