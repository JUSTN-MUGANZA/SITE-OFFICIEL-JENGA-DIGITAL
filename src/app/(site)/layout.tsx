import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { JsonLd } from "@/components/site/section";
import { fr, getPublicServices } from "@/lib/content/public";
import { SOCIAL_NETWORKS } from "@/lib/settings/schema";
import { getSiteSettings } from "@/lib/settings/server";
import { siteUrl } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, services] = await Promise.all([getSiteSettings(), getPublicServices()]);
  const serviceLinks = services.map((s) => ({ slug: s.slug, title: fr(s.title), icon: s.icon }));
  const url = siteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}/#organisation`,
    name: settings.agencyName,
    url,
    logo: `${url}/brand/logo-jenga-digital.png`,
    image: `${url}/opengraph-image.jpg`,
    description: settings.tagline || "Agence digitale : création de sites web, applications, référencement et marketing digital.",
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.address ? { address: settings.address } : {}),
    sameAs: SOCIAL_NETWORKS.map((n) => settings.socials[n]).filter(Boolean),
  };

  return (
    // « site-theme » active le mode sombre du site public (voir globals.css).
    <div className="site-theme flex flex-1 flex-col">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand focus:px-3 focus:py-2 focus:text-white">
        Aller au contenu
      </a>
      <SiteHeader agencyName={settings.agencyName} logoUrl={settings.logoUrl} services={serviceLinks} />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} services={serviceLinks} />
      <JsonLd data={organization} />
    </div>
  );
}
