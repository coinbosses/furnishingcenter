import { getSql } from "@/lib/db";
import { CATALOG_VERSION, PRODUCT_DELIVERY, SEED_BANNERS, SEED_CATEGORIES, SEED_PRODUCTS } from "@/lib/catalog-data";
// Reseed when CATALOG_VERSION changes. Version 8 adds the Nigerian floor.

let chain: Promise<void> | null = null;
let seededFor: string | null = null;

export function seedIfNeeded(): Promise<void> {
  if (chain && seededFor === CATALOG_VERSION) return chain;
  seededFor = CATALOG_VERSION;
  chain = doSeed().catch((err) => {
    chain = null;
    seededFor = null;
    throw err;
  });
  return chain;
}

async function doSeed() {
  const sql = await getSql();
  const marked = await sql<{ value: string }>`select value from store_meta where key = 'catalog_version'`;
  if (marked[0]?.value === CATALOG_VERSION) return;

  const parents = SEED_CATEGORIES.filter((c) => !c.parentId);
  const children = SEED_CATEGORIES.filter((c) => c.parentId);
  for (const c of [...parents, ...children]) {
    await sql.query(
      `insert into categories (id, parent_id, name, description, image_url, sort_order)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (id) do update set
         parent_id = excluded.parent_id,
         name = excluded.name,
         description = excluded.description,
         image_url = excluded.image_url,
         sort_order = excluded.sort_order`,
      [c.id, c.parentId, c.name, c.description, c.imageUrl, c.sortOrder],
    );
  }

  const ids = SEED_PRODUCTS.map((p) => p.id);
  for (const p of SEED_PRODUCTS) {
    await sql.query(
      `insert into products (
        id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
        dimensions, material, stock, warranty, delivery_info, featured, bestseller, new_arrival, special_offer
      ) values (
        $1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9::jsonb,$10::jsonb,
        $11,$12,$13,$14,$15,$16,$17,$18,$19
      ) on conflict (id) do update set
        category_id = excluded.category_id,
        name = excluded.name,
        description = excluded.description,
        price = excluded.price,
        compare_at = excluded.compare_at,
        images = excluded.images,
        specs = excluded.specs,
        colors = excluded.colors,
        sizes = excluded.sizes,
        dimensions = excluded.dimensions,
        material = excluded.material,
        stock = excluded.stock,
        warranty = excluded.warranty,
        delivery_info = excluded.delivery_info,
        featured = excluded.featured,
        bestseller = excluded.bestseller,
        new_arrival = excluded.new_arrival,
        special_offer = excluded.special_offer`,
      [
        p.id,
        p.categoryId,
        p.name,
        p.description,
        p.price,
        p.compareAt ?? null,
        JSON.stringify(p.images),
        JSON.stringify(p.specs),
        JSON.stringify(p.colors),
        JSON.stringify(p.sizes),
        p.dimensions,
        p.material,
        p.stock,
        p.warranty,
        PRODUCT_DELIVERY,
        p.featured ?? false,
        p.bestseller ?? false,
        p.newArrival ?? false,
        p.specialOffer ?? false,
      ],
    );
  }

  await sql.query(
    `delete from products where not (id = any($1::text[]))
       and id not in (select product_id from order_items)
       and id not in (select product_id from wishlist)`,
    [ids],
  );

  await sql`delete from banners`;
  for (const b of SEED_BANNERS) {
    await sql.query(
      `insert into banners (title, subtitle, image_url, cta_text, cta_href, sort_order, active)
       values ($1,$2,$3,$4,$5,$6,true)`,
      [b.title, b.subtitle, b.imageUrl, b.ctaText, b.ctaHref, b.sortOrder],
    );
  }

  await sql.query(
    `insert into store_meta (key, value) values ('catalog_version', $1)
     on conflict (key) do update set value = excluded.value`,
    [CATALOG_VERSION],
  );
}
