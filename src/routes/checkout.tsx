import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Navigate } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { STORE } from "@/lib/constants";
import { deliveryFeeFor, formatNaira } from "@/lib/money";
import { getMyProfile, listMyAddresses, saveAddress } from "@/lib/server/account";
import { placeOrder } from "@/lib/server/orders";
import { listProducts } from "@/lib/server/products";
import { useCart } from "@/lib/store";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;
  if (!user) return <Navigate to="/login" search={{ redirect: "/checkout" }} />;
  return <CheckoutForm />;
}

function CheckoutForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const productsQ = useQuery({ queryKey: ["products", "all"], queryFn: () => listProducts({ data: {} }) });
  const profileQ = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile() });
  const addrQ = useQuery({ queryKey: ["addresses"], queryFn: () => listMyAddresses() });

  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [payment, setPayment] = useState<"card" | "bank_transfer">("card");
  const [addressId, setAddressId] = useState<string>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [newAddr, setNewAddr] = useState(false);
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Abuja");

  useEffect(() => {
    if (profileQ.data) {
      setName((n) => n || profileQ.data.fullName);
      setPhone((p) => p || profileQ.data.phone);
    }
  }, [profileQ.data]);

  useEffect(() => {
    if (!addressId && addrQ.data?.[0]) setAddressId(addrQ.data[0].id);
  }, [addrQ.data, addressId]);

  const lines = items
    .map((item) => {
      const product = (productsQ.data ?? []).find((p) => p.id === item.productId);
      return product ? { item, product } : null;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const subtotal = lines.reduce((n, l) => n + l.product.price * l.item.quantity, 0);
  const fee = deliveryFeeFor(subtotal, fulfillment);
  const total = subtotal + fee;

  if (!items.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-3xl">Nothing to check out</p>
        <Link to="/cart" className="mt-4 inline-block text-sm underline">
          Back to cart
        </Link>
      </div>
    );
  }

  async function onPlace() {
    setBusy(true);
    try {
      let addr = addressId;
      if (fulfillment === "delivery" && (newAddr || !addr)) {
        const list = await saveAddress({
          data: {
            label: "Delivery",
            fullName: name,
            phone,
            street,
            area,
            city,
            state: "FCT",
            isDefault: true,
          },
        });
        await qc.invalidateQueries({ queryKey: ["addresses"] });
        addr = list.find((a) => a.street === street)?.id ?? list[0]?.id;
      }
      const order = await placeOrder({
        data: {
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            color: i.color,
            size: i.size,
          })),
          fulfillment,
          addressId: fulfillment === "delivery" ? addr : undefined,
          paymentMethod: payment,
          notes,
          customerName: name,
          customerPhone: phone,
        },
      });
      clear();
      toast.success("Order placed");
      await navigate({ to: "/account/orders/$id", params: { id: order.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_20rem]">
      <div className="space-y-8">
        <header>
          <p className="text-xs uppercase tracking-widest text-muted">Checkout</p>
          <h1 className="font-display text-4xl">Your details</h1>
        </header>

        <section className="space-y-3">
          <h2 className="font-display text-xl">Customer</h2>
          <div className="space-y-1">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl">Fulfillment</h2>
          <div className="grid grid-cols-2 gap-2">
            {(["delivery", "pickup"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFulfillment(f)}
                className={`rounded-xl border p-4 text-left text-sm ${fulfillment === f ? "border-ink bg-surface" : "border-border"}`}
              >
                <p className="font-medium">{f === "delivery" ? "Home delivery" : "Store pickup"}</p>
                <p className="mt-1 text-muted">
                  {f === "delivery" ? "We deliver anywhere" : STORE.pickupName}
                </p>
              </button>
            ))}
          </div>
        </section>

        {fulfillment === "delivery" ? (
          <section className="space-y-3">
            <h2 className="font-display text-xl">Delivery address</h2>
            {(addrQ.data ?? []).map((a) => (
              <label key={a.id} className="flex gap-3 rounded-xl border border-border bg-surface p-4 text-sm">
                <input type="radio" checked={addressId === a.id && !newAddr} onChange={() => { setAddressId(a.id); setNewAddr(false); }} />
                <span>
                  <span className="font-medium">{a.label}</span>
                  <span className="mt-1 block text-muted">
                    {a.street}, {a.area} {a.city}
                  </span>
                </span>
              </label>
            ))}
            <button type="button" className="text-sm underline" onClick={() => setNewAddr(true)}>
              Use a new address
            </button>
            {newAddr || !(addrQ.data ?? []).length ? (
              <div className="space-y-3">
                <Input placeholder="Street and house" value={street} onChange={(e) => setStreet(e.target.value)} />
                <Input placeholder="Area (Garki, Wuse, Karu…)" value={area} onChange={(e) => setArea(e.target.value)} />
                <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            ) : null}
          </section>
        ) : (
          <section className="rounded-xl bg-surface p-4 text-sm text-muted">
            Pickup at {STORE.address}. We will call when your order is ready.
          </section>
        )}

        <section className="space-y-3">
          <h2 className="font-display text-xl">Payment</h2>
          <label className="flex gap-3 rounded-xl border border-border bg-surface p-4 text-sm">
            <input type="radio" checked={payment === "card"} onChange={() => setPayment("card")} />
            <span>
              <span className="font-medium">Card</span>
              <span className="mt-1 block text-muted">Pay now. Your order is confirmed immediately.</span>
            </span>
          </label>
          <label className="flex gap-3 rounded-xl border border-border bg-surface p-4 text-sm">
            <input type="radio" checked={payment === "bank_transfer"} onChange={() => setPayment("bank_transfer")} />
            <span>
              <span className="font-medium">Bank transfer</span>
              <span className="mt-1 block text-muted">
                {STORE.bank.name} · {STORE.bank.accountName} · {STORE.bank.accountNumber}
              </span>
            </span>
          </label>
          <div className="space-y-1">
            <Label>Order notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Estate gate code, preferred delivery day…" />
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-xl">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map(({ item, product }) => (
            <li key={item.productId + (item.color ?? "")} className="flex justify-between gap-3">
              <span className="text-muted">
                {product.name} × {item.quantity}
              </span>
              <span className="tabular-nums">{formatNaira(product.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between text-sm">
          <span className="text-muted">Delivery</span>
          <span className="tabular-nums">{fee === 0 ? "Free" : formatNaira(fee)}</span>
        </p>
        <p className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
          <span>Total</span>
          <span className="tabular-nums">{formatNaira(total)}</span>
        </p>
        <Button className="mt-5 w-full" disabled={busy || !name || !phone} onClick={() => void onPlace()}>
          {busy ? "Placing…" : payment === "card" ? "Pay and place order" : "Place order"}
        </Button>
      </aside>
    </div>
  );
}
