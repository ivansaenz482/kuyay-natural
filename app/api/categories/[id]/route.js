import { NextResponse } from 'next/server'
import { updateCategory, deleteCategory } from '@/lib/repo'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'

export async function PUT(req, { params }) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    const body = await req.json()
    return NextResponse.json(await updateCategory(Number(params.id), body))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    await deleteCategory(Number(params.id))
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
