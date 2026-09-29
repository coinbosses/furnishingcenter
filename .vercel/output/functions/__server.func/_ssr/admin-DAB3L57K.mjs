import { r as createServerFn } from "./ssr.mjs";
import { b as getSql, c as ORDER_LABELS, x as slugify } from "./catalog-data-087TMwXI.mjs";
import { a as mapEvent, c as mapOrderItem, d as seedIfNeeded, l as mapProduct, r as mapBanner, s as mapOrder, t as createServerRpc, u as mapProfile } from "./seed-D46pse2Z.mjs";
import { t as authMiddleware } from "./middleware-GpiLYHk-.mjs";
import { n as requireAdmin } from "./profile-Dzjl6-xK.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, un as array, vn as record, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DAB3L57K.js
var productInput = object({
	id: string().optional(),
	categoryId: string(),
	name: string().min(2).max(160),
	description: string().min(8).max(4e3),
	price: number().int().min(0),
	compareAt: number().int().min(0).nullable().optional(),
	images: array(string()).min(1),
	specs: record(string(), string()),
	colors: array(object({
		name: string(),
		hex: string()
	})),
	sizes: array(string()),
	dimensions: string(),
	material: string(),
	stock: number().int().min(0),
	warranty: string(),
	deliveryInfo: string(),
	featured: boolean(),
	bestseller: boolean(),
	newArrival: boolean(),
	specialOffer: boolean()
});
var adminOverview_createServerFn_handler = createServerRpc({
	id: "b0810fbd9f9f0856d1b14e3fa48305c27383e99a16fd93e99113c7c1e713f6ee",
	name: "adminOverview",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminOverview.__executeServer(opts));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminOverview_createServerFn_handler, async ({ context }) => {
	await seedIfNeeded();
	await requireAdmin(context.userId);
	const sql = await getSql();
	const [orders, products, customers, low] = await Promise.all([
		sql`select count(*)::int as n,
                coalesce(sum(total) filter (where payment_status = 'paid'),0)::int as revenue,
                count(*) filter (where status in ('pending','confirmed','processing','ready','out_for_delivery'))::int as pending
         from orders`,
		sql`select count(*)::int as n from products`,
		sql`select count(*)::int as n from profiles`,
		sql`select count(*)::int as n from products where stock <= 3`
	]);
	const recent = await sql`
      select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
             subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
      from orders order by created_at desc limit 8
    `;
	return {
		orderCount: orders[0]?.n ?? 0,
		revenue: orders[0]?.revenue ?? 0,
		openOrders: orders[0]?.pending ?? 0,
		productCount: products[0]?.n ?? 0,
		customerCount: customers[0]?.n ?? 0,
		lowStock: low[0]?.n ?? 0,
		recent: recent.map((row) => mapOrder(row, [], []))
	};
});
var adminListProducts_createServerFn_handler = createServerRpc({
	id: "e44d25be80bce2b94deb72faf36c4882bfe3911806ab70b7b500f221420cd68e",
	name: "adminListProducts",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListProducts.__executeServer(opts));
var adminListProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListProducts_createServerFn_handler, async ({ context }) => {
	await seedIfNeeded();
	await requireAdmin(context.userId);
	return (await (await getSql())`
      select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
             dimensions, material, stock, warranty, delivery_info, featured, bestseller,
             new_arrival, special_offer, created_at
      from products order by name
    `).map(mapProduct);
});
var adminSaveProduct_createServerFn_handler = createServerRpc({
	id: "d1945e7f257482ecf2137acde558fe8edd242c8fb898534842dc62c930a26d2d",
	name: "adminSaveProduct",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveProduct.__executeServer(opts));
var adminSaveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(productInput).handler(adminSaveProduct_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const id = data.id?.trim() || `${slugify(data.name)}-${Date.now().toString(36)}`;
	await sql.query(`insert into products (
        id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
        dimensions, material, stock, warranty, delivery_info, featured, bestseller, new_arrival, special_offer
      ) values (
        $1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9::jsonb,$10::jsonb,
        $11,$12,$13,$14,$15,$16,$17,$18,$19
      )
      on conflict (id) do update set
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
        special_offer = excluded.special_offer
      `, [
		id,
		data.categoryId,
		data.name,
		data.description,
		data.price,
		data.compareAt ?? null,
		JSON.stringify(data.images),
		JSON.stringify(data.specs),
		JSON.stringify(data.colors),
		JSON.stringify(data.sizes),
		data.dimensions,
		data.material,
		data.stock,
		data.warranty,
		data.deliveryInfo,
		data.featured,
		data.bestseller,
		data.newArrival,
		data.specialOffer
	]);
	return { id };
});
var adminDeleteProduct_createServerFn_handler = createServerRpc({
	id: "71dd8a1ce0391431ff1798c7a0c815c2516d97f4527b14d590a58d8d3fe9f3ab",
	name: "adminDeleteProduct",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminDeleteProduct.__executeServer(opts));
var adminDeleteProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(adminDeleteProduct_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql())`delete from products where id = ${data.id}`;
	return { ok: true };
});
var adminListOrders_createServerFn_handler = createServerRpc({
	id: "588d427c5c6a9bd05e1014cec0ec3321b2ef1da275509094279b6af46ea31f4e",
	name: "adminListOrders",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListOrders.__executeServer(opts));
var adminListOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListOrders_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const rows = await sql`
      select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
             subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
      from orders order by created_at desc
    `;
	const result = [];
	for (const row of rows) {
		const items = await sql`
        select id, order_id, product_id, name, image_url, unit_price, quantity, color, size
        from order_items where order_id = ${row.id}
      `;
		result.push(mapOrder(row, items.map(mapOrderItem), []));
	}
	return result;
});
var adminGetOrder_createServerFn_handler = createServerRpc({
	id: "0623f380e2e38cdfa24239b07087a46e8a338e90f061f9eb41c74a4a70e8eff9",
	name: "adminGetOrder",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminGetOrder.__executeServer(opts));
var adminGetOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(adminGetOrder_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const row = (await sql`
      select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
             subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
      from orders where id = ${data.id} limit 1
    `)[0];
	if (!row) return null;
	const items = await sql`
      select id, order_id, product_id, name, image_url, unit_price, quantity, color, size
      from order_items where order_id = ${data.id}
    `;
	const events = await sql`
      select id, order_id, status, note, created_at from order_events
      where order_id = ${data.id} order by created_at
    `;
	return mapOrder(row, items.map(mapOrderItem), events.map(mapEvent));
});
var adminUpdateOrder_createServerFn_handler = createServerRpc({
	id: "1adf2a1e37f75fbf14db6c1c320664b023c54d351730c8615d2801c49c5eee75",
	name: "adminUpdateOrder",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminUpdateOrder.__executeServer(opts));
var adminUpdateOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	status: string().optional(),
	paymentStatus: _enum(["pending", "paid"]).optional(),
	note: string().max(400).optional()
})).handler(adminUpdateOrder_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const order = (await sql`
      select id, user_id, status from orders where id = ${data.id} limit 1
    `)[0];
	if (!order) throw new Error("Order not found");
	if (data.status) {
		await sql.query(`update orders set status = $1, updated_at = now() where id = $2`, [data.status, data.id]);
		const label = ORDER_LABELS[data.status] ?? data.status;
		const note = data.note?.trim() || `Status updated to ${label}.`;
		await sql.query(`insert into order_events (order_id, status, note) values ($1,$2,$3)`, [
			data.id,
			data.status,
			note
		]);
		await sql.query(`insert into notifications (user_id, title, body, href) values ($1,$2,$3,$4)`, [
			order.user_id,
			`Order ${data.id}`,
			note,
			`/account/orders/${data.id}`
		]);
	}
	if (data.paymentStatus) await sql.query(`update orders set payment_status = $1, updated_at = now() where id = $2`, [data.paymentStatus, data.id]);
	return { ok: true };
});
var adminListCustomers_createServerFn_handler = createServerRpc({
	id: "96c3c90be288da29c9bf1bf1ed992ffb93d3fc3eb0f0cb071e84d713b896418f",
	name: "adminListCustomers",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListCustomers.__executeServer(opts));
var adminListCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListCustomers_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const rows = await sql`
      select user_id, full_name, phone, email, role from profiles order by created_at desc
    `;
	const withCounts = [];
	for (const row of rows) {
		const counts = await sql`
        select count(*)::int as n, coalesce(sum(total),0)::int as spent from orders where user_id = ${row.user_id}
      `;
		withCounts.push({
			...mapProfile(row),
			orderCount: counts[0]?.n ?? 0,
			spent: counts[0]?.spent ?? 0
		});
	}
	return withCounts;
});
var adminSetRole_createServerFn_handler = createServerRpc({
	id: "ad071b116bb6bfd69b4fa28ecbf96275a634abb71cb7bcc43cb484d3985c37e0",
	name: "adminSetRole",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSetRole.__executeServer(opts));
var adminSetRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string(),
	role: _enum(["admin", "customer"])
})).handler(adminSetRole_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql()).query(`update profiles set role = $1 where user_id = $2`, [data.role, data.userId]);
	return { ok: true };
});
var adminListBanners_createServerFn_handler = createServerRpc({
	id: "cbf9326b36750fb8fc839c6a61721a4df90f09962c81bda4157be029dad2a343",
	name: "adminListBanners",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListBanners.__executeServer(opts));
var adminListBanners = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListBanners_createServerFn_handler, async ({ context }) => {
	await seedIfNeeded();
	await requireAdmin(context.userId);
	return (await (await getSql())`
      select id, title, subtitle, image_url, cta_text, cta_href, sort_order, active
      from banners order by sort_order, id
    `).map(mapBanner);
});
var adminSaveBanner_createServerFn_handler = createServerRpc({
	id: "330f4eaaf384ca8f18d4f679b40590593d0886e994b8cc8a6183fb86125d0fd5",
	name: "adminSaveBanner",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveBanner.__executeServer(opts));
var adminSaveBanner = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number().optional(),
	title: string().min(2),
	subtitle: string(),
	imageUrl: string().min(1),
	ctaText: string(),
	ctaHref: string(),
	sortOrder: number().int(),
	active: boolean()
})).handler(adminSaveBanner_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	if (data.id) await sql.query(`update banners set title=$1, subtitle=$2, image_url=$3, cta_text=$4, cta_href=$5, sort_order=$6, active=$7
         where id=$8`, [
		data.title,
		data.subtitle,
		data.imageUrl,
		data.ctaText,
		data.ctaHref,
		data.sortOrder,
		data.active,
		data.id
	]);
	else await sql.query(`insert into banners (title, subtitle, image_url, cta_text, cta_href, sort_order, active)
         values ($1,$2,$3,$4,$5,$6,$7)`, [
		data.title,
		data.subtitle,
		data.imageUrl,
		data.ctaText,
		data.ctaHref,
		data.sortOrder,
		data.active
	]);
	return { ok: true };
});
var adminDeleteBanner_createServerFn_handler = createServerRpc({
	id: "bce729ffe55e8609179a019a6ee9f92fa4873716adadaf85c8e0a6811eb499e9",
	name: "adminDeleteBanner",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminDeleteBanner.__executeServer(opts));
var adminDeleteBanner = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(adminDeleteBanner_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql())`delete from banners where id = ${data.id}`;
	return { ok: true };
});
var adminSaveCategory_createServerFn_handler = createServerRpc({
	id: "3dac60c61c7f56b95c33798ca621dfd009e8f3da8d3a33877a8e27862b106680",
	name: "adminSaveCategory",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveCategory.__executeServer(opts));
var adminSaveCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().optional(),
	parentId: string().nullable(),
	name: string().min(2),
	description: string(),
	imageUrl: string(),
	sortOrder: number().int()
})).handler(adminSaveCategory_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const id = data.id?.trim() || slugify(data.name);
	await sql.query(`insert into categories (id, parent_id, name, description, image_url, sort_order)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (id) do update set
         parent_id = excluded.parent_id,
         name = excluded.name,
         description = excluded.description,
         image_url = excluded.image_url,
         sort_order = excluded.sort_order`, [
		id,
		data.parentId,
		data.name,
		data.description,
		data.imageUrl,
		data.sortOrder
	]);
	return { id };
});
var adminDeleteCategory_createServerFn_handler = createServerRpc({
	id: "abb641b3ed0659bb2829926cb7470e2219c709ace6671079c081a6e0fcfb7ba6",
	name: "adminDeleteCategory",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminDeleteCategory.__executeServer(opts));
var adminDeleteCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(adminDeleteCategory_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql())`delete from categories where id = ${data.id}`;
	return { ok: true };
});
var adminUpdateStock_createServerFn_handler = createServerRpc({
	id: "a976a30eea0db236afdf3944c55b9ffdb3cb239affe3faeeea011b6c201a2b76",
	name: "adminUpdateStock",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminUpdateStock.__executeServer(opts));
var adminUpdateStock = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	stock: number().int().min(0)
})).handler(adminUpdateStock_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql()).query(`update products set stock = $1 where id = $2`, [data.stock, data.id]);
	return { ok: true };
});
var adminUpdatePrice_createServerFn_handler = createServerRpc({
	id: "b54e8176f3d4e9796f2e11548aea94dcf7cb9f46618da43cb95c5bae047a123b",
	name: "adminUpdatePrice",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminUpdatePrice.__executeServer(opts));
var adminUpdatePrice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	price: number().int().min(0),
	compareAt: number().int().min(0).nullable(),
	specialOffer: boolean().optional()
})).handler(adminUpdatePrice_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql()).query(`update products set price = $1, compare_at = $2, special_offer = coalesce($3, special_offer) where id = $4`, [
		data.price,
		data.compareAt,
		data.specialOffer ?? null,
		data.id
	]);
	return { ok: true };
});
//#endregion
export { adminDeleteBanner_createServerFn_handler, adminDeleteCategory_createServerFn_handler, adminDeleteProduct_createServerFn_handler, adminGetOrder_createServerFn_handler, adminListBanners_createServerFn_handler, adminListCustomers_createServerFn_handler, adminListOrders_createServerFn_handler, adminListProducts_createServerFn_handler, adminOverview_createServerFn_handler, adminSaveBanner_createServerFn_handler, adminSaveCategory_createServerFn_handler, adminSaveProduct_createServerFn_handler, adminSetRole_createServerFn_handler, adminUpdateOrder_createServerFn_handler, adminUpdatePrice_createServerFn_handler, adminUpdateStock_createServerFn_handler };
