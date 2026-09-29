import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { c as ORDER_LABELS } from "./catalog-data-087TMwXI.mjs";
import { n as formatNaira } from "./money-DjeZ0LfL.mjs";
import { s as adminListOrders } from "./admin-K4UZHSlG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders-fYzj3F2R.js
var import_jsx_runtime = require_jsx_runtime();
function AdminOrders() {
	const list = useQuery({
		queryKey: ["admin-orders"],
		queryFn: () => adminListOrders()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Orders"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "divide-y divide-border rounded-xl border border-border bg-surface",
			children: [(list.data ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/orders/$id",
				params: { id: o.id },
				className: "flex items-center justify-between px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: o.id
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-2 text-muted",
					children: [
						o.customerName,
						" · ",
						ORDER_LABELS[o.status] ?? o.status
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: formatNaira(o.total)
				})]
			}) }, o.id)), list.data && !list.data.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-4 py-6 text-sm text-muted",
				children: "No orders yet."
			}) : null]
		})]
	});
}
//#endregion
export { AdminOrders as component };
