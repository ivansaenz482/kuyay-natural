import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import QRCode from 'qrcode'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const URL = process.env.QR_URL || 'https://kuyay-natural.vercel.app'
const SIZE = 1600
const LOGO_SIZE = Math.round(SIZE * 0.22)
const PLATE_SIZE = LOGO_SIZE + Math.round(SIZE * 0.035)

// 1) Genera el QR (alta correccion de error para poder tapar el centro)
const qr = await QRCode.toBuffer(URL, {
  width: SIZE,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: { dark: '#123524', light: '#FFFFFF' },
})

// 2) Logo recortado en circulo/rounded
const logoRounded = await sharp(join(root, 'public', 'images', 'logo.jpeg'))
  .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'cover' })
  .composite([
    {
      input: Buffer.from(
        `<svg width="${LOGO_SIZE}" height="${LOGO_SIZE}"><rect width="${LOGO_SIZE}" height="${LOGO_SIZE}" rx="${Math.round(LOGO_SIZE * 0.22)}" fill="#fff"/></svg>`,
      ),
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer()

// 3) Placa blanca redondeada detras del logo
const plate = Buffer.from(
  `<svg width="${PLATE_SIZE}" height="${PLATE_SIZE}"><rect width="${PLATE_SIZE}" height="${PLATE_SIZE}" rx="${Math.round(PLATE_SIZE * 0.22)}" fill="#ffffff"/></svg>`,
)

await sharp(qr)
  .composite([
    { input: plate, gravity: 'center' },
    { input: logoRounded, gravity: 'center' },
  ])
  .png()
  .toFile(join(root, 'public', 'qr-kuyay.png'))

// 4) Version SVG (sin logo) por si la necesitas vectorial
await QRCode.toFile(join(root, 'public', 'qr-kuyay.svg'), URL, {
  margin: 2,
  errorCorrectionLevel: 'H',
  color: { dark: '#123524', light: '#FFFFFF' },
})

console.log(`✅ QR generado para ${URL}`)
console.log('   → public/qr-kuyay.png')
console.log('   → public/qr-kuyay.svg')
