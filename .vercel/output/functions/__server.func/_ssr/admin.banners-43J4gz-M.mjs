import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { n as Label, t as Input } from "./input-BsJ7Tovf.mjs";
import { a as adminListBanners, t as adminDeleteBanner, u as adminSaveBanner } from "./admin-K4UZHSlG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.banners-43J4gz-M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminBanners() {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["admin-banners"],
		queryFn: () => adminListBanners()
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [subtitle, setSubtitle] = (0, import_react.useState)("");
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const [ctaHref, setCtaHref] = (0, import_react.useState)("/categories");
	const save = useMutation({
		mutationFn: () => adminSaveBanner({ data: {
			title,
			subtitle,
			imageUrl,
			ctaText: "Shop now",
			ctaHref,
			sortOrder: (list.data?.length ?? 0) + 1,
			active: true
		} }),
		onSuccess: () => {
			setTitle("");
			setSubtitle("");
			setImageUrl("");
			qc.invalidateQueries({ queryKey: ["admin-banners"] });
		}
	});
	const del = useMutation({
		mutationFn: (id) => adminDeleteBanner({ data: { id } }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-banners"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Promotional banners"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: (list.data ?? []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 rounded-xl bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: b.imageUrl,
							alt: "",
							className: "h-16 w-24 rounded-md object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: b.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: b.subtitle
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-xs text-danger",
							onClick: () => del.mutate(b.id),
							children: "Remove"
						})
					]
				}, b.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "New banner"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Subtitle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: subtitle,
							onChange: (e) => setSubtitle(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Image URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: imageUrl,
							onChange: (e) => setImageUrl(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Link",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: ctaHref,
							onChange: (e) => setCtaHref(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => save.mutate(),
						disabled: !title || !imageUrl,
						children: "Add banner"
					})
				]
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { AdminBanners as component };
