import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { CANCELLABLE, ORDER_FLOW, ORDER_LABELS, STORE, type OrderStatus } from "@/lib/constants";
import { formatNaira } from "@/lib/money";
import { cancelMyOrder, getMyOrder } from "@/lib/server/orders";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/orders/$id")({ component: OrderDetailPage });

function OrderDetailPage() {
  const { id } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const orderQ = useQuery({
    queryKey: ["order", id],
    queryFn: () => getMyOrder({ data: { id } }),
    enabled: Boolean(user),
  });
  const cancel = useMutation({
    mutationFn: () => cancelMyOrder({ data: { id } }),
    onSuccess: () => {
      toast.success("Order cancelled");
      void qc.invalidateQueries({ queryKey: ["order", id] });
      void qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isPending) return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;
  if (!user) return <RedirectToSignIn />;
  const order = orderQ.data;
  if (orderQ.isPending) return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;
  if (!order) return <p className="text-sm text-muted">Order not found.</p>;

  const status = order.status as OrderStatus;
  const step = ORDER_FLOW.findIndex((s) => s.id === status);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Order</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{order.id}</h1>
        <p className="mt-1 text-sm text-muted">{ORDER_LABELS[status] ?? status}</p>
      </header>

      {status !== "cancelled" ? (
        <ol className="space-y-3">
          {ORDER_FLOW.map((s, i) => (
            <li key={s.id} className="flex gap-3 text-sm">
              <span
                className={cn(
                  "mt-0.5 size-3 shrink-0 rounded-full",
                  i <= step ? "bg-primary" : "bg-surface-2",
                )}
              />
              <span className={i <= step ? "text-ink" : "text-muted"}>{s.label}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm">This order was cancelled.</p>
      )}

      <ul className="space-y-3">
        {order.items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <Link to="/product/$slug" params={{ slug: item.productId }} className="size-16 overflow-hidden rounded-md bg-surface-2">
              {item.imageUrl ? <img src={item.imageUrl} alt="" className="size-full object-cover" /> : null}
            </Link>
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-muted">
                {item.quantity} × {formatNaira(item.unitPrice)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-border bg-surface p-4 text-sm">
        <p className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span className="tabular-nums">{formatNaira(order.subtotal)}</span>
        </p>
        <p className="mt-2 flex justify-between">
          <span className="text-muted">Delivery</span>
          <span className="tabular-nums">{order.deliveryFee ? formatNaira(order.deliveryFee) : "Free"}</span>
        </p>
        <p className="mt-3 flex justify-between border-t border-border pt-3 font-medium">
          <span>Total</span>
          <span className="tabular-nums">{formatNaira(order.total)}</span>
        </p>
        <p className="mt-3 text-muted">
          {order.fulfillment === "pickup" ? `Pickup at ${STORE.pickupName}` : "Home delivery"} ·{" "}
          {order.paymentMethod === "card" ? "Card" : "Bank transfer"} · {order.paymentStatus === "paid" ? "Paid" : "Payment pending"}
        </p>
        {order.paymentMethod === "bank_transfer" && order.paymentStatus !== "paid" ? (
          <p className="mt-3 text-muted">
            Transfer to {STORE.bank.name}, {STORE.bank.accountName}, {STORE.bank.accountNumber}. Use {order.id} as the
            reference.
          </p>
        ) : null}
      </div>

      {order.events.length ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Updates</h2>
          <ul className="space-y-2 text-sm">
            {order.events.map((e) => (
              <li key={e.id} className="text-muted">
                {e.note}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {CANCELLABLE.has(status) ? (
        <Button variant="outline" disabled={cancel.isPending} onClick={() => cancel.mutate()}>
          Cancel order
        </Button>
      ) : null}
    </div>
  );
}
