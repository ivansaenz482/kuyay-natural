import { NextResponse } from 'next/server'
import { listTestimonials, createTestimonial } from '@/lib/repo'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const all = searchParams.get('all') === 'true'
  try {
    if (all && !(await isAdmin(req))) return unauthorized()
    return NextResponse.json(await listTestimonials({ includeInactive: all }))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    const body = await req.json()
    if (!body.name || !body.text) {
      return NextResponse.json({ error: 'Nombre y comentario son obligatorios' }, { status: 400 })
    }
    return NextResponse.json(await createTestimonial(body), { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
