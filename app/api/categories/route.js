import { NextResponse } from 'next/server'
import { listCategories, createCategory } from '@/lib/repo'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(await listCategories())
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    const body = await req.json()
    if (!body.name) return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
    return NextResponse.json(await createCategory(body), { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
