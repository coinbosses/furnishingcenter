import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { c as ORDER_LABELS, s as ORDER_FLOW } from "./catalog-data-087TMwXI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$2 } from "./router-Ba_FUwPp.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { n as formatNaira } from "./money-DjeZ0LfL.mjs";
import { i as adminGetOrder, m as adminUpdateOrder } from "./admin-K4UZHSlG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders._id-B1mNhdK2.js
var import_jsx_runtime = require_jsx_runtime();
function AdminOrderDetail() {
	const { id } = Route$2.useParams();
	const qc = useQueryClient();
	const orderQ = useQuery({
		queryKey: ["admin-order", id],
		queryFn: () => adminGetOrder({ data: { id } })
	});
	const update = useMutation({
		mutationFn: (data) => adminUpdateOrder({ data: {
			id,
			...data
		} }),
		onSuccess: () => {
			toast.success("Order updated");
			qc.invalidateQueries({ queryKey: ["admin-order", id] });
			qc.invalidateQueries({ queryKey: ["admin-orders"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const order = orderQ.data;
	if (orderQ.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" });
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Order not found." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: order.id
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					order.customerName,
					" · ",
					order.customerPhone,
					" · ",
					ORDER_LABELS[order.status]
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: order.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						i.name,
						" × ",
						i.quantity
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatNaira(i.unitPrice * i.quantity)
					})]
				}, i.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-medium tabular-nums",
				children: ["Total ", formatNaira(order.total)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					order.fulfillment === "pickup" ? "Store pickup" : "Delivery",
					" · ",
					order.paymentMethod,
					" · ",
					order.paymentStatus
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [ORDER_FLOW.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: order.status === s.id ? "default" : "outline",
					onClick: () => update.mutate({ status: s.id }),
					children: s.label
				}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => update.mutate({ status: "cancelled" }),
					children: "Cancel"
				})]
			}),
			order.paymentStatus !== "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => update.mutate({
					paymentStatus: "paid",
					status: "confirmed"
				}),
				children: "Mark transfer paid"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-sm text-muted",
				children: order.events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e.note }, e.id))
			})
		]
	});
}
//#endregion
export { AdminOrderDetail as component };
