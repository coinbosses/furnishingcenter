import { i as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { b as getSql, d as SEED_CATEGORIES, f as SEED_PRODUCTS, h as asJson, l as PRODUCT_DELIVERY, r as CATALOG_VERSION, u as SEED_BANNERS } from "./catalog-data-087TMwXI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seed-D46pse2Z.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function mapProduct(row) {
	return {
		id: row.id,
		categoryId: row.category_id,
		name: row.name,
		description: row.description,
		price: Number(row.price),
		compareAt: row.compare_at == null ? null : Number(row.compare_at),
		images: asJson(row.images, []),
		specs: asJson(row.specs, {}),
		colors: asJson(row.colors, []),
		sizes: asJson(row.sizes, []),
		dimensions: row.dimensions,
		material: row.material,
		stock: Number(row.stock),
		warranty: row.warranty,
		deliveryInfo: row.delivery_info,
		featured: Boolean(row.featured),
		bestseller: Boolean(row.bestseller),
		newArrival: Boolean(row.new_arrival),
		specialOffer: Boolean(row.special_offer),
		createdAt: String(row.created_at)
	};
}
function mapCategory(row) {
	return {
		id: row.id,
		parentId: row.parent_id,
		name: row.name,
		description: row.description,
		imageUrl: row.image_url,
		sortOrder: Number(row.sort_order)
	};
}
function mapBanner(row) {
	return {
		id: Number(row.id),
		title: row.title,
		subtitle: row.subtitle,
		imageUrl: row.image_url,
		ctaText: row.cta_text,
		ctaHref: row.cta_href,
		sortOrder: Number(row.sort_order),
		active: Boolean(row.active)
	};
}
function mapProfile(row) {
	return {
		userId: row.user_id,
		fullName: row.full_name,
		phone: row.phone,
		email: row.email,
		role: row.role === "admin" ? "admin" : "customer"
	};
}
function mapAddress(row) {
	return {
		id: row.id,
		userId: row.user_id,
		label: row.label,
		fullName: row.full_name,
		phone: row.phone,
		street: row.street,
		area: row.area,
		city: row.city,
		state: row.state,
		isDefault: Boolean(row.is_default)
	};
}
function mapOrderItem(row) {
	return {
		id: Number(row.id),
		orderId: row.order_id,
		productId: row.product_id,
		name: row.name,
		imageUrl: row.image_url,
		unitPrice: Number(row.unit_price),
		quantity: Number(row.quantity),
		color: row.color,
		size: row.size
	};
}
function mapEvent(row) {
	return {
		id: Number(row.id),
		orderId: row.order_id,
		status: row.status,
		note: row.note,
		createdAt: String(row.created_at)
	};
}
function mapOrder(row, items, events) {
	return {
		id: row.id,
		userId: row.user_id,
		status: row.status,
		fulfillment: row.fulfillment === "pickup" ? "pickup" : "delivery",
		addressSnapshot: asJson(row.address_snapshot, null),
		paymentMethod: row.payment_method === "card" ? "card" : "bank_transfer",
		paymentStatus: row.payment_status === "paid" ? "paid" : "pending",
		subtotal: Number(row.subtotal),
		deliveryFee: Number(row.delivery_fee),
		total: Number(row.total),
		notes: row.notes,
		customerName: row.customer_name,
		customerPhone: row.customer_phone,
		createdAt: String(row.created_at),
		updatedAt: String(row.updated_at),
		items,
		events
	};
}
function mapNotification(row) {
	return {
		id: Number(row.id),
		title: row.title,
		body: row.body,
		href: row.href,
		read: Boolean(row.read),
		createdAt: String(row.created_at)
	};
}
var chain = null;
var seededFor = null;
function seedIfNeeded() {
	if (chain && seededFor === "8-nigerian-floor") return chain;
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
	if ((await sql`select value from store_meta where key = 'catalog_version'`)[0]?.value === "8-nigerian-floor") return;
	const parents = SEED_CATEGORIES.filter((c) => !c.parentId);
	const children = SEED_CATEGORIES.filter((c) => c.parentId);
	for (const c of [...parents, ...children]) await sql.query(`insert into categories (id, parent_id, name, description, image_url, sort_order)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (id) do update set
         parent_id = excluded.parent_id,
         name = excluded.name,
         description = excluded.description,
         image_url = excluded.image_url,
         sort_order = excluded.sort_order`, [
		c.id,
		c.parentId,
		c.name,
		c.description,
		c.imageUrl,
		c.sortOrder
	]);
	const ids = SEED_PRODUCTS.map((p) => p.id);
	for (const p of SEED_PRODUCTS) await sql.query(`insert into products (
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
        special_offer = excluded.special_offer`, [
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
		p.specialOffer ?? false
	]);
	await sql.query(`delete from products where not (id = any($1::text[]))
       and id not in (select product_id from order_items)
       and id not in (select product_id from wishlist)`, [ids]);
	await sql`delete from banners`;
	for (const b of SEED_BANNERS) await sql.query(`insert into banners (title, subtitle, image_url, cta_text, cta_href, sort_order, active)
       values ($1,$2,$3,$4,$5,$6,true)`, [
		b.title,
		b.subtitle,
		b.imageUrl,
		b.ctaText,
		b.ctaHref,
		b.sortOrder
	]);
	await sql.query(`insert into store_meta (key, value) values ('catalog_version', $1)
     on conflict (key) do update set value = excluded.value`, [CATALOG_VERSION]);
}
//#endregion
export { mapEvent as a, mapOrderItem as c, seedIfNeeded as d, mapCategory as i, mapProduct as l, mapAddress as n, mapNotification as o, mapBanner as r, mapOrder as s, createServerRpc as t, mapProfile as u };
