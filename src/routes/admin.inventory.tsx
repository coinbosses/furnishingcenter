import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListProducts, adminUpdatePrice, adminUpdateStock } from "@/lib/server/admin";
import { formatNaira } from "@/lib/money";
import { stockLabel } from "@/lib/utils";

export const Route = createFileRoute("/admin/inventory")({ component: AdminInventory });

function AdminInventory() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["admin-products"], queryFn: () => adminListProducts() });
  const stock = useMutation({
    mutationFn: (d: { id: string; stock: number }) => adminUpdateStock({ data: d }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });
  const price = useMutation({
    mutationFn: (d: { id: string; price: number; compareAt: number | null; specialOffer?: boolean }) =>
      adminUpdatePrice({ data: d }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Inventory & pricing</h1>
      <ul className="space-y-3">
        {(list.data ?? []).map((p) => (
          <li key={p.id} className="rounded-xl bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted">{stockLabel(p.stock)}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
              <label className="text-xs text-muted">
                Stock
                <input
                  type="number"
                  defaultValue={p.stock}
                  className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-2 text-sm text-ink"
                  onBlur={(e) => stock.mutate({ id: p.id, stock: Number(e.target.value) })}
                />
              </label>
              <label className="text-xs text-muted">
                Price ₦
                <input
                  type="number"
                  defaultValue={p.price}
                  className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-2 text-sm text-ink"
                  onBlur={(e) =>
                    price.mutate({
                      id: p.id,
                      price: Number(e.target.value),
                      compareAt: p.compareAt,
                    })
                  }
                />
              </label>
              <label className="text-xs text-muted">
                Compare at ₦
                <input
                  type="number"
                  defaultValue={p.compareAt ?? ""}
                  className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-2 text-sm text-ink"
                  onBlur={(e) =>
                    price.mutate({
                      id: p.id,
                      price: p.price,
                      compareAt: e.target.value === "" ? null : Number(e.target.value),
                      specialOffer: e.target.value !== "",
                    })
                  }
                />
              </label>
              <p className="self-end text-sm tabular-nums">{formatNaira(p.price)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
