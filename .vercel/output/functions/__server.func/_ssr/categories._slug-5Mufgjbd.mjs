import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { o as Route$5 } from "./router-Ba_FUwPp.mjs";
import { t as ProductGrid } from "./product-card-B2pDOTzh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories._slug-5Mufgjbd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	const { slug } = Route$5.useParams();
	const { categories, products } = Route$5.useLoaderData();
	const [sort, setSort] = (0, import_react.useState)("featured");
	const [inStock, setInStock] = (0, import_react.useState)(false);
	const [band, setBand] = (0, import_react.useState)("all");
	const category = categories.find((c) => c.id === slug);
	const children = categories.filter((c) => c.parentId === slug).sort((a, b) => a.sortOrder - b.sortOrder);
	const parent = categories.find((c) => c.id === category?.parentId);
	const siblings = parent ? categories.filter((c) => c.parentId === parent.id).sort((a, b) => a.sortOrder - b.sortOrder) : [];
	const shown = (0, import_react.useMemo)(() => {
		let list = [...products];
		if (inStock) list = list.filter((p) => p.stock > 0);
		if (band === "under") list = list.filter((p) => p.price < 1e5);
		if (band === "mid") list = list.filter((p) => p.price >= 1e5 && p.price < 4e5);
		if (band === "high") list = list.filter((p) => p.price >= 4e5);
		list.sort((a, b) => {
			if (sort === "price_asc") return a.price - b.price;
			if (sort === "price_desc") return b.price - a.price;
			if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
			const score = (p) => (p.featured ? 4 : 0) + (p.bestseller ? 2 : 0) + (p.newArrival ? 1 : 0);
			return score(b) - score(a);
		});
		return list;
	}, [
		products,
		sort,
		inStock,
		band
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/categories",
						className: "hover:text-ink",
						children: "Categories"
					}),
					parent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-1",
						children: "/"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/categories/$slug",
						params: { slug: parent.id },
						className: "hover:text-ink",
						children: parent.name
					})] }) : null,
					category ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-1",
						children: "/"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-ink",
						children: category.name
					})] }) : null
				]
			}),
			category?.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: category.imageUrl,
						alt: "",
						className: "aspect-[16/9] w-full object-cover md:aspect-[21/9]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 p-5 text-primary-fg md:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-4xl md:text-5xl",
								children: category.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-xl text-sm text-primary-fg/85",
								children: category.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs uppercase tracking-widest text-primary-fg/75",
								children: children.length ? `${shown.length} pieces across this department, nothing else` : `${shown.length} pieces filed only here`
							})
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: category?.name ?? "Category"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: category?.description
			})] }),
			children.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-3 text-sm font-medium",
						children: c.name
					})]
				}, c.id))
			}) : null,
			siblings.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/categories/$slug",
					params: { slug: parent.id },
					className: "shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-sm",
					children: ["All ", parent.name.toLowerCase()]
				}), siblings.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/categories/$slug",
					params: { slug: c.id },
					className: `shrink-0 rounded-full px-4 py-2 text-sm ${c.id === slug ? "bg-primary text-primary-fg" : "border border-border bg-surface"}`,
					children: c.name
				}, c.id))]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						className: "h-11 rounded-full border border-border bg-surface px-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "featured",
								children: "Featured"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "newest",
								children: "Newest"
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: inStock,
							onChange: (e) => setInStock(e.target.checked)
						}), "In stock"]
					}),
					[
						["all", "Any price"],
						["under", "Under ₦100k"],
						["mid", "₦100–400k"],
						["high", "₦400k+"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setBand(id),
						className: `h-11 rounded-full px-4 text-sm ${band === id ? "bg-primary text-primary-fg" : "border border-border bg-surface"}`,
						children: label
					}, id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "ml-auto text-sm text-muted",
						children: [shown.length, " pieces"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { products: shown })
		]
	});
}
//#endregion
export { CategoryPage as component };
