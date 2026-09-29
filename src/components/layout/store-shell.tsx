import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, Home, LayoutGrid, Menu, Search, ShoppingBag, User, X } from "lucide-react";
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
      <header className="sticky top-0 z-30 border-b border-border/80 header-bar">
        <div className="hidden border-b border-border/50 md:block">
          <div className="mx-auto flex h-8 max-w-7xl items-center justify-between gap-4 px-6 text-[11px] font-medium tracking-wide text-muted">
            <span>Karu showroom · {STORE.hours}</span>
            <span className="hidden truncate lg:inline">
              Furniture, appliances and electronics — sold as the piece in the photograph
            </span>
            <a href={`tel:${STORE.phoneTel}`} className="text-ink hover:underline">
              {STORE.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 md:h-20 md:gap-4 md:px-6">
          <Link
            to="/"
            className="flex min-w-0 shrink-0 items-center"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src="/logo.png"
              alt="Furnishing Centre"
              className="logo-header"
              width={224}
              height={176}
            />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-7 px-4 md:flex">
            {departments.map((d) => (
              <Link
                key={d.slug}
                to="/categories/$slug"
                params={{ slug: d.slug }}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active(`/categories/${d.slug}`) ? "text-ink" : "text-muted hover:text-ink"
                )}
              >
                {d.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className={cn(
                "text-sm font-medium transition-colors",
                active("/contact") ? "text-ink" : "text-muted hover:text-ink"
              )}
            >
              Showroom
            </Link>
          </nav>

          <form onSubmit={onSearch} className="hidden min-w-0 flex-1 md:max-w-xs lg:block">
            <label className="sr-only" htmlFor="header-q">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                id="header-q"
                name="q"
                placeholder="Search sofas, marble, televisions..."
                className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-ink placeholder:text-muted transition-colors focus-visible:border-accent/60"
                autoComplete="off"
              />
            </div>
          </form>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              aria-label="Search"
              onClick={() => void navigate({ to: "/search" })}
              className="grid size-11 place-items-center rounded-full text-ink hover:bg-black/5 transition-colors lg:hidden"
            >
              <Search className="size-5 stroke-[1.75]" />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="hidden size-11 place-items-center rounded-full text-ink hover:bg-black/5 transition-colors sm:grid"
            >
              <Heart className="size-5 stroke-[1.75]" />
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid size-11 place-items-center rounded-full text-ink hover:bg-black/5 transition-colors"
            >
              <ShoppingBag className="size-5 stroke-[1.75]" />
              {cartCount > 0 ? (
                <span className="absolute right-1 top-1 grid min-w-[1.15rem] place-items-center rounded-full bg-ink px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>
            <Link
              to={user ? "/account" : "/login"}
              className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-ink hover:bg-black/5 transition-colors md:flex"
            >
              <User className="size-4 stroke-[1.75]" />
              {isPending ? (
                <span className="inline-block h-4 w-14 animate-pulse rounded bg-border" />
              ) : user ? (
                user.displayName?.split(" ")[0] ?? "Account"
              ) : (
                "Sign in"
              )}
            </Link>

            <button
              type="button"
              className="relative z-40 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-black/5 transition-colors md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="size-5 stroke-[1.75]" /> : <Menu className="size-5 stroke-[1.75]" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col overflow-y-auto bg-surface pb-8 shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
              <p className="text-base font-semibold">Menu</p>
              <button
                type="button"
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full hover:bg-surface-2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <X className="size-5 stroke-[1.75]" />
              </button>
            </div>
            <div className="space-y-6 px-4 py-4">
              {departments.map((d) => {
                const children = SEED_CATEGORIES.filter((c) => c.parentId === d.slug).sort(
                  (a, b) => a.sortOrder - b.sortOrder
                );
                return (
                  <div key={d.slug}>
                    <Link
                      to="/categories/$slug"
                      params={{ slug: d.slug }}
                      className="text-lg font-semibold text-ink hover:text-accent transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {d.label}
                    </Link>
                    <ul className="mt-2 space-y-0.5">
                      {children.map((c) => (
                        <li key={c.id}>
                          <Link
                            to="/categories/$slug"
                            params={{ slug: c.id }}
                            className="block rounded-lg px-2 py-2 text-sm text-muted hover:bg-surface-2 hover:text-ink transition-colors"
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
              <ul className="space-y-0.5 border-t border-border pt-4">
                {[
                  { to: "/search", label: "Search" },
                  { to: "/wishlist", label: "Wishlist" },
                  { to: "/cart", label: "Cart" },
                  { to: "/contact", label: "Showroom" },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="block rounded-lg px-2 py-2.5 text-base font-medium text-ink hover:bg-surface-2 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to={user ? "/account" : "/login"}
                    className="block rounded-lg px-2 py-2.5 text-base font-medium text-ink hover:bg-surface-2 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {user ? "Account" : "Sign in"}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      ) : null}

      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 md:px-6 md:pb-16 md:pt-8">
        <Outlet />
      </main>

      <footer className="border-t border-ink bg-ink pb-24 text-primary-fg md:pb-0">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-4">
              <img src="/logo.png" alt="" className="logo-footer" width={180} height={140} />
              <span>
                <span className="block text-2xl font-semibold leading-none md:text-3xl">
                  Furnishing Centre
                </span>
                <span className="mt-2 block text-sm tracking-wide text-white/70">Karu showroom</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/80">
              {STORE.tagline}. We deliver anywhere. Pickup is at the showroom.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
              <a href={`tel:${STORE.phoneTel}`} className="hover:underline">
                {STORE.phoneDisplay}
              </a>
              <a href={`https://wa.me/${STORE.whatsapp}`} className="hover:underline">
                WhatsApp
              </a>
              <Link to="/contact" className="hover:underline">
                Showroom
              </Link>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Shop</p>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Showroom</p>
            <p className="mt-3 flex gap-2 text-sm leading-relaxed">
              <span className="mt-0.5 size-5 shrink-0" aria-hidden>
                📍
              </span>
              {STORE.address}
            </p>
            <p className="mt-2 text-sm text-white/80">{STORE.hours}</p>
            <p className="mt-4 text-sm text-white/80">
              {STORE.bank.name} · {STORE.bank.accountName} · {STORE.bank.accountNumber}
            </p>
          </div>
        </div>
        <div className="border-t border-primary-fg/15">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
            {departments.map((d) => {
              const children = SEED_CATEGORIES.filter((c) => c.parentId === d.slug).sort(
                (a, b) => a.sortOrder - b.sortOrder
              );
              return (
                <div key={d.slug}>
                  <Link to="/categories/$slug" params={{ slug: d.slug }} className="text-xl font-semibold md:text-2xl">
                    {d.label}
                  </Link>
                  <ul className="mt-3 space-y-1.5 text-sm text-white/75">
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
        <div className="border-t border-primary-fg/15">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Furnishing Centre</p>
            <p>We deliver anywhere. Pickup is at the Karu showroom.</p>
            <p>Prices in naira.</p>
          </div>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface bottom-nav md:hidden">
        <ul className="grid grid-cols-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const on = active(tab.to);
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                    on ? "text-ink" : "text-muted"
                  )}
                >
                  <span className="relative">
                    <Icon className={cn("size-[1.35rem]", on ? "stroke-[2.25]" : "stroke-[1.75]")} />
                    {tab.to === "/cart" && cartCount > 0 ? (
                      <span className="absolute -right-1.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-ink px-0.5 text-[9px] font-bold leading-none text-white">
                        {cartCount > 99 ? "99+" : cartCount}
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
        href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent("Hello Furnishing Centre, I would like to ask about a piece.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="wa-fab fixed bottom-[5.5rem] right-3 z-40 flex items-center bg-[#25D366] text-sm font-medium text-white shadow-md hover:bg-[#20BA5A] transition-colors md:bottom-6 md:right-6"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current md:size-[1.15rem]">
          <path d="M20.5 3.5A11 11 0 0 0 2.1 16.7L1 23l6.5-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.8.6.6-3.7-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.2-.6.2c-.2.4-.7 1-1 1.2s-.4.3-.6.1-.9-.3-1.7-1.1c-.6-.6-1-1.4-1.2-1.6s0-.4.1-.5.2-.2.3-.4c.1-.1.2-.3 0-.5s-.6-1.4-.8-1.9c-.2-.5-.3-.5-.6-.5h-.5c-.2 0-.5.1-.7.3s-.9.9-.9 2.1c0 1.3.9 2.4 1 2.6s1.7 2.7 4.2 3.7c2.4 1 2.4.6 2.8.6.4 0 1.4-.5 1.6-1s.2-1.2.1-1.3z" />
        </svg>
        <span>Chat</span>
      </a>
    </div>
  );
}
