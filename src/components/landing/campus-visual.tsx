/**
 * Decorative hero visual — a stylised isometric campus with a sensing pulse
 * travelling between buildings. Static by design: it carries no readings, so
 * it cannot misrepresent the simulation.
 */
export function CampusVisual({ className }: { className?: string }) {
  const blocks = [
    { x: 300, y: 210, w: 78, d: 52, h: 62, tone: "var(--color-primary)" },
    { x: 180, y: 290, w: 62, d: 42, h: 34, tone: "var(--color-primary)" },
    { x: 420, y: 290, w: 70, d: 46, h: 84, tone: "var(--color-cyan)" },
    { x: 300, y: 360, w: 66, d: 44, h: 44, tone: "var(--color-ai)" },
    { x: 180, y: 160, w: 54, d: 36, h: 48, tone: "var(--color-primary)" },
  ];

  const iso = (x: number, y: number, w: number, d: number, lift: number) =>
    `${x},${y - d - lift} ${x + w},${y - lift} ${x},${y + d - lift} ${x - w},${y - lift}`;

  return (
    <svg
      viewBox="0 0 600 460"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <radialGradient id="hero-glow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="600" height="460" fill="url(#hero-glow)" />

      <polygon
        points="300,60 590,270 300,440 10,270"
        fill="var(--color-surface)"
        fillOpacity="0.5"
        stroke="var(--color-line)"
      />

      {/* Sensor links */}
      <g stroke="var(--color-primary)" strokeOpacity="0.45" strokeWidth="1.2">
        <line x1="300" y1="210" x2="180" y2="290" />
        <line x1="300" y1="210" x2="420" y2="290" />
        <line x1="300" y1="210" x2="180" y2="160" />
        <line x1="180" y1="290" x2="300" y2="360" />
        <line x1="420" y1="290" x2="300" y2="360" />
      </g>

      {blocks.map((b, i) => (
        <g key={i} style={{ color: b.tone }}>
          <polygon points={iso(b.x, b.y, b.w, b.d, 0)} fill="currentColor" opacity="0.12" />
          <polygon
            points={`${b.x - b.w},${b.y - b.h} ${b.x},${b.y + b.d - b.h} ${b.x},${b.y + b.d} ${b.x - b.w},${b.y}`}
            fill="currentColor"
            opacity="0.28"
          />
          <polygon
            points={`${b.x + b.w},${b.y - b.h} ${b.x},${b.y + b.d - b.h} ${b.x},${b.y + b.d} ${b.x + b.w},${b.y}`}
            fill="currentColor"
            opacity="0.16"
          />
          <polygon
            points={iso(b.x, b.y, b.w, b.d, b.h)}
            fill="currentColor"
            opacity="0.62"
            stroke="currentColor"
            strokeOpacity="0.9"
          />
        </g>
      ))}

      {/* Perception pulses travelling the sensor network */}
      <g fill="var(--color-cyan)">
        <circle r="4">
          <animateMotion dur="3.6s" repeatCount="indefinite" path="M300,210 L420,290 L300,360" />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="4">
          <animateMotion
            dur="4.4s"
            repeatCount="indefinite"
            path="M180,160 L300,210 L180,290"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="4.4s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}
