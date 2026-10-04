"use client";

import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextArea } from "@/components/ui/field";
import { linksToText } from "@/lib/settings/form";
import { SOCIAL_LABELS, SOCIAL_NETWORKS, type SiteSettings } from "@/lib/settings/schema";
import { saveSettings, type SettingsState } from "./actions";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(saveSettings, { status: "idle" });
  const err = (key: string) => state.fieldErrors?.[key];

  return (
    <form action={action} className="space-y-6">
      <Card title="Identité">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom de l'agence" name="agencyName" defaultValue={settings.agencyName} required error={err("agencyName")} />
          <Field label="Slogan" name="tagline" defaultValue={settings.tagline} error={err("tagline")} hint="Utilisé aussi comme description dans Google." />
          <Field label="Logo (lien de l'image)" name="logoUrl" type="url" defaultValue={settings.logoUrl} error={err("logoUrl")} hint="L'envoi direct d'image arrive avec la médiathèque." />
          <Field label="Favicon (lien de l'image)" name="faviconUrl" type="url" defaultValue={settings.faviconUrl} error={err("faviconUrl")} />
        </div>
      </Card>

      <Card title="Coordonnées">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email affiché sur le site" name="email" type="email" defaultValue={settings.email} required error={err("email")} />
          <Field
            label="Email qui reçoit les messages du formulaire"
            name="contactRecipientEmail"
            type="email"
            defaultValue={settings.contactRecipientEmail}
            required
            error={err("contactRecipientEmail")}
            hint="Chaque demande de contact y est envoyée."
          />
          <Field label="Téléphone" name="phone" type="tel" defaultValue={settings.phone} error={err("phone")} />
          <Field label="Lien Google Maps" name="mapsUrl" type="url" defaultValue={settings.mapsUrl} error={err("mapsUrl")} />
          <TextArea label="Adresse" name="address" defaultValue={settings.address} error={err("address")} />
          <TextArea label="Horaires" name="hours" defaultValue={settings.hours} error={err("hours")} placeholder={"Lun – Ven : 8h – 17h\nSam : 9h – 13h"} />
        </div>
      </Card>

      <Card title="Réseaux sociaux" description="Laissez vide un réseau que vous n'utilisez pas.">
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_NETWORKS.map((network) => (
            <Field
              key={network}
              label={SOCIAL_LABELS[network]}
              name={`socials.${network}`}
              type="url"
              placeholder="https://"
              defaultValue={settings.socials[network]}
              error={err(`socials.${network}`)}
            />
          ))}
        </div>
      </Card>

      <Card title="Pied de page">
        <div className="space-y-4">
          <TextArea
            label="Liens importants"
            name="links"
            defaultValue={linksToText(settings.links)}
            hint="Un lien par ligne, au format « Libellé | adresse ». Exemple : Mentions légales | /mentions-legales"
            error={err("links")}
          />
          <TextArea label="Texte du pied de page" name="footerText" defaultValue={settings.footerText} error={err("footerText")} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="maintenance" defaultChecked={settings.maintenance} className="size-4 accent-brand" />
            Mode maintenance (le site public affiche une page d&apos;attente)
          </label>
        </div>
      </Card>

      <div className="sticky bottom-4 flex flex-col gap-3 rounded-xl border border-border bg-white/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:flex-1">
          {state.status === "success" ? <Alert tone="success">{state.message}</Alert> : null}
          {state.status === "error" ? <Alert tone="error">{state.message}</Alert> : null}
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
