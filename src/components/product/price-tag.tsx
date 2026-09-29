import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  compareAt,
  className,
}: {
  price: number;
  compareAt?: number | null;
  className?: string;
}) {
  const onSale = compareAt != null && compareAt > price;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2 tabular-nums", className)}>
      <span className={cn("text-base font-semibold", onSale ? "text-danger" : "text-ink")}>{formatNaira(price)}</span>
      {onSale ? <span className="text-sm text-muted line-through">{formatNaira(compareAt)}</span> : null}
    </div>
  );
}
