import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const QR = readFileSync(join(root, 'public', 'qr-kuyay.png'))
const LOGO = readFileSync(join(root, 'public', 'images', 'logo.jpeg'))

const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
const WA = '+593 96 759 8834'
const WEB = 'kuyay-natural.vercel.app'

function frame(o) {
  const { w, h, card, yTitle, yTag, yPide, yWa, yWeb, titleSize, tagSize, waSize, webSize } = o
  return `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0E2C1E"/>
        <stop offset="55%" stop-color="#123524"/>
        <stop offset="100%" stop-color="#2D6A4F"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#D4A017"/>
        <stop offset="100%" stop-color="#f2c14e"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <circle cx="${w - 90}" cy="120" r="${Math.round(w * 0.22)}" fill="#B7E4C7" opacity="0.10"/>
    <circle cx="90" cy="${h - 120}" r="${Math.round(w * 0.24)}" fill="#D4A017" opacity="0.10"/>
    <rect x="${card.x}" y="${card.y}" width="${card.w}" height="${card.h}" rx="${card.r}" fill="#FBF9F4"/>
    <rect x="${card.x}" y="${card.y}" width="${card.w}" height="${Math.round(card.h * 0.02)}" rx="${card.r}" fill="url(#gold)"/>
    <text x="${w / 2}" y="${yTitle}" text-anchor="middle" font-family="${FONT}" font-size="${titleSize}" font-weight="800" fill="#FFFFFF" letter-spacing="3">KUYAY NATURAL</text>
    <text x="${w / 2}" y="${yTag}" text-anchor="middle" font-family="${FONT}" font-size="${tagSize}" font-weight="600" fill="#B7E4C7" letter-spacing="6">100% HECHO CON AMOR</text>
    <text x="${w / 2}" y="${yPide}" text-anchor="middle" font-family="${FONT}" font-size="${waSize}" font-weight="800" fill="#FFFFFF">Pide por WhatsApp</text>
    <text x="${w / 2}" y="${yWa}" text-anchor="middle" font-family="${FONT}" font-size="${Math.round(waSize * 0.92)}" font-weight="700" fill="#B7E4C7">${WA}</text>
    <text x="${w / 2}" y="${yWeb}" text-anchor="middle" font-family="${FONT}" font-size="${webSize}" font-weight="600" fill="#FFFFFF" opacity="0.75">${WEB}</text>
  </svg>`
}

async function build({ out, w, h, card, qrSize, logoSize, logoY, ...rest }) {
  const bg = await sharp(Buffer.from(frame({ w, h, card, qrSize, logoSize, logoY, ...rest }))).png().toBuffer()
  const qr = await sharp(QR).resize(qrSize, qrSize).png().toBuffer()
  const logo = await sharp(LOGO).resize(logoSize, logoSize, { fit: 'cover' }).png().toBuffer()

  await sharp(bg)
    .composite([
      { input: qr, left: card.x + Math.round((card.w - qrSize) / 2), top: card.y + Math.round((card.h - qrSize) / 2) },
      { input: logo, left: Math.round((w - logoSize) / 2), top: logoY },
    ])
    .withMetadata({ density: 300 })
    .png()
    .toFile(join(root, 'public', out))

  console.log(`✅ ${out}`)
}

/* ---------- Postal 10 x 15 cm (300 dpi) ---------- */
await build({
  out: 'qr-kuyay-postal.png',
  w: 1181, h: 1772,
  logoSize: 220, logoY: 120,
  titleSize: 66, tagSize: 26,
  yTitle: 430, yTag: 486,
  card: { x: 150, y: 560, w: 881, h: 881, r: 64 },
  qrSize: 740,
  waSize: 38, webSize: 26,
  yPide: 1560, yWa: 1640, yWeb: 1712,
})

/* ---------- Flyer A5 148 x 210 mm (300 dpi) ---------- */
await build({
  out: 'qr-kuyay-a5.png',
  w: 1748, h: 2480,
  logoSize: 320, logoY: 170,
  titleSize: 104, tagSize: 40,
  yTitle: 610, yTag: 690,
  card: { x: 200, y: 790, w: 1348, h: 1180, r: 90 },
  qrSize: 1020,
  waSize: 58, webSize: 40,
  yPide: 2160, yWa: 2260, yWeb: 2360,
})

/* ---------- Sticker 10 x 12.7 cm (300 dpi) ---------- */
await build({
  out: 'qr-kuyay-sticker.png',
  w: 1181, h: 1500,
  logoSize: 180, logoY: 80,
  titleSize: 56, tagSize: 22,
  yTitle: 340, yTag: 384,
  card: { x: 120, y: 440, w: 941, h: 760, r: 64 },
  qrSize: 600,
  waSize: 32, webSize: 24,
  yPide: 1290, yWa: 1350, yWeb: 1410,
})

console.log('🖨️  Listo para imprimir (300 dpi).')
