import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { _ as cn, c as ORDER_LABELS, m as STORE, n as CANCELLABLE, s as ORDER_FLOW } from "./catalog-data-087TMwXI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Route$3, m as useCurrentUserState } from "./router-Ba_FUwPp.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { t as RedirectToSignIn } from "./gates-hsNySADr.mjs";
import { n as getMyOrder, t as cancelMyOrder } from "./orders-tCsYrRRi.mjs";
import { n as formatNaira } from "./money-DjeZ0LfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.orders._id-DvGW1FFw.js
var import_jsx_runtime = require_jsx_runtime();
function OrderDetailPage() {
	const { id } = Route$3.useParams();
	const { user, isPending } = useCurrentUserState();
	const qc = useQueryClient();
	const orderQ = useQuery({
		queryKey: ["order", id],
		queryFn: () => getMyOrder({ data: { id } }),
		enabled: Boolean(user)
	});
	const cancel = useMutation({
		mutationFn: () => cancelMyOrder({ data: { id } }),
		onSuccess: () => {
			toast.success("Order cancelled");
			qc.invalidateQueries({ queryKey: ["order", id] });
			qc.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const order = orderQ.data;
	if (orderQ.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" });
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Order not found."
	});
	const status = order.status;
	const step = ORDER_FLOW.findIndex((s) => s.id === status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: "Order"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl",
					children: order.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: ORDER_LABELS[status] ?? status
				})
			] }),
			status !== "cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-3",
				children: ORDER_FLOW.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-0.5 size-3 shrink-0 rounded-full", i <= step ? "bg-primary" : "bg-surface-2") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: i <= step ? "text-ink" : "text-muted",
						children: s.label
					})]
				}, s.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-surface-2 px-4 py-3 text-sm",
				children: "This order was cancelled."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: order.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/product/$slug",
						params: { slug: item.productId },
						className: "size-16 overflow-hidden rounded-md bg-surface-2",
						children: item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.imageUrl,
							alt: "",
							className: "size-full object-cover"
						}) : null
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: item.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								item.quantity,
								" × ",
								formatNaira(item.unitPrice)
							]
						})]
					})]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Subtotal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: formatNaira(order.subtotal)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Delivery"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: order.deliveryFee ? formatNaira(order.deliveryFee) : "Free"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 flex justify-between border-t border-border pt-3 font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: formatNaira(order.total)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-muted",
						children: [
							order.fulfillment === "pickup" ? `Pickup at ${STORE.pickupName}` : "Home delivery",
							" ·",
							" ",
							order.paymentMethod === "card" ? "Card" : "Bank transfer",
							" · ",
							order.paymentStatus === "paid" ? "Paid" : "Payment pending"
						]
					}),
					order.paymentMethod === "bank_transfer" && order.paymentStatus !== "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-muted",
						children: [
							"Transfer to ",
							STORE.bank.name,
							", ",
							STORE.bank.accountName,
							", ",
							STORE.bank.accountNumber,
							". Use ",
							order.id,
							" as the reference."
						]
					}) : null
				]
			}),
			order.events.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-xl",
				children: "Updates"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: order.events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-muted",
					children: e.note
				}, e.id))
			})] }) : null,
			CANCELLABLE.has(status) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				disabled: cancel.isPending,
				onClick: () => cancel.mutate(),
				children: "Cancel order"
			}) : null
		]
	});
}
//#endregion
export { OrderDetailPage as component };
