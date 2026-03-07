import { createContext, useContext, useId, type ReactNode } from "react";
import { ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

type TooltipEntry = {
  dataKey?: string;
  color?: string;
  value?: number | string;
};

type TooltipContentProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  className?: string;
  hideLabel?: boolean;
};

/* ─── Config types ─────────────────────────────────────────── */

export type ChartConfig = Record<
  string,
  { label?: string; color?: string; icon?: React.ComponentType }
>;

/* ─── Context ──────────────────────────────────────────────── */

const ChartContext = createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within <ChartContainer>");
  return ctx;
}

/* ─── ChartContainer ───────────────────────────────────────── */

function ChartContainer({
  config,
  children,
  className,
}: {
  config: ChartConfig;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();

  // Inject CSS variables for each config key so recharts can reference them
  const styleVars = Object.entries(config).reduce<Record<string, string>>(
    (acc, [key, val]) => {
      if (val.color) acc[`--color-${key}`] = val.color;
      return acc;
    },
    {},
  );

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        id={id}
        className={cn("flex aspect-video justify-center text-xs", className)}
        style={styleVars as React.CSSProperties}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/* ─── ChartTooltip ─────────────────────────────────────────── */

const ChartTooltip = Tooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  hideLabel = false,
}: TooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs",
        className,
      )}
    >
      {!hideLabel && (
        <p className="mb-1.5 font-medium text-foreground">{label}</p>
      )}
      <div className="space-y-1">
        {payload.map((entry: TooltipEntry) => {
          const key = (entry.dataKey ?? "") as string;
          const cfg = config[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ background: entry.color }}
              />
              <span className="text-muted-foreground">{cfg?.label ?? key}</span>
              <span className="ml-auto font-semibold text-foreground">
                {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── ChartLegend ──────────────────────────────────────────── */

function ChartLegendContent({
  payload,
  className,
}: {
  payload?: Array<{ value: string; color?: string }>;
  className?: string;
}) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4",
        className,
      )}
    >
      {payload.map((entry) => {
        const cfg = config[entry.value];
        return (
          <div key={entry.value} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-xs text-muted-foreground">
              {cfg?.label ?? entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
};
