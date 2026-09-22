"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBrain } from "@/components/icons";
import { NAV_ITEMS } from "@/components/dashboard/nav-items";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useSimulation();

  // Carry the active scenario across navigation so a page change never
  // silently resets the demo.
  const withScenario = (href: string) => `${href}?scenario=${state.scenario}`;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-surface">
      <Link
        href="/"
        className="flex items-center gap-2.5 border-b border-line px-5 py-4 transition-colors hover:bg-white/5"
      >
        <IconBrain className="text-primary" width={22} height={22} />
        <div className="leading-tight">
          <div className="text-sm font-extrabold tracking-[0.14em] text-fg">
            CAMPUSBRAIN
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
            Physical AI OS
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={withScenario(item.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-primary/12 font-semibold text-primary"
                      : "font-medium text-muted hover:bg-white/5 hover:text-fg",
                    !item.ready && "opacity-60",
                  )}
                >
                  <Icon
                    className={cn("shrink-0", active ? "text-primary" : "text-muted")}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {!item.ready && (
                    <span className="rounded border border-line px-1.5 py-px text-[9px] font-medium uppercase tracking-wider text-muted">
                      준비중
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line px-5 py-4">
        <p className="text-[11px] leading-relaxed text-muted">
          인터랙티브 프로토타입입니다. 실제 센서·로봇·설비와 연결되어 있지 않습니다.
        </p>
      </div>
    </aside>
  );
}
