import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { g as listCategories } from "./router-Ba_FUwPp.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { n as Label, t as Input } from "./input-BsJ7Tovf.mjs";
import { d as adminSaveCategory, n as adminDeleteCategory } from "./admin-K4UZHSlG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-CWvZ8nzD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCategories() {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	const [name, setName] = (0, import_react.useState)("");
	const [parentId, setParentId] = (0, import_react.useState)("furniture");
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const save = useMutation({
		mutationFn: () => adminSaveCategory({ data: {
			name,
			parentId: parentId || null,
			description: name,
			imageUrl: imageUrl || "/categories/furniture.jpg",
			sortOrder: 99
		} }),
		onSuccess: () => {
			setName("");
			qc.invalidateQueries({ queryKey: ["categories"] });
		}
	});
	const del = useMutation({
		mutationFn: (id) => adminDeleteCategory({ data: { id } }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["categories"] })
	});
	const parents = (list.data ?? []).filter((c) => !c.parentId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Categories"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: (list.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-xl bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.parentId ? `${c.parentId} / ` : "", c.name] }), c.parentId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-danger",
						onClick: () => del.mutate(c.id),
						children: "Remove"
					}) : null]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Add subcategory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Parent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: parentId,
							onChange: (e) => setParentId(e.target.value),
							className: "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm",
							children: parents.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.name
							}, p.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Image URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: imageUrl,
							onChange: (e) => setImageUrl(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => save.mutate(),
						disabled: !name,
						children: "Add category"
					})
				]
			})
		]
	});
}
//#endregion
export { AdminCategories as component };
