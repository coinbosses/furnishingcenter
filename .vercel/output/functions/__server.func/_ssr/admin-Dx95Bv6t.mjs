import { _ as Outlet, m as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { _ as cn } from "./catalog-data-087TMwXI.mjs";
import { m as useCurrentUserState } from "./router-Ba_FUwPp.mjs";
import { t as RedirectToSignIn } from "./gates-hsNySADr.mjs";
import { n as getMyProfile } from "./account-BDZmsuxf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Dx95Bv6t.js
var import_jsx_runtime = require_jsx_runtime();
var links = [
	{
		to: "/admin",
		label: "Overview"
	},
	{
		to: "/admin/products",
		label: "Products"
	},
	{
		to: "/admin/inventory",
		label: "Inventory"
	},
	{
		to: "/admin/orders",
		label: "Orders"
	},
	{
		to: "/admin/customers",
		label: "Customers"
	},
	{
		to: "/admin/categories",
		label: "Categories"
	},
	{
		to: "/admin/banners",
		label: "Banners"
	}
];
function AdminShell() {
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (isPending || user && profile.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg text-sm text-muted",
		children: "Loading staff desk…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (profile.data && profile.data.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl",
			children: "Staff only"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/account",
			className: "mt-4 inline-block text-sm underline",
			children: "Back to account"
		})] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-border bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: "Furnishing Center"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: "Admin"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-sm text-muted hover:text-ink",
					children: "View store"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2",
				children: links.map((l) => {
					const active = l.to === "/admin" ? pathname === "/admin" : pathname.startsWith(l.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: cn("h-10 shrink-0 rounded-full px-4 text-sm leading-10", active ? "bg-primary text-primary-fg" : "text-muted hover:text-ink"),
						children: l.label
					}, l.to);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl px-4 py-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
var SplitComponent = AdminShell;
//#endregion
export { SplitComponent as component };
