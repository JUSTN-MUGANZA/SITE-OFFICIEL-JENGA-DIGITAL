import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { SOCIAL_LABELS, SOCIAL_NETWORKS, type SiteSettings } from "@/lib/settings/schema";
import { DEFAULT_TAGLINE, NAV_LINKS } from "@/lib/site";
import { Logo } from "./logo";
import { SocialIcon } from "./social-icons";
import { TechLines } from "./visuals";

const heading = "text-sm font-semibold text-white";
const link = "text-sm text-white/65 transition hover:text-white";

export function SocialLinks({ settings, className = "" }: { settings: SiteSettings; className?: string }) {
  const socials = SOCIAL_NETWORKS.filter((n) => settings.socials[n]);
  if (socials.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {socials.map((n) => (
        <li key={n}>
          <a
            href={settings.socials[n]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-9 items-center justify-center rounded-full bg-brand text-white transition hover:-translate-y-0.5 hover:bg-brand-mid"
          >
            <SocialIcon network={n} className="size-4" />
            <span className="sr-only">{SOCIAL_LABELS[n]}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter({ settings, services }: { settings: SiteSettings; services: { slug: string; title: string }[] }) {
  const year = new Date().getFullYear();
  const hasContact = Boolean(settings.email || settings.phone || settings.address || settings.hours);
  const hasSocials = SOCIAL_NETWORKS.some((n) => settings.socials[n]);
  return (
    <footer className="relative mt-auto overflow-hidden bg-navy-950 text-white">
      <TechLines className="absolute -right-20 bottom-0 h-full opacity-30" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr] lg:px-8 lg:py-16">
        <div className="space-y-5">
          <Link href="/" aria-label={`${settings.agencyName}, accueil`} className="inline-block">
            <Logo agencyName={settings.agencyName} logoUrl={settings.logoUrl} className="h-12 w-auto" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-white/65">{settings.footerText || settings.tagline || DEFAULT_TAGLINE}</p>
        </div>

        <div>
          <h2 className={heading}>Liens rapides</h2>
          <ul className="mt-4 space-y-2.5">
            {[...NAV_LINKS, { href: "/histoire", label: "Notre histoire" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={heading}>Nos services</h2>
          <ul className="mt-4 space-y-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={link}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={heading}>Contact</h2>
          {hasContact ? null : (
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-mid"
            >
              Nous écrire
            </Link>
          )}
          <ul className="mt-4 space-y-3 text-sm text-white/65 empty:hidden">
            {settings.email ? (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings.phone ? (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings.address ? (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            ) : null}
            {settings.hours ? (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span className="whitespace-pre-line">{settings.hours}</span>
              </li>
            ) : null}
          </ul>
          {hasSocials ? (
            <>
              <h2 className={`${heading} mt-6`}>Suivez-nous</h2>
              <SocialLinks settings={settings} className="mt-3" />
            </>
          ) : null}
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {settings.agencyName}. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {settings.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} className="hover:text-white" {...(l.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/confidentialite" className="hover:text-white">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:text-white">
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
