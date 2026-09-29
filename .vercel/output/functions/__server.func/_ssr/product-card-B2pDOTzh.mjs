import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { S as stockLabel, _ as cn, g as categoryById } from "./catalog-data-087TMwXI.mjs";
import { m as Heart } from "../_libs/lucide-react.mjs";
import { f as useWishlistLocal, m as useCurrentUserState } from "./router-Ba_FUwPp.mjs";
import { a as listWishlist, c as toggleWishlist } from "./account-BDZmsuxf.mjs";
import { t as PriceTag } from "./price-tag-7NSvamv2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-B2pDOTzh.js
var import_jsx_runtime = require_jsx_runtime();
function useWish() {
	const { user } = useCurrentUserState();
	const local = useWishlistLocal();
	const qc = useQueryClient();
	const server = useQuery({
		queryKey: ["wishlist"],
		queryFn: () => listWishlist(),
		enabled: Boolean(user)
	});
	const ids = user ? (server.data ?? []).map((p) => p.id) : local.ids;
	async function toggle(id) {
		if (user) {
			await toggleWishlist({ data: { productId: id } });
			await qc.invalidateQueries({ queryKey: ["wishlist"] });
		} else local.toggle(id);
	}
	return {
		ids,
		has: (id) => ids.includes(id),
		toggle,
		products: server.data ?? []
	};
}
function ProductCard({ product }) {
	const wish = useWish();
	const wished = wish.has(product.id);
	const img = product.images[0];
	const category = categoryById(product.categoryId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group relative flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/product/$slug",
				params: { slug: product.id },
				className: "relative block overflow-hidden rounded-md bg-surface-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[4/3] overflow-hidden",
					children: img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: img,
						alt: product.name,
						className: "size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-surface-2" })
				}), product.specialOffer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-primary-fg",
					children: "Offer"
				}) : product.newArrival ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-ink",
					children: "New"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": wished ? "Remove from wishlist" : "Save to wishlist",
				onClick: () => void wish.toggle(product.id),
				className: "absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-surface/90 text-ink",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", wished && "fill-ink") })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-col gap-1",
				children: [
					category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted",
						children: category.name
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/product/$slug",
						params: { slug: product.id },
						className: "text-sm font-medium leading-snug",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTag, {
						price: product.price,
						compareAt: product.compareAt
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: stockLabel(product.stock)
					})
				]
			})
		]
	});
}
function ProductRail({ products }) {
	if (!products.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory md:mx-0 md:px-0",
		children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-56 shrink-0 snap-start md:w-60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p })
		}, p.id))
	});
}
function ProductGrid({ products }) {
	if (!products.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-12 text-center text-sm text-muted",
		children: "No products match these filters."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4",
		children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
	});
}
//#endregion
export { ProductRail as n, useWish as r, ProductGrid as t };
