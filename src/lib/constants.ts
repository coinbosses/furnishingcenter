export const STORE = {
  name: "Furnishing Center",
  shortName: "FC",
  tagline: "Furniture, appliances and electronics for the Abuja home",
  address:
    "2H87+C3M, Sen George Akume Way, Karu, New Karu 900101, Federal Capital Territory, Nigeria",
  plusCode: "6FX92H87+C3",
  phoneDisplay: "+234 817 432 3014",
  phoneTel: "+2348174323014",
  whatsapp: "2348174323014",
  mapsUrl: "https://maps.app.goo.gl/dnyDuuGboeaAWDd89",
  map: { lat: 9.015036, lng: 7.562584 },
  hours: "Monday–Saturday 9:00–19:00 · Sunday 12:00–17:00",
  pickupName: "Furnishing Center showroom, Karu",
  bank: {
    name: "Zenith Bank",
    accountName: "Furnishing Center",
    accountNumber: "1214986730",
  },
} as const;

export const ORDER_FLOW = [
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "processing", label: "Processing" },
  { id: "ready", label: "Ready for Delivery/Pickup" },
  { id: "out_for_delivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" },
] as const;

export type OrderStatus = (typeof ORDER_FLOW)[number]["id"] | "cancelled";

export const ORDER_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  ready: "Ready for Delivery/Pickup",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const CANCELLABLE = new Set<OrderStatus>(["pending", "confirmed"]);

export const DEFAULT_DELIVERY =
  "We deliver anywhere. Large pieces are scheduled with you before dispatch. Same-day showroom pickup in Karu when the item is in stock.";
