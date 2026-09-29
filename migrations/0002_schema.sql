create table if not exists categories (
  id text primary key,
  parent_id text references categories(id) on delete cascade,
  name text not null,
  description text not null default '',
  image_url text not null default '',
  sort_order int not null default 0
);

create table if not exists products (
  id text primary key,
  category_id text not null references categories(id),
  name text not null,
  description text not null default '',
  price integer not null,
  compare_at integer,
  images jsonb not null default '[]',
  specs jsonb not null default '{}',
  colors jsonb not null default '[]',
  sizes jsonb not null default '[]',
  dimensions text not null default '',
  material text not null default '',
  stock integer not null default 0,
  warranty text not null default '',
  delivery_info text not null default '',
  featured boolean not null default false,
  bestseller boolean not null default false,
  new_arrival boolean not null default false,
  special_offer boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category_id);
create index if not exists products_featured_idx on products (featured);

create table if not exists banners (
  id serial primary key,
  title text not null,
  subtitle text not null default '',
  image_url text not null,
  cta_text text not null default 'Shop now',
  cta_href text not null default '/categories',
  sort_order int not null default 0,
  active boolean not null default true
);

create table if not exists profiles (
  user_id text primary key,
  full_name text not null default '',
  phone text not null default '',
  email text not null default '',
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists addresses (
  id text primary key,
  user_id text not null,
  label text not null default 'Home',
  full_name text not null,
  phone text not null,
  street text not null,
  area text not null default '',
  city text not null default 'Abuja',
  state text not null default 'FCT',
  is_default boolean not null default false
);
create index if not exists addresses_user_idx on addresses (user_id);

create table if not exists wishlist (
  user_id text not null,
  product_id text not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists orders (
  id text primary key,
  user_id text not null,
  status text not null default 'pending',
  fulfillment text not null,
  address_snapshot jsonb,
  payment_method text not null,
  payment_status text not null default 'pending',
  subtotal integer not null,
  delivery_fee integer not null default 0,
  total integer not null,
  notes text not null default '',
  customer_name text not null default '',
  customer_phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on orders (user_id);
create index if not exists orders_status_idx on orders (status);

create table if not exists order_items (
  id serial primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  image_url text not null default '',
  unit_price integer not null,
  quantity integer not null,
  color text,
  size text
);

create table if not exists order_events (
  id serial primary key,
  order_id text not null references orders(id) on delete cascade,
  status text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists inquiries (
  id serial primary key,
  user_id text not null,
  product_id text,
  kind text not null,
  message text not null,
  phone text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id serial primary key,
  user_id text not null,
  title text not null,
  body text not null,
  href text not null default '',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on notifications (user_id);

create table if not exists store_meta (
  key text primary key,
  value text not null
);
