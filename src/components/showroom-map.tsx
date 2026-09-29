import { PointerEvent, useEffect, useRef, useState } from "react";
import { Minus, Navigation, Plus } from "lucide-react";
import { STORE } from "@/lib/constants";

const TILE = 256;
const PIN = { lat: STORE.map.lat, lng: STORE.map.lng };

function project(lat: number, lng: number, zoom: number) {
  const scale = TILE * 2 ** zoom;
  const x = ((lng + 180) / 360) * scale;
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale;
  return { x, y };
}

function worldYToLat(y: number, zoom: number) {
  const scale = TILE * 2 ** zoom;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  return (180 / Math.PI) * Math.atan(Math.sinh(n));
}

export function ShowroomMap({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; lat: number; lng: number; locked: boolean } | null>(null);
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState<{ lat: number; lng: number }>(PIN);
  const [size, setSize] = useState({ w: 640, h: 420 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const origin = project(center.lat, center.lng, zoom);
  const pin = project(PIN.lat, PIN.lng, zoom);
  const left = origin.x - size.w / 2;
  const top = origin.y - size.h / 2;
  const x0 = Math.floor(left / TILE);
  const y0 = Math.floor(top / TILE);
  const x1 = Math.floor((left + size.w) / TILE);
  const y1 = Math.floor((top + size.h) / TILE);
  const max = 2 ** zoom;
  const tiles: { key: string; url: string; left: number; top: number }[] = [];
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      if (x < 0 || y < 0 || x >= max || y >= max) continue;
      tiles.push({
        key: `${zoom}-${x}-${y}`,
        url: `https://basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${x}/${y}@2x.png`,
        left: x * TILE - left,
        top: y * TILE - top,
      });
    }
  }
  const pinX = size.w / 2 + (pin.x - origin.x);
  const pinY = size.h / 2 + (pin.y - origin.y);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a,button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, lat: center.lat, lng: center.lng, locked: e.pointerType !== "touch" };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (!start.locked) {
      if (Math.hypot(dx, dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      start.locked = true;
    }
    const scale = TILE * 2 ** zoom;
    const world = project(start.lat, start.lng, zoom);
    setCenter({
      lng: start.lng - (dx / scale) * 360,
      lat: worldYToLat(world.y - dy, zoom),
    });
  }

  function endDrag() {
    drag.current = null;
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 border-ink bg-surface ${className}`}>
      <div
        ref={box}
        className="relative h-[26rem] w-full cursor-grab touch-pan-y active:cursor-grabbing md:h-[32rem]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="application"
        aria-label="Live map of Furnishing Center, Sen George Akume Way, Karu"
      >
        {tiles.map((t) => (
          <img
            key={t.key}
            src={t.url}
            alt=""
            width={TILE}
            height={TILE}
            draggable={false}
            className="pointer-events-none absolute max-w-none select-none"
            style={{ left: t.left, top: t.top, width: TILE, height: TILE }}
          />
        ))}
        <div className="pointer-events-none absolute z-10" style={{ left: pinX, top: pinY }}>
          <div className="-translate-x-1/2 -translate-y-full">
            <p className="mb-1 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-sm font-medium text-primary-fg shadow-md">
              Furnishing Center
            </p>
            <span className="mx-auto block size-4 rounded-full border-[3px] border-primary-fg bg-ink shadow-md" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex justify-between gap-3">
        <div className="pointer-events-auto max-w-sm rounded-lg bg-ink px-4 py-3 text-primary-fg shadow-md">
          <p className="text-sm font-medium uppercase tracking-widest">Showroom</p>
          <p className="mt-1 text-base font-medium leading-snug">Sen George Akume Way, Karu</p>
          <a
            href={STORE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex h-10 items-center gap-2 rounded-full bg-primary-fg px-4 text-sm font-medium text-ink"
          >
            <Navigation className="size-4" /> Open in Google Maps
          </a>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          aria-label="Zoom in"
          className="grid size-11 place-items-center rounded-md border-2 border-ink bg-surface text-ink shadow-md"
          onClick={() => setZoom((z) => Math.min(18, z + 1))}
        >
          <Plus className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          className="grid size-11 place-items-center rounded-md border-2 border-ink bg-surface text-ink shadow-md"
          onClick={() => setZoom((z) => Math.max(14, z - 1))}
        >
          <Minus className="size-5" />
        </button>
        <button
          type="button"
          className="h-11 rounded-md border-2 border-ink bg-ink px-3 text-sm font-medium text-primary-fg shadow-md"
          onClick={() => {
            setCenter(PIN);
            setZoom(16);
          }}
        >
          Recenter
        </button>
      </div>

      <p className="absolute bottom-3 left-3 z-20 rounded-md bg-surface px-2 py-1 text-xs font-medium text-ink">
        Map data © OpenStreetMap · © CARTO
      </p>
    </div>
  );
}
