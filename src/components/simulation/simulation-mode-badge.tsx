export function SimulationModeBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-ai/40 bg-ai/10 px-2.5 py-1">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-ai animate-pulse-soft" />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ai">
        시뮬레이션 모드
      </span>
    </span>
  );
}
