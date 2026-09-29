import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-GpiLYHk-.mjs";
import { cn as _enum, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-tCsYrRRi.js
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
var placeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(placeInput).handler(createSsrRpc("eff383686543aaf1d3781cf0aaa6a0b80974ddd9537d83f9cfc933b88b01f00f"));
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d2d387e734d2b9ad38ff263d4ea22b591a11097849ddb7e854b3d1896e2dcb7e"));
var getMyOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("4096b2026b038348e3866bd521ecc67e4d87fd9fb2bcbcb5a8b133f4d5ff293e"));
var cancelMyOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("ce04adca7d8cf2e5655362378bfcda50dea2e05cc45f2f7d630ee90c323d90db"));
//#endregion
export { placeOrder as i, getMyOrder as n, listMyOrders as r, cancelMyOrder as t };
