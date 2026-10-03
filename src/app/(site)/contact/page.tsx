import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
import { PageHero } from "@/components/site/section";
import { fr, getPublicServices } from "@/lib/content/public";
import { getSiteSettings } from "@/lib/settings/server";

export const metadata: Metadata = {
  title: "Contact et devis",
  description:
    "Parlez-nous de votre projet de site web, d'application ou de visibilité en ligne : devis gratuit et réponse rapide.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: PageProps<"/contact">) {
  const [{ service }, services, settings] = await Promise.all([
    searchParams,
    getPublicServices(),
    getSiteSettings(),
  ]);
  const wanted = typeof service === "string" ? service : "";
  const initial =
    services.find((s) => s.slug === wanted || s.id === wanted)?.id ?? "";
  const whatsapp = settings.socials.whatsapp;
  const hasDetails = Boolean(
    settings.email ||
    settings.phone ||
    settings.address ||
    settings.hours ||
    whatsapp,
  );

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlons de votre projet"
        intro="Un site, une application, plus de clients en ligne ? Décrivez votre besoin : le devis est gratuit et sans engagement."
      />
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <div className="relative rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-10">
          <ContactForm
            services={services.map((s) => ({ id: s.id, title: fr(s.title) }))}
            initialServiceId={initial}
          />
        </div>
        <aside className="space-y-6">
          {hasDetails ? (
            <div className="rounded-3xl bg-ink p-8 text-white">
              <h2 className="text-xl font-bold">Nos coordonnées</h2>
              <ul className="mt-6 space-y-4 text-sm text-white/85">
                {settings.email ? (
                  <li className="flex gap-3">
                    <Mail
                      className="mt-0.5 size-5 shrink-0 text-accent-light"
                      aria-hidden
                    />
                    <a
                      href={`mailto:${settings.email}`}
                      className="break-all hover:text-accent-light"
                    >
                      {settings.email}
                    </a>
                  </li>
                ) : null}
                {settings.phone ? (
                  <li className="flex gap-3">
                    <Phone
                      className="mt-0.5 size-5 shrink-0 text-accent-light"
                      aria-hidden
                    />
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                      className="hover:text-accent-light"
                    >
                      {settings.phone}
                    </a>
                  </li>
                ) : null}
                {settings.address ? (
                  <li className="flex gap-3">
                    <MapPin
                      className="mt-0.5 size-5 shrink-0 text-accent-light"
                      aria-hidden
                    />
                    <span className="whitespace-pre-line">
                      {settings.address}
                    </span>
                  </li>
                ) : null}
                {settings.hours ? (
                  <li className="flex gap-3">
                    <Clock
                      className="mt-0.5 size-5 shrink-0 text-accent-light"
                      aria-hidden
                    />
                    <span className="whitespace-pre-line">
                      {settings.hours}
                    </span>
                  </li>
                ) : null}
              </ul>
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  Écrire sur WhatsApp
                </a>
              ) : null}
            </div>
          ) : null}
          <div className="rounded-3xl border border-border p-8">
            <h2 className="text-lg font-bold text-ink">
              Comment ça se passe ?
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <strong className="text-ink">1.</strong> Nous lisons votre
                demande et revenons vers vous rapidement.
              </li>
              <li>
                <strong className="text-ink">2.</strong> Un échange pour bien
                comprendre vos objectifs.
              </li>
              <li>
                <strong className="text-ink">3.</strong> Vous recevez une
                proposition claire, avec prix et délais.
              </li>
            </ol>
          </div>
        </aside>
      </section>
    </>
  );
}
