import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { _ as listProducts, m as useCurrentUserState } from "./router-Ba_FUwPp.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { r as useWish, t as ProductGrid } from "./product-card-B2pDOTzh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-BPG2ieGk.js
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const { user, isPending } = useCurrentUserState();
	const wish = useWish();
	const all = useQuery({
		queryKey: ["products", "all"],
		queryFn: () => listProducts({ data: {} })
	});
	const products = user ? wish.products : (all.data ?? []).filter((p) => wish.ids.includes(p.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-muted",
				children: "Saved"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl md:text-5xl",
				children: "Wishlist"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted",
				children: "Saved pieces stay in their own categories. A heart on a sofa does not file it under appliances."
			})
		] }), isPending || all.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" }) : products.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { products }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-surface p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: "Nothing saved yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Save a piece from its own category. Hearts remember the item, not a stand-in."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/categories",
						children: "Browse the floor"
					})
				})
			]
		})]
	});
}
//#endregion
export { WishlistPage as component };
