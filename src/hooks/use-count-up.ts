"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Counts up to `value` once, on mount — the "dashboard coming online" beat.
 * After that it follows `value` directly, so it never fights the simulation
 * loop, which already interpolates its own numbers.
 *
 * While the intro runs, `anim` holds the eased value; the rest of the time it
 * is null and the live value passes straight through.
 */
export function useCountUp(value: number, durationMs = 900): number {
  const [anim, setAnim] = useState<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (prefersReducedMotion() || durationMs <= 0) return;

    const target = value;
    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      if (t >= 1) {
        setAnim(null);
        return;
      }
      // easeOutCubic
      setAnim(target * (1 - Math.pow(1 - t, 3)));
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return anim ?? value;
}
