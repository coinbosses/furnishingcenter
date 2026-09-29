import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminOverview } from "@/lib/server/admin";
import { ORDER_LABELS, type OrderStatus } from "@/lib/constants";
import { formatNaira } from "@/lib/money";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const { data, isPending, error } = useQuery({ queryKey: ["admin-overview"], queryFn: () => adminOverview() });
  if (isPending) return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;
  if (error || !data) return <p className="text-sm text-danger">Could not load overview.</p>;

  const stats = [
    { label: "Revenue (paid)", value: formatNaira(data.revenue) },
    { label: "Orders", value: String(data.orderCount) },
    { label: "Open orders", value: String(data.openOrders) },
    { label: "Products", value: String(data.productCount) },
    { label: "Low stock", value: String(data.lowStock) },
    { label: "Customers", value: String(data.customerCount) },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">Sales overview</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-surface p-4">
            <p className="text-xs uppercase tracking-widest text-muted">{s.label}</p>
            <p className="mt-2 font-display text-3xl tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm text-muted hover:text-ink">
            All orders
          </Link>
        </div>
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {data.recent.map((o) => (
            <li key={o.id}>
              <Link to="/admin/orders/$id" params={{ id: o.id }} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>
                  {o.id}
                  <span className="ml-2 text-muted">{ORDER_LABELS[o.status as OrderStatus] ?? o.status}</span>
                </span>
                <span className="tabular-nums">{formatNaira(o.total)}</span>
              </Link>
            </li>
          ))}
          {!data.recent.length ? <li className="px-4 py-6 text-sm text-muted">No orders yet.</li> : null}
        </ul>
      </section>
    </div>
  );
}
