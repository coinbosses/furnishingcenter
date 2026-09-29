import { r as createServerFn } from "./ssr.mjs";
import { b as getSql, t as ADVANCED_IDS } from "./catalog-data-087TMwXI.mjs";
import { d as seedIfNeeded, i as mapCategory, l as mapProduct, r as mapBanner, t as createServerRpc } from "./seed-D46pse2Z.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-CxMVDYDX.js
var listInput = object({
	category: string().optional(),
	q: string().optional(),
	sort: _enum([
		"featured",
		"price_asc",
		"price_desc",
		"newest",
		"name"
	]).optional(),
	minPrice: number().optional(),
	maxPrice: number().optional(),
	inStock: boolean().optional(),
	flag: _enum([
		"featured",
		"bestseller",
		"newArrival",
		"specialOffer"
	]).optional()
});
var listCategories_createServerFn_handler = createServerRpc({
	id: "1f27125c21b555e17b81b0e1f5d452735bf7800f98431cde6aae8979df56dbc4",
	name: "listCategories",
	filename: "src/lib/server/products.ts"
}, (opts) => listCategories.__executeServer(opts));
var listCategories = createServerFn({ method: "GET" }).handler(listCategories_createServerFn_handler, async () => {
	await seedIfNeeded();
	return (await (await getSql())`
    select id, parent_id, name, description, image_url, sort_order
    from categories order by sort_order, name
  `).map(mapCategory);
});
var listBanners_createServerFn_handler = createServerRpc({
	id: "477918193c1b67ab41129bf938ab15285270cbbf256e389e8e6751ea436320df",
	name: "listBanners",
	filename: "src/lib/server/products.ts"
}, (opts) => listBanners.__executeServer(opts));
var listBanners = createServerFn({ method: "GET" }).handler(listBanners_createServerFn_handler, async () => {
	await seedIfNeeded();
	return (await (await getSql())`
    select id, title, subtitle, image_url, cta_text, cta_href, sort_order, active
    from banners where active = true order by sort_order, id
  `).map(mapBanner);
});
var listProducts_createServerFn_handler = createServerRpc({
	id: "f77ecbd962621f24ca6b18b109613b9bc6bc68cd4fd61a81d59ee40c85f43786",
	name: "listProducts",
	filename: "src/lib/server/products.ts"
}, (opts) => listProducts.__executeServer(opts));
var listProducts = createServerFn({ method: "GET" }).validator((d) => listInput.parse(d ?? {})).handler(listProducts_createServerFn_handler, async ({ data }) => {
	await seedIfNeeded();
	const sql = await getSql();
	let products = (await sql`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products
    `).map(mapProduct);
	if (data.category) {
		const cats = await sql`select id, parent_id from categories`;
		const match = /* @__PURE__ */ new Set();
		match.add(data.category);
		for (const c of cats) if (c.parent_id === data.category) match.add(c.id);
		products = products.filter((p) => match.has(p.categoryId));
	}
	if (data.q?.trim()) {
		const q = data.q.trim().toLowerCase();
		const cats = await sql`select id, name from categories`;
		const catName = new Map(cats.map((c) => [c.id, c.name.toLowerCase()]));
		products = products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.material.toLowerCase().includes(q) || (catName.get(p.categoryId) ?? "").includes(q));
	}
	if (data.minPrice != null) products = products.filter((p) => p.price >= data.minPrice);
	if (data.maxPrice != null) products = products.filter((p) => p.price <= data.maxPrice);
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
		const score = (p) => (p.featured ? 4 : 0) + (p.bestseller ? 2 : 0) + (p.newArrival ? 1 : 0);
		return score(b) - score(a) || a.name.localeCompare(b.name);
	});
	return products;
});
var getProduct_createServerFn_handler = createServerRpc({
	id: "8ebc21f3eb1ce8393febc512eea25da64a0baaf5cbc8df794b278ff10393e8c5",
	name: "getProduct",
	filename: "src/lib/server/products.ts"
}, (opts) => getProduct.__executeServer(opts));
var getProduct = createServerFn({ method: "GET" }).validator(object({ id: string() })).handler(getProduct_createServerFn_handler, async ({ data }) => {
	await seedIfNeeded();
	const rows = await (await getSql())`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products where id = ${data.id} limit 1
    `;
	return rows[0] ? mapProduct(rows[0]) : null;
});
var relatedProducts_createServerFn_handler = createServerRpc({
	id: "a82955cd250d9379aca0a7ed27eccdc7ee2e5b4354af4a1c3c02fcc398bd3075",
	name: "relatedProducts",
	filename: "src/lib/server/products.ts"
}, (opts) => relatedProducts.__executeServer(opts));
var relatedProducts = createServerFn({ method: "GET" }).validator(object({
	id: string(),
	categoryId: string()
})).handler(relatedProducts_createServerFn_handler, async ({ data }) => {
	await seedIfNeeded();
	return (await (await getSql())`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products where category_id = ${data.categoryId} and id <> ${data.id}
    `).map(mapProduct).slice(0, 8);
});
var homeCatalog_createServerFn_handler = createServerRpc({
	id: "7f2de324b470bf87c0c1ceae3eee919a1688a6e7fedb2502e0bdc42c776af612",
	name: "homeCatalog",
	filename: "src/lib/server/products.ts"
}, (opts) => homeCatalog.__executeServer(opts));
var homeCatalog = createServerFn({ method: "GET" }).handler(homeCatalog_createServerFn_handler, async () => {
	await seedIfNeeded();
	const sql = await getSql();
	const [banners, categories, productRows] = await Promise.all([
		sql`
      select id, title, subtitle, image_url, cta_text, cta_href, sort_order, active
      from banners where active = true order by sort_order, id
    `,
		sql`
      select id, parent_id, name, description, image_url, sort_order
      from categories order by sort_order, name
    `,
		sql`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products
    `
	]);
	const products = productRows.map(mapProduct);
	const counts = {};
	for (const p of products) counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
	const advancedSet = new Set(ADVANCED_IDS);
	return {
		banners: banners.map(mapBanner),
		categories: categories.map(mapCategory),
		featured: products.filter((p) => p.featured),
		bestsellers: products.filter((p) => p.bestseller),
		newArrivals: products.filter((p) => p.newArrival),
		offers: products.filter((p) => p.specialOffer),
		recommended: products.filter((p) => p.featured || p.bestseller).slice(0, 8),
		advanced: products.filter((p) => advancedSet.has(p.id)),
		counts
	};
});
//#endregion
export { getProduct_createServerFn_handler, homeCatalog_createServerFn_handler, listBanners_createServerFn_handler, listCategories_createServerFn_handler, listProducts_createServerFn_handler, relatedProducts_createServerFn_handler };
