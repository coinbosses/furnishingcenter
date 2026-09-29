import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, Phone, MessageCircle, Navigation } from "lucide-react";
import { ShowroomMap } from "@/components/showroom-map";
import { STORE } from "@/lib/constants";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const catsQ = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      return res.json();
    },
  });

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Showroom</p>
          <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">Visit Furnishing Centre in Karu</h1>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-muted">{STORE.address}</p>
        <p className="text-sm font-medium text-muted">Plus code {STORE.plusCode}</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <ShowroomMap />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <a
          href={`tel:${STORE.phoneTel}`}
          className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent hover:bg-surface-2"
        >
          <Phone className="size-5 shrink-0 text-accent" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Call</p>
            <p className="mt-0.5 font-medium text-ink">{STORE.phoneDisplay}</p>
          </div>
        </a>
        <a
          href={`https://wa.me/${STORE.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent hover:bg-surface-2"
        >
          <MessageCircle className="size-5 shrink-0 text-accent" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Message</p>
            <p className="mt-0.5 font-medium text-ink">WhatsApp</p>
          </div>
        </a>
        <a
          href={STORE.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent hover:bg-surface-2"
        >
          <Navigation className="size-5 shrink-0 text-accent" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Navigate</p>
            <p className="mt-0.5 font-medium text-ink">Google Maps</p>
          </div>
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Hours</p>
            <p className="mt-2 font-medium text-ink">{STORE.hours}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Address</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{STORE.address}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Payment accepted</p>
            <p className="mt-2 text-sm font-medium text-ink">{STORE.bank.name}</p>
            <p className="text-xs text-muted">{STORE.bank.accountName}</p>
            <p className="text-xs text-muted">{STORE.bank.accountNumber}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-accent p-6 text-ink">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Quick facts</p>
            <ul className="mt-3 space-y-2 text-sm font-medium">
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-ink/60 shrink-0" />
                Verified pieces on the showroom floor
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-ink/60 shrink-0" />
                Same-day collection when in stock
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-ink/60 shrink-0" />
                Delivery anywhere in Nigeria
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-ink/60 shrink-0" />
                Card or bank transfer payment
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Pickup</p>
          <h3 className="text-xl font-semibold text-ink">Collect in Karu</h3>
          <p className="text-sm leading-relaxed text-muted">
            Choose store pickup at checkout. Collection is at this showroom on Sen George Akume Way, New Karu. We hold in-stock pieces for you.
          </p>
          <p className="text-xs font-medium text-success">Free</p>
        </div>
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Delivery</p>
          <h3 className="text-xl font-semibold text-ink">Anywhere</h3>
          <p className="text-sm leading-relaxed text-muted">
            Delivery is not limited to Abuja or nearby districts. Enter the address at checkout. Large furniture is scheduled before it leaves the floor.
          </p>
          <p className="text-xs font-medium text-muted">From ₦8,500</p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Browse</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">Shop by department</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { slug: "furniture", title: "Furniture", note: "Sofas, beds, tables, lighting" },
            { slug: "appliances", title: "Appliances", note: "Cold, laundry, cooking, cooling" },
            { slug: "electronics", title: "Electronics", note: "Televisions, sound, small electronics" },
          ].map((d) => (
            <Link key={d.slug} to="/categories/$slug" params={{ slug: d.slug }} className="group overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-accent hover:shadow-md">
              <div className="aspect-[4/3] overflow-hidden bg-surface-2">
                <div className="size-full bg-gradient-to-br from-surface to-surface-2" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-ink">{d.title}</h3>
                <p className="mt-1 text-sm text-muted">{d.note}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Explore <ArrowRight className="size-4" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
