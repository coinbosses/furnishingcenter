import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminListOrders } from "@/lib/server/admin";
import { ORDER_LABELS, type OrderStatus } from "@/lib/constants";
import { formatNaira } from "@/lib/money";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

function AdminOrders() {
  const list = useQuery({ queryKey: ["admin-orders"], queryFn: () => adminListOrders() });
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Orders</h1>
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {(list.data ?? []).map((o) => (
          <li key={o.id}>
            <Link to="/admin/orders/$id" params={{ id: o.id }} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>
                <span className="font-medium">{o.id}</span>
                <span className="ml-2 text-muted">
                  {o.customerName} · {ORDER_LABELS[o.status as OrderStatus] ?? o.status}
                </span>
              </span>
              <span className="tabular-nums">{formatNaira(o.total)}</span>
            </Link>
          </li>
        ))}
        {list.data && !list.data.length ? <li className="px-4 py-6 text-sm text-muted">No orders yet.</li> : null}
      </ul>
    </div>
  );
}
