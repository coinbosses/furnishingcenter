import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, Search, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { FormEvent } from "react";
import { ProductGrid, ProductRail } from "@/components/product/product-card";
import { PriceTag } from "@/components/product/price-tag";
import { ShowroomMap } from "@/components/showroom-map";
import { EXTENDED_IDS, MARBLE_IDS, SITTING_IDS } from "@/lib/catalog-data";
import { homeCatalog, listProducts } from "@/lib/server/products";
import { useRecent } from "@/lib/store";
import { STORE } from "@/lib/constants";
import type { Category, Product } from "@/lib/types";

export const Route = createFileRoute("/")({ loader: () => homeCatalog(), component: Home });

function Home() {
  const data = Route.useLoaderData();
  const navigate = useNavigate();
  const recentIds = useRecent((s) => s.ids);
  const recentQ = useQuery({ queryKey: ["products", "all"], queryFn: () => listProducts({ data: {} }) });
  const recent = (recentQ.data ?? []).filter((p) => recentIds.includes(p.id));
  const parents = data.categories.filter((c) => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  const leaves = data.categories.filter((c) => c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  const hero = data.banners[0];
  const rest = data.banners.slice(1);
  const extended = data.advanced.filter((p) => new Set<string>(EXTENDED_IDS).has(p.id));
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
    <div className="space-y-10 md:space-y-14">
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Furnishing Centre · Karu</p>
            <h1 className="mt-1.5 max-w-xl text-2xl font-semibold leading-tight tracking-tight md:text-4xl">Make room for better living.</h1>
          </div>
          <Link to="/categories" className="hidden items-center gap-1 text-sm font-semibold text-ink sm:flex">Browse all <ArrowRight className="size-4" /></Link>
        </div>

        <form onSubmit={onSearch} className="relative flex items-center rounded-xl border border-border bg-surface focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/10">
          <Search className="ml-3.5 size-[1.15rem] shrink-0 text-muted" aria-hidden="true" />
          <label className="sr-only" htmlFor="home-q">Search the catalog</label>
          <input id="home-q" name="q" placeholder="Search sofas, marble, televisions..." className="h-12 min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none" autoComplete="off" />
          <button type="submit" className="m-1.5 h-9 shrink-0 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink/90 active:scale-[0.98]">Search</button>
        </form>

        <div className="grid grid-cols-3 gap-2 md:grid-cols-3 md:gap-4">
          {parents.map((c) => <DepartmentCard key={c.id} category={c} />)}
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:-mx-0 sm:px-0">
          {leaves.slice(0, 8).map((c) => (
            <Link key={c.id} to="/categories/$slug" params={{ slug: c.id }} className="group w-[5.4rem] shrink-0 snap-start text-center sm:w-24">
              <img src={c.imageUrl} alt="" className="mx-auto aspect-square w-full rounded-xl border border-border object-cover transition group-hover:border-accent group-hover:scale-[1.03]" />
              <span className="mt-2 block line-clamp-2 min-h-8 text-xs font-medium leading-tight text-ink">{c.name}</span>
            </Link>
          ))}
        </div>

        {hero ? (
          <Link to="/categories/$slug" params={{ slug: "furniture" }} className="group relative block min-h-[18rem] overflow-hidden rounded-2xl bg-ink md:min-h-[26rem]">
            <img src={hero.imageUrl} alt={hero.title} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
            <div className="relative flex min-h-[18rem] max-w-lg flex-col justify-end p-5 text-white md:min-h-[26rem] md:p-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E4C46D]">Featured collection</p>
              <h2 className="max-w-lg text-2xl font-semibold leading-tight md:text-4xl">{hero.title}</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 md:text-base">{hero.subtitle}</p>
              <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-ink">{hero.ctaText} <ArrowRight className="size-4" /></span>
            </div>
          </Link>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          <TrustCard icon={Truck} title="Delivery anywhere" body="Large pieces are scheduled with you." />
          <TrustCard icon={MapPin} title="Pickup in Karu" body="Collect at the showroom when in stock." />
          <TrustCard icon={ShieldCheck} title="Shop the actual piece" body="Clear photographs, prices and details." />
        </div>
      </section>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:-mx-6 md:px-6">
        {rest.map((b) => <div key={b.id} className="w-[86%] shrink-0 snap-start md:w-[32%]"><HeroCard banner={b} /></div>)}
      </div>

      <section><SectionHead eyebrow="Departments" title="Shop the home, one room at a time" href="/categories" action="All categories" /><div className="grid gap-4 md:grid-cols-3">{parents.map((c) => <DepartmentCard key={c.id} category={c} large />)}</div></section>

      {spotlight ? (
        <section className="grid items-center gap-8 overflow-hidden rounded-2xl border border-border bg-surface md:grid-cols-2">
          <Link to="/product/$slug" params={{ slug: spotlight.id }} className="overflow-hidden"><img src={spotlight.images[0]} alt={spotlight.name} className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-[1.03]" /></Link>
          <div className="p-6 md:p-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">On the floor</p><h2 className="mt-1.5 text-2xl font-semibold leading-tight md:text-3xl">{spotlight.name}</h2><p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{spotlight.description}</p><PriceTag price={spotlight.price} compareAt={spotlight.compareAt} className="mt-4 text-lg" /><div className="mt-6 flex flex-wrap gap-3"><Link to="/product/$slug" params={{ slug: spotlight.id }} className="inline-flex h-11 items-center rounded-lg bg-ink px-5 text-sm font-semibold text-white">View this piece</Link><Link to="/categories/$slug" params={{ slug: "sofas" }} className="inline-flex h-11 items-center text-sm font-semibold text-muted hover:text-ink">All sofas <ArrowRight className="ml-1 size-4" /></Link></div><ul className="mt-8 divide-y divide-border border-y border-border">{beside.map((p) => <li key={p.id}><Link to="/product/$slug" params={{ slug: p.id }} className="flex items-center gap-3 py-3"><img src={p.images[0]} alt="" className="size-14 rounded-lg object-cover" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{p.name}</span><PriceTag price={p.price} compareAt={p.compareAt} /></span></Link></li>)}</ul></div>
        </section>
      ) : null}

      <Rail title="How a sitting room is bought" kicker="Abuja sets" products={sitting} href="/categories/$slug" params={{ slug: "sofas" }} action="All sofas" />
      <Rail title="Marble and stone, with the chairs" kicker="Dining" products={marble} href="/categories/$slug" params={{ slug: "dining-sets" }} action="All dining" />
      <section><SectionHead eyebrow="New photographs" title="Twenty pieces, each one itself" href="/categories" action="Shop by category" /><p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted">A curved bouclé sofa is not the linen three-seater. A five-burner cooker is not the four-burner. Browse the actual piece shown.</p><ProductGrid products={extended} /></section>
      {parents.map((parent) => <CategoryBand key={parent.id} parent={parent} categories={data.categories} counts={data.counts} />)}
      <Rail title="On the floor now" kicker="Featured" products={data.featured} /><Rail title="Just arrived" kicker="New" products={data.newArrivals} /><Rail title="What Karu keeps reordering" kicker="Best sellers" products={data.bestsellers} />
      <section className="space-y-4"><SectionHead eyebrow="Showroom" title="Come sit in it first" href="/contact" action="Contact" /><ShowroomMap /><div className="rounded-2xl bg-ink px-6 py-8 text-white md:px-10"><p className="text-base font-medium leading-relaxed">{STORE.address}</p><p className="mt-2 text-base font-medium">{STORE.hours}</p><div className="mt-6 flex flex-wrap gap-3"><a href={STORE.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-lg bg-white px-5 text-base font-medium text-ink">Open in Google Maps</a><a href={`https://wa.me/${STORE.whatsapp}`} className="inline-flex h-12 items-center rounded-lg border border-white px-5 text-base font-medium">WhatsApp</a></div></div></section>
      <section><SectionHead eyebrow="Where we deliver" title="Anywhere, or collect in Karu" /><p className="max-w-2xl text-base leading-relaxed text-ink">Home delivery is not limited to Abuja. Enter any address at checkout. Pickup stays at the showroom on Sen George Akume Way. Card or Zenith Bank transfer.</p></section>
      <Rail title="Marked down, still the same piece" kicker="Offers" products={data.offers} />
      <section><SectionHead eyebrow="Edit" title="A short list worth starting with" /><ProductGrid products={data.recommended} /></section>
      <section className="grid gap-8 md:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-widest text-muted">How a purchase works</p><ol className="mt-4 space-y-4">{[["Find the right room", "Furniture, appliances and electronics each have their own category."], ["Check the photograph", "The picture is that piece. Styling is called out when it is not included."], ["Delivery or pickup", "Pay by card or transfer, then track delivery or collect in Karu."]].map(([title, body], i) => <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-3"><span className="text-2xl font-semibold text-muted">0{i + 1}</span><span><span className="block text-sm font-medium">{title}</span><span className="mt-1 block text-sm leading-relaxed text-muted">{body}</span></span></li>)}</ol></div><div><p className="text-xs font-semibold uppercase tracking-widest text-muted">Before you ask</p><div className="mt-4 divide-y divide-border border-y border-border">{[["Do you deliver outside Abuja?", "Yes. We deliver anywhere. Put the address in at checkout."], ["Can I see it before I pay?", "Yes. The Karu showroom is open through the week and Sunday afternoons."], ["What if the colour is wrong?", "Every product lists its colours. If a finish is not on the page, it is not the one in stock."]].map(([q, a]) => <details key={q} className="group py-3"><summary className="cursor-pointer text-sm font-medium">{q}</summary><p className="mt-2 text-sm leading-relaxed text-muted">{a}</p></details>)}</div></div></section>
      {recent.length ? <section><SectionHead title="Recently viewed" /><ProductRail products={recent} /></section> : null}
    </div>
  );
}

function DepartmentCard({ category, large = false }: { category: Category; large?: boolean }) {
  return <Link to="/categories/$slug" params={{ slug: category.id }} className={`group overflow-hidden rounded-2xl border border-border bg-surface ${large ? "" : "min-w-0"}`}><div className={large ? "aspect-[16/9] overflow-hidden" : "aspect-square overflow-hidden"}><img src={category.imageUrl} alt={category.name} className="size-full object-cover transition duration-500 group-hover:scale-[1.04]" /></div>{large ? <div className="p-5"><p className="text-xl font-semibold">{category.name}</p><p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{category.description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">Shop {category.name} <ArrowRight className="size-4" /></span></div> : <p className="truncate px-2 py-2 text-center text-xs font-semibold sm:text-sm">{category.name}</p>}</Link>;
}

function TrustCard({ icon: Icon, title, body }: { icon: typeof Truck; title: string; body: string }) { return <div className="flex min-h-24 items-start gap-3 rounded-xl border border-border bg-surface p-4"><Icon className="mt-0.5 size-5 shrink-0 text-accent" /><span><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted">{body}</p></span></div>; }

function HeroCard({ banner }: { banner: { id: number; title: string; subtitle: string; imageUrl: string; ctaText: string; ctaHref: string } }) { const slug = banner.ctaHref.replace("/categories/", ""); return <Link to="/categories/$slug" params={{ slug }} className="group block overflow-hidden rounded-2xl border border-border bg-surface"><img src={banner.imageUrl} alt={banner.title} className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]" /><div className="p-4"><p className="text-base font-semibold leading-tight">{banner.title}</p><p className="mt-1 line-clamp-2 text-sm leading-snug text-muted">{banner.subtitle}</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">{banner.ctaText} <ArrowRight className="size-4" /></span></div></Link>; }

function CategoryBand({ parent, categories, counts }: { parent: Category; categories: Category[]; counts: Record<string, number> }) { const children = categories.filter((c) => c.parentId === parent.id).sort((a, b) => a.sortOrder - b.sortOrder); return <section><SectionHead eyebrow={parent.name} title="Exactly what is in here" href="/categories/$slug" params={{ slug: parent.id }} action="Shop department" /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{children.map((c) => <Link key={c.id} to="/categories/$slug" params={{ slug: c.id }} className="group overflow-hidden rounded-xl border border-border bg-surface"><div className="aspect-[4/3] overflow-hidden"><img src={c.imageUrl} alt={c.name} className="size-full object-cover transition duration-500 group-hover:scale-[1.03]" /></div><div className="px-3 py-3"><p className="text-sm font-medium leading-snug">{c.name}</p><p className="mt-1 text-xs text-muted">{counts[c.id] ?? 0} pieces</p></div></Link>)}</div></section>; }

function SectionHead({ eyebrow, title, href, params, action }: { eyebrow?: string; title: string; href?: "/categories" | "/categories/$slug" | "/contact"; params?: { slug: string }; action?: string }) { return <div className="mb-5 flex items-end justify-between gap-4"><div>{eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p> : null}<h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">{title}</h2></div>{href && action ? <Link to={href} params={params} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ink hover:text-accent">{action} <ArrowRight className="size-4" /></Link> : null}</div>; }

function Rail({ title, kicker, products, href = "/categories", params, action = "View all" }: { title: string; kicker?: string; products: Product[]; href?: "/categories" | "/categories/$slug" | "/contact"; params?: { slug: string }; action?: string }) { if (!products.length) return null; return <section><SectionHead eyebrow={kicker} title={title} href={href} params={params} action={action} /><ProductRail products={products} /></section>; }
