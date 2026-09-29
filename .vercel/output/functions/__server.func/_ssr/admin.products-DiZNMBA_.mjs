import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { S as stockLabel } from "./catalog-data-087TMwXI.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { n as formatNaira } from "./money-DjeZ0LfL.mjs";
import { c as adminListProducts, r as adminDeleteProduct } from "./admin-K4UZHSlG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products-DiZNMBA_.js
var import_jsx_runtime = require_jsx_runtime();
function AdminProducts() {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["admin-products"],
		queryFn: () => adminListProducts()
	});
	const del = useMutation({
		mutationFn: (id) => adminDeleteProduct({ data: { id } }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-products"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Products"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/products/$id",
					params: { id: "new" },
					children: "Add product"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border rounded-xl border border-border bg-surface",
			children: (list.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3 px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.images[0],
						alt: "",
						className: "size-14 rounded-md object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/products/$id",
							params: { id: p.id },
							className: "font-medium",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								formatNaira(p.price),
								" · ",
								stockLabel(p.stock)
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-danger",
						onClick: () => del.mutate(p.id),
						children: "Remove"
					})
				]
			}, p.id))
		})]
	});
}
//#endregion
export { AdminProducts as component };
