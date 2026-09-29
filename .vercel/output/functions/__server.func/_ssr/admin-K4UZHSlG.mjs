import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-GpiLYHk-.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, un as array, vn as record, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-K4UZHSlG.js
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
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b0810fbd9f9f0856d1b14e3fa48305c27383e99a16fd93e99113c7c1e713f6ee"));
var adminListProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e44d25be80bce2b94deb72faf36c4882bfe3911806ab70b7b500f221420cd68e"));
var adminSaveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(productInput).handler(createSsrRpc("d1945e7f257482ecf2137acde558fe8edd242c8fb898534842dc62c930a26d2d"));
var adminDeleteProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("71dd8a1ce0391431ff1798c7a0c815c2516d97f4527b14d590a58d8d3fe9f3ab"));
var adminListOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("588d427c5c6a9bd05e1014cec0ec3321b2ef1da275509094279b6af46ea31f4e"));
var adminGetOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("0623f380e2e38cdfa24239b07087a46e8a338e90f061f9eb41c74a4a70e8eff9"));
var adminUpdateOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	status: string().optional(),
	paymentStatus: _enum(["pending", "paid"]).optional(),
	note: string().max(400).optional()
})).handler(createSsrRpc("1adf2a1e37f75fbf14db6c1c320664b023c54d351730c8615d2801c49c5eee75"));
var adminListCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("96c3c90be288da29c9bf1bf1ed992ffb93d3fc3eb0f0cb071e84d713b896418f"));
var adminSetRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string(),
	role: _enum(["admin", "customer"])
})).handler(createSsrRpc("ad071b116bb6bfd69b4fa28ecbf96275a634abb71cb7bcc43cb484d3985c37e0"));
var adminListBanners = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cbf9326b36750fb8fc839c6a61721a4df90f09962c81bda4157be029dad2a343"));
var adminSaveBanner = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number().optional(),
	title: string().min(2),
	subtitle: string(),
	imageUrl: string().min(1),
	ctaText: string(),
	ctaHref: string(),
	sortOrder: number().int(),
	active: boolean()
})).handler(createSsrRpc("330f4eaaf384ca8f18d4f679b40590593d0886e994b8cc8a6183fb86125d0fd5"));
var adminDeleteBanner = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(createSsrRpc("bce729ffe55e8609179a019a6ee9f92fa4873716adadaf85c8e0a6811eb499e9"));
var adminSaveCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string().optional(),
	parentId: string().nullable(),
	name: string().min(2),
	description: string(),
	imageUrl: string(),
	sortOrder: number().int()
})).handler(createSsrRpc("3dac60c61c7f56b95c33798ca621dfd009e8f3da8d3a33877a8e27862b106680"));
var adminDeleteCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("abb641b3ed0659bb2829926cb7470e2219c709ace6671079c081a6e0fcfb7ba6"));
var adminUpdateStock = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	stock: number().int().min(0)
})).handler(createSsrRpc("a976a30eea0db236afdf3944c55b9ffdb3cb239affe3faeeea011b6c201a2b76"));
var adminUpdatePrice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	price: number().int().min(0),
	compareAt: number().int().min(0).nullable(),
	specialOffer: boolean().optional()
})).handler(createSsrRpc("b54e8176f3d4e9796f2e11548aea94dcf7cb9f46618da43cb95c5bae047a123b"));
//#endregion
export { adminListBanners as a, adminListProducts as c, adminSaveCategory as d, adminSaveProduct as f, adminUpdateStock as g, adminUpdatePrice as h, adminGetOrder as i, adminOverview as l, adminUpdateOrder as m, adminDeleteCategory as n, adminListCustomers as o, adminSetRole as p, adminDeleteProduct as r, adminListOrders as s, adminDeleteBanner as t, adminSaveBanner as u };
