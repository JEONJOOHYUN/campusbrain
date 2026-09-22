import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width={18}
      height={18}
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconOverview = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="4.5" rx="1.5" />
    <rect x="13.5" y="10.5" width="7.5" height="10.5" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
  </Icon>
);

export const IconTwin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2.8 21 8v8l-9 5.2L3 16V8z" />
    <path d="M3 8l9 5.2L21 8" />
    <path d="M12 13.2V21" />
  </Icon>
);

export const IconCrowd = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.6a3 3 0 0 1 0 5.8" />
    <path d="M17.5 14.4A5.5 5.5 0 0 1 21 20" />
  </Icon>
);

export const IconSignage = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="4" width="19" height="12" rx="2" />
    <path d="M9 20h6M12 16v4" />
    <path d="M7.5 10h6M11.5 7.6 14 10l-2.5 2.4" />
  </Icon>
);

export const IconRobot = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="8" width="16" height="11" rx="3" />
    <path d="M12 4.5V8" />
    <circle cx="12" cy="3.4" r="1.4" />
    <path d="M9 13h.01M15 13h.01" />
    <path d="M1.8 12v3M22.2 12v3" />
  </Icon>
);

export const IconEnergy = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.2 2.5 4.8 13.4h5.6L10 21.5l9-11H13z" />
  </Icon>
);

export const IconEmergency = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10.6 3.4 2.4 17.6A1.6 1.6 0 0 0 3.8 20h16.4a1.6 1.6 0 0 0 1.4-2.4L13.4 3.4a1.6 1.6 0 0 0-2.8 0z" />
    <path d="M12 9v4.5M12 17h.01" />
  </Icon>
);

export const IconReports = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 2.8H7a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.8z" />
    <path d="M14 2.8V8h5" />
    <path d="M8.5 13h7M8.5 16.5h4.5" />
  </Icon>
);

export const IconBrain = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4.2a3 3 0 0 0-5.6 1.4A2.9 2.9 0 0 0 4.2 10a3 3 0 0 0 1 4.6A3 3 0 0 0 9 19.4a3 3 0 0 0 3-1.6z" />
    <path d="M12 4.2a3 3 0 0 1 5.6 1.4A2.9 2.9 0 0 1 19.8 10a3 3 0 0 1-1 4.6A3 3 0 0 1 15 19.4a3 3 0 0 1-3-1.6z" />
  </Icon>
);

export const IconPlay = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <path d="M7.5 4.8v14.4l11.5-7.2z" />
  </Icon>
);

export const IconPause = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <rect x="6.5" y="5" width="3.8" height="14" rx="1" />
    <rect x="13.7" y="5" width="3.8" height="14" rx="1" />
  </Icon>
);

export const IconReset = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
    <path d="M3.2 4.2v4.6h4.6" />
  </Icon>
);

export const IconClose = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const IconArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </Icon>
);

export const IconCheck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12.5l5 5 10-11" />
  </Icon>
);

export const IconElevator = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="2.8" width="16" height="18.4" rx="2" />
    <path d="M12 2.8v18.4" />
    <path d="M8 9.5 6.4 11.5h3.2zM16 14.5l1.6-2h-3.2z" />
  </Icon>
);

export const IconTemperature = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 13.6V5a2 2 0 1 1 4 0v8.6a4 4 0 1 1-4 0z" />
  </Icon>
);

export const IconAir = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8.5h11a3 3 0 1 0-3-3" />
    <path d="M3 13h14.5a3 3 0 1 1-3 3" />
    <path d="M3 17.5h6" />
  </Icon>
);

export const IconSensor = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="2.4" />
    <path d="M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4" />
    <path d="M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14" />
  </Icon>
);
