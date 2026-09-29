import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { PriceTag } from "@/components/product/price-tag";
import { formatNaira, deliveryFeeFor } from "@/lib/money";
import { listProducts } from "@/lib/server/products";
import { useCart } from "@/lib/store";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const productsQ = useQuery({ queryKey: ["products", "all"], queryFn: () => listProducts({ data: {} }) });
  const products = productsQ.data ?? [];

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { item, product, line: product.price * item.quantity };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const subtotal = lines.reduce((n, l) => n + l.line, 0);
  const delivery = deliveryFeeFor(subtotal, "delivery");
  const total = subtotal + delivery;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <ShoppingCart className="size-8 text-accent" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Bag</p>
            <h1 className="text-4xl font-semibold md:text-5xl">Your cart</h1>
          </div>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Home delivery anywhere, or pickup at the Karu showroom. You choose at checkout, with card or Zenith Bank transfer.
        </p>
      </header>

      {/* Empty state */}
      {!lines.length ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-2xl font-semibold">Your cart is empty</p>
          <p className="mt-2 text-muted max-w-sm mx-auto">Furniture, appliances and electronics are organized by department. Start shopping to add items to your cart.</p>
          <Link
            to="/categories"
            className="mt-6 inline-flex items-center gap-2 h-12 rounded-lg bg-ink px-6 text-white font-semibold hover:bg-ink/90 transition-colors"
          >
            Browse categories
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_20rem]">
          {/* Cart items */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted mb-4">{lines.length} {lines.length === 1 ? "item" : "items"} in cart</p>
            {lines.map(({ item, product }) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex gap-4 rounded-lg border border-border bg-white p-4 transition-all hover:border-accent/40 hover:shadow-sm"
              >
                {/* Product image */}
                <Link
                  to="/product/$slug"
                  params={{ slug: product.id }}
                  className="size-24 shrink-0 overflow-hidden rounded-lg bg-surface-2"
                >
                  <img src={product.images[0]} alt={product.name} className="size-full object-cover transition-transform hover:scale-105" />
                </Link>

                {/* Product info */}
                <div className="min-w-0 flex-1">
                  <Link to="/product/$slug" params={{ slug: product.id }} className="font-semibold text-ink hover:text-accent transition line-clamp-2">
                    {product.name}
                  </Link>
                  {(item.color || item.size) && (
                    <p className="mt-1 text-xs text-muted">
                      {[item.color, item.size].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <PriceTag price={product.price} compareAt={product.compareAt} className="mt-2" />

                  {/* Quantity controls */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="inline-flex items-center rounded-lg border border-border bg-surface-2">
                      <button
                        type="button"
                        className="px-2.5 py-1.5 hover:bg-surface transition"
                        onClick={() => setQty(item, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-2.5 py-1.5 hover:bg-surface transition"
                        onClick={() => setQty(item, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      className="text-xs font-medium text-muted hover:text-danger transition inline-flex items-center gap-1"
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-ink">{formatNaira(product.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary sidebar */}
          <div className="h-fit sticky top-24 space-y-4 rounded-lg border border-border bg-white p-5 md:top-32">
            <h2 className="text-lg font-semibold text-ink">Order summary</h2>

            <div className="space-y-2 border-b border-border pb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold tabular-nums text-ink">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery from</span>
                <span className="font-semibold tabular-nums text-ink">{delivery === 0 ? "Free" : formatNaira(delivery)}</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-bold text-ink">
              <span>Total</span>
              <span className="tabular-nums">{formatNaira(total)}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full h-11 rounded-lg bg-ink text-white font-semibold text-center pt-2.5 hover:bg-ink/90 transition-colors"
            >
              Proceed to checkout
            </Link>

            <p className="text-xs text-muted text-center leading-relaxed">
              Free delivery on orders from {formatNaira(400000)}. Pickup in Karu is free.
            </p>

            <Link to="/" className="block text-center text-xs font-semibold text-ink hover:text-accent transition">
              Continue shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
