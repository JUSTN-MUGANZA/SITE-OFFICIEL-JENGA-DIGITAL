import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { SOCIAL_LABELS, SOCIAL_NETWORKS, type SiteSettings } from "@/lib/settings/schema";
import { DEFAULT_TAGLINE, NAV_LINKS } from "@/lib/site";
import { Logo } from "./logo";
import { SocialIcon } from "./social-icons";
import { TechLines } from "./visuals";

const heading = "text-xs font-bold uppercase tracking-[0.14em] text-white";
const link = "text-sm text-white/60 transition hover:text-white";

export function SocialLinks({ settings, className = "", onLight = false }: { settings: SiteSettings; className?: string; onLight?: boolean }) {
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
            className={`inline-flex size-9 items-center justify-center rounded-lg transition hover:bg-brand hover:text-white ${onLight ? "bg-muted text-ink ring-1 ring-border" : "bg-white/10 text-white ring-1 ring-white/10"}`}
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
      <div className="tech-grid-dark absolute inset-0 opacity-60" aria-hidden />
      <TechLines light className="absolute -right-24 bottom-0 h-full opacity-40" />
      <div className="relative mx-auto grid w-full max-w-[1320px] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-16">
        <div className="space-y-5 lg:col-span-4">
          <Link href="/" aria-label={`${settings.agencyName}, accueil`} className="inline-block">
            <Logo agencyName={settings.agencyName} logoUrl={settings.logoUrl} dark className="h-14 w-auto" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-white/60">{settings.footerText || settings.tagline || DEFAULT_TAGLINE}</p>
          {hasSocials ? <SocialLinks settings={settings} /> : null}
        </div>

        <div className="lg:col-span-3">
          <h2 className={heading}>Services</h2>
          <ul className="mt-5 space-y-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={link}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className={heading}>Entreprise</h2>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.filter((l) => l.href !== "/" && l.href !== "/services").map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className={heading}>Contact</h2>
          {hasContact ? null : (
            <Link href="/contact" className="mt-5 inline-flex rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-mid">
              Nous écrire
            </Link>
          )}
          <ul className="mt-5 space-y-3.5 text-sm text-white/60 empty:hidden">
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
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-3 px-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>
            © {year} {settings.agencyName}. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {settings.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} className="hover:text-white" {...(l.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/mentions-legales" className="hover:text-white">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-white">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
