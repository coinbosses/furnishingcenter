import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListCustomers, adminSetRole } from "@/lib/server/admin";
import { formatNaira } from "@/lib/money";

export const Route = createFileRoute("/admin/customers")({ component: AdminCustomers });

function AdminCustomers() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["admin-customers"], queryFn: () => adminListCustomers() });
  const setRole = useMutation({
    mutationFn: (d: { userId: string; role: "admin" | "customer" }) => adminSetRole({ data: d }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-customers"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Customers</h1>
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {(list.data ?? []).map((c) => (
          <li key={c.userId} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span>
              <span className="block font-medium">{c.fullName || c.email || c.userId}</span>
              <span className="text-muted">
                {c.phone} · {c.orderCount} orders · {formatNaira(c.spent)}
              </span>
            </span>
            <button
              type="button"
              className="text-xs underline"
              onClick={() =>
                setRole.mutate({ userId: c.userId, role: c.role === "admin" ? "customer" : "admin" })
              }
            >
              {c.role === "admin" ? "Admin · make customer" : "Make admin"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
