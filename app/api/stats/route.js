import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isAdmin, unauthorized } from '@/lib/guard'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  if (!(await isAdmin(req))) return unauthorized()
  try {
    const [totalViews, todayViews, weekViews, revenue, ordersCount, productsCount] =
      await Promise.all([
        query('select count(*)::int as n from page_views'),
        query("select count(*)::int as n from page_views where created_at >= date_trunc('day', now())"),
        query("select count(*)::int as n from page_views where created_at >= now() - interval '7 days'"),
        query('select coalesce(sum(total),0) as n from orders'),
        query('select count(*)::int as n from orders'),
        query('select count(*)::int as n from products where active = true'),
      ])

    const daily = await query(
      `select to_char(d.day, 'YYYY-MM-DD') as date,
              coalesce(count(pv.id), 0)::int as views
       from generate_series(
         date_trunc('day', now()) - interval '6 days',
         date_trunc('day', now()),
         interval '1 day'
       ) as d(day)
       left join page_views pv on date_trunc('day', pv.created_at) = d.day
       group by d.day
       order by d.day`,
    )

    const topSold = await query(
      `select p.id, p.name, p.sales, p.views,
              coalesce((select url from product_images pi where pi.product_id = p.id order by position limit 1), '') as image
       from products p order by p.sales desc limit 6`,
    )

    const topViewed = await query(
      `select p.id, p.name, p.sales, p.views,
              coalesce((select url from product_images pi where pi.product_id = p.id order by position limit 1), '') as image
       from products p order by p.views desc limit 6`,
    )

    const recentOrders = await query(
      `select code, customer, total, payment_method, status, created_at
       from orders order by created_at desc limit 8`,
    )

    return NextResponse.json({
      totalViews: totalViews.rows[0].n,
      todayViews: todayViews.rows[0].n,
      weekViews: weekViews.rows[0].n,
      revenue: Number(revenue.rows[0].n),
      ordersCount: ordersCount.rows[0].n,
      productsCount: productsCount.rows[0].n,
      daily: daily.rows.map((r) => ({ date: r.date, views: r.views })),
      topSold: topSold.rows.map((r) => ({ ...r, sales: Number(r.sales), views: Number(r.views) })),
      topViewed: topViewed.rows.map((r) => ({ ...r, sales: Number(r.sales), views: Number(r.views) })),
      recentOrders: recentOrders.rows.map((r) => ({
        id: r.code,
        customer: r.customer,
        total: Number(r.total),
        paymentMethod: r.payment_method,
        status: r.status,
        createdAt: r.created_at,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
