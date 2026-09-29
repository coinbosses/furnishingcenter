/**
 * Catalog served from in-repo seed data (no database required).
 * Used on Vercel when DATABASE_URL is not set so the store stays online
 * without depending on PGlite WASM assets in the serverless bundle.
 */
import {
  ADVANCED_IDS,
  PRODUCT_DELIVERY,
  SEED_BANNERS,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
} from "@/lib/catalog-data";
import { DEFAULT_DELIVERY } from "@/lib/constants";
import type { Banner, Category, Product } from "@/lib/types";

const CREATED_AT = "2026-01-01T00:00:00.000Z";

export function seedCategories(): Category[] {
  return SEED_CATEGORIES.map((c) => ({
    id: c.id,
    parentId: c.parentId,
    name: c.name,
    description: c.description,
    imageUrl: c.imageUrl,
    sortOrder: c.sortOrder,
  })).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function seedBanners(): Banner[] {
  return SEED_BANNERS.map((b, i) => ({
    id: i + 1,
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.imageUrl,
    ctaText: b.ctaText,
    ctaHref: b.ctaHref,
    sortOrder: i,
    active: true,
  }));
}

export function seedProducts(): Product[] {
  return SEED_PRODUCTS.map((p) => ({
    id: p.id,
    categoryId: p.categoryId,
    name: p.name,
    description: p.description,
    price: p.price,
    compareAt: p.compareAt ?? null,
    images: p.images,
    specs: p.specs,
    colors: p.colors,
    sizes: p.sizes,
    dimensions: p.dimensions,
    material: p.material,
    stock: p.stock,
    warranty: p.warranty,
    deliveryInfo: PRODUCT_DELIVERY[p.id] ?? DEFAULT_DELIVERY,
    featured: Boolean(p.featured),
    bestseller: Boolean(p.bestseller),
    newArrival: Boolean(p.newArrival),
    specialOffer: Boolean(p.specialOffer),
    createdAt: CREATED_AT,
  }));
}

export function seedProductById(id: string): Product | null {
  return seedProducts().find((p) => p.id === id) ?? null;
}

export function seedHomeCatalog() {
  const products = seedProducts();
  const categories = seedCategories();
  const banners = seedBanners();
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
  const advancedSet = new Set<string>(ADVANCED_IDS);
  return {
    banners,
    categories,
    featured: products.filter((p) => p.featured),
    bestsellers: products.filter((p) => p.bestseller),
    newArrivals: products.filter((p) => p.newArrival),
    offers: products.filter((p) => p.specialOffer),
    recommended: products.filter((p) => p.featured || p.bestseller).slice(0, 8),
    advanced: products.filter((p) => advancedSet.has(p.id)),
    counts,
  };
}
