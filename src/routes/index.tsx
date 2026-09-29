import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, Truck } from "lucide-react";
import { FormEvent } from "react";
import { ProductGrid, ProductRail } from "@/components/product/product-card";
import { PriceTag } from "@/components/product/price-tag";
import { ShowroomMap } from "@/components/showroom-map";
import { EXTENDED_IDS, MARBLE_IDS, SITTING_IDS } from "@/lib/catalog-data";
import { homeCatalog, listProducts } from "@/lib/server/products";
import { useRecent } from "@/lib/store";
import { STORE } from "@/lib/constants";
import type { Category, Product } from "@/lib/types";

export const Route = createFileRoute("/")({
  loader: () => homeCatalog(),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const navigate = useNavigate();
  const recentIds = useRecent((s) => s.ids);
  const recentQ = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => listProducts({ data: {} }),
  });
  const recent = (recentQ.data ?? []).filter((p) => recentIds.includes(p.id));

  const parents = data.categories.filter((c) => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  const leaves = data.categories.filter((c) => c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  const hero = data.banners[0];
  const rest = data.banners.slice(1);
  const extendedSet = new Set<string>(EXTENDED_IDS);
  const extended = data.advanced.filter((p) => extendedSet.has(p.id));
  const byId = new Map(data.advanced.map((p) => [p.id, p]));
  const sitting = SITTING_IDS.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
  const marble = MARBLE_IDS.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
  const spotlight = data.featured.find((p) => p.id === "wuse-curve-sofa") ?? data.featured[0];
  const beside = data.featured.filter((p) => p.id !== spotlight?.id).slice(0, 3);

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    void navigate({ to: "/search", search: { q: q || undefined } });
  }

  return (
    <div className="space-y-8 md:space-y-12">
      <section className="space-y-4">
        <form onSubmit={onSearch} className="flex gap-2">
          <label className="sr-only" htmlFor="home-q">
            Search
          </label>
          <input
            id="home-q"
            name="q"
            placeholder="Search sofas, marble, televisions"
            className="h-12 min-w-0 flex-1 rounded-full border border-border bg-surface px-4 text-base text-ink"
          />
          <button type="submit" className="h-12 shrink-0 rounded-full bg-ink px-5 text-sm font-semibold text-primary-fg">
            Search
          </button>
        </form>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
          {leaves.map((c) => (
            <Link key={c.id} to="/categories/$slug" params={{ slug: c.id }} className="w-[4.75rem] shrink-0 snap-start text-center">
              <img src={c.imageUrl} alt="" className="mx-auto size-16 rounded-2xl object-cover shadow-sm" />
              <span className="mt-1 block text-xs font-medium leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
        {hero ? (
          <Link to="/categories/$slug" params={{ slug: "furniture" }} className="block overflow-hidden rounded-2xl">
            <img src={hero.imageUrl} alt="" className="aspect-[16/9] w-full object-cover md:aspect-[21/8]" />
          </Link>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          <Fact icon={Truck} title="Delivery anywhere" body="Any address at checkout. Large pieces are scheduled." />
          <Fact icon={MapPin} title="Pickup in Karu" body="Collect at the showroom on Sen George Akume Way." />
        </div>
      </section>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
        {rest.map((b) => (
          <div key={b.id} className="w-[86%] shrink-0 snap-start md:w-[32%]">
            <HeroCard banner={b} />
          </div>
        ))}
      </div>

      <section>
        <SectionHead eyebrow="Departments" title="Every category" href="/categories" action="All categories" />
        <div className="grid gap-3 md:grid-cols-3">
          {parents.map((c) => {
            const n = data.categories
              .filter((child) => child.parentId === c.id)
              .reduce((sum, child) => sum + (data.counts[child.id] ?? 0), 0);
            const leaves = data.categories.filter((child) => child.parentId === c.id).length;
            return (
              <Link
                key={c.id}
                to="/categories/$slug"
                params={{ slug: c.id }}
                className="group overflow-hidden rounded-2xl bg-surface"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={c.imageUrl} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="p-4 text-ink">
                  <p className="text-lg font-semibold leading-tight">{c.name}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted">{c.description}</p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-widest text-accent">
                    {leaves} categories · {n} pieces
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {spotlight ? (
        <section className="grid items-center gap-6 md:grid-cols-2">
          <Link to="/product/$slug" params={{ slug: spotlight.id }} className="overflow-hidden rounded-xl bg-surface">
            <img src={spotlight.images[0]} alt={spotlight.name} className="aspect-[4/3] w-full object-cover" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">On the floor</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">{spotlight.name}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{spotlight.description}</p>
            <PriceTag price={spotlight.price} compareAt={spotlight.compareAt} className="mt-4 text-lg" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/product/$slug"
                params={{ slug: spotlight.id }}
                className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-fg"
              >
                View this piece
              </Link>
              <Link to="/categories/$slug" params={{ slug: "sofas" }} className="inline-flex h-11 items-center text-sm text-muted">
                All sofas
              </Link>
            </div>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {beside.map((p) => (
                <li key={p.id}>
                  <Link to="/product/$slug" params={{ slug: p.id }} className="flex items-center gap-3 py-3">
                    <img src={p.images[0]} alt="" className="size-16 rounded-md object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <PriceTag price={p.price} compareAt={p.compareAt} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <Rail
        title="How a sitting room is bought"
        kicker="Abuja sets"
        products={sitting}
        href="/categories/$slug"
        params={{ slug: "sofas" }}
        action="All sofas"
      />
      <Rail
        title="Marble and stone, with the chairs"
        kicker="Dining"
        products={marble}
        href="/categories/$slug"
        params={{ slug: "dining-sets" }}
        action="All dining"
      />

      <section>
        <SectionHead eyebrow="New photographs" title="Twenty pieces, each one itself" href="/categories" action="Shop by category" />
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted">
          A curved bouclé sofa is not the linen three-seater. A five-burner cooker is not the four-burner. A washer-dryer combo is one machine, not a stack. A floor speaker is not a portable speaker.
        </p>
        <ProductGrid products={extended} />
      </section>

      {parents.map((parent) => (
        <CategoryBand key={parent.id} parent={parent} categories={data.categories} counts={data.counts} />
      ))}

      <Rail title="On the floor now" kicker="Featured" products={data.featured} />
      <Rail title="Just arrived" kicker="New" products={data.newArrivals} />
      <Rail title="What Karu keeps reordering" kicker="Best sellers" products={data.bestsellers} />

      <section className="space-y-4">
        <SectionHead eyebrow="Showroom" title="Come sit in it first" href="/contact" action="Contact" />
        <ShowroomMap />
        <div className="rounded-xl bg-primary px-6 py-8 text-primary-fg md:px-10">
          <p className="text-base font-medium leading-relaxed">{STORE.address}</p>
          <p className="mt-2 text-base font-medium">{STORE.hours}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={STORE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-full bg-primary-fg px-5 text-base font-medium text-ink"
            >
              Open in Google Maps
            </a>
            <a
              href={`https://wa.me/${STORE.whatsapp}`}
              className="inline-flex h-12 items-center rounded-full border-2 border-primary-fg px-5 text-base font-medium"
            >
              WhatsApp
            </a>
            <a href={`tel:${STORE.phoneTel}`} className="inline-flex h-12 items-center text-base font-medium underline">
              {STORE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section>
        <SectionHead eyebrow="Where we deliver" title="Anywhere, or collect in Karu" />
        <p className="max-w-2xl text-base leading-relaxed text-ink">
          Home delivery is not limited to Abuja. Enter any address at checkout. Pickup stays at the showroom on Sen George Akume Way. Card or Zenith Bank transfer.
        </p>
      </section>

      <Rail title="Marked down, still the same piece" kicker="Offers" products={data.offers} />

      <section>
        <SectionHead eyebrow="Edit" title="A short list worth starting with" />
        <ProductGrid products={data.recommended} />
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">How a purchase works</p>
          <ol className="mt-4 space-y-4">
            {[
              ["Find the right room", "Furniture, appliances and electronics never share a category. Filters stay inside the one you opened."],
              ["Check the photograph", "The picture is that piece. Styling in the room — a console under a television, a vase on a table — is called out when it is not included."],
              ["Delivery or pickup", "Pay by card or transfer. Track the order from pending through delivered, or collect it in Karu."],
            ].map(([title, body], i) => (
              <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-3">
                <span className="font-display text-3xl text-muted">0{i + 1}</span>
                <span>
                  <span className="block text-sm font-medium">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Before you ask</p>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {[
              ["Do you deliver outside Abuja?", "Yes. We deliver anywhere. Put the address in at checkout. Large pieces are scheduled before they leave the floor."],
              ["Can I see it before I pay?", "Yes. The Karu showroom is open through the week, and Sunday afternoons. Call ahead for a large piece."],
              ["What if the colour is wrong?", "Every product lists its colours. If a finish is not on the page, it is not the one in stock."],
            ].map(([q, a]) => (
              <details key={q} className="group py-3">
                <summary className="cursor-pointer text-sm font-medium">{q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {recent.length ? (
        <section>
          <SectionHead title="Recently viewed" />
          <ProductRail products={recent} />
        </section>
      ) : null}
    </div>
  );
}

function HeroCard({
  banner,
}: {
  banner: { id: number; title: string; subtitle: string; imageUrl: string; ctaText: string; ctaHref: string };
}) {
  const slug = banner.ctaHref.replace("/categories/", "");
  return (
    <Link to="/categories/$slug" params={{ slug }} className="group block overflow-hidden rounded-2xl bg-surface">
      <img src={banner.imageUrl} alt="" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      <div className="p-4">
        <p className="text-base font-semibold leading-tight text-ink">{banner.title}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted">{banner.subtitle}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-ink">
          {banner.ctaText} <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}

function Fact({ icon: Icon, title, body }: { icon: typeof Truck; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <Icon className="size-5 text-ink" />
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function CategoryBand({
  parent,
  categories,
  counts,
}: {
  parent: Category;
  categories: Category[];
  counts: Record<string, number>;
}) {
  const children = categories.filter((c) => c.parentId === parent.id).sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <section>
      <SectionHead eyebrow={parent.name} title="Exactly what is in here" href="/categories/$slug" params={{ slug: parent.id }} action="Shop the department" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {children.map((c) => (
          <Link key={c.id} to="/categories/$slug" params={{ slug: c.id }} className="group overflow-hidden rounded-xl bg-surface">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={c.imageUrl} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </div>
            <div className="px-3 py-3">
              <p className="text-sm font-medium leading-snug">{c.name}</p>
              <p className="mt-1 text-xs text-muted">{counts[c.id] ?? 0} pieces</p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  href,
  params,
  action,
}: {
  eyebrow?: string;
  title: string;
  href?: "/categories" | "/categories/$slug" | "/contact";
  params?: { slug: string };
  action?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-xs uppercase tracking-widest text-muted">{eyebrow}</p> : null}
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {href && action ? (
        <Link to={href} params={params} className="shrink-0 text-sm font-medium text-ink">
          {action}
        </Link>
      ) : null}
    </div>
  );
}

function Rail({
  title,
  kicker,
  products,
  href = "/categories",
  params,
  action = "View all",
}: {
  title: string;
  kicker?: string;
  products: Product[];
  href?: "/categories" | "/categories/$slug" | "/contact";
  params?: { slug: string };
  action?: string;
}) {
  if (!products.length) return null;
  return (
    <section>
      <SectionHead eyebrow={kicker} title={title} href={href} params={params} action={action} />
      <ProductRail products={products} />
    </section>
  );
}
