import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-background hover:bg-primary/90 disabled:bg-primary/40 shadow-[0_0_24px_-8px_var(--color-primary)]",
  secondary: "bg-card text-fg border border-line hover:border-primary/60 hover:bg-surface",
  outline: "border border-line text-muted hover:text-fg hover:border-primary/60",
  ghost: "text-muted hover:text-fg hover:bg-white/5",
  danger: "bg-danger text-background hover:bg-danger/90",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

/**
 * The button's look, on its own. Use it on a Link or an anchor — never nest a
 * <button> inside <a>: that is invalid markup and the browser drops the
 * navigation, leaving a button that appears to work and does nothing.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
    "disabled:pointer-events-none disabled:opacity-45",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}
