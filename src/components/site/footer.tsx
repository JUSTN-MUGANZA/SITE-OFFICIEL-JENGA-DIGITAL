import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SOCIAL_LABELS, SOCIAL_NETWORKS, type SiteSettings } from "@/lib/settings/schema";
import { NAV_LINKS } from "@/lib/site";
import { SocialIcon } from "./social-icons";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socials = SOCIAL_NETWORKS.filter((n) => settings.socials[n]);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/brand/mark-transparent.png" alt="" width={48} height={48} className="size-12" />
            <span className="text-lg font-bold tracking-wide text-white">{settings.agencyName}</span>
          </div>
          <p className="text-sm leading-relaxed">
            {settings.footerText || settings.tagline || "Agence digitale : sites web, applications et visibilité en ligne pour faire grandir votre activité."}
          </p>
          {socials.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {socials.map((n) => (
                <li key={n}>
                  <a
                    href={settings.socials[n]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-accent"
                  >
                    <SocialIcon network={n} className="size-5" />
                    <span className="sr-only">{SOCIAL_LABELS[n]}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Navigation</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[...NAV_LINKS, { href: "/contact", label: "Contact" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Liens utiles</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {settings.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} className="hover:text-accent-light" {...(l.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/mentions-legales" className="hover:text-accent-light">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-accent-light">
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {settings.email ? (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent-light" aria-hidden />
                <a href={`mailto:${settings.email}`} className="break-all hover:text-accent-light">
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings.phone ? (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent-light" aria-hidden />
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-accent-light">
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings.address ? (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent-light" aria-hidden />
                {settings.mapsUrl ? (
                  <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="whitespace-pre-line hover:text-accent-light">
                    {settings.address}
                  </a>
                ) : (
                  <span className="whitespace-pre-line">{settings.address}</span>
                )}
              </li>
            ) : null}
            {settings.hours ? (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-accent-light" aria-hidden />
                <span className="whitespace-pre-line">{settings.hours}</span>
              </li>
            ) : null}
            <li>
              <Link href="/contact" className="mt-1 inline-flex rounded-lg bg-accent px-4 py-2 font-semibold text-ink transition hover:bg-accent-light">
                Nous écrire
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/60 sm:px-6">
          © {year} {settings.agencyName}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
