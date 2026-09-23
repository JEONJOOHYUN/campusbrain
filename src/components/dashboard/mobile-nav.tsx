"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/dashboard/nav-items";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { cn } from "@/lib/utils";

/**
 * The sidebar's stand-in below `lg`, where 16rem of chrome would leave the
 * content about a third of a phone screen. Same items, same scenario
 * carry-over — laid out as one horizontally scrolling strip rather than a
 * drawer, so every page stays one tap away during a demo.
 */
export function MobileNav() {
  const pathname = usePathname();
  const { state } = useSimulation();

  return (
    <nav
      aria-label="대시보드 메뉴"
      className="overflow-x-auto border-t border-line lg:hidden"
    >
      <ul className="flex w-max items-center gap-1 px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={`${item.href}?scenario=${state.scenario}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                  active
                    ? "bg-primary/12 font-semibold text-primary"
                    : "font-medium text-muted hover:bg-white/5 hover:text-fg",
                  !item.ready && "opacity-60",
                )}
              >
                <Icon
                  width={14}
                  height={14}
                  className={cn("shrink-0", active ? "text-primary" : "text-muted")}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
