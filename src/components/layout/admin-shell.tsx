import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile } from "@/lib/server/account";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/inventory", label: "Inventory" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/banners", label: "Banners" },
] as const;

export function AdminShell() {
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile(), enabled: Boolean(user) });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending || (user && profile.isPending)) {
    return <div className="grid min-h-dvh place-items-center bg-bg text-sm text-muted">Loading staff desk…</div>;
  }
  if (!user) return <RedirectToSignIn />;
  if (profile.data && profile.data.role !== "admin") {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg p-6 text-center">
        <div>
          <p className="font-display text-3xl">Staff only</p>
          <Link to="/account" className="mt-4 inline-block text-sm underline">
            Back to account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <img src="/logo.png" alt="Furnishing Center" className="mt-1 h-16 w-16 object-contain" />
            <p className="font-display text-xl">Admin</p>
          </div>
          <Link to="/" className="text-sm text-muted hover:text-ink">
            View store
          </Link>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {links.map((l) => {
            const active = l.to === "/admin" ? pathname === "/admin" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "h-10 shrink-0 rounded-full px-4 text-sm leading-10",
                  active ? "bg-primary text-primary-fg" : "text-muted hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
