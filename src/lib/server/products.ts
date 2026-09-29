import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { seedIfNeeded } from "@/lib/server/seed";
import { ADVANCED_IDS } from "@/lib/catalog-data";
import { mapBanner, mapCategory, mapProduct, type ProductRow } from "@/lib/server/map";

const listInput = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["featured", "price_asc", "price_desc", "newest", "name"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
  flag: z.enum(["featured", "bestseller", "newArrival", "specialOffer"]).optional(),
});

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  await seedIfNeeded();
  const sql = await getSql();
  const rows = await sql<Parameters<typeof mapCategory>[0]>`
    select id, parent_id, name, description, image_url, sort_order
    from categories order by sort_order, name
  `;
  return rows.map(mapCategory);
});

export const listBanners = createServerFn({ method: "GET" }).handler(async () => {
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
    await seedIfNeeded();
    const sql = await getSql();
    const rows = await sql<ProductRow>`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products
    `;
    let products = rows.map(mapProduct);

    if (data.category) {
      const cats = await sql<{ id: string; parent_id: string | null }>`select id, parent_id from categories`;
      const match = new Set<string>();
      match.add(data.category);
      for (const c of cats) {
        if (c.parent_id === data.category) match.add(c.id);
      }
      products = products.filter((p) => match.has(p.categoryId));
    }
    if (data.q?.trim()) {
      const q = data.q.trim().toLowerCase();
      const cats = await sql<{ id: string; name: string }>`select id, name from categories`;
      const catName = new Map(cats.map((c) => [c.id, c.name.toLowerCase()]));
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          (catName.get(p.categoryId) ?? "").includes(q),
      );
    }
    if (data.minPrice != null) products = products.filter((p) => p.price >= data.minPrice!);
    if (data.maxPrice != null) products = products.filter((p) => p.price <= data.maxPrice!);
    if (data.inStock) products = products.filter((p) => p.stock > 0);
    if (data.flag === "featured") products = products.filter((p) => p.featured);
    if (data.flag === "bestseller") products = products.filter((p) => p.bestseller);
    if (data.flag === "newArrival") products = products.filter((p) => p.newArrival);
    if (data.flag === "specialOffer") products = products.filter((p) => p.specialOffer);

    const sort = data.sort ?? "featured";
    products.sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (sort === "name") return a.name.localeCompare(b.name);
      const score = (p: typeof a) =>
        (p.featured ? 4 : 0) + (p.bestseller ? 2 : 0) + (p.newArrival ? 1 : 0);
      return score(b) - score(a) || a.name.localeCompare(b.name);
    });
    return products;
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
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
