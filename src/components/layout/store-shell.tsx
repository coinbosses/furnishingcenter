import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, Home, LayoutGrid, MapPin, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SEED_CATEGORIES } from "@/lib/catalog-data";
import { STORE } from "@/lib/constants";
import { useCart } from "@/lib/store";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/search", label: "Search", icon: Search },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/account", label: "Account", icon: User },
] as const;

const departments = [
  { slug: "furniture", label: "Furniture" },
  { slug: "appliances", label: "Appliances" },
  { slug: "electronics", label: "Electronics" },
] as const;

export function StoreShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const { user, isPending } = useCurrentUserState();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    setMenuOpen(false);
    void navigate({ to: "/search", search: { q: q || undefined } });
  }

  function active(to: string) {
    return to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
  }

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="header-milk sticky top-0 z-30 border-b border-border shadow-sm">
        <div className="hidden border-b border-border md:block">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-6 text-xs tracking-wide text-muted">
            <span>Karu showroom · {STORE.hours}</span>
            <span className="truncate">Furniture, appliances and electronics, sold as the piece in the photograph</span>
            <a href={`tel:${STORE.phoneTel}`} className="text-ink">{STORE.phoneDisplay}</a>
          </div>
        </div>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <Link to="/" className="flex min-w-0 items-center" onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt="Furnishing Center" className="logo-blend h-16 w-auto object-contain object-left md:h-[4.25rem]" />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {departments.map((d) => (
              <Link
                key={d.slug}
                to="/categories/$slug"
                params={{ slug: d.slug }}
                className={cn("text-sm font-medium text-ink hover:underline", active(`/categories/${d.slug}`) && "underline")}
              >
                {d.label}
              </Link>
            ))}
            <Link to="/contact" className={cn("text-sm font-medium text-ink hover:underline", active("/contact") && "underline")}>
              Showroom
            </Link>
          </nav>
          <form onSubmit={onSearch} className="hidden min-w-0 flex-1 lg:block lg:max-w-sm">
            <label className="sr-only" htmlFor="header-q">
              Search
            </label>
            <input
              id="header-q"
              name="q"
              placeholder="Search sofas, marble, televisions"
              className="h-11 w-full rounded-full border border-border bg-bg px-4 text-sm text-ink"
            />
          </form>
          <div className="flex items-center gap-1">
            <Link to="/search" aria-label="Search" className="grid size-11 place-items-center rounded-full text-ink hover:bg-surface-2 lg:hidden">
              <Search className="size-5" />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="hidden size-11 place-items-center rounded-full text-ink hover:bg-surface-2 sm:grid">
              <Heart className="size-5" />
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative grid size-11 place-items-center rounded-full text-ink hover:bg-surface-2">
              <ShoppingBag className="size-5" />
              {cartCount > 0 ? (
                <span className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-ink px-1 text-xs text-primary-fg">
                  {cartCount}
                </span>
              ) : null}
            </Link>
            <Link to={user ? "/account" : "/login"} className="hidden h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-ink hover:bg-surface-2 md:flex">
              <User className="size-4" />
              {isPending ? <span className="inline-block w-14" /> : user ? user.displayName?.split(" ")[0] ?? "Account" : "Sign in"}
            </Link>
            <button
              type="button"
              className="relative z-40 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-surface-2 md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
          <nav className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col overflow-y-auto bg-surface pb-8 shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
              <p className="text-base font-semibold">All categories</p>
              <button type="button" aria-label="Close menu" className="grid size-11 place-items-center rounded-full" onClick={() => setMenuOpen(false)}>
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-6 px-4 py-4">
              {departments.map((d) => {
                const children = SEED_CATEGORIES.filter((c) => c.parentId === d.slug).sort((a, b) => a.sortOrder - b.sortOrder);
                return (
                  <div key={d.slug}>
                    <Link to="/categories/$slug" params={{ slug: d.slug }} className="text-lg font-semibold" onClick={() => setMenuOpen(false)}>
                      {d.label}
                    </Link>
                    <ul className="mt-2 space-y-1">
                      {children.map((c) => (
                        <li key={c.id}>
                          <Link
                            to="/categories/$slug"
                            params={{ slug: c.id }}
                            className="block rounded-lg px-2 py-2.5 text-base active:bg-surface-2"
                            onClick={() => setMenuOpen(false)}
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              <ul className="space-y-1 border-t border-border pt-4 text-base font-medium">
                <li>
                  <Link to="/search" className="block rounded-lg px-2 py-2.5" onClick={() => setMenuOpen(false)}>
                    Search
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="block rounded-lg px-2 py-2.5" onClick={() => setMenuOpen(false)}>
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="block rounded-lg px-2 py-2.5" onClick={() => setMenuOpen(false)}>
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="block rounded-lg px-2 py-2.5" onClick={() => setMenuOpen(false)}>
                    Showroom
                  </Link>
                </li>
                <li>
                  <Link to={user ? "/account" : "/login"} className="block rounded-lg px-2 py-2.5" onClick={() => setMenuOpen(false)}>
                    {user ? "Account" : "Sign in"}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      ) : null}

      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-4 md:px-6 md:pb-16 md:pt-8">
        <Outlet />
      </main>

      <footer className="border-t border-ink bg-ink pb-24 text-primary-fg md:pb-0">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-4">
              <img src="/logo.png" alt="" className="h-24 w-24 object-contain" />
              <span>
                <span className="block font-display text-3xl leading-none">Furnishing Center</span>
                <span className="mt-2 block text-sm tracking-wide">Karu showroom</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">{STORE.tagline}. We deliver anywhere. Pickup is at the showroom.</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
              <a href={`tel:${STORE.phoneTel}`} className="underline">{STORE.phoneDisplay}</a>
              <a href={`https://wa.me/${STORE.whatsapp}`} className="underline">WhatsApp</a>
              <Link to="/contact" className="underline">Showroom</Link>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-widest">Shop</p>
            <ul className="mt-3 space-y-2 text-sm">
              {departments.map((d) => (
                <li key={d.slug}>
                  <Link to="/categories/$slug" params={{ slug: d.slug }} className="hover:underline">
                    {d.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/categories" className="hover:underline">
                  All categories
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-5">
            <p className="text-xs font-medium uppercase tracking-widest">Showroom</p>
            <p className="mt-3 flex gap-2 text-sm leading-relaxed">
              <MapPin className="mt-0.5 size-5 shrink-0" />
              {STORE.address}
            </p>
            <p className="mt-2 text-sm">{STORE.hours}</p>
            <p className="mt-4 text-sm">
              {STORE.bank.name} · {STORE.bank.accountName} · {STORE.bank.accountNumber}
            </p>
          </div>
        </div>
        <div className="border-t border-primary-fg/20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
            {departments.map((d) => {
              const children = SEED_CATEGORIES.filter((c) => c.parentId === d.slug).sort((a, b) => a.sortOrder - b.sortOrder);
              return (
                <div key={d.slug}>
                  <Link to="/categories/$slug" params={{ slug: d.slug }} className="font-display text-2xl">
                    {d.label}
                  </Link>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {children.map((c) => (
                      <li key={c.id}>
                        <Link to="/categories/$slug" params={{ slug: c.id }} className="hover:underline">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-primary-fg/20">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Furnishing Center</p>
            <p>We deliver anywhere. Pickup is at the Karu showroom.</p>
            <p>Prices in naira.</p>
          </div>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="grid grid-cols-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const on = active(tab.to);
            return (
              <li key={tab.to}>
                <Link to={tab.to} className={cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium", on ? "text-ink" : "text-muted")}>
                  <span className="relative">
                    <Icon className={cn("size-5", on && "stroke-[2.4]")} />
                    {tab.to === "/cart" && cartCount > 0 ? (
                      <span className="absolute -right-2 -top-1 grid min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] text-primary-fg">
                        {cartCount}
                      </span>
                    ) : null}
                  </span>
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <a
        href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent("Hello Furnishing Center, I would like to ask about a piece.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-24 right-4 z-40 flex h-14 items-center gap-2 rounded-full bg-[#0b6b4f] px-4 text-sm font-medium text-white shadow-lg md:bottom-6"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
          <path d="M20.5 3.5A11 11 0 0 0 2.1 16.7L1 23l6.5-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.8.6.6-3.7-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.3a1.7 1.7 0 0 0 0-.5c0-.1-.5-1.3-.7-1.8s-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.6 4 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.1-.4-.2z" />
        </svg>
        Chat
      </a>
    </div>
  );
}
