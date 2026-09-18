import { NextResponse } from 'next/server'
import { getSettings, setSettings } from '@/lib/repo'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'

function defaults() {
  return {
    whatsapp_primary: process.env.NEXT_PUBLIC_WHATSAPP_PRIMARY || '593967598834',
    whatsapp_secondary: '',
    bank_accounts: JSON.stringify([
      {
        banco: process.env.NEXT_PUBLIC_BANK_NAME || 'Banco Pichincha',
        tipo: process.env.NEXT_PUBLIC_BANK_TYPE || 'Cuenta de Ahorros',
        numero: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '2200000000',
        titular: process.env.NEXT_PUBLIC_BANK_HOLDER || 'Kuyay Natural',
        identificacion: process.env.NEXT_PUBLIC_BANK_ID || '1790000000001',
      },
    ]),
    deuna_enabled: 'true',
    deuna_phone: '',
    deuna_link: '',
    deuna_note: 'Paga con DeUna escaneando o desde tu app.',
    go_enabled: 'true',
    go_phone: '',
    go_link: '',
    go_note: 'Paga con GO desde tu app.',
    social_instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '',
    social_facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '',
    social_tiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || '',
    social_youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '',
    social_x: process.env.NEXT_PUBLIC_SOCIAL_X || '',
    hero_price: '6.50',
    hero_image: '/images/kefir-natural.jpeg',
  }
}

function parseAccounts(raw, d) {
  try {
    const arr = JSON.parse(raw || '[]')
    if (Array.isArray(arr) && arr.length) return arr
  } catch {
    /* usa el fallback */
  }
  try {
    return JSON.parse(d.bank_accounts)
  } catch {
    return []
  }
}

function toPublic(map) {
  const d = defaults()
  const bool = (v) => v === undefined || v === null ? true : v === 'true' || v === true
  return {
    whatsappPrimary: map.whatsapp_primary || d.whatsapp_primary,
    whatsappSecondary: '',
    bankAccounts: parseAccounts(map.bank_accounts, d),
    payment: {
      deuna: {
        enabled: bool(map.deuna_enabled),
        phone: map.deuna_phone || d.deuna_phone,
        link: map.deuna_link || d.deuna_link,
        note: map.deuna_note || d.deuna_note,
      },
      go: {
        enabled: bool(map.go_enabled),
        phone: map.go_phone || d.go_phone,
        link: map.go_link || d.go_link,
        note: map.go_note || d.go_note,
      },
    },
    social: {
      instagram: map.social_instagram ?? d.social_instagram,
      facebook: map.social_facebook ?? d.social_facebook,
      tiktok: map.social_tiktok ?? d.social_tiktok,
      youtube: map.social_youtube ?? d.social_youtube,
      x: map.social_x ?? d.social_x,
    },
    hero: {
      price: map.hero_price ?? d.hero_price,
      image: map.hero_image || d.hero_image,
    },
  }
}

const onlyDigits = (v) => String(v || '').replace(/\D/g, '')

export async function GET() {
  try {
    return NextResponse.json(toPublic(await getSettings()))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    const body = await req.json()
    const entries = {}

    if (body.whatsappPrimary != null) entries.whatsapp_primary = onlyDigits(body.whatsappPrimary)
    entries.whatsapp_secondary = ''

    if (Array.isArray(body.bankAccounts)) {
      entries.bank_accounts = JSON.stringify(
        body.bankAccounts.map((a) => ({
          banco: String(a.banco || ''),
          tipo: String(a.tipo || ''),
          numero: String(a.numero || ''),
          titular: String(a.titular || ''),
          identificacion: String(a.identificacion || ''),
        })),
      )
    }

    if (body.deuna) {
      entries.deuna_enabled = body.deuna.enabled ? 'true' : 'false'
      entries.deuna_phone = onlyDigits(body.deuna.phone)
      entries.deuna_link = String(body.deuna.link || '').trim()
      entries.deuna_note = String(body.deuna.note || '').trim()
    }
    if (body.go) {
      entries.go_enabled = body.go.enabled ? 'true' : 'false'
      entries.go_phone = onlyDigits(body.go.phone)
      entries.go_link = String(body.go.link || '').trim()
      entries.go_note = String(body.go.note || '').trim()
    }

    if (body.socialInstagram != null) entries.social_instagram = String(body.socialInstagram).trim()
    if (body.socialFacebook != null) entries.social_facebook = String(body.socialFacebook).trim()
    if (body.socialTiktok != null) entries.social_tiktok = String(body.socialTiktok).trim()
    if (body.socialYoutube != null) entries.social_youtube = String(body.socialYoutube).trim()
    if (body.socialX != null) entries.social_x = String(body.socialX).trim()

    if (body.heroPrice != null) entries.hero_price = String(body.heroPrice).trim()
    if (body.heroImage != null) entries.hero_image = String(body.heroImage).trim()

    await setSettings(entries)
    return NextResponse.json(toPublic(await getSettings()))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
