import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as EXTENDED_IDS, m as STORE, o as MARBLE_IDS, p as SITTING_IDS } from "./catalog-data-087TMwXI.mjs";
import { a as ShieldCheck, d as MapPin, g as ArrowRight, n as Truck, u as MessageCircle } from "../_libs/lucide-react.mjs";
import { _ as listProducts, d as useRecent, l as Route$26 } from "./router-Ba_FUwPp.mjs";
import { t as PriceTag } from "./price-tag-7NSvamv2.mjs";
import { n as ProductRail, t as ProductGrid } from "./product-card-B2pDOTzh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B-ZAZ5mw.js
var import_jsx_runtime = require_jsx_runtime();
var ZONES = [
	"Karu",
	"Nyanya",
	"Jikwoyi",
	"Jabi",
	"Wuse",
	"Garki",
	"Maitama",
	"Asokoro",
	"Gwarinpa",
	"Lugbe"
];
function Home() {
	const data = Route$26.useLoaderData();
	const navigate = useNavigate();
	const recentIds = useRecent((s) => s.ids);
	const recent = (useQuery({
		queryKey: ["products", "all"],
		queryFn: () => listProducts({ data: {} })
	}).data ?? []).filter((p) => recentIds.includes(p.id));
	const parents = data.categories.filter((c) => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
	const hero = data.banners[0];
	const rest = data.banners.slice(1);
	const extendedSet = new Set(EXTENDED_IDS);
	const extended = data.advanced.filter((p) => extendedSet.has(p.id));
	const byId = new Map(data.advanced.map((p) => [p.id, p]));
	const sitting = SITTING_IDS.map((id) => byId.get(id)).filter((p) => Boolean(p));
	const marble = MARBLE_IDS.map((id) => byId.get(id)).filter((p) => Boolean(p));
	const spotlight = data.featured.find((p) => p.id === "wuse-curve-sofa") ?? data.featured[0];
	const beside = data.featured.filter((p) => p.id !== spotlight?.id).slice(0, 3);
	const pieceCount = Object.values(data.counts).reduce((n, c) => n + c, 0);
	function onSearch(e) {
		e.preventDefault();
		const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
		navigate({
			to: "/search",
			search: { q: q || void 0 }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-16 md:space-y-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "-mx-4 grid gap-3 md:mx-0 md:grid-cols-12",
				children: [hero ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-h-[32rem] overflow-hidden md:col-span-8 md:rounded-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: hero.imageUrl,
							alt: "",
							className: "absolute inset-0 size-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex h-full min-h-[32rem] flex-col justify-end p-6 text-primary-fg md:p-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.22em] text-primary-fg/75",
									children: "Furnishing Center · Karu, Abuja"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 max-w-xl font-display text-5xl leading-[0.95] md:text-7xl",
									children: hero.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-md text-sm leading-relaxed text-primary-fg/85",
									children: hero.subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: onSearch,
									className: "mt-6 flex max-w-lg gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "sr-only",
											htmlFor: "home-q",
											children: "Search the floor"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "home-q",
											name: "q",
											placeholder: "Search 3+2+1, marble dining, sofas…",
											className: "h-12 min-w-0 flex-1 rounded-full border border-primary-fg/25 bg-surface px-4 text-sm text-ink"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "h-12 shrink-0 rounded-full bg-surface px-5 text-sm font-medium text-ink",
											children: "Search"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap gap-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/categories/$slug",
											params: { slug: "furniture" },
											className: "inline-flex items-center gap-1",
											children: ["Furniture ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/categories/$slug",
											params: { slug: "appliances" },
											className: "inline-flex items-center gap-1 text-primary-fg/80",
											children: "Appliances"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/categories/$slug",
											params: { slug: "electronics" },
											className: "inline-flex items-center gap-1 text-primary-fg/80",
											children: "Electronics"
										})
									]
								})
							]
						})
					]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 px-4 md:col-span-4 md:px-0",
					children: rest.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroCard, { banner: b }, b.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						icon: MapPin,
						title: "Karu showroom",
						body: "Sit in it on Sen George Akume Way before you buy."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						icon: Truck,
						title: "FCT delivery",
						body: `${pieceCount} pieces. 3–7 working days. Large pieces are scheduled.`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						icon: ShieldCheck,
						title: "Named warranties",
						body: "Frame, mattress and appliance cover, written on every piece."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						icon: MessageCircle,
						title: "WhatsApp the floor",
						body: "Ask about stock, colour or a quote from any product."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "Departments",
				title: "Three floors, nothing mixed",
				href: "/categories",
				action: "All categories"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: parents.map((c) => {
					const n = data.categories.filter((child) => child.parentId === c.id).reduce((sum, child) => sum + (data.counts[child.id] ?? 0), 0);
					const leaves = data.categories.filter((child) => child.parentId === c.id).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/categories/$slug",
						params: { slug: c.id },
						className: "group relative overflow-hidden rounded-xl bg-surface",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "aspect-[4/3] overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: c.imageUrl,
									alt: "",
									className: "size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-x-0 bottom-0 p-5 text-primary-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-4xl",
										children: c.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-sm text-primary-fg/85",
										children: c.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs uppercase tracking-widest text-primary-fg/75",
										children: [
											leaves,
											" categories · ",
											n,
											" pieces"
										]
									})
								]
							})
						]
					}, c.id);
				})
			})] }),
			spotlight ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid items-center gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$slug",
					params: { slug: spotlight.id },
					className: "overflow-hidden rounded-xl bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: spotlight.images[0],
						alt: spotlight.name,
						className: "aspect-[4/3] w-full object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-muted",
						children: "On the floor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-4xl md:text-5xl",
						children: spotlight.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-md text-sm leading-relaxed text-muted",
						children: spotlight.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTag, {
						price: spotlight.price,
						compareAt: spotlight.compareAt,
						className: "mt-4 text-lg"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/product/$slug",
							params: { slug: spotlight.id },
							className: "inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-fg",
							children: "View this piece"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/categories/$slug",
							params: { slug: "sofas" },
							className: "inline-flex h-11 items-center text-sm text-muted",
							children: "All sofas"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 divide-y divide-border border-y border-border",
						children: beside.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/product/$slug",
							params: { slug: p.id },
							className: "flex items-center gap-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.images[0],
								alt: "",
								className: "size-16 rounded-md object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTag, {
									price: p.price,
									compareAt: p.compareAt
								})]
							})]
						}) }, p.id))
					})
				] })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "How a sitting room is bought",
				kicker: "Abuja sets",
				products: sitting,
				href: "/categories/$slug",
				params: { slug: "sofas" },
				action: "All sofas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "Marble and stone, with the chairs",
				kicker: "Dining",
				products: marble,
				href: "/categories/$slug",
				params: { slug: "dining-sets" },
				action: "All dining"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
					eyebrow: "New photographs",
					title: "Twenty pieces, each one itself",
					href: "/categories",
					action: "Shop by category"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-5 max-w-2xl text-sm leading-relaxed text-muted",
					children: "A curved bouclé sofa is not the linen three-seater. A five-burner cooker is not the four-burner. A washer-dryer combo is one machine, not a stack. A floor speaker is not a portable speaker."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { products: extended })
			] }),
			parents.map((parent) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryBand, {
				parent,
				categories: data.categories,
				counts: data.counts
			}, parent.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "On the floor now",
				kicker: "Featured",
				products: data.featured
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "Just arrived",
				kicker: "New",
				products: data.newArrivals
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "What Karu keeps reordering",
				kicker: "Best sellers",
				products: data.bestsellers
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid overflow-hidden rounded-xl bg-primary text-primary-fg md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/banners/living-hero.jpg",
					alt: "Furnishing Center living room",
					className: "aspect-[4/3] size-full object-cover md:aspect-auto md:min-h-80"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-center px-6 py-10 md:px-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-primary-fg/70",
							children: "Showroom · Karu"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-4xl md:text-5xl",
							children: "Come sit in it first"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 max-w-md text-sm leading-relaxed text-primary-fg/80",
							children: [
								STORE.address,
								". ",
								STORE.hours,
								". Large pieces are easier in person — call, WhatsApp, or request a quote from any product page."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								className: "inline-flex h-11 items-center rounded-full bg-surface px-5 text-sm font-medium text-ink",
								children: "Visit and contact"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `https://wa.me/${STORE.whatsapp}`,
								className: "inline-flex h-11 items-center rounded-full border border-primary-fg/30 px-5 text-sm",
								children: "WhatsApp"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
					eyebrow: "Where we deliver",
					title: "Across the FCT, or collect in Karu"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: ZONES.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-border bg-surface px-4 py-2 text-sm",
						children: z
					}, z))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Home delivery or showroom pickup. Pickup is at Furnishing Center on Sen George Akume Way. You set the delivery address at checkout. Card or Zenith Bank transfer."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "Marked down, still the same piece",
				kicker: "Offers",
				products: data.offers
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "Edit",
				title: "A short list worth starting with"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { products: data.recommended })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-8 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: "How a purchase works"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 space-y-4",
					children: [
						["Find the right room", "Furniture, appliances and electronics never share a category. Filters stay inside the one you opened."],
						["Check the photograph", "The picture is that piece. Styling in the room — a console under a television, a vase on a table — is called out when it is not included."],
						["Delivery or pickup", "Pay by card or transfer. Track the order from pending through delivered, or collect it in Karu."]
					].map(([title, body], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "grid grid-cols-[2.5rem_1fr] gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-3xl text-muted",
							children: ["0", i + 1]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm leading-relaxed text-muted",
							children: body
						})] })]
					}, title))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: "Before you ask"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 divide-y divide-border border-y border-border",
					children: [
						["Do you deliver outside Abuja?", "The standard run is the FCT. Further destinations are quoted on WhatsApp before we take payment."],
						["Can I see it before I pay?", "Yes. The Karu showroom is open through the week, and Sunday afternoons. Call ahead for a large piece."],
						["What if the colour is wrong?", "Every product lists its colours. If a finish is not on the page, it is not the one in stock."]
					].map(([q, a]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "group py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer text-sm font-medium",
							children: q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: a
						})]
					}, q))
				})] })]
			}),
			recent.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, { title: "Recently viewed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRail, { products: recent })] }) : null
		]
	});
}
function HeroCard({ banner }) {
	const slug = banner.ctaHref.replace("/categories/", "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/categories/$slug",
		params: { slug },
		className: "group relative block min-h-48 overflow-hidden rounded-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: banner.imageUrl,
				alt: "",
				className: "absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full min-h-48 flex-col justify-end p-5 text-primary-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl leading-tight",
						children: banner.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 line-clamp-2 text-sm text-primary-fg/85",
						children: banner.subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-3 inline-flex items-center gap-1 text-sm",
						children: [
							banner.ctaText,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
						]
					})
				]
			})
		]
	});
}
function Fact({ icon: Icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-ink" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: body
			})
		]
	});
}
function CategoryBand({ parent, categories, counts }) {
	const children = categories.filter((c) => c.parentId === parent.id).sort((a, b) => a.sortOrder - b.sortOrder);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		eyebrow: parent.name,
		title: "Exactly what is in here",
		href: "/categories/$slug",
		params: { slug: parent.id },
		action: "Shop the department"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4",
		children: children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/categories/$slug",
			params: { slug: c.id },
			className: "group overflow-hidden rounded-xl bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[4/3] overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: c.imageUrl,
					alt: "",
					className: "size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium leading-snug",
						children: c.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [counts[c.id] ?? 0, " pieces"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-xs leading-relaxed text-muted",
						children: c.description
					})
				]
			})]
		}, c.id))
	})] });
}
function SectionHead({ eyebrow, title, href, params, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-widest text-muted",
			children: eyebrow
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl md:text-4xl",
			children: title
		})] }), href && action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: href,
			params,
			className: "shrink-0 text-sm text-muted hover:text-ink",
			children: action
		}) : null]
	});
}
function Rail({ title, kicker, products, href = "/categories", params, action = "View all" }) {
	if (!products.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
		eyebrow: kicker,
		title,
		href,
		params,
		action
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductRail, { products })] });
}
//#endregion
export { Home as component };
