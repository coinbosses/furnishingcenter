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
      <header>
        <p className="text-xs uppercase tracking-widest text-muted">Saved</p>
        <h1 className="font-display text-4xl md:text-5xl">Wishlist</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Saved pieces stay in their own categories. A heart on a sofa does not file it under appliances.
        </p>
      </header>
      {isPending || all.isPending ? (
        <div className="h-40 animate-pulse rounded-xl bg-surface-2" />
      ) : products.length ? (
        <ProductGrid products={products} />
      ) : (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="font-display text-2xl">Nothing saved yet</p>
          <p className="mt-2 text-sm text-muted">Save a piece from its own category. Hearts remember the item, not a stand-in.</p>
          <Button asChild className="mt-6">
            <Link to="/categories">Browse the floor</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
