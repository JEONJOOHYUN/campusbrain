import Link from "next/link";
import { Card } from "@/components/ui/card";
import { IconArrowRight } from "@/components/icons";

export function ComingSoon({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <Card className="flex min-h-[26rem] flex-col items-center justify-center px-6 py-16 text-center">
      <span className="rounded-md border border-line bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        준비 중
      </span>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-fg">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      <p className="tnum mt-4 text-xs text-muted">{phase}</p>
      <Link
        href="/dashboard"
        className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-fg"
      >
        개요로 돌아가기
        <IconArrowRight width={14} height={14} />
      </Link>
    </Card>
  );
}
