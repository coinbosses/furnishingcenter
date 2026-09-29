import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { c as ORDER_LABELS } from "./catalog-data-087TMwXI.mjs";
import { n as formatNaira } from "./money-DjeZ0LfL.mjs";
import { l as adminOverview } from "./admin-K4UZHSlG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-CbLl3h_-.js
var import_jsx_runtime = require_jsx_runtime();
function AdminHome() {
	const { data, isPending, error } = useQuery({
		queryKey: ["admin-overview"],
		queryFn: () => adminOverview()
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" });
	if (error || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-danger",
		children: "Could not load overview."
	});
	const stats = [
		{
			label: "Revenue (paid)",
			value: formatNaira(data.revenue)
		},
		{
			label: "Orders",
			value: String(data.orderCount)
		},
		{
			label: "Open orders",
			value: String(data.openOrders)
		},
		{
			label: "Products",
			value: String(data.productCount)
		},
		{
			label: "Low stock",
			value: String(data.lowStock)
		},
		{
			label: "Customers",
			value: String(data.customerCount)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Sales overview"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-muted",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-3xl tabular-nums",
						children: s.value
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Recent orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/orders",
					className: "text-sm text-muted hover:text-ink",
					children: "All orders"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "divide-y divide-border rounded-xl border border-border bg-surface",
				children: [data.recent.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/orders/$id",
					params: { id: o.id },
					className: "flex items-center justify-between px-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [o.id, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-muted",
						children: ORDER_LABELS[o.status] ?? o.status
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatNaira(o.total)
					})]
				}) }, o.id)), !data.recent.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-sm text-muted",
					children: "No orders yet."
				}) : null]
			})] })
		]
	});
}
//#endregion
export { AdminHome as component };
