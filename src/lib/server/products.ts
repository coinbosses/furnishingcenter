import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { dbSource, getSql } from "@/lib/db";
import { seedIfNeeded } from "@/lib/server/seed";
import { ADVANCED_IDS } from "@/lib/catalog-data";
import { mapBanner, mapCategory, mapProduct, type ProductRow } from "@/lib/server/map";
import {
  seedBanners,
  seedCategories,
  seedHomeCatalog,
  seedProductById,
  seedProducts,
} from "@/lib/server/catalog-from-seed";
import type { Product } from "@/lib/types";

/**
 * Always serve catalog from in-repo seed data when:
 * - no external Postgres (dbSource === "pglite"), OR
 * - running on Vercel/Lambda (PGlite WASM assets are missing from the bundle)
 * Never open PGlite on serverless — it crashes with ENOENT pglite.data.
 */
const useSeedCatalog =
  dbSource === "pglite" ||
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

const listInput = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["featured", "price_asc", "price_desc", "newest", "name"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
  flag: z.enum(["featured", "bestseller", "newArrival", "specialOffer"]).optional(),
});

function filterAndSortProducts(
  products: Product[],
  data: z.infer<typeof listInput>,
  categories: { id: string; parentId: string | null; name: string }[],
): Product[] {
  let list = [...products];

  if (data.category) {
    const match = new Set<string>();
    match.add(data.category);
    for (const c of categories) {
      if (c.parentId === data.category) match.add(c.id);
    }
    list = list.filter((p) => match.has(p.categoryId));
  }
  if (data.q?.trim()) {
    const q = data.q.trim().toLowerCase();
    const catName = new Map(categories.map((c) => [c.id, c.name.toLowerCase()]));
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        (catName.get(p.categoryId) ?? "").includes(q),
    );
  }
  if (data.minPrice != null) list = list.filter((p) => p.price >= data.minPrice!);
  if (data.maxPrice != null) list = list.filter((p) => p.price <= data.maxPrice!);
  if (data.inStock) list = list.filter((p) => p.stock > 0);
  if (data.flag === "featured") list = list.filter((p) => p.featured);
  if (data.flag === "bestseller") list = list.filter((p) => p.bestseller);
  if (data.flag === "newArrival") list = list.filter((p) => p.newArrival);
  if (data.flag === "specialOffer") list = list.filter((p) => p.specialOffer);

  const sort = data.sort ?? "featured";
  list.sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
    if (sort === "name") return a.name.localeCompare(b.name);
    const score = (p: typeof a) =>
      (p.featured ? 4 : 0) + (p.bestseller ? 2 : 0) + (p.newArrival ? 1 : 0);
    return score(b) - score(a) || a.name.localeCompare(b.name);
  });
  return list;
}

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  if (useSeedCatalog) return seedCategories();
  await seedIfNeeded();
  const sql = await getSql();
  const rows = await sql<Parameters<typeof mapCategory>[0]>`
    select id, parent_id, name, description, image_url, sort_order
    from categories order by sort_order, name
  `;
  return rows.map(mapCategory);
});

export const listBanners = createServerFn({ method: "GET" }).handler(async () => {
  if (useSeedCatalog) return seedBanners();
  await seedIfNeeded();
  const sql = await getSql();
  const rows = await sql<Parameters<typeof mapBanner>[0]>`
    select id, title, subtitle, image_url, cta_text, cta_href, sort_order, active
    from banners where active = true order by sort_order, id
  `;
  return rows.map(mapBanner);
});

export const listProducts = createServerFn({ method: "GET" })
  .validator((d: unknown) => listInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    if (useSeedCatalog) {
      return filterAndSortProducts(seedProducts(), data, seedCategories());
    }
    await seedIfNeeded();
    const sql = await getSql();
    const rows = await sql<ProductRow>`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products
    `;
    const products = rows.map(mapProduct);
    const cats = await sql<{ id: string; parent_id: string | null; name: string }>`
      select id, parent_id, name from categories
    `;
    return filterAndSortProducts(
      products,
      data,
      cats.map((c) => ({ id: c.id, parentId: c.parent_id, name: c.name })),
    );
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    if (useSeedCatalog) return seedProductById(data.id);
    await seedIfNeeded();
    const sql = await getSql();
    const rows = await sql<ProductRow>`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products where id = ${data.id} limit 1
    `;
    return rows[0] ? mapProduct(rows[0]) : null;
  });

export const relatedProducts = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string(), categoryId: z.string() }))
  .handler(async ({ data }) => {
    if (useSeedCatalog) {
      return seedProducts()
        .filter((p) => p.categoryId === data.categoryId && p.id !== data.id)
        .slice(0, 8);
    }
    await seedIfNeeded();
    const sql = await getSql();
    const rows = await sql<ProductRow>`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products where category_id = ${data.categoryId} and id <> ${data.id}
    `;
    return rows.map(mapProduct).slice(0, 8);
  });

export const homeCatalog = createServerFn({ method: "GET" }).handler(async () => {
  if (useSeedCatalog) return seedHomeCatalog();
  await seedIfNeeded();
  const sql = await getSql();
  const [banners, categories, productRows] = await Promise.all([
    sql<Parameters<typeof mapBanner>[0]>`
      select id, title, subtitle, image_url, cta_text, cta_href, sort_order, active
      from banners where active = true order by sort_order, id
    `,
    sql<Parameters<typeof mapCategory>[0]>`
      select id, parent_id, name, description, image_url, sort_order
      from categories order by sort_order, name
    `,
    sql<ProductRow>`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products
    `,
  ]);
  const products = productRows.map(mapProduct);
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
  const advancedSet = new Set<string>(ADVANCED_IDS);
  return {
    banners: banners.map(mapBanner),
    categories: categories.map(mapCategory),
    featured: products.filter((p) => p.featured),
    bestsellers: products.filter((p) => p.bestseller),
    newArrivals: products.filter((p) => p.newArrival),
    offers: products.filter((p) => p.specialOffer),
    recommended: products.filter((p) => p.featured || p.bestseller).slice(0, 8),
    advanced: products.filter((p) => advancedSet.has(p.id)),
    counts,
  };
});
