import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StatCard as StatCardType } from "@/data";

export function StatCard({ stat }: { stat: StatCardType }) {
  const positive = stat.trend === "up";
  return (
    <Card>
      <CardContent className="space-y-2.5">
        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
        <div className="flex items-end justify-between gap-2">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {stat.value}
          </span>
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              positive
                ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
            )}
          >
            {positive ? (
              <IconTrendingUp className="size-3.5" />
            ) : (
              <IconTrendingDown className="size-3.5" />
            )}
            {stat.change}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{stat.hint}</p>
      </CardContent>
    </Card>
  );
}
