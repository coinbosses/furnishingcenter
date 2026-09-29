import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Heart, MapPin, Package, User } from "lucide-react";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, listMyNotifications } from "@/lib/server/account";
import { listMyOrders } from "@/lib/server/orders";
import { ORDER_LABELS, type OrderStatus } from "@/lib/constants";

export const Route = createFileRoute("/account/")({ component: AccountPage });

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile(), enabled: Boolean(user) });
  const orders = useQuery({ queryKey: ["orders"], queryFn: () => listMyOrders(), enabled: Boolean(user) });
  const notes = useQuery({ queryKey: ["notifications"], queryFn: () => listMyNotifications(), enabled: Boolean(user) });

  if (isPending) return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;
  if (!user) return <RedirectToSignIn />;

  const current = (orders.data ?? []).filter((o) => !["delivered", "cancelled"].includes(o.status));

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Account</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {profile.data?.fullName || user.displayName || "Your account"}
          </h1>
          <p className="text-sm text-muted">{user.primaryEmail}</p>
          <p className="max-w-md text-sm text-muted">
            Orders, addresses and the pieces you saved. Tracking stays with the order, from pending to delivered.
          </p>
        </div>
        <UserButton />
      </header>

      <div className="grid gap-2">
        <Row to="/account/orders" icon={Package} label="Orders" hint="History and tracking" />
        <Row to="/account/addresses" icon={MapPin} label="Addresses" hint="Delivery locations" />
        <Row to="/account/profile" icon={User} label="Profile" hint="Name and phone" />
        <Row to="/wishlist" icon={Heart} label="Saved products" hint="Wishlist" />
      </div>

      {profile.data?.role === "admin" ? (
        <Link to="/admin" className="block rounded-xl bg-primary px-5 py-4 text-primary-fg">
          <p className="text-xs uppercase tracking-widest text-primary-fg/70">Staff</p>
          <p className="text-lg font-semibold">Open admin dashboard</p>
        </Link>
      ) : null}

      {current.length ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Current orders</h2>
          <ul className="space-y-2">
            {current.map((o) => (
              <li key={o.id}>
                <Link
                  to="/account/orders/$id"
                  params={{ id: o.id }}
                  className="flex items-center justify-between rounded-xl bg-surface px-4 py-3"
                >
                  <span>
                    <span className="block font-medium">{o.id}</span>
                    <span className="text-xs text-muted">{ORDER_LABELS[o.status as OrderStatus] ?? o.status}</span>
                  </span>
                  <ChevronRight className="size-4 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(notes.data ?? []).length ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Notifications</h2>
          <ul className="space-y-2">
            {(notes.data ?? []).slice(0, 6).map((n) => (
              <li key={n.id} className="rounded-xl bg-surface px-4 py-3 text-sm">
                <p className="font-medium">{n.title}</p>
                <p className="text-muted">{n.body}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Row({
  to,
  icon: Icon,
  label,
  hint,
}: {
  to: "/account/orders" | "/account/addresses" | "/account/profile" | "/wishlist";
  icon: typeof User;
  label: string;
  hint: string;
}) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
      <Icon className="size-5" />
      <span className="flex-1">
        <span className="block font-medium">{label}</span>
        <span className="text-xs text-muted">{hint}</span>
      </span>
      <ChevronRight className="size-4 text-muted" />
    </Link>
  );
}
