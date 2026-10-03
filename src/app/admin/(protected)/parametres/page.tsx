import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { getSiteSettingsFresh } from "@/lib/settings/server";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Paramètres du site" };

export default async function SettingsPage() {
  await requireAdmin("settings:edit");
  const settings = await getSiteSettingsFresh();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Paramètres du site</h1>
        <p className="text-sm text-muted-foreground">
          Ces informations s&apos;affichent sur le site public (en-tête, pied de page, page Contact).
        </p>
      </header>
      <SettingsForm settings={settings} />
    </div>
  );
}
