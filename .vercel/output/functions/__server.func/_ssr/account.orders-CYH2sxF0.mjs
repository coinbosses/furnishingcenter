import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { c as ORDER_LABELS } from "./catalog-data-087TMwXI.mjs";
import { m as useCurrentUserState } from "./router-Ba_FUwPp.mjs";
import { t as RedirectToSignIn } from "./gates-hsNySADr.mjs";
import { r as listMyOrders } from "./orders-tCsYrRRi.mjs";
import { n as formatNaira } from "./money-DjeZ0LfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.orders-CYH2sxF0.js
var import_jsx_runtime = require_jsx_runtime();
function OrdersPage() {
	const { user, isPending } = useCurrentUserState();
	const orders = useQuery({
		queryKey: ["orders"],
		queryFn: () => listMyOrders(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Orders"
		}), !(orders.data ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "No orders yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: (orders.data ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/account/orders/$id",
				params: { id: o.id },
				className: "block rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: o.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "tabular-nums",
						children: formatNaira(o.total)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						ORDER_LABELS[o.status] ?? o.status,
						" · ",
						o.fulfillment === "pickup" ? "Pickup" : "Delivery"
					]
				})]
			}) }, o.id))
		})]
	});
}
//#endregion
export { OrdersPage as component };
