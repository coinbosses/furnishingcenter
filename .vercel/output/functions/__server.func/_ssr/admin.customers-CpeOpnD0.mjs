import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as formatNaira } from "./money-DjeZ0LfL.mjs";
import { o as adminListCustomers, p as adminSetRole } from "./admin-K4UZHSlG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.customers-CpeOpnD0.js
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomers() {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["admin-customers"],
		queryFn: () => adminListCustomers()
	});
	const setRole = useMutation({
		mutationFn: (d) => adminSetRole({ data: d }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-customers"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Customers"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border rounded-xl border border-border bg-surface",
			children: (list.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-3 px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-medium",
					children: c.fullName || c.email || c.userId
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted",
					children: [
						c.phone,
						" · ",
						c.orderCount,
						" orders · ",
						formatNaira(c.spent)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs underline",
					onClick: () => setRole.mutate({
						userId: c.userId,
						role: c.role === "admin" ? "customer" : "admin"
					}),
					children: c.role === "admin" ? "Admin · make customer" : "Make admin"
				})]
			}, c.userId))
		})]
	});
}
//#endregion
export { AdminCustomers as component };
