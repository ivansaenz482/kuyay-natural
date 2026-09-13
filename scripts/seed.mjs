import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import dotenv from 'dotenv'
import pg from 'pg'
import { betterAuth } from 'better-auth'
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_TESTIMONIALS } from '../data/catalog.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
dotenv.config({ path: join(root, '.env.local') })
dotenv.config({ path: join(root, '.env') })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('❌ Falta DATABASE_URL en kuyay-next/.env.local')
  process.exit(1)
}

const ssl = connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
const pool = new pg.Pool({ connectionString, ssl })

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@kuyaynatural.com'
  const password = process.env.ADMIN_PASSWORD || 'kuyay2026'
  const name = process.env.ADMIN_NAME || 'Administrador Kuyay'

  const auth = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET || 'seed-secret-kuyay',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    emailAndPassword: { enabled: true },
  })

  const existing = await pool.query('select id from "user" where email = $1', [email])
  if (existing.rowCount > 0) {
    console.log(`ℹ️  El administrador ${email} ya existe.`)
    return
  }

  await auth.api.signUpEmail({ body: { email, password, name } })
  console.log(`✅ Administrador creado: ${email}`)
}

async function seedCatalog() {
  const { rows: catRows } = await pool.query('select count(*)::int as n from categories')
  if (catRows[0].n === 0) {
    for (const c of SEED_CATEGORIES) {
      await pool.query(
        'insert into categories (name, slug, emoji, sort_order) values ($1,$2,$3,$4)',
        [c.name, c.slug, c.emoji, c.sort_order],
      )
    }
    console.log(`✅ ${SEED_CATEGORIES.length} categorías insertadas.`)
  } else {
    console.log('ℹ️  Las categorías ya tienen datos, no se insertaron.')
  }

  const { rows: catMap } = await pool.query('select id, slug from categories')
  const bySlug = Object.fromEntries(catMap.map((r) => [r.slug, r.id]))

  const { rows: prodRows } = await pool.query('select count(*)::int as n from products')
  if (prodRows[0].n === 0) {
    for (const p of SEED_PRODUCTS) {
      const { rows } = await pool.query(
        `insert into products
          (name, slug, category_id, price, old_price, unit, badge, rating, reviews, stock, sales, views, featured, short, description, benefits, ingredients)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         returning id`,
        [
          p.name, p.slug, bySlug[p.category] || null, p.price, p.old_price, p.unit, p.badge,
          p.rating, p.reviews, p.stock, p.sales, p.views, p.featured, p.short, p.description,
          p.benefits, p.ingredients,
        ],
      )
      const productId = rows[0].id
      for (let i = 0; i < p.images.length; i++) {
        await pool.query(
          'insert into product_images (product_id, url, position) values ($1,$2,$3)',
          [productId, p.images[i], i],
        )
      }
    }
    console.log(`✅ ${SEED_PRODUCTS.length} productos insertados con sus imágenes.`)
  } else {
    console.log('ℹ️  Los productos ya tienen datos, no se insertaron.')
  }
}

async function seedTestimonials() {
  const { rows } = await pool.query('select count(*)::int as n from testimonials')
  if (rows[0].n > 0) {
    console.log('ℹ️  Los testimonios ya tienen datos, no se insertaron.')
    return
  }
  for (const t of SEED_TESTIMONIALS) {
    await pool.query(
      `insert into testimonials (name, role, text, rating, sort_order)
       values ($1,$2,$3,$4,$5)`,
      [t.name, t.role, t.text, t.rating, t.sort_order],
    )
  }
  console.log(`✅ ${SEED_TESTIMONIALS.length} testimonios insertados.`)
}

try {
  await seedAdmin()
  await seedCatalog()
  await seedTestimonials()
  console.log('🌿 Seed completado.')
} catch (error) {
  console.error('❌ Error en el seed:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
