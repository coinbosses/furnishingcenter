import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { adminGetOrder, adminUpdateOrder } from "@/lib/server/admin";
import { ORDER_FLOW, ORDER_LABELS, type OrderStatus } from "@/lib/constants";
import { formatNaira } from "@/lib/money";

export const Route = createFileRoute("/admin/orders/$id")({ component: AdminOrderDetail });

function AdminOrderDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const orderQ = useQuery({ queryKey: ["admin-order", id], queryFn: () => adminGetOrder({ data: { id } }) });
  const update = useMutation({
    mutationFn: (data: { status?: string; paymentStatus?: "pending" | "paid"; note?: string }) =>
      adminUpdateOrder({ data: { id, ...data } }),
    onSuccess: () => {
      toast.success("Order updated");
      void qc.invalidateQueries({ queryKey: ["admin-order", id] });
      void qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const order = orderQ.data;
  if (orderQ.isPending) return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">{order.id}</h1>
        <p className="text-sm text-muted">
          {order.customerName} · {order.customerPhone} · {ORDER_LABELS[order.status as OrderStatus]}
        </p>
      </header>
      <ul className="space-y-2 text-sm">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between">
            <span>
              {i.name} × {i.quantity}
            </span>
            <span className="tabular-nums">{formatNaira(i.unitPrice * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="font-medium tabular-nums">Total {formatNaira(order.total)}</p>
      <p className="text-sm text-muted">
        {order.fulfillment === "pickup" ? "Store pickup" : "Delivery"} · {order.paymentMethod} · {order.paymentStatus}
      </p>
      <div className="flex flex-wrap gap-2">
        {ORDER_FLOW.map((s) => (
          <Button
            key={s.id}
            size="sm"
            variant={order.status === s.id ? "default" : "outline"}
            onClick={() => update.mutate({ status: s.id })}
          >
            {s.label}
          </Button>
        ))}
        <Button size="sm" variant="outline" onClick={() => update.mutate({ status: "cancelled" })}>
          Cancel
        </Button>
      </div>
      {order.paymentStatus !== "paid" ? (
        <Button variant="secondary" onClick={() => update.mutate({ paymentStatus: "paid", status: "confirmed" })}>
          Mark transfer paid
        </Button>
      ) : null}
      <ul className="space-y-1 text-sm text-muted">
        {order.events.map((e) => (
          <li key={e.id}>{e.note}</li>
        ))}
      </ul>
    </div>
  );
}
