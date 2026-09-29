import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PriceTag } from "@/components/product/price-tag";
import { useWish } from "@/hooks/use-wish";
import type { Product } from "@/lib/types";
import { cn, stockLabel, stockStatus } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const wish = useWish();
  const wished = wish.has(product.id);
  const img = product.images[0];
  const status = stockStatus(product.stock);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-surface">
      <Link to="/product/$slug" params={{ slug: product.id }} className="relative block">
        <div className="aspect-square overflow-hidden bg-surface-2">
          {img ? (
            <img
              src={img}
              alt={product.name}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="size-full bg-surface-2" />
          )}
        </div>
        {product.specialOffer || product.newArrival ? (
          <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-xs font-medium text-primary-fg">
            {product.specialOffer ? "Offer" : "New"}
          </span>
        ) : null}
      </Link>
      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
        onClick={() => void wish.toggle(product.id)}
        className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-surface text-ink"
      >
        <Heart className={cn("size-4", wished && "fill-ink")} />
      </button>
      <div className="flex flex-col gap-1 p-2.5">
        <Link to="/product/$slug" params={{ slug: product.id }} className="line-clamp-2 min-h-10 text-sm font-medium leading-snug text-ink">
          {product.name}
        </Link>
        <PriceTag price={product.price} compareAt={product.compareAt} />
        <p
          className={cn(
            "text-xs font-medium",
            status === "out_of_stock" ? "text-danger" : status === "low_stock" ? "text-warn" : "text-success",
          )}
        >
          {stockLabel(product.stock)}
        </p>
      </div>
    </article>
  );
}

export function ProductRail({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
      {products.map((p) => (
        <div key={p.id} className="w-44 shrink-0 snap-start">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <p className="py-12 text-center text-sm text-muted">No products match these filters.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
