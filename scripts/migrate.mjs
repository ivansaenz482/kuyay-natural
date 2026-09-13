import { readFileSync } from 'node:fs'
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

const sql = readFileSync(join(root, 'db', 'schema.sql'), 'utf8')
const authSql = readFileSync(join(root, 'db', 'auth-schema.sql'), 'utf8')
const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
})

try {
  await pool.query(authSql)
  await pool.query(sql)
  console.log('✅ Tablas de Better Auth y de la aplicacion creadas/actualizadas correctamente.')
} catch (error) {
  console.error('❌ Error al migrar:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
