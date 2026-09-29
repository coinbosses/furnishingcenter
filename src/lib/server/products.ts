import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  seedBanners,
  seedCategories,
  seedHomeCatalog,
  seedProductById,
  seedProducts,
} from "@/lib/server/catalog-from-seed";
import type { Product } from "@/lib/types";

/**
 * Storefront catalog is served entirely from in-repo seed data.
 * No database / PGlite / Neon required for browsing, search, or product pages.
 */
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
  return seedCategories();
});

export const listBanners = createServerFn({ method: "GET" }).handler(async () => {
  return seedBanners();
});

export const listProducts = createServerFn({ method: "GET" })
  .validator((d: unknown) => listInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    return filterAndSortProducts(seedProducts(), data, seedCategories());
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    return seedProductById(data.id);
  });

export const relatedProducts = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string(), categoryId: z.string() }))
  .handler(async ({ data }) => {
    return seedProducts()
      .filter((p) => p.categoryId === data.categoryId && p.id !== data.id)
      .slice(0, 8);
  });

export const homeCatalog = createServerFn({ method: "GET" }).handler(async () => {
  return seedHomeCatalog();
});
