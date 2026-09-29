import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useNavigate, S as Navigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { m as STORE } from "./catalog-data-087TMwXI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as listProducts, m as useCurrentUserState, u as useCart } from "./router-Ba_FUwPp.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-BsJ7Tovf.mjs";
import { n as getMyProfile, o as saveAddress, r as listMyAddresses } from "./account-BDZmsuxf.mjs";
import { i as placeOrder } from "./orders-tCsYrRRi.mjs";
import { n as formatNaira, t as deliveryFeeFor } from "./money-DjeZ0LfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-NlO8lSKa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		search: { redirect: "/checkout" }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutForm, {});
}
function CheckoutForm() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const items = useCart((s) => s.items);
	const clear = useCart((s) => s.clear);
	const productsQ = useQuery({
		queryKey: ["products", "all"],
		queryFn: () => listProducts({ data: {} })
	});
	const profileQ = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile()
	});
	const addrQ = useQuery({
		queryKey: ["addresses"],
		queryFn: () => listMyAddresses()
	});
	const [fulfillment, setFulfillment] = (0, import_react.useState)("delivery");
	const [payment, setPayment] = (0, import_react.useState)("card");
	const [addressId, setAddressId] = (0, import_react.useState)();
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [newAddr, setNewAddr] = (0, import_react.useState)(false);
	const [street, setStreet] = (0, import_react.useState)("");
	const [area, setArea] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("Abuja");
	(0, import_react.useEffect)(() => {
		if (profileQ.data) {
			setName((n) => n || profileQ.data.fullName);
			setPhone((p) => p || profileQ.data.phone);
		}
	}, [profileQ.data]);
	(0, import_react.useEffect)(() => {
		if (!addressId && addrQ.data?.[0]) setAddressId(addrQ.data[0].id);
	}, [addrQ.data, addressId]);
	const lines = items.map((item) => {
		const product = (productsQ.data ?? []).find((p) => p.id === item.productId);
		return product ? {
			item,
			product
		} : null;
	}).filter((x) => Boolean(x));
	const subtotal = lines.reduce((n, l) => n + l.product.price * l.item.quantity, 0);
	const fee = deliveryFeeFor(subtotal, fulfillment);
	const total = subtotal + fee;
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl",
			children: "Nothing to check out"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/cart",
			className: "mt-4 inline-block text-sm underline",
			children: "Back to cart"
		})]
	});
	async function onPlace() {
		setBusy(true);
		try {
			let addr = addressId;
			if (fulfillment === "delivery" && (newAddr || !addr)) {
				const list = await saveAddress({ data: {
					label: "Delivery",
					fullName: name,
					phone,
					street,
					area,
					city,
					state: "FCT",
					isDefault: true
				} });
				await qc.invalidateQueries({ queryKey: ["addresses"] });
				addr = list.find((a) => a.street === street)?.id ?? list[0]?.id;
			}
			const order = await placeOrder({ data: {
				items: items.map((i) => ({
					productId: i.productId,
					quantity: i.quantity,
					color: i.color,
					size: i.size
				})),
				fulfillment,
				addressId: fulfillment === "delivery" ? addr : void 0,
				paymentMethod: payment,
				notes,
				customerName: name,
				customerPhone: phone
			} });
			clear();
			toast.success("Order placed");
			await navigate({
				to: "/account/orders/$id",
				params: { id: order.id }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not place order");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 md:grid-cols-[1fr_20rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: "Checkout"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl",
					children: "Your details"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								required: true
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Fulfillment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: ["delivery", "pickup"].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setFulfillment(f),
							className: `rounded-xl border p-4 text-left text-sm ${fulfillment === f ? "border-ink bg-surface" : "border-border"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: f === "delivery" ? "Home delivery" : "Store pickup"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted",
								children: f === "delivery" ? "Across Abuja & Karu" : STORE.pickupName
							})]
						}, f))
					})]
				}),
				fulfillment === "delivery" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Delivery address"
						}),
						(addrQ.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex gap-3 rounded-xl border border-border bg-surface p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								checked: addressId === a.id && !newAddr,
								onChange: () => {
									setAddressId(a.id);
									setNewAddr(false);
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: a.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-muted",
								children: [
									a.street,
									", ",
									a.area,
									" ",
									a.city
								]
							})] })]
						}, a.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm underline",
							onClick: () => setNewAddr(true),
							children: "Use a new address"
						}),
						newAddr || !(addrQ.data ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Street and house",
									value: street,
									onChange: (e) => setStreet(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Area (Garki, Wuse, Karu…)",
									value: area,
									onChange: (e) => setArea(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "City",
									value: city,
									onChange: (e) => setCity(e.target.value)
								})
							]
						}) : null
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-4 text-sm text-muted",
					children: [
						"Pickup at ",
						STORE.address,
						". We will call when your order is ready."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex gap-3 rounded-xl border border-border bg-surface p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								checked: payment === "card",
								onChange: () => setPayment("card")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Card"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-muted",
								children: "Pay now. Your order is confirmed immediately."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex gap-3 rounded-xl border border-border bg-surface p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								checked: payment === "bank_transfer",
								onChange: () => setPayment("bank_transfer")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Bank transfer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-muted",
								children: [
									STORE.bank.name,
									" · ",
									STORE.bank.accountName,
									" · ",
									STORE.bank.accountNumber
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Order notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								placeholder: "Estate gate code, preferred delivery day…"
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "h-fit rounded-xl border border-border bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Order summary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3 text-sm",
					children: lines.map(({ item, product }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								product.name,
								" × ",
								item.quantity
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: formatNaira(product.price * item.quantity)
						})]
					}, item.productId + (item.color ?? "")))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Delivery"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: fee === 0 ? "Free" : formatNaira(fee)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 flex justify-between border-t border-border pt-4 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatNaira(total)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5 w-full",
					disabled: busy || !name || !phone,
					onClick: () => void onPlace(),
					children: busy ? "Placing…" : payment === "card" ? "Pay and place order" : "Place order"
				})
			]
		})]
	});
}
//#endregion
export { CheckoutPage as component };
