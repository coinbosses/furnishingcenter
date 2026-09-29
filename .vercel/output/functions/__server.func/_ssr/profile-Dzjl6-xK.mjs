import { b as getSql } from "./catalog-data-087TMwXI.mjs";
import { u as mapProfile } from "./seed-D46pse2Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Dzjl6-xK.js
async function ensureProfile(userId) {
	const sql = await getSql();
	const existing = await sql`select user_id, full_name, phone, email, role from profiles where user_id = ${userId}`;
	if (existing[0]) return mapProfile(existing[0]);
	let fullName = "";
	let email = "";
	try {
		const users = await sql`
      select name, email from "user" where id = ${userId} limit 1
    `;
		fullName = users[0]?.name ?? "";
		email = users[0]?.email ?? "";
	} catch {}
	const role = ((await sql`select count(*)::int as n from profiles where role = 'admin'`)[0]?.n ?? 0) === 0 ? "admin" : "customer";
	await sql.query(`insert into profiles (user_id, full_name, phone, email, role) values ($1,$2,'',$3,$4)
     on conflict (user_id) do nothing`, [
		userId,
		fullName,
		email,
		role
	]);
	const created = await sql`select user_id, full_name, phone, email, role from profiles where user_id = ${userId}`;
	return mapProfile(created[0]);
}
async function requireAdmin(userId) {
	const profile = await ensureProfile(userId);
	if (profile.role !== "admin") {
		const err = /* @__PURE__ */ new Error("Forbidden");
		err.status = 403;
		throw err;
	}
	return profile;
}
//#endregion
export { requireAdmin as n, ensureProfile as t };
