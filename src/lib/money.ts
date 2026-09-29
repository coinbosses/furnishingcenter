const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number) {
  return naira.format(amount);
}

export function deliveryFeeFor(subtotal: number, fulfillment: "delivery" | "pickup") {
  if (fulfillment === "pickup") return 0;
  if (subtotal >= 400_000) return 0;
  return 8_500;
}
