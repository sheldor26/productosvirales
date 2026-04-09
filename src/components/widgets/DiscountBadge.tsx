import { Badge } from "@/components/ui/Badge";

interface DiscountBadgeProps {
  percentage: number;
  className?: string;
}

export function DiscountBadge({ percentage, className }: DiscountBadgeProps) {
  return (
    <Badge variant="discount" className={className}>
      -{percentage}%
    </Badge>
  );
}
