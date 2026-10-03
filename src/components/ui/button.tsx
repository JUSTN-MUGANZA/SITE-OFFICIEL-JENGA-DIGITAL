import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-brand-foreground hover:opacity-90",
  secondary: "border border-border bg-background hover:bg-muted",
  ghost: "hover:bg-muted",
  danger: "bg-danger text-white hover:opacity-90",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${VARIANTS[variant]} ${extra}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}
