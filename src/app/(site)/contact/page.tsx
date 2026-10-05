import { Clock, Mail, MapPin, MessageCircle, Phone, ShieldCheck, FileText, UserCheck } from "lucide-react";
import type { Metadata } from "next";
import { card } from "@/components/site/cards";
import { ContactForm } from "@/components/site/contact-form";
import { ConsentMap } from "@/components/site/cookie-consent";
import { SocialLinks } from "@/components/site/footer";
import { container, PageHero } from "@/components/site/section";
import { fr, getPublicFaqs, getPublicServices } from "@/lib/content/public";
import { SOCIAL_NETWORKS } from "@/lib/settings/schema";
import { getSiteSettings } from "@/lib/settings/server";
import { pageMetadata } from "@/lib/seo";
import { whatsappHref } from "@/components/site/whatsapp-button";

export const metadata: Metadata = pageMetadata({
  title: "Contact et devis gratuit",
  description: "Contactez JENGA Digital par formulaire, e-mail ou WhatsApp pour votre site web, votre application ou votre visibilité sur Google : devis gratuit et sans engagement.",
  path: "/contact",
});

const COMMITMENTS = [
  { icon: ShieldCheck, title: "Confidentialité", text: "Vos informations et vos idées restent entre nous." },
  { icon: FileText, title: "Devis clair et détaillé", text: "Un chiffrage par étapes, sans frais cachés." },
  { icon: UserCheck, title: "Un interlocuteur dédié", text: "La même personne vous suit du premier échange à la livraison." },
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const [{ service }, services, settings, faqs] = await Promise.all([searchParams, getPublicServices(), getSiteSettings(), getPublicFaqs()]);
  const wanted = typeof service === "string" ? service : "";
  const initial = services.find((s) => s.slug === wanted || s.id === wanted)?.id ?? "";
  const whatsapp = settings.socials.whatsapp;
  const hasSocials = SOCIAL_NETWORKS.some((n) => settings.socials[n]);

  const details = [
    { icon: Mail, label: "E-mail", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Phone, label: "Téléphone", value: settings.phone, href: `tel:${settings.phone.replace(/\s+/g, "")}` },
    { icon: MapPin, label: "Adresse", value: settings.address, href: settings.mapsUrl || undefined },
    { icon: Clock, label: "Horaires", value: settings.hours },
  ].filter((d) => d.value);

  return (
    <>
      <PageHero
        eyebrow="Contact & devis"
        title="Parlons de votre prochain projet."
        intro="Décrivez-nous votre besoin : nous l'étudions et revenons vers vous avec une proposition claire. Le devis est gratuit et sans engagement."
        crumbs={[{ href: "/", label: "Accueil" }, { label: "Contact" }]}
      />
      <section className="bg-muted">
        <div className={`grid gap-6 py-14 sm:py-16 lg:grid-cols-12 ${container}`}>
          <div className={`p-6 sm:p-9 lg:col-span-8 ${card}`}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-ink">Votre projet</h2>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">Réponse par e-mail</span>
            </div>
            <div className="mt-7">
              <ContactForm services={services.map((s) => ({ id: s.id, title: fr(s.title) }))} initialServiceId={initial} />
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            {settings.address ? (
              <div className={`overflow-hidden ${card}`}>
                <ConsentMap address={settings.address} />
              </div>
            ) : null}
            {details.length > 0 || hasSocials || whatsapp ? (
              <div className={`p-6 ${card}`}>
                <h2 className="font-bold text-ink">Nous joindre directement</h2>
                <ul className="mt-5 space-y-4">
                  {details.map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex gap-3.5">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                        <Icon className="size-[18px]" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">{label}</p>
                        {href ? (
                          <a href={href} className="whitespace-pre-line break-words text-sm font-semibold text-ink hover:text-brand" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                            {value}
                          </a>
                        ) : (
                          <p className="whitespace-pre-line text-sm font-semibold text-ink">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {whatsapp ? (
                  <a
                    href={whatsappHref(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-success px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    Écrire sur WhatsApp
                  </a>
                ) : null}
                {hasSocials ? <SocialLinks settings={settings} onLight className="mt-5" /> : null}
              </div>
            ) : null}
            <div className={`p-6 ${card}`}>
              <h2 className="font-bold text-ink">Nos engagements</h2>
              <ul className="mt-5 space-y-4">
                {COMMITMENTS.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3.5">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-brand">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{title}</p>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      {faqs.length > 0 ? (
        <section className={`py-16 sm:py-20 ${container}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Avant de nous écrire</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">Questions fréquentes</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {faqs.slice(0, 4).map((f) => (
              <div key={f.id} className={`p-6 ${card}`}>
                <h3 className="font-bold text-ink">{fr(f.question)}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{fr(f.answer)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
