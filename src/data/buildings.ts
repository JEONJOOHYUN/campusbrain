import type { BuildingBase, BuildingId, BuildingMetrics } from "@/types";

/**
 * Campus footprint. `shape` coordinates live in the Digital Twin's own
 * 960 x 560 SVG space; the map component projects them isometrically.
 */
export const BUILDINGS: BuildingBase[] = [
  {
    id: "main",
    name: "본관",
    code: "MAIN-A1",
    floors: 7,
    capacity: 900,
    sensors: 34,
    shape: { x: 300, y: 190, w: 92, d: 62, h: 74 },
  },
  {
    id: "engineering",
    name: "공학관",
    code: "ENG-C2",
    floors: 9,
    capacity: 761,
    sensors: 48,
    shape: { x: 560, y: 250, w: 86, d: 58, h: 96 },
  },
  {
    id: "student-center",
    name: "학생회관",
    code: "STU-B1",
    floors: 4,
    capacity: 640,
    sensors: 29,
    shape: { x: 430, y: 360, w: 80, d: 56, h: 52 },
  },
  {
    id: "library",
    name: "도서관",
    code: "LIB-D1",
    floors: 6,
    capacity: 720,
    sensors: 31,
    shape: { x: 700, y: 150, w: 74, d: 52, h: 66 },
  },
  {
    id: "gymnasium",
    name: "체육관",
    code: "GYM-E1",
    floors: 2,
    capacity: 525,
    sensors: 17,
    shape: { x: 190, y: 350, w: 86, d: 58, h: 38 },
  },
  {
    id: "parking",
    name: "주차장",
    code: "PRK-P1",
    floors: 1,
    capacity: 1000,
    sensors: 12,
    shape: { x: 690, y: 400, w: 100, d: 66, h: 12 },
  },
];

/** Baseline readings — what a quiet Tuesday afternoon looks like. */
export const BASELINE_METRICS: Record<BuildingId, BuildingMetrics> = {
  main: { crowd: 48, energy: 61, temperature: 22.6, airQuality: 38 },
  engineering: { crowd: 82, energy: 74, temperature: 23.4, airQuality: 52 },
  "student-center": { crowd: 71, energy: 68, temperature: 23.1, airQuality: 47 },
  library: { crowd: 63, energy: 57, temperature: 22.2, airQuality: 35 },
  gymnasium: { crowd: 37, energy: 42, temperature: 21.8, airQuality: 41 },
  parking: { crowd: 26, energy: 19, temperature: 20.4, airQuality: 58 },
};

export const BUILDING_BY_ID: Record<BuildingId, BuildingBase> = Object.fromEntries(
  BUILDINGS.map((b) => [b.id, b]),
) as Record<BuildingId, BuildingBase>;
