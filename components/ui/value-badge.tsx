import { Badge } from "@/components/ui/badge"
import { getValueBadgeClass } from "@/lib/value-colors"

interface ValueBadgeProps {
  value: string
  className?: string
}

export function ValueBadge({ value, className = "" }: ValueBadgeProps) {
  const badgeClass = getValueBadgeClass(value)

  return (
    <Badge className={`${badgeClass} ${className}`} variant="outline">
      {value}
    </Badge>
  )
}

