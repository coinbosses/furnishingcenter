import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ORDER_LABELS, type OrderStatus } from "@/lib/constants";
import { formatNaira } from "@/lib/money";
import { listMyOrders } from "@/lib/server/orders";

export const Route = createFileRoute("/account/orders")({ component: OrdersPage });

function OrdersPage() {
  const { user, isPending } = useCurrentUserState();
  const orders = useQuery({ queryKey: ["orders"], queryFn: () => listMyOrders(), enabled: Boolean(user) });
  if (isPending) return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Orders</h1>
      {!(orders.data ?? []).length ? (
        <p className="text-sm text-muted">No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {(orders.data ?? []).map((o) => (
            <li key={o.id}>
              <Link
                to="/account/orders/$id"
                params={{ id: o.id }}
                className="block rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-medium">{o.id}</p>
                  <p className="tabular-nums">{formatNaira(o.total)}</p>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {ORDER_LABELS[o.status as OrderStatus] ?? o.status} · {o.fulfillment === "pickup" ? "Pickup" : "Delivery"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
