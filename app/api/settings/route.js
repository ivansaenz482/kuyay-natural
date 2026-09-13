import { NextResponse } from 'next/server'
import { getSettings, setSettings } from '@/lib/repo'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'

function defaults() {
  return {
    whatsapp_primary: process.env.NEXT_PUBLIC_WHATSAPP_PRIMARY || '593991028834',
    whatsapp_secondary: process.env.NEXT_PUBLIC_WHATSAPP_SECONDARY || '593994395266',
    bank_name: process.env.NEXT_PUBLIC_BANK_NAME || 'Banco Pichincha',
    bank_type: process.env.NEXT_PUBLIC_BANK_TYPE || 'Cuenta de Ahorros',
    bank_account: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '2200000000',
    bank_holder: process.env.NEXT_PUBLIC_BANK_HOLDER || 'Kuyay Natural',
    bank_id: process.env.NEXT_PUBLIC_BANK_ID || '1790000000001',
    social_instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '',
    social_facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '',
    social_tiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || '',
    social_youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '',
    social_x: process.env.NEXT_PUBLIC_SOCIAL_X || '',
  }
}

function toPublic(map) {
  const d = defaults()
  return {
    whatsappPrimary: map.whatsapp_primary || d.whatsapp_primary,
    whatsappSecondary: map.whatsapp_secondary || d.whatsapp_secondary,
    bank: {
      banco: map.bank_name || d.bank_name,
      tipo: map.bank_type || d.bank_type,
      numero: map.bank_account || d.bank_account,
      titular: map.bank_holder || d.bank_holder,
      identificacion: map.bank_id || d.bank_id,
    },
    social: {
      instagram: map.social_instagram ?? d.social_instagram,
      facebook: map.social_facebook ?? d.social_facebook,
      tiktok: map.social_tiktok ?? d.social_tiktok,
      youtube: map.social_youtube ?? d.social_youtube,
      x: map.social_x ?? d.social_x,
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
    if (body.whatsappSecondary != null) entries.whatsapp_secondary = onlyDigits(body.whatsappSecondary)
    if (body.bankName != null) entries.bank_name = String(body.bankName)
    if (body.bankType != null) entries.bank_type = String(body.bankType)
    if (body.bankAccount != null) entries.bank_account = String(body.bankAccount)
    if (body.bankHolder != null) entries.bank_holder = String(body.bankHolder)
    if (body.bankId != null) entries.bank_id = String(body.bankId)
    if (body.socialInstagram != null) entries.social_instagram = String(body.socialInstagram).trim()
    if (body.socialFacebook != null) entries.social_facebook = String(body.socialFacebook).trim()
    if (body.socialTiktok != null) entries.social_tiktok = String(body.socialTiktok).trim()
    if (body.socialYoutube != null) entries.social_youtube = String(body.socialYoutube).trim()
    if (body.socialX != null) entries.social_x = String(body.socialX).trim()
    await setSettings(entries)
    return NextResponse.json(toPublic(await getSettings()))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
