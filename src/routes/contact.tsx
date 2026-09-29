import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { ShowroomMap } from "@/components/showroom-map";
import { STORE } from "@/lib/constants";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-ink">Showroom</p>
        <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">Visit Furnishing Center</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink">{STORE.address}</p>
        <p className="mt-2 text-base text-ink">
          Plus code {STORE.plusCode} · {STORE.hours}
        </p>
      </header>

      <ShowroomMap />

      <div className="grid gap-3 sm:grid-cols-3">
        <a
          href={`tel:${STORE.phoneTel}`}
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-base font-medium text-primary-fg"
        >
          <Phone className="size-5" /> Call {STORE.phoneDisplay}
        </a>
        <a
          href={`https://wa.me/${STORE.whatsapp}`}
          className="flex h-14 items-center justify-center gap-2 rounded-full border-2 border-ink bg-surface text-base font-medium text-ink"
        >
          <MessageCircle className="size-5" /> WhatsApp
        </a>
        <a
          href={STORE.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-14 items-center justify-center gap-2 rounded-full border-2 border-ink bg-ink text-base font-medium text-primary-fg"
        >
          <Navigation className="size-5" /> Directions
        </a>
      </div>

      <div className="rounded-xl border-2 border-ink bg-surface p-5">
        <p className="flex gap-2 text-base font-medium leading-relaxed text-ink">
          <MapPin className="mt-0.5 size-5 shrink-0" />
          {STORE.name}
        </p>
        <p className="mt-2 pl-7 text-base leading-relaxed text-ink">{STORE.address}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border-2 border-ink bg-surface p-5">
          <p className="text-sm font-medium uppercase tracking-widest text-ink">Store pickup</p>
          <p className="mt-2 font-display text-3xl text-ink">Collect in Karu</p>
          <p className="mt-2 text-base leading-relaxed text-ink">
            Choose store pickup at checkout. Collection is this showroom on Sen George Akume Way, New Karu. We hold in-stock pieces for you.
          </p>
        </div>
        <div className="rounded-xl border-2 border-ink bg-surface p-5">
          <p className="text-sm font-medium uppercase tracking-widest text-ink">Home delivery</p>
          <p className="mt-2 font-display text-3xl text-ink">Anywhere</p>
          <p className="mt-2 text-base leading-relaxed text-ink">
            Delivery is not limited to Abuja or those nearby districts. Enter the address at checkout. Large furniture is scheduled before it leaves the floor.
          </p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { slug: "furniture", title: "Furniture", image: "/banners/living-hero.jpg", note: "Sofas, beds, tables, lighting" },
          { slug: "appliances", title: "Appliances", image: "/banners/kitchen-hero.jpg", note: "Cold, laundry, cooking, cooling" },
          { slug: "electronics", title: "Electronics", image: "/products/tv-75.jpg", note: "Televisions, sound, small electronics" },
        ].map((d) => (
          <Link key={d.slug} to="/categories/$slug" params={{ slug: d.slug }} className="overflow-hidden rounded-xl border-2 border-ink bg-surface">
            <img src={d.image} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4">
              <p className="font-display text-2xl text-ink">{d.title}</p>
              <p className="mt-1 text-base text-ink">{d.note}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
