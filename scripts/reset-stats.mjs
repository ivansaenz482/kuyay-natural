import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import dotenv from 'dotenv'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

dotenv.config({ path: join(root, '.env.local') })
dotenv.config({ path: join(root, '.env') })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('❌ Falta DATABASE_URL. Crea kuyay-next/.env.local con tu cadena de Neon.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
})

try {
  await pool.query('truncate table page_views restart identity')
  await pool.query('truncate table product_view_events restart identity')
  await pool.query('update products set views = 0, sales = 0')
  console.log('✅ Vistas de la pagina y productos comprados/vistos reiniciados a 0.')
  console.log('   (Los pedidos e ingresos no se modificaron.)')
} catch (error) {
  console.error('❌ Error al reiniciar estadisticas:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
