import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/product-card";
import { listCategories, listProducts } from "@/lib/server/products";

export const Route = createFileRoute("/categories/$slug")({
  loader: async ({ params }) => {
    const [categories, products] = await Promise.all([
      listCategories(),
      listProducts({ data: { category: params.slug } }),
    ]);
    return { categories, products };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { categories, products } = Route.useLoaderData();
  const [sort, setSort] = useState<"featured" | "price_asc" | "price_desc" | "newest">("featured");
  const [inStock, setInStock] = useState(false);
  const [band, setBand] = useState<"all" | "under" | "mid" | "high">("all");

  const category = categories.find((c) => c.id === slug);
  const children = categories.filter((c) => c.parentId === slug).sort((a, b) => a.sortOrder - b.sortOrder);
  const parent = categories.find((c) => c.id === category?.parentId);
  const siblings = parent ? categories.filter((c) => c.parentId === parent.id).sort((a, b) => a.sortOrder - b.sortOrder) : [];

  const shown = useMemo(() => {
    let list = [...products];
    if (inStock) list = list.filter((p) => p.stock > 0);
    if (band === "under") list = list.filter((p) => p.price < 100_000);
    if (band === "mid") list = list.filter((p) => p.price >= 100_000 && p.price < 400_000);
    if (band === "high") list = list.filter((p) => p.price >= 400_000);
    list.sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      const score = (p: (typeof list)[number]) => (p.featured ? 4 : 0) + (p.bestseller ? 2 : 0) + (p.newArrival ? 1 : 0);
      return score(b) - score(a);
    });
    return list;
  }, [products, sort, inStock, band]);

  return (
    <div className="space-y-8">
      <nav className="text-sm text-muted">
        <Link to="/categories" className="hover:text-ink">
          Categories
        </Link>
        {parent ? (
          <>
            <span className="mx-1">/</span>
            <Link to="/categories/$slug" params={{ slug: parent.id }} className="hover:text-ink">
              {parent.name}
            </Link>
          </>
        ) : null}
        {category ? (
          <>
            <span className="mx-1">/</span>
            <span className="text-ink">{category.name}</span>
          </>
        ) : null}
      </nav>

      {category?.imageUrl ? (
        <div className="overflow-hidden rounded-2xl bg-surface">
          <img src={category.imageUrl} alt="" className="aspect-[16/9] w-full object-cover md:aspect-[21/8]" />
          <div className="p-5 md:p-8">
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-ink md:text-3xl">{category.name}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{category.description}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
              {children.length
                ? `${shown.length} pieces across this department, nothing else`
                : `${shown.length} pieces filed only here`}
            </p>
          </div>
        </div>
      ) : (
        <header className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{category?.name ?? "Category"}</h1>
          <p className="text-sm text-muted">{category?.description}</p>
        </header>
      )}

      {children.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {children.map((c) => (
            <Link key={c.id} to="/categories/$slug" params={{ slug: c.id }} className="overflow-hidden rounded-xl bg-surface">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={c.imageUrl} alt="" className="size-full object-cover" />
              </div>
              <p className="px-3 py-3 text-sm font-medium">{c.name}</p>
            </Link>
          ))}
        </div>
      ) : null}

      {siblings.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          <Link
            to="/categories/$slug"
            params={{ slug: parent!.id }}
            className="shrink-0 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium"
          >
            All {parent!.name.toLowerCase()}
          </Link>
          {siblings.map((c) => (
            <Link
              key={c.id}
              to="/categories/$slug"
              params={{ slug: c.id }}
              className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium ${c.id === slug ? "bg-primary text-primary-fg" : "border border-border bg-surface"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
        <label className="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In stock
        </label>
        {(
          [
            ["all", "Any price"],
            ["under", "Under ₦100k"],
            ["mid", "₦100–400k"],
            ["high", "₦400k+"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setBand(id)}
            className={`h-10 rounded-lg px-3.5 text-sm font-medium ${band === id ? "bg-primary text-primary-fg" : "border border-border bg-surface"}`}
          >
            {label}
          </button>
        ))}
        <p className="ml-auto text-sm text-muted">{shown.length} pieces</p>
      </div>
      <ProductGrid products={shown} />
    </div>
  );
}
