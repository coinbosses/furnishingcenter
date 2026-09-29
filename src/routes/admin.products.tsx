import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { adminDeleteProduct, adminListProducts } from "@/lib/server/admin";
import { formatNaira } from "@/lib/money";
import { stockLabel } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

function AdminProducts() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["admin-products"], queryFn: () => adminListProducts() });
  const del = useMutation({
    mutationFn: (id: string) => adminDeleteProduct({ data: { id } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Products</h1>
        <Button asChild>
          <Link to="/admin/products/$id" params={{ id: "new" }}>
            Add product
          </Link>
        </Button>
      </div>
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {(list.data ?? []).map((p) => (
          <li key={p.id} className="flex items-center gap-3 px-3 py-3">
            <img src={p.images[0]} alt="" className="size-14 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
              <Link to="/admin/products/$id" params={{ id: p.id }} className="font-medium">
                {p.name}
              </Link>
              <p className="text-xs text-muted">
                {formatNaira(p.price)} · {stockLabel(p.stock)}
              </p>
            </div>
            <button type="button" className="text-xs text-danger" onClick={() => del.mutate(p.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
