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
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums", className)}>
      <span className={cn("text-base font-bold tracking-tight", onSale ? "text-danger" : "text-ink")}>
        {formatNaira(price)}
      </span>
      {onSale ? (
        <span className="text-xs font-medium text-muted line-through" aria-label={`Previous price ${formatNaira(compareAt)}`}>
          {formatNaira(compareAt)}
        </span>
      ) : null}
    </div>
  );
}
