import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { _ as listProducts, u as useCart } from "./router-Ba_FUwPp.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { n as formatNaira, t as deliveryFeeFor } from "./money-DjeZ0LfL.mjs";
import { t as PriceTag } from "./price-tag-7NSvamv2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-BDwOKbeI.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const items = useCart((s) => s.items);
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const products = useQuery({
		queryKey: ["products", "all"],
		queryFn: () => listProducts({ data: {} })
	}).data ?? [];
	const lines = items.map((item) => {
		const product = products.find((p) => p.id === item.productId);
		if (!product) return null;
		return {
			item,
			product,
			line: product.price * item.quantity
		};
	}).filter((x) => Boolean(x));
	const subtotal = lines.reduce((n, l) => n + l.line, 0);
	const delivery = deliveryFeeFor(subtotal, "delivery");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-muted",
				children: "Bag"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl md:text-5xl",
				children: "Cart"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted",
				children: "Home delivery or pickup at the Karu showroom. You choose at checkout, with card or Zenith Bank transfer."
			})
		] }), !lines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-surface p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: "Your cart is empty"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Furniture, appliances and electronics are separate floors."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/categories",
						children: "Continue shopping"
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 md:grid-cols-[1fr_18rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-4",
				children: lines.map(({ item, product }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 rounded-xl bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/product/$slug",
						params: { slug: product.id },
						className: "size-24 shrink-0 overflow-hidden rounded-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.images[0],
							alt: "",
							className: "size-full object-cover"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/product/$slug",
								params: { slug: product.id },
								className: "font-medium",
								children: product.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: [item.color, item.size].filter(Boolean).join(" · ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTag, {
								price: product.price,
								compareAt: product.compareAt,
								className: "mt-1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex h-9 items-center rounded-full border border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "w-9",
											onClick: () => setQty(item, item.quantity - 1),
											children: "−"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-6 text-center text-sm tabular-nums",
											children: item.quantity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "w-9",
											onClick: () => setQty(item, item.quantity + 1),
											children: "+"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs text-muted underline",
									onClick: () => remove(item),
									children: "Remove"
								})]
							})
						]
					})]
				}, `${item.productId}-${item.color}-${item.size}`))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Summary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Subtotal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: formatNaira(subtotal)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Delivery from"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: delivery === 0 ? "Free" : formatNaira(delivery)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 flex justify-between border-t border-border pt-4 font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: formatNaira(subtotal + delivery)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted",
						children: [
							"Free delivery on orders from ",
							formatNaira(4e5),
							". Pickup in Karu is free."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-5 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/checkout",
							children: "Checkout"
						})
					})
				]
			})]
		})]
	});
}
//#endregion
export { CartPage as component };
