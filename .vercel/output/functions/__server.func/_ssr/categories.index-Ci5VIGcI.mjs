import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { _ as listProducts, g as listCategories } from "./router-Ba_FUwPp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories.index-Ci5VIGcI.js
var import_jsx_runtime = require_jsx_runtime();
function CategoriesPage() {
	const { data = [], isPending } = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	const products = useQuery({
		queryKey: ["products", "all"],
		queryFn: () => listProducts({ data: {} })
	});
	const parents = data.filter((c) => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
	const countOf = (id) => (products.data ?? []).filter((p) => p.categoryId === id).length;
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-muted",
				children: "Catalogue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl md:text-5xl",
				children: "Categories"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
				children: "Furniture, appliances and electronics stay in their own departments. Open a category and you only see pieces that belong there — a freezer is never listed as a refrigerator, and a soundbar is never a television."
			})
		] }), parents.map((parent) => {
			const children = data.filter((c) => c.parentId === parent.id).sort((a, b) => a.sortOrder - b.sortOrder);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/categories/$slug",
				params: { slug: parent.id },
				className: "group mb-4 grid overflow-hidden rounded-xl bg-surface md:grid-cols-[1.2fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[16/9] overflow-hidden md:aspect-auto md:min-h-48",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: parent.imageUrl,
						alt: "",
						className: "size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-end p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-muted",
							children: "Department"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-4xl",
							children: parent.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: parent.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm",
							children: [
								children.reduce((n, c) => n + countOf(c.id), 0),
								" pieces · shop all ",
								parent.name.toLowerCase()
							]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/categories/$slug",
					params: { slug: c.id },
					className: "overflow-hidden rounded-xl bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[4/3] overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.imageUrl,
							alt: "",
							className: "size-full object-cover"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [countOf(c.id), " pieces"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-xs leading-relaxed text-muted",
								children: c.description
							})
						]
					})]
				}, c.id))
			})] }, parent.id);
		})]
	});
}
//#endregion
export { CategoriesPage as component };
