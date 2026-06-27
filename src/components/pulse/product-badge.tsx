import type { Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ACCENT: Record<Product["accent"], string> = {
  teal: "bg-[#E0F7FA] text-[#00747C]",
  blue: "bg-[#E0F2FE] text-[#003A70]",
  amber: "bg-[#FEF3C7] text-[#92400E]",
  gold: "bg-[#FEF9C3] text-[#854D0E]",
  green: "bg-[#DCFCE7] text-[#166534]",
};

export function ProductBadge({
  product,
  className,
}: {
  product: Pick<Product, "name" | "accent">;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-wide",
        ACCENT[product.accent] ?? ACCENT.teal,
        className,
      )}
    >
      {product.name}
    </span>
  );
}