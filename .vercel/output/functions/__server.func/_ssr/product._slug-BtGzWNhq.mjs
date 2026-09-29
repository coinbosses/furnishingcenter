import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { C as stockStatus, S as stockLabel, _ as cn, m as STORE } from "./catalog-data-087TMwXI.mjs";
import { m as Heart, s as Phone, u as MessageCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as listProducts, a as Route$4, d as useRecent, g as listCategories, h as getProduct, m as useCurrentUserState, u as useCart, v as relatedProducts } from "./router-Ba_FUwPp.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-BsJ7Tovf.mjs";
import { s as submitInquiry } from "./account-BDZmsuxf.mjs";
import { t as PriceTag } from "./price-tag-7NSvamv2.mjs";
import { n as ProductRail, r as useWish } from "./product-card-B2pDOTzh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-BtGzWNhq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { slug } = Route$4.useParams();
	const navigate = useNavigate();
	const productQ = useQuery({
		queryKey: ["product", slug],
		queryFn: () => getProduct({ data: { id: slug } })
	});
	const product = productQ.data;
	const relatedQ = useQuery({
		queryKey: [
			"related",
			slug,
			product?.categoryId
		],
		queryFn: () => relatedProducts({ data: {
			id: slug,
			categoryId: product.categoryId
		} }),
		enabled: Boolean(product)
	});
	const allQ = useQuery({
		queryKey: ["products", "all"],
		queryFn: () => listProducts({ data: {} })
	});
	const catsQ = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	const pushRecent = useRecent((s) => s.push);
	const recentIds = useRecent((s) => s.ids);
	const add = useCart((s) => s.add);
	const wish = useWish();
	const { user } = useCurrentUserState();
	const [image, setImage] = (0, import_react.useState)(0);
	const [color, setColor] = (0, import_react.useState)();
	const [size, setSize] = (0, import_react.useState)();
	const [qty, setQty] = (0, import_react.useState)(1);
	const [askOpen, setAskOpen] = (0, import_react.useState)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (product) {
			pushRecent(product.id);
			setImage(0);
			setColor(product.colors[0]?.name);
			setSize(product.sizes[0]);
			setQty(1);
		}
	}, [product, pushRecent]);
	if (productQ.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square animate-pulse rounded-xl bg-surface-2" });
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl",
			children: "Piece not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/categories",
			className: "mt-4 inline-block text-sm underline",
			children: "Back to categories"
		})]
	});
	const status = stockStatus(product.stock);
	const wished = wish.has(product.id);
	const recent = (allQ.data ?? []).filter((p) => recentIds.includes(p.id) && p.id !== product.id);
	const category = catsQ.data?.find((c) => c.id === product.categoryId);
	const parent = catsQ.data?.find((c) => c.id === category?.parentId);
	const wa = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hello Furnishing Center, I want to ask about ${product.name} (${product.id}).`)}`;
	function addLine(goCheckout) {
		if (status === "out_of_stock") {
			toast.error("This piece is currently out of stock");
			return;
		}
		add({
			productId: product.id,
			quantity: qty,
			color,
			size
		});
		toast.success("Added to cart");
		if (goCheckout) navigate({ to: "/checkout" });
	}
	async function sendInquiry() {
		if (!user) {
			navigate({
				to: "/login",
				search: { redirect: `/product/${slug}` }
			});
			return;
		}
		try {
			await submitInquiry({ data: {
				productId: product.id,
				kind: askOpen ?? "ask",
				message,
				phone
			} });
			toast.success(askOpen === "quote" ? "Quote requested" : "Message sent");
			setAskOpen(null);
			setMessage("");
		} catch {
			toast.error("Could not send. Try WhatsApp instead.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-12",
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/categories/$slug",
						params: { slug: category.id },
						className: "hover:text-ink",
						children: category.name
					})] }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-xl bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.images[image] ?? product.images[0],
						alt: product.name,
						className: "aspect-[4/3] w-full object-cover"
					})
				}), product.images.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-2 overflow-x-auto",
					children: product.images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setImage(i),
						className: cn("size-16 shrink-0 overflow-hidden rounded-md border", i === image ? "border-ink" : "border-transparent"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src,
							alt: "",
							className: "size-full object-cover"
						})
					}, src + i))
				}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-muted",
						children: status === "out_of_stock" ? "Unavailable" : stockLabel(product.stock)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl leading-tight",
						children: product.name
					}),
					category ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: [
							"Filed under",
							" ",
							parent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/categories/$slug",
								params: { slug: parent.id },
								className: "underline",
								children: parent.name
							}), " / "] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/categories/$slug",
								params: { slug: category.id },
								className: "underline",
								children: category.name
							}),
							". ",
							category.description
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTag, {
						price: product.price,
						compareAt: product.compareAt,
						className: "mt-3 text-xl"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: product.description
					}),
					product.colors.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-muted",
							children: ["Colour — ", color]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-2",
							children: product.colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": c.name,
								onClick: () => setColor(c.name),
								className: cn("size-11 rounded-full border-2", color === c.name ? "border-ink" : "border-border"),
								style: { background: c.hex }
							}, c.name))
						})]
					}) : null,
					product.sizes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-muted",
							children: "Size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: product.sizes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSize(s),
								className: cn("h-10 rounded-full px-4 text-sm", size === s ? "bg-primary text-primary-fg" : "bg-surface-2"),
								children: s
							}, s))
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-12 items-center rounded-full border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "size-12",
									onClick: () => setQty(Math.max(1, qty - 1)),
									children: "−"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-8 text-center tabular-nums",
									children: qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "size-12",
									onClick: () => setQty(Math.min(product.stock || 1, qty + 1)),
									children: "+"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1",
							disabled: status === "out_of_stock",
							onClick: () => addLine(false),
							children: "Add to cart"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "mt-3 w-full",
						disabled: status === "out_of_stock",
						onClick: () => addLine(true),
						children: "Buy now"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => void wish.toggle(product.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", wished && "fill-ink") }), wished ? "Saved" : "Wishlist"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: wa,
							className: "inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm hover:bg-surface-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " WhatsApp"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setAskOpen("ask"),
							children: "Ask about this"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setAskOpen("quote"),
							children: "Request a quote"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-8 space-y-3 border-t border-border pt-6 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Dimensions",
								value: product.dimensions
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Material",
								value: product.material
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Warranty",
								value: product.warranty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Delivery",
								value: product.deliveryInfo
							})
						]
					}),
					Object.keys(product.specs).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-4 space-y-3 text-sm",
						children: Object.entries(product.specs).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: k,
							value: v
						}, k))
					}) : null
				] })]
			}),
			(relatedQ.data ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 font-display text-2xl",
				children: "Related pieces"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRail, { products: relatedQ.data ?? [] })] }) : null,
			recent.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 font-display text-2xl",
				children: "Recently viewed"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRail, { products: recent })] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-16 z-20 border-t border-border bg-surface/95 p-3 backdrop-blur md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: product.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTag, {
							price: product.price,
							compareAt: product.compareAt
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: status === "out_of_stock",
						onClick: () => addLine(false),
						children: "Add to cart"
					})]
				})
			}),
			askOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 grid place-items-end bg-ink/40 p-4 md:place-items-center",
				onClick: () => setAskOpen(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-xl bg-surface p-5",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl",
							children: askOpen === "quote" ? "Request a quote" : "Ask about this piece"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: product.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: phone,
										onChange: (e) => setPhone(e.target.value),
										placeholder: "080…"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: message,
										onChange: (e) => setMessage(e.target.value),
										placeholder: "Colour, size, delivery area…"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "w-full",
									onClick: () => void sendInquiry(),
									children: "Send"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${STORE.phoneTel}`,
									className: "flex h-11 items-center justify-center gap-2 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }),
										" Call ",
										STORE.phoneDisplay
									]
								})
							]
						})
					]
				})
			}) : null
		]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[8rem_1fr] gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: value })]
	});
}
//#endregion
export { ProductPage as component };
