import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { c as ORDER_LABELS } from "./catalog-data-087TMwXI.mjs";
import { c as Package, d as MapPin, h as ChevronRight, m as Heart, t as User } from "../_libs/lucide-react.mjs";
import { m as useCurrentUserState } from "./router-Ba_FUwPp.mjs";
import { n as UserButton, t as RedirectToSignIn } from "./gates-hsNySADr.mjs";
import { i as listMyNotifications, n as getMyProfile } from "./account-BDZmsuxf.mjs";
import { r as listMyOrders } from "./orders-tCsYrRRi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.index-COMHY3YQ.js
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	const orders = useQuery({
		queryKey: ["orders"],
		queryFn: () => listMyOrders(),
		enabled: Boolean(user)
	});
	const notes = useQuery({
		queryKey: ["notifications"],
		queryFn: () => listMyNotifications(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const current = (orders.data ?? []).filter((o) => !["delivered", "cancelled"].includes(o.status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-muted",
						children: "Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl md:text-5xl",
						children: profile.data?.fullName || user.displayName || "Your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: user.primaryEmail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-md text-sm text-muted",
						children: "Orders, addresses and the pieces you saved. Tracking stays with the order, from pending to delivered."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						to: "/account/orders",
						icon: Package,
						label: "Orders",
						hint: "History and tracking"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						to: "/account/addresses",
						icon: MapPin,
						label: "Addresses",
						hint: "Delivery locations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						to: "/account/profile",
						icon: User,
						label: "Profile",
						hint: "Name and phone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						to: "/wishlist",
						icon: Heart,
						label: "Saved products",
						hint: "Wishlist"
					})
				]
			}),
			profile.data?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin",
				className: "block rounded-xl bg-primary px-5 py-4 text-primary-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-primary-fg/70",
					children: "Staff"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: "Open admin dashboard"
				})]
			}) : null,
			current.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-2xl",
				children: "Current orders"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: current.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/account/orders/$id",
					params: { id: o.id },
					className: "flex items-center justify-between rounded-xl bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: o.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: ORDER_LABELS[o.status] ?? o.status
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted" })]
				}) }, o.id))
			})] }) : null,
			(notes.data ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-2xl",
				children: "Notifications"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: (notes.data ?? []).slice(0, 6).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-surface px-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: n.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: n.body
					})]
				}, n.id))
			})] }) : null
		]
	});
}
function Row({ to, icon: Icon, label, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "flex items-center gap-3 rounded-xl bg-surface px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-medium",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: hint
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted" })
		]
	});
}
//#endregion
export { AccountPage as component };
