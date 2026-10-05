import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { JsonLd } from "@/components/site/section";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { fr, getPublicServices } from "@/lib/content/public";
import { OFFICIAL_LOCATION, SOCIAL_NETWORKS } from "@/lib/settings/schema";
import { getSiteSettings } from "@/lib/settings/server";
import { siteUrl } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, services] = await Promise.all([getSiteSettings(), getPublicServices()]);
  const serviceLinks = services.map((s) => ({ slug: s.slug, title: fr(s.title), icon: s.icon }));
  const url = siteUrl();

  // Identité de l'agence pour Google, Bing et les assistants IA : qui, quoi, comment la joindre.
  const sameAs = SOCIAL_NETWORKS.filter((n) => n !== "whatsapp")
    .map((n) => settings.socials[n])
    .filter(Boolean);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${url}/#organisation`,
        name: settings.agencyName,
        url,
        logo: `${url}/brand/logo-jenga-digital.png`,
        image: `${url}/opengraph-image.jpg`,
        description:
          settings.tagline ||
          "Agence digitale : création de sites web et d'applications, référencement Google, référencement local et visibilité dans les moteurs de recherche IA.",
        ...(settings.email ? { email: settings.email } : {}),
        ...(settings.phone ? { telephone: settings.phone } : {}),
        // Adresse structurée tant que l'adresse affichée est celle de Bukavu (sinon, texte libre).
        address: settings.address.includes(OFFICIAL_LOCATION.locality)
          ? {
              "@type": "PostalAddress",
              addressLocality: OFFICIAL_LOCATION.locality,
              addressRegion: OFFICIAL_LOCATION.region,
              addressCountry: OFFICIAL_LOCATION.countryCode,
            }
          : settings.address || undefined,
        areaServed: [
          { "@type": "City", name: OFFICIAL_LOCATION.locality },
          { "@type": "AdministrativeArea", name: OFFICIAL_LOCATION.region },
          { "@type": "Country", name: OFFICIAL_LOCATION.countryName },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["French"],
          ...(settings.email ? { email: settings.email } : {}),
          ...(settings.phone ? { telephone: settings.phone } : {}),
          url: `${url}/contact`,
        },
        knowsAbout: ["Création de sites web", "Applications mobiles", "Référencement naturel (SEO)", "Référencement local", "Visibilité dans les moteurs de recherche IA", "Design graphique", "Communication digitale"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: fr(s.title), url: `${url}/services/${s.slug}` },
          })),
        },
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#site`,
        url,
        name: settings.agencyName,
        inLanguage: "fr",
        publisher: { "@id": `${url}/#organisation` },
      },
    ],
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
      <WhatsAppButton link={settings.socials.whatsapp} />
      <JsonLd data={structuredData} />
    </div>
  );
}
