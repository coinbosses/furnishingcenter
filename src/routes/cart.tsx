import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PriceTag } from "@/components/product/price-tag";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted">Bag</p>
        <h1 className="font-display text-4xl md:text-5xl">Cart</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Home delivery anywhere, or pickup at the Karu showroom. You choose at checkout, with card or Zenith Bank transfer.
        </p>
      </header>

      {!lines.length ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="font-display text-2xl">Your cart is empty</p>
          <p className="mt-2 text-sm text-muted">Furniture, appliances and electronics are separate floors.</p>
          <Button asChild className="mt-6">
            <Link to="/categories">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_18rem]">
          <ul className="space-y-4">
            {lines.map(({ item, product }) => (
              <li key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3 rounded-xl bg-surface p-3">
                <Link to="/product/$slug" params={{ slug: product.id }} className="size-24 shrink-0 overflow-hidden rounded-md">
                  <img src={product.images[0]} alt="" className="size-full object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to="/product/$slug" params={{ slug: product.id }} className="font-medium">
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted">
                    {[item.color, item.size].filter(Boolean).join(" · ")}
                  </p>
                  <PriceTag price={product.price} compareAt={product.compareAt} className="mt-1" />
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-9 items-center rounded-full border border-border">
                      <button type="button" className="w-9" onClick={() => setQty(item, item.quantity - 1)}>
                        −
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                      <button type="button" className="w-9" onClick={() => setQty(item, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button type="button" className="text-xs text-muted underline" onClick={() => remove(item)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-xl border border-border bg-surface p-5">
            <h2 className="font-display text-xl">Summary</h2>
            <p className="mt-4 flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="tabular-nums">{formatNaira(subtotal)}</span>
            </p>
            <p className="mt-2 flex justify-between text-sm">
              <span className="text-muted">Delivery from</span>
              <span className="tabular-nums">{delivery === 0 ? "Free" : formatNaira(delivery)}</span>
            </p>
            <p className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
              <span>Total</span>
              <span className="tabular-nums">{formatNaira(subtotal + delivery)}</span>
            </p>
            <p className="mt-2 text-xs text-muted">Free delivery on orders from {formatNaira(400000)}. Pickup in Karu is free.</p>
            <Button asChild className="mt-5 w-full">
              <Link to="/checkout">Checkout</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
