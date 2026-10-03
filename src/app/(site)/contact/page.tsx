import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
import { SocialLinks } from "@/components/site/footer";
import { container, PageHero } from "@/components/site/section";
import { MediaFrame } from "@/components/site/visuals";
import { fr, getPublicServices } from "@/lib/content/public";
import { getSiteSettings } from "@/lib/settings/server";

export const metadata: Metadata = {
  title: "Nous contacter",
  description: "Parlez-nous de votre projet de site web, d'application ou de communication digitale : devis gratuit et réponse rapide.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const [{ service }, services, settings] = await Promise.all([searchParams, getPublicServices(), getSiteSettings()]);
  const wanted = typeof service === "string" ? service : "";
  const initial = services.find((s) => s.slug === wanted || s.id === wanted)?.id ?? "";
  const whatsapp = settings.socials.whatsapp;

  const details = [
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Phone, label: "Téléphone", value: settings.phone, href: `tel:${settings.phone.replace(/\s+/g, "")}` },
    { icon: MapPin, label: "Localisation", value: settings.address, href: settings.mapsUrl || undefined },
    { icon: Clock, label: "Horaires", value: settings.hours },
  ].filter((d) => d.value);

  return (
    <>
      <PageHero title="Nous contacter" intro="Parlons de votre projet. Le devis est gratuit et sans engagement." crumbs={[{ href: "/", label: "Accueil" }, { label: "Contact" }]} />
      <section className={`grid gap-8 py-16 sm:py-20 lg:grid-cols-[17rem_1fr] xl:grid-cols-[17rem_1fr_20rem] ${container}`}>
        <aside className="space-y-6">
          {details.length > 0 ? (
            <ul className="space-y-5">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/30">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{label}</p>
                    {href ? (
                      <a href={href} className="whitespace-pre-line break-words text-sm text-muted-foreground hover:text-brand" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {value}
                      </a>
                    ) : (
                      <p className="whitespace-pre-line text-sm text-muted-foreground">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
          <SocialLinks settings={settings} />
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <MessageCircle className="size-4" aria-hidden />
              Écrire sur WhatsApp
            </a>
          ) : null}
        </aside>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-xl shadow-navy-950/5 sm:p-8">
          <h2 className="text-xl font-semibold text-ink">Envoyez-nous un message</h2>
          <p className="mt-1 text-sm text-muted-foreground">Nous vous répondons rapidement.</p>
          <div className="mt-6">
            <ContactForm services={services.map((s) => ({ id: s.id, title: fr(s.title) }))} initialServiceId={initial} />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2 xl:col-span-1 xl:grid-cols-1">
          {settings.address ? (
            <iframe
              title={`Carte : ${settings.address}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-3xl border border-border shadow-lg"
            />
          ) : null}
          <MediaFrame alt="" sizes="20rem" className="aspect-[4/3] rounded-3xl shadow-lg">
            <div className="px-6 text-center">
              <p className="text-lg font-semibold">Un projet en tête ?</p>
              <p className="mt-1 text-sm text-white/70">Nous transformons vos idées en solutions digitales.</p>
            </div>
          </MediaFrame>
        </div>
      </section>
    </>
  );
}
