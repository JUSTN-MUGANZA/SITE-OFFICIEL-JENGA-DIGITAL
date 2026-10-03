import type { Metadata } from "next";
import { LegalBody } from "@/components/site/legal";
import { PageHero } from "@/components/site/section";
import { getSiteSettings } from "@/lib/settings/server";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données nous collectons, pourquoi, combien de temps nous les gardons et comment exercer vos droits.",
  alternates: { canonical: "/confidentialite" },
};

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const contact = settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : <a href="/contact">notre formulaire de contact</a>;
  return (
    <>
      <PageHero title="Politique de confidentialité" intro="Vos données servent à vous répondre, rien de plus." crumbs={[{ href: "/", label: "Accueil" }, { label: "Confidentialité" }]} />
      <LegalBody updated="octobre 2026">
        <div>
          <h2>Données collectées</h2>
          <p>Lorsque vous nous écrivez via le formulaire de contact, nous enregistrons :</p>
          <ul>
            <li>votre nom et votre adresse email ;</li>
            <li>si vous les indiquez : téléphone, entreprise, service souhaité et sujet ;</li>
            <li>votre message, la page d&apos;où vous écrivez et la date d&apos;envoi ;</li>
            <li>une empreinte anonymisée de votre adresse IP, pour bloquer les envois abusifs.</li>
          </ul>
        </div>
        <div>
          <h2>Pourquoi</h2>
          <ul>
            <li>Répondre à votre demande et établir un devis.</li>
            <li>Vous envoyer nos nouvelles, uniquement si vous avez coché la case prévue. Chaque email contient un lien de désinscription.</li>
          </ul>
          <p>Vos données ne sont jamais vendues ni cédées à des tiers.</p>
        </div>
        <div>
          <h2>Durée de conservation</h2>
          <p>
            Les demandes sont conservées 3 ans après notre dernier échange, puis supprimées. Si vous vous désinscrivez, vous ne recevez
            plus aucun email d&apos;information.
          </p>
        </div>
        <div>
          <h2>Prestataires</h2>
          <ul>
            <li>Vercel : hébergement du site.</li>
            <li>Google Firebase : stockage des demandes, en Europe.</li>
            <li>Resend : envoi des emails.</li>
          </ul>
        </div>
        <div>
          <h2>Cookies</h2>
          <p>
            Le site public n&apos;utilise aucun cookie publicitaire ni de suivi. Un cookie technique sert uniquement à la connexion des
            administrateurs.
          </p>
        </div>
        <div>
          <h2>Vos droits</h2>
          <p>
            Vous pouvez demander à consulter, corriger ou supprimer vos données, ou vous opposer à leur utilisation, en écrivant à {contact}.
            Nous répondons sous un mois.
          </p>
        </div>
      </LegalBody>
    </>
  );
}
