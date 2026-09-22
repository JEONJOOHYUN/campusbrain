"use client";

import { useId } from "react";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { statusTone } from "@/components/dashboard/status";
import type { BuildingShape, BuildingState } from "@/types";
import { cn } from "@/lib/utils";

const VIEW_W = 960;
const VIEW_H = 560;

/* Isometric box maths. `shape` gives the centre of the ground tile plus its
   half-width / half-depth / extruded height, all in SVG user units. */
function groundPoints({ x, y, w, d }: BuildingShape, lift = 0): string {
  return [
    `${x},${y - d - lift}`,
    `${x + w},${y - lift}`,
    `${x},${y + d - lift}`,
    `${x - w},${y - lift}`,
  ].join(" ");
}

function leftFace({ x, y, w, d, h }: BuildingShape): string {
  return [
    `${x - w},${y - h}`,
    `${x},${y + d - h}`,
    `${x},${y + d}`,
    `${x - w},${y}`,
  ].join(" ");
}

function rightFace({ x, y, w, d, h }: BuildingShape): string {
  return [
    `${x + w},${y - h}`,
    `${x},${y + d - h}`,
    `${x},${y + d}`,
    `${x + w},${y}`,
  ].join(" ");
}

/** Ground grid, drawn in the same isometric direction as the buildings. */
function GroundGrid({ opacity = 0.28 }: { opacity?: number }) {
  const lines: React.ReactElement[] = [];
  const cx = 470;
  const cy = 290;
  const halfW = 470;
  const halfD = 250;
  const steps = 14;

  for (let i = -steps; i <= steps; i += 1) {
    const f = i / steps;
    lines.push(
      <line
        key={`a${i}`}
        x1={cx + f * halfW}
        y1={cy + f * halfD - halfD}
        x2={cx + f * halfW + halfW}
        y2={cy + f * halfD}
        stroke="currentColor"
        strokeWidth={0.5}
      />,
      <line
        key={`b${i}`}
        x1={cx + f * halfW}
        y1={cy - f * halfD + halfD}
        x2={cx + f * halfW + halfW}
        y2={cy - f * halfD}
        stroke="currentColor"
        strokeWidth={0.5}
      />,
    );
  }
  return (
    <g className="text-primary" opacity={opacity}>
      {lines}
    </g>
  );
}

interface CampusMapProps {
  className?: string;
}

export function CampusMap({ className }: CampusMapProps) {
  const { state, selectedBuildingId, selectBuilding, isPlaying } = useSimulation();
  const uid = useId().replace(/:/g, "");

  // Painter's algorithm: back rows first, so closer buildings overlap.
  const ordered = [...state.buildings].sort((a, b) => a.shape.y - b.shape.y);

  const focusId = state.insight?.buildingId ?? null;
  const flowSource = focusId ? state.buildings.find((b) => b.id === "main") : null;
  const flowTarget = focusId ? state.buildings.find((b) => b.id === focusId) : null;

  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl", className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full"
        role="group"
        aria-label="캠퍼스 디지털 트윈 — 건물을 클릭하면 상세 정보가 열립니다"
      >
        <defs>
          <radialGradient id={`${uid}-glow`} cx="50%" cy="46%" r="62%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-plate`}>
            <polygon points="470,40 940,290 470,540 0,290" />
          </clipPath>
          <linearGradient id={`${uid}-scan`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-cyan)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={VIEW_W} height={VIEW_H} fill={`url(#${uid}-glow)`} />

        <g clipPath={`url(#${uid}-plate)`}>
          <polygon
            points="470,40 940,290 470,540 0,290"
            fill="var(--color-surface)"
            fillOpacity="0.55"
            stroke="var(--color-line)"
          />
          <GroundGrid />
          {isPlaying && (
            <rect
              x="0"
              y="-120"
              width={VIEW_W}
              height="120"
              fill={`url(#${uid}-scan)`}
              className="animate-scan"
            />
          )}
        </g>

        {/* Walkways between buildings, on the ground plane. */}
        <g stroke="var(--color-line)" strokeWidth={2} fill="none" opacity={0.9}>
          <polyline points="300,252 430,300 430,416" />
          <polyline points="430,300 560,308" />
          <polyline points="560,308 690,340 690,466" />
          <polyline points="700,202 630,240 560,192" />
          <polyline points="190,408 300,360 430,416" />
        </g>

        {/* Inbound crowd flow, shown only while an AI insight is live. */}
        {flowSource && flowTarget && (
          <g>
            <path
              d={`M ${flowSource.shape.x} ${flowSource.shape.y + flowSource.shape.d}
                  Q 430 320 ${flowTarget.shape.x - flowTarget.shape.w} ${flowTarget.shape.y}`}
              fill="none"
              stroke="var(--color-warning)"
              strokeWidth={2.5}
              strokeDasharray="7 7"
              strokeLinecap="round"
              opacity={0.85}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="28"
                to="0"
                dur="1.1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        )}

        {ordered.map((b) => (
          <BuildingNode
            key={b.id}
            building={b}
            selected={selectedBuildingId === b.id}
            focused={focusId === b.id}
            onSelect={() => selectBuilding(b.id)}
          />
        ))}
      </svg>
    </div>
  );
}

interface BuildingNodeProps {
  building: BuildingState;
  selected: boolean;
  focused: boolean;
  onSelect: () => void;
}

function BuildingNode({ building, selected, focused, onSelect }: BuildingNodeProps) {
  const tone = statusTone(building.status);
  const { shape } = building;
  const labelY = shape.y - shape.d - shape.h - 16;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${building.name}, 혼잡도 ${building.crowd}퍼센트, 상태 ${building.status}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="cursor-pointer outline-none [&:focus-visible>.bl-hit]:stroke-primary [&:hover>.bl-top]:brightness-125"
      style={{ color: tone.css }}
    >
      {/* Footprint glow on the ground. */}
      <polygon
        points={groundPoints(shape)}
        fill="currentColor"
        opacity={selected || focused ? 0.28 : 0.12}
      />

      {/* Box faces. */}
      <polygon points={leftFace(shape)} fill="currentColor" opacity={0.3} />
      <polygon points={rightFace(shape)} fill="currentColor" opacity={0.18} />
      <polygon
        className="bl-top transition-all"
        points={groundPoints(shape, shape.h)}
        fill="currentColor"
        opacity={selected ? 0.95 : 0.7}
        stroke="currentColor"
        strokeWidth={selected ? 2 : 1}
      />

      {/* Status beacon on critical buildings. */}
      {building.status === "critical" && (
        <circle
          cx={shape.x}
          cy={shape.y - shape.d - shape.h - 4}
          r={5}
          fill="currentColor"
          className="animate-pulse-soft"
        />
      )}

      {/* Selection / keyboard-focus outline. */}
      <polygon
        className="bl-hit"
        points={groundPoints(shape, shape.h)}
        fill="none"
        stroke={selected ? "var(--color-primary)" : "transparent"}
        strokeWidth={2.5}
      />

      <g className="pointer-events-none">
        <text
          x={shape.x}
          y={labelY}
          textAnchor="middle"
          className="fill-[var(--color-fg)] text-[13px] font-semibold"
        >
          {building.name}
        </text>
        <text
          x={shape.x}
          y={labelY + 15}
          textAnchor="middle"
          fill="currentColor"
          className="tnum text-[12px] font-medium"
        >
          {building.crowd}%
        </text>
      </g>
    </g>
  );
}
