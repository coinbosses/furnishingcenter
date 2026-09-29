import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ChevronDown, Filter, Search as SearchIcon } from "lucide-react";
import { ProductGrid } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { listCategories, listProducts } from "@/lib/server/products";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q: initial = "" } = Route.useSearchValidated();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(initial);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"featured" | "price_asc" | "price_desc">("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
    <div className="space-y-6">
      <header className="space-y-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Search</p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight md:text-3xl">Find what you're looking for</h1>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Search by name, material or category. A result only appears if that exact term is on the piece — a refrigerator won't appear under sofas.
        </p>
      </header>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted pointer-events-none" />
        <Input
          autoFocus
          value={q}
          placeholder="Sofas, refrigerators, 55 inch TV…"
          onChange={(e) => {
            setQ(e.target.value);
            void navigate({ search: { q: e.target.value || undefined } });
          }}
          className="pl-12 h-13 text-base"
        />
      </div>

      <div className="flex items-center justify-between gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium"
        >
          <Filter className="size-4" /> Filters
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      {mobileFiltersOpen && (
        <div className="space-y-4 rounded-lg border border-border bg-surface p-4 md:hidden">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Department</p>
            <div className="space-y-2">
              {[{ id: "", name: "All categories" }, ...parents].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategory(c.id);
                    setMobileFiltersOpen(false);
                  }}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition",
                    category === c.id ? "bg-ink text-white" : "bg-surface-2 text-ink hover:bg-surface-2/80"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="hidden gap-4 md:flex md:items-start">
        <aside className="w-48 space-y-4">
          <div>
            <p className="mb-3 text-sm font-semibold">Department</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setCategory("")}
                className={cn(
                  "block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition",
                  category === "" ? "bg-ink text-white" : "bg-surface-2 text-ink hover:bg-surface-2/80"
                )}
              >
                All
              </button>
              {parents.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition",
                    category === c.id || activeParent?.id === c.id ? "bg-ink text-white" : "bg-surface-2 text-ink hover:bg-surface-2/80"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          {activeParent && (
            <div>
              <p className="mb-3 text-sm font-semibold">Subcategories</p>
              <div className="space-y-2">
                {chips.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      "block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition",
                      category === c.id ? "bg-ink text-white" : "border border-border bg-surface text-ink hover:border-accent hover:bg-surface"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
          <ProductGrid products={shown} />
        </div>
      </div>

      <div className="md:hidden">
        <ProductGrid products={shown} />
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted py-4 md:hidden">
        {products.isPending ? "Searching…" : `${shown.length} ${shown.length === 1 ? "piece" : "pieces"}`}
        {q.trim() ? ` for "${q.trim()}"` : ""}
      </div>

      {!products.isPending && !shown.length && (
        <div className="rounded-lg border border-border bg-surface p-8 text-center">
          <p className="text-xl font-semibold">No pieces found</p>
          <p className="mt-2 text-sm text-muted">Try a different search term or browse by category.</p>
        </div>
      )}
    </div>
  );
}
