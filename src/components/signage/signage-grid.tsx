"use client";

import { IconBrain } from "@/components/icons";
import { SignageCard } from "@/components/signage/signage-card";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SignageGrid() {
  const { state } = useSimulation();
  const overridden = state.signage.filter((d) => d.overridden).length;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>디스플레이</CardTitle>
          <p className="mt-0.5 text-xs text-muted">
            관리자가 편성하지 않습니다 — AI가 상황을 읽고 메시지를 직접 바꿉니다
          </p>
        </div>
        {overridden > 0 && (
          <Badge tone="ai">
            <IconBrain width={12} height={12} />
            AI가 {overridden}대 교체 중
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {state.signage.map((display) => (
            <SignageCard key={display.id} display={display} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
