import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";

export function SiteHeader({ agencyName, logoUrl }: { agencyName: string; logoUrl: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <Link href="/" className="shrink-0" aria-label={`${agencyName}, accueil`}>
          {logoUrl ? (
            // Logo personnalisé saisi dans les paramètres (adresse externe).
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={agencyName} className="h-10 w-auto sm:h-12" />
          ) : (
            <Image src="/brand/logo-jenga-digital-transparent.png" alt={agencyName} width={640} height={276} priority className="h-10 w-auto sm:h-12" />
          )}
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <Link
          href="/contact"
          className="hidden rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-mid md:inline-flex"
        >
          Demander un devis
        </Link>
        <MobileMenu items={[...NAV_LINKS, { href: "/contact", label: "Contact" }]} />
      </div>
    </header>
  );
}
