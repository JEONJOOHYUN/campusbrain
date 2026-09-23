import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown while a dashboard route is being rendered. It mirrors the Overview
 * skeleton — KPI row, map, side column — so the page does not jump when the
 * real content lands. The sidebar and topbar live in the layout and stay put.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="px-4 py-3.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="mt-3 h-6 w-20" />
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-52" />
              </div>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <div className="p-5">
              <Skeleton className="aspect-[1200/660] w-full rounded-xl" />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-3.5 w-12" />
              <Skeleton className="h-2.5 w-40" />
            </CardHeader>
            <div className="space-y-4 px-5 pb-5 pt-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="ml-auto h-2.5 w-14" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3.5 w-44" />
              </div>
            </CardHeader>
            <div className="space-y-5 px-5 pb-5 pt-4">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-2.5 w-12" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </CardHeader>
            <div className="space-y-4 px-5 pb-5 pt-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-2.5 w-28" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
