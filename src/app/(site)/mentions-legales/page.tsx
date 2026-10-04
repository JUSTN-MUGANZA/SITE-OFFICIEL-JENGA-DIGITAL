import type { Metadata } from "next";
import { LegalBody } from "@/components/site/legal";
import { PageHero } from "@/components/site/section";
import { getSiteSettings } from "@/lib/settings/server";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

export default async function LegalNoticePage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Mentions légales" crumbs={[{ href: "/", label: "Accueil" }, { label: "Mentions légales" }]} />
      <LegalBody updated="octobre 2026">
        <div>
          <h2>Éditeur du site</h2>
          <p>
            Le site <a href={siteUrl()}>{siteUrl().replace(/^https?:\/\//, "")}</a> est édité par {settings.agencyName}.
          </p>
          <ul>
            {settings.address ? <li>Adresse : {settings.address}</li> : null}
            {settings.email ? (
              <li>
                Email : <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            ) : null}
            {settings.phone ? <li>Téléphone : {settings.phone}</li> : null}
          </ul>
        </div>
        <div>
          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com). Les données du
            formulaire de contact sont stockées chez Google Cloud (Firebase), en Europe (Belgique).
          </p>
        </div>
        <div>
          <h2>Propriété intellectuelle</h2>
          <p>
            Les textes, le logo, les visuels et la présentation du site appartiennent à {settings.agencyName} ou à ses clients, qui ont
            autorisé leur publication. Toute reproduction sans accord écrit préalable est interdite.
          </p>
        </div>
        <div>
          <h2>Responsabilité</h2>
          <p>
            {settings.agencyName} s&apos;efforce de publier des informations exactes et à jour, sans pouvoir le garantir. Les liens vers
            d&apos;autres sites sont fournis à titre indicatif ; nous ne sommes pas responsables de leur contenu.
          </p>
        </div>
        <div>
          <h2>Données personnelles</h2>
          <p>
            Pour savoir comment nous traitons vos données, consultez notre <a href="/confidentialite">politique de confidentialité</a>.
          </p>
        </div>
      </LegalBody>
    </>
  );
}
