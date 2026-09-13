-- =====================================================================
--  Kuyay Natural - Tablas de la aplicacion (PostgreSQL / Neon)
--  Las tablas de Better Auth (user, session, account, verification)
--  se crean aparte con:  npm run auth:migrate
-- =====================================================================

create extension if not exists "pgcrypto";

-- --------------------------- Categorias ------------------------------
create table if not exists categories (
  id          serial primary key,
  name        text not null,
  slug        text not null unique,
  emoji       text default '🌿',
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------- Productos ------------------------------
create table if not exists products (
  id          serial primary key,
  name        text not null,
  slug        text not null unique,
  category_id integer references categories(id) on delete set null,
  price       numeric(10,2) not null default 0,
  old_price   numeric(10,2),
  unit        text,
  badge       text,
  rating      numeric(2,1) not null default 5.0,
  reviews     integer not null default 0,
  stock       integer not null default 0,
  sales       integer not null default 0,
  views       integer not null default 0,
  featured    boolean not null default false,
  active      boolean not null default true,
  short       text,
  description text,
  benefits    text[] not null default '{}',
  ingredients text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists products_category_idx on products(category_id);
create index if not exists products_featured_idx on products(featured);

-- ----------------------- Imagenes de producto ------------------------
create table if not exists product_images (
  id         serial primary key,
  product_id integer not null references products(id) on delete cascade,
  url        text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on product_images(product_id);

-- ------------------------------ Pedidos ------------------------------
create table if not exists orders (
  id             serial primary key,
  code           text not null unique,
  customer       jsonb not null,
  total          numeric(10,2) not null default 0,
  payment_method text not null check (payment_method in ('transferencia', 'efectivo', 'deuna', 'go')),
  status         text not null default 'pendiente',
  created_at     timestamptz not null default now()
);

-- Permite agregar metodos de pago nuevos en bases existentes
alter table orders drop constraint if exists orders_payment_method_check;
alter table orders add constraint orders_payment_method_check
  check (payment_method in ('transferencia', 'efectivo', 'deuna', 'go'));

create table if not exists order_items (
  id         serial primary key,
  order_id   integer not null references orders(id) on delete cascade,
  product_id integer,
  name       text not null,
  qty        integer not null default 1,
  price      numeric(10,2) not null default 0
);

create index if not exists order_items_order_idx on order_items(order_id);

-- --------------------------- Vistas de pagina ------------------------
create table if not exists page_views (
  id         bigserial primary key,
  path       text default '/',
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_idx on page_views(created_at);

-- ----------------------------- Testimonios ---------------------------
create table if not exists testimonials (
  id         serial primary key,
  name       text not null,
  role       text,
  text       text not null,
  rating     integer not null default 5,
  active     boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------- Ajustes de la tienda ----------------------
create table if not exists settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);
