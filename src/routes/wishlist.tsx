import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useWish } from "@/hooks/use-wish";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listProducts } from "@/lib/server/products";

export const Route = createFileRoute("/wishlist")({ component: WishlistPage });

function WishlistPage() {
  const { user, isPending } = useCurrentUserState();
  const wish = useWish();
  const all = useQuery({ queryKey: ["products", "all"], queryFn: () => listProducts({ data: {} }) });
  const products = user
    ? wish.products
    : (all.data ?? []).filter((p) => wish.ids.includes(p.id));

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Saved</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Wishlist</h1>
        <p className="max-w-xl text-sm text-muted">
          Saved pieces stay in their own categories. A heart on a sofa does not file it under appliances.
        </p>
      </header>
      {isPending || all.isPending ? (
        <div className="h-40 animate-pulse rounded-xl bg-surface-2" />
      ) : products.length ? (
        <ProductGrid products={products} />
      ) : (
        <div className="rounded-xl border border-border bg-surface p-10 text-center">
          <p className="text-xl font-semibold">Your wishlist is waiting for something special.</p>
          <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
            Save pieces you like while browsing. Hearts remember the exact item.
          </p>
          <Button asChild className="mt-6">
            <Link to="/categories">Browse categories</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
