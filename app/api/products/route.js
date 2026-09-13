import { NextResponse } from 'next/server'
import { listProducts, createProduct } from '@/lib/repo'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  try {
    const products = await listProducts({
      category: searchParams.get('category') || undefined,
      featured: searchParams.get('featured') === 'true',
      search: searchParams.get('q') || undefined,
      includeInactive: searchParams.get('all') === 'true',
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    const body = await req.json()
    if (!body.name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
    }
    const product = await createProduct(body)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
