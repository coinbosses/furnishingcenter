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
    <article className="product-card group relative flex flex-col overflow-hidden bg-surface transition-colors duration-200">
      <Link to="/product/$slug" params={{ slug: product.id }} className="relative block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-surface-2">
          {img ? (
            <img
              src={img}
              alt={product.name}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted">No image</div>
          )}
        </div>
        {product.specialOffer || product.newArrival ? (
          <span
            className={cn(
              "absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white",
              product.specialOffer ? "bg-danger/90" : "bg-ink/80"
            )}
          >
            {product.specialOffer ? "Offer" : "New"}
          </span>
        ) : null}
      </Link>
      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
        onClick={() => void wish.toggle(product.id)}
        className="absolute right-2.5 top-2.5 z-10 grid size-9 place-items-center rounded-full bg-white/95 text-ink shadow-sm transition-all duration-200 hover:bg-white hover:shadow"
      >
        <Heart
          className={cn("size-[1.15rem] transition-all", wished ? "fill-danger stroke-danger" : "stroke-[1.75]")}
        />
      </button>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link
          to="/product/$slug"
          params={{ slug: product.id }}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-ink transition-colors hover:text-accent"
        >
          {product.name}
        </Link>
        <div className="flex-shrink-0">
          <PriceTag price={product.price} compareAt={product.compareAt} />
        </div>
        <p
          className={cn(
            "mt-auto text-[11px] font-medium leading-tight",
            status === "out_of_stock" ? "text-danger" : status === "low_stock" ? "text-warn" : "text-success"
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
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 no-scrollbar md:-mx-6 md:px-6">
      {products.map((p) => (
        <div key={p.id} className="w-44 shrink-0 snap-start sm:w-48">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="py-14 text-center">
        <p className="text-sm text-muted">No products match these filters.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
