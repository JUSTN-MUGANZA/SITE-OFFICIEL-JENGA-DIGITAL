import type { ReactNode } from "react";

const TONES = {
  success: "border-success/30 bg-success/10 text-success",
  error: "border-danger/30 bg-danger/10 text-danger",
  info: "border-border bg-muted text-foreground",
};

export function Alert({ tone = "info", children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${TONES[tone]}`}>
      {children}
    </div>
  );
}
