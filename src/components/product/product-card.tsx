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
    <article className="group relative flex flex-col overflow-hidden rounded-lg bg-surface border border-border hover:border-accent/40 transition-all duration-200">
      {/* Image container */}
      <Link to="/product/$slug" params={{ slug: product.id }} className="relative block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-surface-2">
          {img ? (
            <img
              src={img}
              alt={product.name}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="size-full bg-surface-2 flex items-center justify-center text-xs text-muted">No image</div>
          )}
        </div>
        
        {/* Badge overlay */}
        {product.specialOffer || product.newArrival ? (
          <span className={cn(
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white transition-opacity",
            product.specialOffer ? "bg-danger/90" : "bg-ink/80"
          )}>
            {product.specialOffer ? "Offer" : "New"}
          </span>
        ) : null}
      </Link>

      {/* Wishlist button */}
      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
        onClick={() => void wish.toggle(product.id)}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/95 text-ink shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 z-10"
      >
        <Heart className={cn("size-5 transition-all", wished ? "fill-danger stroke-danger" : "stroke-2")} />
      </button>

      {/* Content section */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Product name */}
        <Link 
          to="/product/$slug" 
          params={{ slug: product.id }} 
          className="line-clamp-2 min-h-10 text-sm font-medium leading-snug text-ink hover:text-accent transition-colors"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="flex-shrink-0">
          <PriceTag price={product.price} compareAt={product.compareAt} />
        </div>

        {/* Stock status */}
        <p className={cn(
          "text-xs font-medium leading-tight mt-auto",
          status === "out_of_stock" ? "text-danger" : status === "low_stock" ? "text-warn" : "text-success"
        )}>
          {stockLabel(product.stock)}
        </p>
      </div>
    </article>
  );
}

export function ProductRail({ products }: { products: Product[] }) {
  if (!products.length) return null;
  
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">
      {products.map((p) => (
        <div key={p.id} className="w-48 shrink-0 snap-start">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted">No products match these filters.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
