import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductRail } from "@/components/product/product-card";
import { PriceTag } from "@/components/product/price-tag";
import { Button } from "@/components/ui/button";
import { Textarea, Label, Input } from "@/components/ui/input";
import { useWish } from "@/hooks/use-wish";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { STORE } from "@/lib/constants";
import { submitInquiry } from "@/lib/server/account";
import { getProduct, listCategories, listProducts, relatedProducts } from "@/lib/server/products";
import { useCart, useRecent } from "@/lib/store";
import { cn, stockLabel, stockStatus } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({ component: ProductPage });

function ProductPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const productQ = useQuery({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { id: slug } }) });
  const product = productQ.data;
  const relatedQ = useQuery({
    queryKey: ["related", slug, product?.categoryId],
    queryFn: () => relatedProducts({ data: { id: slug, categoryId: product!.categoryId } }),
    enabled: Boolean(product),
  });
  const allQ = useQuery({ queryKey: ["products", "all"], queryFn: () => listProducts({ data: {} }) });
  const catsQ = useQuery({ queryKey: ["categories"], queryFn: () => listCategories() });
  const pushRecent = useRecent((s) => s.push);
  const recentIds = useRecent((s) => s.ids);
  const add = useCart((s) => s.add);
  const wish = useWish();
  const { user } = useCurrentUserState();

  const [image, setImage] = useState(0);
  const [color, setColor] = useState<string>();
  const [size, setSize] = useState<string>();
  const [qty, setQty] = useState(1);
  const [askOpen, setAskOpen] = useState<"ask" | "quote" | null>(null);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (product) {
      pushRecent(product.id);
      setImage(0);
      setColor(product.colors[0]?.name);
      setSize(product.sizes[0]);
      setQty(1);
    }
  }, [product, pushRecent]);

  if (productQ.isPending) return <div className="aspect-square animate-pulse rounded-xl bg-surface-2" />;
  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="text-2xl font-semibold tracking-tight">Piece not found</p>
        <Link to="/categories" className="mt-4 inline-block text-sm underline">
          Back to categories
        </Link>
      </div>
    );
  }

  const status = stockStatus(product.stock);
  const wished = wish.has(product.id);
  const recent = (allQ.data ?? []).filter((p) => recentIds.includes(p.id) && p.id !== product.id);
  const category = catsQ.data?.find((c) => c.id === product.categoryId);
  const parent = catsQ.data?.find((c) => c.id === category?.parentId);
  const wa = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hello Furnishing Centre, I want to ask about ${product.name} (${product.id}).`)}`;

  function addLine(goCheckout: boolean) {
    if (status === "out_of_stock") {
      toast.error("This piece is currently out of stock");
      return;
    }
    add({ productId: product!.id, quantity: qty, color, size });
    toast.success("Added to cart");
    if (goCheckout) void navigate({ to: "/checkout" });
  }

  async function sendInquiry() {
    if (!user) {
      void navigate({ to: "/login", search: { redirect: `/product/${slug}` } });
      return;
    }
    try {
      await submitInquiry({
        data: { productId: product!.id, kind: askOpen ?? "ask", message, phone },
      });
      toast.success(askOpen === "quote" ? "Quote requested" : "Message sent");
      setAskOpen(null);
      setMessage("");
    } catch {
      toast.error("Could not send. Try WhatsApp instead.");
    }
  }

  return (
    <div className="space-y-12">
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
            <Link to="/categories/$slug" params={{ slug: category.id }} className="hover:text-ink">
              {category.name}
            </Link>
          </>
        ) : null}
      </nav>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-xl bg-surface-2">
            <img
              src={product.images[image] ?? product.images[0]}
              alt={product.name}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          {product.images.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setImage(i)}
                  className={cn(
                    "size-16 shrink-0 overflow-hidden rounded-md border",
                    i === image ? "border-ink" : "border-transparent",
                  )}
                >
                  <img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{status === "out_of_stock" ? "Unavailable" : stockLabel(product.stock)}</p>
          <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{product.name}</h1>
          {category ? (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Filed under{" "}
              {parent ? (
                <>
                  <Link to="/categories/$slug" params={{ slug: parent.id }} className="underline">
                    {parent.name}
                  </Link>
                  {" / "}
                </>
              ) : null}
              <Link to="/categories/$slug" params={{ slug: category.id }} className="underline">
                {category.name}
              </Link>
              . {category.description}
            </p>
          ) : null}
          <PriceTag price={product.price} compareAt={product.compareAt} className="mt-3 text-xl" />
          <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

          {product.colors.length ? (
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Colour — {color}</p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    onClick={() => setColor(c.name)}
                    className={cn("size-11 rounded-full border-2", color === c.name ? "border-ink" : "border-border")}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {product.sizes.length ? (
            <div className="mt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-10 rounded-lg px-4 text-sm",
                      size === s ? "bg-primary text-primary-fg" : "bg-surface-2",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-11 items-center rounded-lg border border-border">
              <button type="button" className="size-11" onClick={() => setQty(Math.max(1, qty - 1))}>
                −
              </button>
              <span className="w-8 text-center tabular-nums">{qty}</span>
              <button type="button" className="size-11" onClick={() => setQty(Math.min(product.stock || 1, qty + 1))}>
                +
              </button>
            </div>
            <Button className="flex-1" disabled={status === "out_of_stock"} onClick={() => addLine(false)}>
              Add to cart
            </Button>
          </div>
          <Button
            variant="outline"
            className="mt-3 w-full"
            disabled={status === "out_of_stock"}
            onClick={() => addLine(true)}
          >
            Buy now
          </Button>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => void wish.toggle(product.id)}>
              <Heart className={cn("size-4", wished && "fill-ink")} />
              {wished ? "Saved" : "Wishlist"}
            </Button>
            <a href={wa} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg text-sm hover:bg-surface-2">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setAskOpen("ask")}>
              Ask about this
            </Button>
            <Button variant="outline" onClick={() => setAskOpen("quote")}>
              Request a quote
            </Button>
          </div>

          <dl className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
            <Row label="Dimensions" value={product.dimensions} />
            <Row label="Material" value={product.material} />
            <Row label="Warranty" value={product.warranty} />
            <Row label="Delivery" value={product.deliveryInfo} />
          </dl>
          {Object.keys(product.specs).length ? (
            <dl className="mt-4 space-y-3 text-sm">
              {Object.entries(product.specs).map(([k, v]) => (
                <Row key={k} label={k} value={v} />
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      {(relatedQ.data ?? []).length ? (
        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Related pieces</h2>
          <ProductRail products={relatedQ.data ?? []} />
        </section>
      ) : null}

      {recent.length ? (
        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Recently viewed</h2>
          <ProductRail products={recent} />
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <PriceTag price={product.price} compareAt={product.compareAt} />
          </div>
          <Button disabled={status === "out_of_stock"} onClick={() => addLine(false)}>
            Add to cart
          </Button>
        </div>
      </div>

      {askOpen ? (
        <div className="fixed inset-0 z-40 grid place-items-end bg-ink/40 p-4 md:place-items-center" onClick={() => setAskOpen(null)}>
          <div className="w-full max-w-md rounded-xl bg-surface p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold tracking-tight">{askOpen === "quote" ? "Request a quote" : "Ask about this piece"}</h3>
            <p className="mt-1 text-sm text-muted">{product.name}</p>
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="080…" />
              </div>
              <div className="space-y-1">
                <Label>Message</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Colour, size, delivery area…" />
              </div>
              <Button className="w-full" onClick={() => void sendInquiry()}>
                Send
              </Button>
              <a href={`tel:${STORE.phoneTel}`} className="flex h-11 items-center justify-center gap-2 text-sm text-muted">
                <Phone className="size-4" /> Call {STORE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-3">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
