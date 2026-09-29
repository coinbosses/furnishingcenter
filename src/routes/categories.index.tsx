import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listCategories, listProducts } from "@/lib/server/products";

export const Route = createFileRoute("/categories/")({ component: CategoriesPage });

function CategoriesPage() {
  const { data = [], isPending } = useQuery({ queryKey: ["categories"], queryFn: () => listCategories() });
  const products = useQuery({ queryKey: ["products", "all"], queryFn: () => listProducts({ data: {} }) });
  const parents = data.filter((c) => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  const countOf = (id: string) => (products.data ?? []).filter((p) => p.categoryId === id).length;

  if (isPending) return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;

  return (
    <div className="space-y-14">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted">Catalogue</p>
        <h1 className="font-display text-4xl md:text-5xl">Categories</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Furniture, appliances and electronics stay in their own departments. Open a category and you only see pieces that belong there — a freezer is never listed as a refrigerator, and a soundbar is never a television.
        </p>
      </header>
      {parents.map((parent) => {
        const children = data.filter((c) => c.parentId === parent.id).sort((a, b) => a.sortOrder - b.sortOrder);
        return (
          <section key={parent.id}>
            <Link to="/categories/$slug" params={{ slug: parent.id }} className="group mb-4 grid overflow-hidden rounded-xl bg-surface md:grid-cols-[1.2fr_1fr]">
              <div className="aspect-[16/9] overflow-hidden md:aspect-auto md:min-h-48">
                <img src={parent.imageUrl} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              </div>
              <div className="flex flex-col justify-end p-5">
                <p className="text-xs uppercase tracking-widest text-muted">Department</p>
                <h2 className="font-display text-4xl">{parent.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{parent.description}</p>
                <p className="mt-4 text-sm">
                  {children.reduce((n, c) => n + countOf(c.id), 0)} pieces · shop all {parent.name.toLowerCase()}
                </p>
              </div>
            </Link>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {children.map((c) => (
                <Link key={c.id} to="/categories/$slug" params={{ slug: c.id }} className="overflow-hidden rounded-xl bg-surface">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={c.imageUrl} alt="" className="size-full object-cover" />
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="mt-1 text-xs text-muted">{countOf(c.id)} pieces</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{c.description}</p>
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
