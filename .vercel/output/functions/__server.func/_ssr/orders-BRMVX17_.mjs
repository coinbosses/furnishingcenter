import { r as createServerFn } from "./ssr.mjs";
import { b as getSql, n as CANCELLABLE } from "./catalog-data-087TMwXI.mjs";
import { a as mapEvent, c as mapOrderItem, d as seedIfNeeded, l as mapProduct, n as mapAddress, s as mapOrder, t as createServerRpc } from "./seed-D46pse2Z.mjs";
import { t as authMiddleware } from "./middleware-GpiLYHk-.mjs";
import { t as ensureProfile } from "./profile-Dzjl6-xK.mjs";
import { cn as _enum, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as deliveryFeeFor } from "./money-DjeZ0LfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BRMVX17_.js
var itemInput = object({
	productId: string(),
	quantity: number().int().min(1).max(20),
	color: string().optional(),
	size: string().optional()
});
var placeInput = object({
	items: array(itemInput).min(1),
	fulfillment: _enum(["delivery", "pickup"]),
	addressId: string().optional(),
	paymentMethod: _enum(["card", "bank_transfer"]),
	notes: string().max(500).optional(),
	customerName: string().min(1).max(120),
	customerPhone: string().min(7).max(40)
});
async function loadOrder(orderId, userId) {
	const sql = await getSql();
	const row = (userId ? await sql`
        select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
               subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
        from orders where id = ${orderId} and user_id = ${userId} limit 1
      ` : await sql`
        select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
               subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
        from orders where id = ${orderId} limit 1
      `)[0];
	if (!row) return null;
	const items = await sql`
    select id, order_id, product_id, name, image_url, unit_price, quantity, color, size
    from order_items where order_id = ${orderId}
  `;
	const events = await sql`
    select id, order_id, status, note, created_at from order_events
    where order_id = ${orderId} order by created_at
  `;
	return mapOrder(row, items.map(mapOrderItem), events.map(mapEvent));
}
var placeOrder_createServerFn_handler = createServerRpc({
	id: "eff383686543aaf1d3781cf0aaa6a0b80974ddd9537d83f9cfc933b88b01f00f",
	name: "placeOrder",
	filename: "src/lib/server/orders.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(placeInput).handler(placeOrder_createServerFn_handler, async ({ context, data }) => {
	await seedIfNeeded();
	await ensureProfile(context.userId);
	const sql = await getSql();
	let addressSnapshot = null;
	if (data.fulfillment === "delivery") {
		if (!data.addressId) throw new Error("Choose a delivery address");
		const addr = await sql`
        select id, user_id, label, full_name, phone, street, area, city, state, is_default
        from addresses where id = ${data.addressId} and user_id = ${context.userId} limit 1
      `;
		if (!addr[0]) throw new Error("Address not found");
		addressSnapshot = mapAddress(addr[0]);
	}
	let subtotal = 0;
	const lines = [];
	for (const item of data.items) {
		const rows = await sql`
        select id, category_id, name, description, price, compare_at, images, specs, colors, sizes,
               dimensions, material, stock, warranty, delivery_info, featured, bestseller,
               new_arrival, special_offer, created_at
        from products where id = ${item.productId} limit 1
      `;
		const product = rows[0] ? mapProduct(rows[0]) : null;
		if (!product) throw new Error("A product in your cart is no longer available");
		if (product.stock < item.quantity) throw new Error(`${product.name} does not have enough stock`);
		subtotal += product.price * item.quantity;
		lines.push({
			productId: product.id,
			name: product.name,
			image: product.images[0] ?? "",
			price: product.price,
			quantity: item.quantity,
			color: item.color,
			size: item.size
		});
	}
	const deliveryFee = deliveryFeeFor(subtotal, data.fulfillment);
	const total = subtotal + deliveryFee;
	const paymentStatus = data.paymentMethod === "card" ? "paid" : "pending";
	const status = data.paymentMethod === "card" ? "confirmed" : "pending";
	const id = `FC-${Date.now().toString(36).toUpperCase()}`;
	await sql.query(`insert into orders (
        id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
        subtotal, delivery_fee, total, notes, customer_name, customer_phone
      ) values ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13)`, [
		id,
		context.userId,
		status,
		data.fulfillment,
		JSON.stringify(addressSnapshot),
		data.paymentMethod,
		paymentStatus,
		subtotal,
		deliveryFee,
		total,
		data.notes ?? "",
		data.customerName,
		data.customerPhone
	]);
	for (const line of lines) {
		await sql.query(`insert into order_items (order_id, product_id, name, image_url, unit_price, quantity, color, size)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`, [
			id,
			line.productId,
			line.name,
			line.image,
			line.price,
			line.quantity,
			line.color ?? null,
			line.size ?? null
		]);
		await sql.query(`update products set stock = stock - $1 where id = $2 and stock >= $1`, [line.quantity, line.productId]);
	}
	const note = data.paymentMethod === "card" ? "Payment received by card. Order confirmed." : "Order placed. Awaiting bank transfer.";
	await sql.query(`insert into order_events (order_id, status, note) values ($1,$2,$3)`, [
		id,
		status,
		note
	]);
	await sql.query(`insert into notifications (user_id, title, body, href) values ($1,$2,$3,$4)`, [
		context.userId,
		`Order ${id}`,
		note,
		`/account/orders/${id}`
	]);
	const order = await loadOrder(id, context.userId);
	if (!order) throw new Error("Order could not be loaded");
	return order;
});
var listMyOrders_createServerFn_handler = createServerRpc({
	id: "d2d387e734d2b9ad38ff263d4ea22b591a11097849ddb7e854b3d1896e2dcb7e",
	name: "listMyOrders",
	filename: "src/lib/server/orders.ts"
}, (opts) => listMyOrders.__executeServer(opts));
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyOrders_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const rows = await sql`
      select id, user_id, status, fulfillment, address_snapshot, payment_method, payment_status,
             subtotal, delivery_fee, total, notes, customer_name, customer_phone, created_at, updated_at
      from orders where user_id = ${context.userId} order by created_at desc
    `;
	const result = [];
	for (const row of rows) {
		const items = await sql`
        select id, order_id, product_id, name, image_url, unit_price, quantity, color, size
        from order_items where order_id = ${row.id}
      `;
		const events = await sql`
        select id, order_id, status, note, created_at from order_events
        where order_id = ${row.id} order by created_at
      `;
		result.push(mapOrder(row, items.map(mapOrderItem), events.map(mapEvent)));
	}
	return result;
});
var getMyOrder_createServerFn_handler = createServerRpc({
	id: "4096b2026b038348e3866bd521ecc67e4d87fd9fb2bcbcb5a8b133f4d5ff293e",
	name: "getMyOrder",
	filename: "src/lib/server/orders.ts"
}, (opts) => getMyOrder.__executeServer(opts));
var getMyOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(getMyOrder_createServerFn_handler, async ({ context, data }) => {
	return loadOrder(data.id, context.userId);
});
var cancelMyOrder_createServerFn_handler = createServerRpc({
	id: "ce04adca7d8cf2e5655362378bfcda50dea2e05cc45f2f7d630ee90c323d90db",
	name: "cancelMyOrder",
	filename: "src/lib/server/orders.ts"
}, (opts) => cancelMyOrder.__executeServer(opts));
var cancelMyOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(cancelMyOrder_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const order = (await sql`
      select id, status from orders where id = ${data.id} and user_id = ${context.userId} limit 1
    `)[0];
	if (!order) throw new Error("Order not found");
	if (!CANCELLABLE.has(order.status)) throw new Error("This order can no longer be cancelled");
	await sql`update orders set status = 'cancelled', updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
	const items = await sql`
      select product_id, quantity from order_items where order_id = ${data.id}
    `;
	for (const item of items) await sql.query(`update products set stock = stock + $1 where id = $2`, [item.quantity, item.product_id]);
	await sql.query(`insert into order_events (order_id, status, note) values ($1,'cancelled',$2)`, [data.id, "Cancelled by customer."]);
	await sql.query(`insert into notifications (user_id, title, body, href) values ($1,$2,$3,$4)`, [
		context.userId,
		`Order ${data.id} cancelled`,
		"Your order was cancelled and stock was returned.",
		`/account/orders/${data.id}`
	]);
	return loadOrder(data.id, context.userId);
});
//#endregion
export { cancelMyOrder_createServerFn_handler, getMyOrder_createServerFn_handler, listMyOrders_createServerFn_handler, placeOrder_createServerFn_handler };
