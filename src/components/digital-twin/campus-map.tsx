"use client";

import { useId } from "react";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { statusTone } from "@/components/dashboard/status";
import { deriveSafeFlow, type SafeFlowSnapshot } from "@/lib/simulation/safeflow";
import type { BuildingShape, BuildingState, SafeFlowRoute } from "@/types";
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

/**
 * Inbound crowd arrow: leaves the source's front corner, bows out towards the
 * viewer, and lands on the target's near-left face.
 */
function flowPath(from: BuildingShape, to: BuildingShape): string {
  const sx = from.x;
  const sy = from.y + from.d;
  const tx = to.x - to.w;
  const ty = to.y;
  const cx = (sx + tx) / 2 - 20;
  const cy = (sy + ty) / 2 + 48;
  return `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
}

/* --- SafeFlow geometry -------------------------------------------- */

/** An evacuation route, as a path through its waypoints. */
function routePath(route: SafeFlowRoute): string {
  return route.points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
}

/** The risk area around the fire: the building's ground tile, grown. */
function riskZonePoints(shape: BuildingShape, margin: number): string {
  // Depth grows in proportion so the ring keeps the isometric angle.
  return groundPoints({
    ...shape,
    w: shape.w + margin,
    d: shape.d + margin * (shape.d / shape.w),
  });
}

/** Where the flame sits: on the roof plane, towards the building's east side. */
function firePoint(shape: BuildingShape): { x: number; y: number } {
  return { x: shape.x + shape.w * 0.45, y: shape.y - shape.h - shape.d * 0.25 };
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
  const flowFromId = state.definition.flowFromBuildingId;
  const flowSource =
    focusId && flowFromId ? state.buildings.find((b) => b.id === flowFromId) : null;
  const flowTarget = focusId ? state.buildings.find((b) => b.id === focusId) : null;

  const safeflow = deriveSafeFlow(state);
  const fireBuilding =
    safeflow && safeflow.reached.detect
      ? state.buildings.find((b) => b.id === safeflow.fire.buildingId)
      : null;

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
              d={flowPath(flowSource.shape, flowTarget.shape)}
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

        {/* SafeFlow lies on the ground plane, so the buildings stand on top
            of it and the routes read as paths between them. */}
        {safeflow && fireBuilding && (
          <SafeFlowGround safeflow={safeflow} fireShape={fireBuilding.shape} />
        )}

        {ordered.map((b) => (
          <BuildingNode
            key={b.id}
            building={b}
            selected={selectedBuildingId === b.id}
            focused={focusId === b.id}
            onFire={fireBuilding?.id === b.id}
            onSelect={() => selectBuilding(b.id)}
          />
        ))}

        {/* The flame sits above everything — it is the one thing on the map
            that must never be occluded. */}
        {fireBuilding && <FireMarker shape={fireBuilding.shape} />}
      </svg>
    </div>
  );
}

/* --- SafeFlow layers ----------------------------------------------- */

function SafeFlowGround({
  safeflow,
  fireShape,
}: {
  safeflow: SafeFlowSnapshot;
  fireShape: BuildingShape;
}) {
  const { reached, safeRoutes, blockedRoutes } = safeflow;

  return (
    <g>
      {/* Risk area — the ground the AI marks as unsafe. */}
      {reached.risk && (
        <g>
          <polygon
            points={riskZonePoints(fireShape, 46)}
            fill="var(--status-caution)"
            fillOpacity={0.1}
            stroke="var(--status-caution)"
            strokeWidth={1.5}
            strokeDasharray="9 7"
            opacity={0.8}
          />
        </g>
      )}

      {/* Routes the AI took out of service. */}
      {reached.coordinate &&
        blockedRoutes.map((route) => {
          const [bx, by] = route.points[Math.floor(route.points.length / 2)];
          return (
            <g key={route.id}>
              <path
                d={routePath(route)}
                fill="none"
                stroke="var(--status-critical)"
                strokeWidth={2.5}
                strokeDasharray="6 6"
                strokeLinecap="round"
                opacity={0.75}
              />
              <g stroke="var(--status-critical)" strokeWidth={2.5} strokeLinecap="round">
                <line x1={bx - 7} y1={by - 7} x2={bx + 7} y2={by + 7} />
                <line x1={bx - 7} y1={by + 7} x2={bx + 7} y2={by - 7} />
              </g>
            </g>
          );
        })}

      {/* Safe routes draw themselves on when the AI settles on them. */}
      {reached.route &&
        safeRoutes.map((route) => {
          const d = routePath(route);
          const [ex, ey] = route.points[route.points.length - 1];
          return (
            <g key={route.id}>
              <path
                d={d}
                fill="none"
                stroke="var(--status-normal)"
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.14}
                pathLength={1}
                strokeDasharray={1}
                className="animate-draw"
              />
              <path
                d={d}
                fill="none"
                stroke="var(--status-normal)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                className="animate-draw"
              />
              {/* People moving along it, once their positions are known. */}
              {reached.crowd &&
                ["0s", "1.4s"].map((begin) => (
                  <circle key={begin} r={4} fill="var(--status-normal)">
                    <animateMotion
                      dur="2.8s"
                      begin={begin}
                      repeatCount="indefinite"
                      path={d}
                    />
                  </circle>
                ))}
              {/* Assembly point at the end of the route. */}
              <circle
                cx={ex}
                cy={ey}
                r={6}
                fill="none"
                stroke="var(--status-normal)"
                strokeWidth={2}
                className="animate-pulse-soft"
              />
            </g>
          );
        })}
    </g>
  );
}

function FireMarker({ shape }: { shape: BuildingShape }) {
  const { x, y } = firePoint(shape);
  return (
    <g className="pointer-events-none" style={{ color: "var(--status-critical)" }}>
      {[0, 1].map((i) => (
        <circle key={i} cx={x} cy={y} r={8} fill="none" stroke="currentColor" strokeWidth={1.5}>
          <animate
            attributeName="r"
            from="8"
            to="30"
            dur="2.2s"
            begin={`${i * 1.1}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.7"
            to="0"
            dur="2.2s"
            begin={`${i * 1.1}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      {/* The roof it sits on is already critical red, so the glyph needs a
          dark disc behind it to stay legible. */}
      <circle cx={x} cy={y} r={11} fill="var(--color-background)" opacity={0.9} />
      <circle
        cx={x}
        cy={y}
        r={11}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        opacity={0.9}
      />
      {/* Flame glyph. */}
      <path
        d={`M ${x} ${y - 9} C ${x + 6} ${y - 3} ${x + 5} ${y + 1} ${x + 3} ${y + 4}
            C ${x + 2} ${y + 1} ${x + 1} ${y} ${x} ${y - 1}
            C ${x - 1} ${y + 1} ${x - 3} ${y + 2} ${x - 3} ${y + 4}
            C ${x - 6} ${y} ${x - 5} ${y - 4} ${x} ${y - 9} Z`}
        fill="currentColor"
        className="animate-pulse-soft"
      />
    </g>
  );
}

interface BuildingNodeProps {
  building: BuildingState;
  selected: boolean;
  focused: boolean;
  /** The building the fire is in — it reads CRITICAL whatever its crowd says. */
  onFire?: boolean;
  onSelect: () => void;
}

function BuildingNode({
  building,
  selected,
  focused,
  onFire = false,
  onSelect,
}: BuildingNodeProps) {
  // Crowd is the only thing the status scale measures, and an evacuated
  // building is empty — so during a fire the box keeps its own colour.
  const tone = statusTone(onFire ? "critical" : building.status);
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
