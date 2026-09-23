import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { BuildingDetailPanel } from "@/components/digital-twin/building-detail-panel";
import { SimulationProvider } from "@/components/simulation/simulation-provider";

/**
 * The dashboard reads ?scenario= on every render, so it is rendered per
 * request rather than prerendered. That keeps useSearchParams out of the
 * static-shell bailout path, which otherwise leaves a direct page load
 * un-hydrated.
 */
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The provider lives here so scenario + playback survive navigation
    // between dashboard pages.
    <SimulationProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>
        </div>
        <BuildingDetailPanel />
      </div>
    </SimulationProvider>
  );
}
