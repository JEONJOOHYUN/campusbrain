"use client";

import { CampusMap } from "@/components/digital-twin/campus-map";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { cn } from "@/lib/utils";

const LEGEND = [
  { label: "NORMAL", css: "var(--status-normal)" },
  { label: "CAUTION", css: "var(--status-caution)" },
  { label: "CRITICAL", css: "var(--status-critical)" },
];

export function TwinPanel({
  className,
  tall = false,
  title = "디지털 트윈",
  description = "건물을 클릭하면 상세 정보와 AI 판단을 볼 수 있습니다.",
}: {
  className?: string;
  tall?: boolean;
  /** Overridden where the same map answers a different question. */
  title?: string;
  description?: string;
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
          {LEGEND.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.css }}
              />
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
