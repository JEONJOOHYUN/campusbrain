"use client";

import { CampusMap } from "@/components/digital-twin/campus-map";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { cn } from "@/lib/utils";

/** How a legend entry is drawn: a point, an area, or a route. */
type LegendShape = "dot" | "area" | "line" | "dashed";

export interface LegendItem {
  label: string;
  css: string;
  shape?: LegendShape;
}

const STATUS_LEGEND: LegendItem[] = [
  { label: "NORMAL", css: "var(--status-normal)" },
  { label: "CAUTION", css: "var(--status-caution)" },
  { label: "CRITICAL", css: "var(--status-critical)" },
];

/** What the map means during a SafeFlow run. Same colours the layers use. */
export const SAFEFLOW_LEGEND: LegendItem[] = [
  { label: "화재 지점", css: "var(--status-critical)", shape: "dot" },
  { label: "위험 구역", css: "var(--status-caution)", shape: "area" },
  { label: "차단 경로", css: "var(--status-critical)", shape: "dashed" },
  { label: "안전 대피경로", css: "var(--status-normal)", shape: "line" },
];

export function TwinPanel({
  className,
  tall = false,
  title = "디지털 트윈",
  description = "건물을 클릭하면 상세 정보와 AI 판단을 볼 수 있습니다.",
  legend = STATUS_LEGEND,
}: {
  className?: string;
  tall?: boolean;
  /** Overridden where the same map answers a different question. */
  title?: string;
  description?: string;
  legend?: LegendItem[];
}) {
  const { state } = useSimulation();

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-0">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {legend.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <LegendSwatch item={item} />
              <span className="tnum text-[10px] font-medium tracking-wider text-muted">
                {item.label}
              </span>
            </span>
          ))}
          <Badge tone="cyan" mono>
            건물 {state.buildings.length}개소
          </Badge>
        </div>
      </CardHeader>

      <CampusMap className={tall ? "aspect-[960/560] max-h-[70vh]" : "aspect-[960/560]"} />
    </Card>
  );
}

function LegendSwatch({ item }: { item: LegendItem }) {
  if (item.shape === "line" || item.shape === "dashed") {
    return (
      <span
        className="h-0 w-3.5 border-t-2"
        style={{
          borderColor: item.css,
          borderStyle: item.shape === "dashed" ? "dashed" : "solid",
        }}
      />
    );
  }
  if (item.shape === "area") {
    return (
      <span
        className="h-2.5 w-2.5 rounded-[3px] border border-dashed"
        style={{ borderColor: item.css }}
      />
    );
  }
  return (
    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.css }} />
  );
}
