import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-GpiLYHk-.mjs";
import { cn as _enum, dn as boolean, gn as object, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-BDZmsuxf.js
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a7bfb2735f11df3d6bbf55085ae071faa90bad2cde2fcce815d27570e17c5822"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	fullName: string().min(1).max(120),
	phone: string().max(40)
})).handler(createSsrRpc("0ef4c4cb0c1523be8636aba4e65793bb433944c60e563d74cc6eea91aed6c693"));
var listMyAddresses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d14990e5f1ddf8d5956cd8031288f602f9ce1bcce51067e1ca86f638e321a544"));
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
var saveAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(addressInput.extend({ id: string().optional() })).handler(createSsrRpc("b47af9d3d84286eef9854674463db25394f27cea97c0ad52dc494cd2b2a830cc"));
var deleteAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("c8cd6ed47baa93f3bbb9260fbaa47b717e31a58a37893ea882315ebca0cf81ca"));
var listWishlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0f65a14aac9db1515eb5f3c3b07d46000c5be64fce183e39915af31949c53f9c"));
var toggleWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ productId: string() })).handler(createSsrRpc("d722b30664b11807c4739156190faaaa57e0329f6e9fe36e55f47dd7d5f66fef"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ productIds: array(string()) })).handler(createSsrRpc("98ddc9e0338461c940e6e90832dab1bd36a9bef3838da5c0a44d04f0ce06f85f"));
var submitInquiry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	productId: string().optional(),
	kind: _enum(["ask", "quote"]),
	message: string().min(4).max(2e3),
	phone: string().max(40)
})).handler(createSsrRpc("5fc182f689983795bdbe844ee6457abd0b51f19e08d6597bb60b3360b0283a16"));
var listMyNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("db04715e8f8d884f9ea0a4b65bcf9fb76e5d5523c571618fc3efc890bebad05a"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("032cbf0977012e1264295a348e3f893791d708d87efb7917ac13836b1dfd0878"));
//#endregion
export { listWishlist as a, toggleWishlist as c, listMyNotifications as i, updateMyProfile as l, getMyProfile as n, saveAddress as o, listMyAddresses as r, submitInquiry as s, deleteAddress as t };
