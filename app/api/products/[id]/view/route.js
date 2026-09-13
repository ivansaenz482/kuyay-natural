import { NextResponse } from 'next/server'
import { incrementProductView } from '@/lib/repo'

export async function POST(_req, { params }) {
  try {
    await incrementProductView(Number(params.id))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
