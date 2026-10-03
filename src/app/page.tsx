import { getSiteSettings } from "@/lib/settings/server";

// Page d'attente : le site public complet arrive en phase 2.
export default async function HomePage() {
  const settings = await getSiteSettings();
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{settings.agencyName}</h1>
      {settings.tagline ? <p className="max-w-xl text-lg text-muted-foreground">{settings.tagline}</p> : null}
      <p className="text-sm text-muted-foreground">Notre nouveau site arrive très bientôt.</p>
      {settings.email ? (
        <a href={`mailto:${settings.email}`} className="text-brand hover:underline">
          {settings.email}
        </a>
      ) : null}
    </main>
  );
}
