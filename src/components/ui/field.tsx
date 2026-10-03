import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 aria-invalid:border-danger";

type FieldProps = { label: string; name: string; hint?: ReactNode; error?: string };

export function Field({ label, name, hint, error, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input name={name} className={control} aria-invalid={error ? true : undefined} {...props} />
      {error ? <span className="text-xs text-danger">{error}</span> : hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function TextArea({ label, name, hint, error, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <textarea name={name} className={`${control} min-h-24`} aria-invalid={error ? true : undefined} {...props} />
      {error ? <span className="text-xs text-danger">{error}</span> : hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export const selectClass = control;
