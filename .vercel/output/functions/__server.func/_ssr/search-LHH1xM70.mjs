import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { _ as listProducts, g as listCategories, s as Route$19 } from "./router-Ba_FUwPp.mjs";
import { t as Input } from "./input-BsJ7Tovf.mjs";
import { t as ProductGrid } from "./product-card-B2pDOTzh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-LHH1xM70.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const { q: initial = "" } = Route$19.useSearch();
	const navigate = Route$19.useNavigate();
	const [q, setQ] = (0, import_react.useState)(initial);
	const [category, setCategory] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("featured");
	const cats = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	const products = useQuery({
		queryKey: [
			"search",
			q,
			category
		],
		queryFn: () => listProducts({ data: {
			q,
			category: category || void 0
		} })
	});
	const shown = (0, import_react.useMemo)(() => {
		const list = [...products.data ?? []];
		if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
		if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
		return list;
	}, [products.data, sort]);
	const leaves = (cats.data ?? []).filter((c) => c.parentId);
	const parents = (cats.data ?? []).filter((c) => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
	const activeParent = parents.find((p) => p.id === category) ?? parents.find((p) => leaves.some((c) => c.id === category && c.parentId === p.id));
	const chips = activeParent ? leaves.filter((c) => c.parentId === activeParent.id) : parents;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl md:text-5xl",
				children: "Search"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-xl text-sm leading-relaxed text-muted",
				children: "Search by name, material or category. A result only appears if that word is on the piece itself — a fridge will not turn up under sofas."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				autoFocus: true,
				value: q,
				placeholder: "Sofas, refrigerators, 55 inch TV…",
				onChange: (e) => {
					setQ(e.target.value);
					navigate({ search: { q: e.target.value || void 0 } });
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCategory(""),
					className: `h-11 shrink-0 rounded-full px-4 text-sm ${category === "" ? "bg-primary text-primary-fg" : "bg-surface-2"}`,
					children: "All"
				}), parents.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCategory(c.id),
					className: `h-11 shrink-0 rounded-full px-4 text-sm ${category === c.id || activeParent?.id === c.id ? "bg-primary text-primary-fg" : "bg-surface-2"}`,
					children: c.name
				}, c.id))]
			}),
			activeParent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: chips.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCategory(c.id),
					className: `h-11 shrink-0 rounded-full px-4 text-sm ${category === c.id ? "bg-ink text-primary-fg" : "border border-border bg-surface"}`,
					children: c.name
				}, c.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: sort,
					onChange: (e) => setSort(e.target.value),
					className: "h-11 rounded-full border border-border bg-surface px-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "featured",
							children: "Featured"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "price_asc",
							children: "Price: low to high"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "price_desc",
							children: "Price: high to low"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [products.isPending ? "Looking" : `${shown.length} ${shown.length === 1 ? "piece" : "pieces"}`, q.trim() ? ` for “${q.trim()}”` : ""]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { products: shown })
		]
	});
}
//#endregion
export { SearchPage as component };
