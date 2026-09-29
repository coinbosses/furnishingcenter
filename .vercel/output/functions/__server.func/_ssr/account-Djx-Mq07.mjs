import { r as createServerFn } from "./ssr.mjs";
import { b as getSql } from "./catalog-data-087TMwXI.mjs";
import { d as seedIfNeeded, l as mapProduct, n as mapAddress, o as mapNotification, t as createServerRpc } from "./seed-D46pse2Z.mjs";
import { t as authMiddleware } from "./middleware-GpiLYHk-.mjs";
import { t as ensureProfile } from "./profile-Dzjl6-xK.mjs";
import { cn as _enum, dn as boolean, gn as object, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-Djx-Mq07.js
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "a7bfb2735f11df3d6bbf55085ae071faa90bad2cde2fcce815d27570e17c5822",
	name: "getMyProfile",
	filename: "src/lib/server/account.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	await seedIfNeeded();
	return ensureProfile(context.userId);
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "0ef4c4cb0c1523be8636aba4e65793bb433944c60e563d74cc6eea91aed6c693",
	name: "updateMyProfile",
	filename: "src/lib/server/account.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	fullName: string().min(1).max(120),
	phone: string().max(40)
})).handler(updateMyProfile_createServerFn_handler, async ({ context, data }) => {
	await ensureProfile(context.userId);
	await (await getSql()).query(`update profiles set full_name = $1, phone = $2 where user_id = $3`, [
		data.fullName.trim(),
		data.phone.trim(),
		context.userId
	]);
	return ensureProfile(context.userId);
});
var listMyAddresses_createServerFn_handler = createServerRpc({
	id: "d14990e5f1ddf8d5956cd8031288f602f9ce1bcce51067e1ca86f638e321a544",
	name: "listMyAddresses",
	filename: "src/lib/server/account.ts"
}, (opts) => listMyAddresses.__executeServer(opts));
var listMyAddresses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyAddresses_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, user_id, label, full_name, phone, street, area, city, state, is_default
      from addresses where user_id = ${context.userId} order by is_default desc, label
    `).map(mapAddress);
});
var addressInput = object({
	label: string().min(1).max(40),
	fullName: string().min(1).max(120),
	phone: string().min(7).max(40),
	street: string().min(3).max(200),
	area: string().max(80),
	city: string().min(1).max(80),
	state: string().min(1).max(80),
	isDefault: boolean().optional()
});
var saveAddress_createServerFn_handler = createServerRpc({
	id: "b47af9d3d84286eef9854674463db25394f27cea97c0ad52dc494cd2b2a830cc",
	name: "saveAddress",
	filename: "src/lib/server/account.ts"
}, (opts) => saveAddress.__executeServer(opts));
var saveAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(addressInput.extend({ id: string().optional() })).handler(saveAddress_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const id = data.id ?? crypto.randomUUID();
	if (data.isDefault) await sql`update addresses set is_default = false where user_id = ${context.userId}`;
	if (data.id) await sql.query(`update addresses set label=$1, full_name=$2, phone=$3, street=$4, area=$5, city=$6, state=$7, is_default=$8
         where id=$9 and user_id=$10`, [
		data.label,
		data.fullName,
		data.phone,
		data.street,
		data.area,
		data.city,
		data.state,
		data.isDefault ?? false,
		data.id,
		context.userId
	]);
	else await sql.query(`insert into addresses (id, user_id, label, full_name, phone, street, area, city, state, is_default)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [
		id,
		context.userId,
		data.label,
		data.fullName,
		data.phone,
		data.street,
		data.area,
		data.city,
		data.state,
		data.isDefault ?? false
	]);
	return (await sql`
      select id, user_id, label, full_name, phone, street, area, city, state, is_default
      from addresses where user_id = ${context.userId} order by is_default desc, label
    `).map(mapAddress);
});
var deleteAddress_createServerFn_handler = createServerRpc({
	id: "c8cd6ed47baa93f3bbb9260fbaa47b717e31a58a37893ea882315ebca0cf81ca",
	name: "deleteAddress",
	filename: "src/lib/server/account.ts"
}, (opts) => deleteAddress.__executeServer(opts));
var deleteAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(deleteAddress_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`delete from addresses where id = ${data.id} and user_id = ${context.userId}`;
	return { ok: true };
});
var listWishlist_createServerFn_handler = createServerRpc({
	id: "0f65a14aac9db1515eb5f3c3b07d46000c5be64fce183e39915af31949c53f9c",
	name: "listWishlist",
	filename: "src/lib/server/account.ts"
}, (opts) => listWishlist.__executeServer(opts));
var listWishlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listWishlist_createServerFn_handler, async ({ context }) => {
	await seedIfNeeded();
	return (await (await getSql())`
      select p.id, p.category_id, p.name, p.description, p.price, p.compare_at, p.images, p.specs, p.colors, p.sizes,
             p.dimensions, p.material, p.stock, p.warranty, p.delivery_info, p.featured, p.bestseller,
             p.new_arrival, p.special_offer, p.created_at
      from wishlist w join products p on p.id = w.product_id
      where w.user_id = ${context.userId}
      order by w.created_at desc
    `).map(mapProduct);
});
var toggleWishlist_createServerFn_handler = createServerRpc({
	id: "d722b30664b11807c4739156190faaaa57e0329f6e9fe36e55f47dd7d5f66fef",
	name: "toggleWishlist",
	filename: "src/lib/server/account.ts"
}, (opts) => toggleWishlist.__executeServer(opts));
var toggleWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ productId: string() })).handler(toggleWishlist_createServerFn_handler, async ({ context, data }) => {
	await seedIfNeeded();
	const sql = await getSql();
	if ((await sql`
      select product_id from wishlist where user_id = ${context.userId} and product_id = ${data.productId}
    `).length) {
		await sql`delete from wishlist where user_id = ${context.userId} and product_id = ${data.productId}`;
		return { saved: false };
	}
	await sql.query(`insert into wishlist (user_id, product_id) values ($1,$2) on conflict do nothing`, [context.userId, data.productId]);
	return { saved: true };
});
var mergeWishlist_createServerFn_handler = createServerRpc({
	id: "98ddc9e0338461c940e6e90832dab1bd36a9bef3838da5c0a44d04f0ce06f85f",
	name: "mergeWishlist",
	filename: "src/lib/server/account.ts"
}, (opts) => mergeWishlist.__executeServer(opts));
var mergeWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ productIds: array(string()) })).handler(mergeWishlist_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	for (const id of data.productIds) await sql.query(`insert into wishlist (user_id, product_id) values ($1,$2) on conflict do nothing`, [context.userId, id]);
	return { ok: true };
});
var submitInquiry_createServerFn_handler = createServerRpc({
	id: "5fc182f689983795bdbe844ee6457abd0b51f19e08d6597bb60b3360b0283a16",
	name: "submitInquiry",
	filename: "src/lib/server/account.ts"
}, (opts) => submitInquiry.__executeServer(opts));
var submitInquiry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	productId: string().optional(),
	kind: _enum(["ask", "quote"]),
	message: string().min(4).max(2e3),
	phone: string().max(40)
})).handler(submitInquiry_createServerFn_handler, async ({ context, data }) => {
	await ensureProfile(context.userId);
	await (await getSql()).query(`insert into inquiries (user_id, product_id, kind, message, phone) values ($1,$2,$3,$4,$5)`, [
		context.userId,
		data.productId ?? null,
		data.kind,
		data.message.trim(),
		data.phone.trim()
	]);
	return { ok: true };
});
var listMyNotifications_createServerFn_handler = createServerRpc({
	id: "db04715e8f8d884f9ea0a4b65bcf9fb76e5d5523c571618fc3efc890bebad05a",
	name: "listMyNotifications",
	filename: "src/lib/server/account.ts"
}, (opts) => listMyNotifications.__executeServer(opts));
var listMyNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyNotifications_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, title, body, href, read, created_at
      from notifications where user_id = ${context.userId}
      order by created_at desc limit 40
    `).map(mapNotification);
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "032cbf0977012e1264295a348e3f893791d708d87efb7917ac13836b1dfd0878",
	name: "markNotificationsRead",
	filename: "src/lib/server/account.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await (await getSql())`update notifications set read = true where user_id = ${context.userId}`;
	return { ok: true };
});
//#endregion
export { deleteAddress_createServerFn_handler, getMyProfile_createServerFn_handler, listMyAddresses_createServerFn_handler, listMyNotifications_createServerFn_handler, listWishlist_createServerFn_handler, markNotificationsRead_createServerFn_handler, mergeWishlist_createServerFn_handler, saveAddress_createServerFn_handler, submitInquiry_createServerFn_handler, toggleWishlist_createServerFn_handler, updateMyProfile_createServerFn_handler };
