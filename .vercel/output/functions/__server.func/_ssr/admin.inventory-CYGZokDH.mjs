import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { S as stockLabel } from "./catalog-data-087TMwXI.mjs";
import { n as formatNaira } from "./money-DjeZ0LfL.mjs";
import { c as adminListProducts, g as adminUpdateStock, h as adminUpdatePrice } from "./admin-K4UZHSlG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.inventory-CYGZokDH.js
var import_jsx_runtime = require_jsx_runtime();
function AdminInventory() {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["admin-products"],
		queryFn: () => adminListProducts()
	});
	const stock = useMutation({
		mutationFn: (d) => adminUpdateStock({ data: d }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-products"] })
	});
	const price = useMutation({
		mutationFn: (d) => adminUpdatePrice({ data: d }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-products"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Inventory & pricing"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: (list.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: stockLabel(p.stock)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["Stock", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								defaultValue: p.stock,
								className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-2 text-sm text-ink",
								onBlur: (e) => stock.mutate({
									id: p.id,
									stock: Number(e.target.value)
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["Price ₦", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								defaultValue: p.price,
								className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-2 text-sm text-ink",
								onBlur: (e) => price.mutate({
									id: p.id,
									price: Number(e.target.value),
									compareAt: p.compareAt
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["Compare at ₦", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								defaultValue: p.compareAt ?? "",
								className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-2 text-sm text-ink",
								onBlur: (e) => price.mutate({
									id: p.id,
									price: p.price,
									compareAt: e.target.value === "" ? null : Number(e.target.value),
									specialOffer: e.target.value !== ""
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "self-end text-sm tabular-nums",
							children: formatNaira(p.price)
						})
					]
				})]
			}, p.id))
		})]
	});
}
//#endregion
export { AdminInventory as component };
