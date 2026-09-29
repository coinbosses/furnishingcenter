import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { listCategories, listProducts } from "@/lib/server/products";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q: initial = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(initial);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"featured" | "price_asc" | "price_desc">("featured");

  const cats = useQuery({ queryKey: ["categories"], queryFn: () => listCategories() });
  const products = useQuery({
    queryKey: ["search", q, category],
    queryFn: () => listProducts({ data: { q, category: category || undefined } }),
  });

  const shown = useMemo(() => {
    const list = [...(products.data ?? [])];
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products.data, sort]);

  const leaves = (cats.data ?? []).filter((c) => c.parentId);
  const parents = (cats.data ?? []).filter((c) => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  const activeParent = parents.find((p) => p.id === category) ?? parents.find((p) => leaves.some((c) => c.id === category && c.parentId === p.id));
  const chips = activeParent ? leaves.filter((c) => c.parentId === activeParent.id) : parents;

  return (
    <div className="space-y-5">
      <h1 className="font-display text-4xl md:text-5xl">Search</h1>
      <p className="max-w-xl text-sm leading-relaxed text-muted">
        Search by name, material or category. A result only appears if that word is on the piece itself — a fridge will not turn up under sofas.
      </p>
      <Input
        autoFocus
        value={q}
        placeholder="Sofas, refrigerators, 55 inch TV…"
        onChange={(e) => {
          setQ(e.target.value);
          void navigate({ search: { q: e.target.value || undefined } });
        }}
      />
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCategory("")}
          className={`h-11 shrink-0 rounded-full px-4 text-sm ${category === "" ? "bg-primary text-primary-fg" : "bg-surface-2"}`}
        >
          All
        </button>
        {parents.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`h-11 shrink-0 rounded-full px-4 text-sm ${category === c.id || activeParent?.id === c.id ? "bg-primary text-primary-fg" : "bg-surface-2"}`}
          >
            {c.name}
          </button>
        ))}
      </div>
      {activeParent ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`h-11 shrink-0 rounded-full px-4 text-sm ${category === c.id ? "bg-ink text-primary-fg" : "border border-border bg-surface"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="h-11 rounded-full border border-border bg-surface px-4 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
        <p className="text-sm text-muted">
          {products.isPending ? "Looking" : `${shown.length} ${shown.length === 1 ? "piece" : "pieces"}`}
          {q.trim() ? ` for “${q.trim()}”` : ""}
        </p>
      </div>
      <ProductGrid products={shown} />
    </div>
  );
}
