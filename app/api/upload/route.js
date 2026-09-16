import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']

export async function POST(req) {
  if (!(await isAdmin(req))) return unauthorized()

  try {
    const form = await req.formData()
    const files = form.getAll('files').length ? form.getAll('files') : [form.get('file')].filter(Boolean)
    if (!files.length) return NextResponse.json({ error: 'No se recibió ninguna imagen' }, { status: 400 })

    const folder = form.get('folder') || 'productos'

    const urls = []

    for (const file of files) {
      if (!(file instanceof File)) continue
      if (!ALLOWED.includes(file.type)) {
        return NextResponse.json(
          { error: `Formato no permitido: ${file.type}` },
          { status: 400 },
        )
      }
      if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json({ error: 'Cada imagen debe pesar menos de 8MB' }, { status: 400 })
      }

      const bytes = Buffer.from(await file.arrayBuffer())
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const { put } = await import('@vercel/blob')
        const blob = await put(safeName, bytes, {
          access: 'public',
          contentType: file.type,
          token: process.env.BLOB_READ_WRITE_TOKEN,
          addRandomSuffix: false,
        })
        urls.push(blob.url)
      } else {
        // Fallback solo para desarrollo local (Vercel usa Blob)
        const dir = path.join(process.cwd(), 'public', 'uploads')
        await mkdir(dir, { recursive: true })
        const localName = path.basename(safeName)
        await writeFile(path.join(dir, localName), bytes)
        urls.push(`/uploads/${localName}`)
      }
    }

    return NextResponse.json({ urls })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
