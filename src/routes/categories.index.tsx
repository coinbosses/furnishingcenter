import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { listCategories, listProducts } from "@/lib/server/products";

export const Route = createFileRoute("/categories/")({ component: CategoriesPage });

function CategoriesPage() {
  const { data = [], isPending } = useQuery({ queryKey: ["categories"], queryFn: () => listCategories() });
  const products = useQuery({ queryKey: ["products", "all"], queryFn: () => listProducts({ data: {} }) });
  const parents = data.filter((c) => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  const countOf = (id: string) => (products.data ?? []).filter((p) => p.categoryId === id).length;

  if (isPending) return <div className="h-64 animate-pulse rounded-2xl bg-surface-2" />;

  return (
    <div className="space-y-14">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Departments</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Shop by category</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Furniture, appliances and electronics each have their own department. Open a category and you only see pieces that belong there — a freezer is never listed as a refrigerator.
        </p>
      </header>

      {parents.map((parent) => {
        const children = data.filter((c) => c.parentId === parent.id).sort((a, b) => a.sortOrder - b.sortOrder);
        const total = children.reduce((n, c) => n + countOf(c.id), 0);

        return (
          <section key={parent.id} className="space-y-6">
            <Link
              to="/categories/$slug"
              params={{ slug: parent.id }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-accent hover:shadow-md"
            >
              <div className="grid md:grid-cols-[1.2fr_1fr]">
                <div className="aspect-[16/9] overflow-hidden bg-surface-2 md:aspect-auto md:min-h-56">
                  <img
                    src={parent.imageUrl}
                    alt={parent.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col justify-between p-6 md:p-8">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Department</p>
                    <h2 className="mt-2 text-xl font-semibold text-ink md:text-2xl">{parent.name}</h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{parent.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {children.length} categories · {total} pieces
                    </p>
                    <ArrowRight className="size-5 text-accent transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {children.map((c) => (
                <Link
                  key={c.id}
                  to="/categories/$slug"
                  params={{ slug: c.id }}
                  className="group overflow-hidden rounded-lg border border-border bg-white transition-all hover:border-accent hover:shadow-sm"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-surface-2">
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-ink leading-snug">{c.name}</h3>
                    <p className="mt-1.5 text-xs text-muted">{countOf(c.id)} pieces</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
