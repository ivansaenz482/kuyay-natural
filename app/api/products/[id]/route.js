import { NextResponse } from 'next/server'
import { getProductById, updateProduct, deleteProduct } from '@/lib/repo'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'

export async function GET(_req, { params }) {
  const product = await getProductById(Number(params.id))
  if (!product) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req, { params }) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    const body = await req.json()
    const product = await updateProduct(Number(params.id), body)
    if (!product) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    await deleteProduct(Number(params.id))
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
