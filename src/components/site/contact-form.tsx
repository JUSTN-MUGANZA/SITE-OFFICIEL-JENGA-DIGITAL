"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

type ServiceOption = { id: string; title: string };
type Status = { kind: "idle" | "sending" } | { kind: "ok" | "error"; message: string };

const input =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-ink outline-none transition focus:border-brand-mid focus:ring-2 focus:ring-accent/30";
const label = "text-sm font-semibold text-ink";

export function ContactForm({ services, initialServiceId = "" }: { services: ServiceOption[]; initialServiceId?: string }) {
  const startedAt = useRef(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "");
    setStatus({ kind: "sending" });
    setFieldErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: text("name"),
          email: text("email"),
          phone: text("phone"),
          company: text("company"),
          subject: text("subject"),
          serviceId: text("serviceId"),
          message: text("message"),
          consentMarketing: data.get("consentMarketing") === "on",
          sourcePage: window.location.pathname + window.location.search,
          website: text("website"),
          startedAt: startedAt.current || undefined,
        }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; message?: string; fieldErrors?: Record<string, string> } | null;
      if (res.ok && body?.ok) {
        form.reset();
        setStatus({ kind: "ok", message: body.message ?? "Merci ! Votre message a bien été envoyé." });
        return;
      }
      setFieldErrors(body?.fieldErrors ?? {});
      setStatus({ kind: "error", message: body?.message ?? "L'envoi a échoué. Réessayez dans un instant." });
    } catch {
      setStatus({ kind: "error", message: "Connexion impossible. Vérifiez votre réseau et réessayez." });
    }
  }

  if (status.kind === "ok") {
    return (
      <div role="status" className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-ink">{status.message}</p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-6 text-sm font-semibold text-brand-mid hover:underline">
          Envoyer un autre message
        </button>
      </div>
    );
  }

  const error = (name: string) =>
    fieldErrors[name] ? (
      <p id={`${name}-error`} className="mt-1 text-sm text-danger">
        {fieldErrors[name]}
      </p>
    ) : null;
  const describedBy = (name: string) => (fieldErrors[name] ? `${name}-error` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className={label}>
          Nom complet *
        </label>
        <input id="name" name="name" required autoComplete="name" className={input} aria-invalid={!!fieldErrors.name} aria-describedby={describedBy("name")} />
        {error("name")}
      </div>
      <div>
        <label htmlFor="email" className={label}>
          Email *
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={input} aria-invalid={!!fieldErrors.email} aria-describedby={describedBy("email")} />
        {error("email")}
      </div>
      <div>
        <label htmlFor="phone" className={label}>
          Téléphone
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={input} />
      </div>
      <div>
        <label htmlFor="company" className={label}>
          Entreprise
        </label>
        <input id="company" name="company" autoComplete="organization" className={input} />
      </div>
      <div>
        <label htmlFor="serviceId" className={label}>
          Service souhaité
        </label>
        <select id="serviceId" name="serviceId" defaultValue={initialServiceId} className={input}>
          <option value="">Je ne sais pas encore</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="subject" className={label}>
          Sujet
        </label>
        <input id="subject" name="subject" className={input} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={label}>
          Votre projet *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Décrivez votre besoin, vos objectifs, vos délais…"
          className={input}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={describedBy("message")}
        />
        {error("message")}
      </div>
      {/* Champ piège invisible pour les robots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor="website">Site web</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex items-start gap-3 text-sm text-muted-foreground sm:col-span-2">
        <input type="checkbox" name="consentMarketing" className="mt-0.5 size-4 accent-brand" />
        J&apos;accepte de recevoir occasionnellement des nouvelles de JENGA Digital. Désinscription possible à tout moment.
      </label>
      {status.kind === "error" ? (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger sm:col-span-2">
          {status.message}
        </p>
      ) : null}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-mid disabled:opacity-60"
        >
          {status.kind === "sending" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Send className="size-5" aria-hidden />}
          {status.kind === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>
        <p className="mt-3 text-xs text-muted-foreground">
          Vos informations servent uniquement à répondre à votre demande. Voir notre{" "}
          <a href="/confidentialite" className="underline">
            politique de confidentialité
          </a>
          .
        </p>
      </div>
    </form>
  );
}
