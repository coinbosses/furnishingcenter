import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { m as STORE } from "./catalog-data-087TMwXI.mjs";
import { d as MapPin, l as Navigation, s as Phone, u as MessageCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-DQ0oBSdy.js
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-muted",
				children: "Showroom"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Visit Furnishing Center"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/banners/living-hero.jpg",
					alt: "Furnishing Center showroom living room",
					className: "aspect-video w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: STORE.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 flex gap-2 text-sm leading-relaxed text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0" }), STORE.address]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: ["Plus code ", STORE.plusCode]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: STORE.hours
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `tel:${STORE.phoneTel}`,
						className: "flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-fg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }),
							" Call ",
							STORE.phoneDisplay
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `https://wa.me/${STORE.whatsapp}`,
						className: "flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-surface text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " WhatsApp"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: STORE.mapsUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-surface text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "size-4" }), " Directions"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-muted",
							children: "Store pickup"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-3xl",
							children: "Collect in Karu"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: "Choose store pickup at checkout. The collection point is this showroom — Sen George Akume Way, New Karu. We hold in-stock pieces for you."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-muted",
							children: "Home delivery"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-3xl",
							children: "Across the FCT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: "Karu, Nyanya, Jabi, Wuse, Garki, Maitama, Asokoro, Gwarinpa and Lugbe. You enter the address at checkout. Large furniture is scheduled before it leaves the floor."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					{
						slug: "furniture",
						title: "Furniture",
						image: "/banners/living-hero.jpg",
						note: "Sofas, beds, tables, lighting"
					},
					{
						slug: "appliances",
						title: "Appliances",
						image: "/banners/kitchen-hero.jpg",
						note: "Cold, laundry, cooking, cooling"
					},
					{
						slug: "electronics",
						title: "Electronics",
						image: "/products/tv-75.jpg",
						note: "Televisions, sound, small electronics"
					}
				].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/categories/$slug",
					params: { slug: d.slug },
					className: "overflow-hidden rounded-xl bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: d.image,
						alt: "",
						className: "aspect-[4/3] w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl",
							children: d.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: d.note
						})]
					})]
				}, d.slug))
			})
		]
	});
}
//#endregion
export { ContactPage as component };
