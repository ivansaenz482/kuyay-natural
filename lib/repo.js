import { query } from './db'

export function mapProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category_slug || null,
    categoryId: row.category_id,
    categoryName: row.category_name || null,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    unit: row.unit,
    badge: row.badge,
    rating: Number(row.rating ?? 5),
    reviews: Number(row.reviews ?? 0),
    stock: Number(row.stock ?? 0),
    sales: Number(row.sales ?? 0),
    views: Number(row.views ?? 0),
    featured: Boolean(row.featured),
    active: row.active !== false,
    short: row.short,
    description: row.description,
    benefits: row.benefits || [],
    ingredients: row.ingredients,
    images: Array.isArray(row.images) ? row.images : [],
    createdAt: row.created_at,
  }
}

const BASE_SELECT = `
  select p.*, c.name as category_name, c.slug as category_slug,
    coalesce(
      json_agg(pi.url order by pi.position) filter (where pi.id is not null),
      '[]'
    ) as images
  from products p
  left join categories c on c.id = p.category_id
  left join product_images pi on pi.product_id = p.id
`

export async function listProducts({ category, featured, search, includeInactive = false } = {}) {
  const where = []
  const params = []
  if (!includeInactive) where.push('p.active = true')
  if (category && category !== 'all') {
    params.push(category)
    where.push(`c.slug = $${params.length}`)
  }
  if (featured) where.push('p.featured = true')
  if (search) {
    params.push(`%${search}%`)
    where.push(`(p.name ilike $${params.length} or p.short ilike $${params.length})`)
  }
  const sql = `${BASE_SELECT}
    ${where.length ? 'where ' + where.join(' and ') : ''}
    group by p.id, c.name, c.slug
    order by p.featured desc, p.created_at asc`
  const { rows } = await query(sql, params)
  return rows.map(mapProduct)
}

export async function getProductBySlug(slug) {
  const { rows } = await query(
    `${BASE_SELECT} where p.slug = $1 group by p.id, c.name, c.slug limit 1`,
    [slug],
  )
  return mapProduct(rows[0])
}

export async function getProductById(id) {
  const { rows } = await query(
    `${BASE_SELECT} where p.id = $1 group by p.id, c.name, c.slug limit 1`,
    [id],
  )
  return mapProduct(rows[0])
}

export async function listCategories() {
  const { rows } = await query(
    `select c.*, (select count(*)::int from products p where p.category_id = c.id) as product_count
     from categories c order by c.sort_order asc, c.name asc`,
  )
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    emoji: r.emoji,
    description: r.description,
    sortOrder: r.sort_order,
    productCount: r.product_count,
  }))
}

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export { slugify }

export async function saveProductImages(productId, images = []) {
  await query('delete from product_images where product_id = $1', [productId])
  for (let i = 0; i < images.length; i++) {
    if (!images[i]) continue
    await query(
      'insert into product_images (product_id, url, position) values ($1,$2,$3)',
      [productId, images[i], i],
    )
  }
}

export async function createProduct(data) {
  const slug = data.slug || slugify(data.name)
  const { rows } = await query(
    `insert into products
      (name, slug, category_id, price, old_price, unit, badge, rating, reviews, stock, sales, views, featured, active, short, description, benefits, ingredients)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
     returning id`,
    [
      data.name, slug, data.categoryId || null, data.price || 0, data.oldPrice || null,
      data.unit || null, data.badge || null, data.rating ?? 5, data.reviews ?? 0,
      data.stock ?? 0, data.sales ?? 0, data.views ?? 0, Boolean(data.featured),
      data.active !== false, data.short || null, data.description || null,
      data.benefits || [], data.ingredients || null,
    ],
  )
  await saveProductImages(rows[0].id, data.images || [])
  return getProductById(rows[0].id)
}

export async function updateProduct(id, data) {
  await query(
    `update products set
      name = $1, slug = $2, category_id = $3, price = $4, old_price = $5, unit = $6,
      badge = $7, rating = $8, reviews = $9, stock = $10, sales = $11, views = $12,
      featured = $13, active = $14, short = $15, description = $16, benefits = $17,
      ingredients = $18, updated_at = now()
     where id = $19`,
    [
      data.name, data.slug || slugify(data.name), data.categoryId || null, data.price || 0,
      data.oldPrice || null, data.unit || null, data.badge || null, data.rating ?? 5,
      data.reviews ?? 0, data.stock ?? 0, data.sales ?? 0, data.views ?? 0,
      Boolean(data.featured), data.active !== false, data.short || null,
      data.description || null, data.benefits || [], data.ingredients || null, id,
    ],
  )
  if (Array.isArray(data.images)) await saveProductImages(id, data.images)
  return getProductById(id)
}

export async function deleteProduct(id) {
  await query('delete from products where id = $1', [id])
}

export async function incrementProductView(id) {
  await query('update products set views = views + 1 where id = $1', [id])
}

export async function createCategory(data) {
  const slug = data.slug || slugify(data.name)
  const { rows } = await query(
    `insert into categories (name, slug, emoji, description, sort_order)
     values ($1,$2,$3,$4,$5) returning *`,
    [data.name, slug, data.emoji || '🌿', data.description || null, data.sortOrder ?? 0],
  )
  return rows[0]
}

export async function updateCategory(id, data) {
  const { rows } = await query(
    `update categories set name=$1, slug=$2, emoji=$3, description=$4, sort_order=$5
     where id=$6 returning *`,
    [
      data.name, data.slug || slugify(data.name), data.emoji || '🌿',
      data.description || null, data.sortOrder ?? 0, id,
    ],
  )
  return rows[0]
}

export async function deleteCategory(id) {
  await query('delete from categories where id = $1', [id])
}

/* --------------------------- Testimonios --------------------------- */

export function mapTestimonial(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    text: row.text,
    rating: Number(row.rating ?? 5),
    active: row.active !== false,
    sortOrder: row.sort_order ?? 0,
    imageUrl: row.image_url,
  }
}

export async function listTestimonials({ includeInactive = false } = {}) {
  const { rows } = await query(
    `select * from testimonials
     ${includeInactive ? '' : 'where active = true'}
     order by sort_order asc, created_at asc`,
  )
  return rows.map(mapTestimonial)
}

export async function createTestimonial(data) {
  const { rows } = await query(
    `insert into testimonials (name, role, text, rating, active, sort_order, image_url)
     values ($1,$2,$3,$4,$5,$6,$7) returning *`,
    [data.name, data.role || null, data.text, Number(data.rating) || 5, data.active !== false, Number(data.sortOrder) || 0, data.image_url || null],
  )
  return mapTestimonial(rows[0])
}

export async function updateTestimonial(id, data) {
  const { rows } = await query(
    `update testimonials set name=$1, role=$2, text=$3, rating=$4, active=$5, sort_order=$6, image_url=$7
     where id=$8 returning *`,
    [data.name, data.role || null, data.text, Number(data.rating) || 5, data.active !== false, Number(data.sortOrder) || 0, data.image_url || null, id],
  )
  return mapTestimonial(rows[0])
}

export async function deleteTestimonial(id) {
  await query('delete from testimonials where id = $1', [id])
}

/* --------------------------- Ajustes ------------------------------- */

export async function getSettings() {
  const { rows } = await query('select key, value from settings')
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function setSettings(entries) {
  for (const [key, value] of Object.entries(entries)) {
    await query(
      `insert into settings (key, value, updated_at) values ($1, $2, now())
       on conflict (key) do update set value = excluded.value, updated_at = now()`,
      [key, value],
    )
  }
}

/* ----------------------------- Pedidos ------------------------------ */

export async function updateOrderStatus(id, status) {
  const { rows } = await query(
    `update orders set status = $1 where id = $2 returning code, status`,
    [status, id],
  )
  return rows[0]
}

export async function getOrderByCode(code) {
  const { rows } = await query(
    `select o.code, o.customer, o.total, o.payment_method, o.status, o.created_at,
            coalesce(json_agg(json_build_object('name', oi.name, 'qty', oi.qty, 'price', oi.price)) filter (where oi.id is not null), '[]') as items
     from orders o
     left join order_items oi on oi.order_id = o.id
     where upper(o.code) = upper($1)
     group by o.id`,
    [code],
  )
  if (!rows[0]) return null
  const r = rows[0]
  return {
    id: r.code,
    customer: { name: r.customer?.name, city: r.customer?.city },
    items: r.items,
    total: Number(r.total),
    paymentMethod: r.payment_method,
    status: r.status,
    createdAt: r.created_at,
  }
}
