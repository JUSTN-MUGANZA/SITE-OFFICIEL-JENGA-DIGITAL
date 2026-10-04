import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";
import { btnPrimary } from "./cards";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { ServiceIcon } from "./service-icon";

type ServiceLink = { slug: string; title: string; icon: string };

export function SiteHeader({ agencyName, logoUrl, services }: { agencyName: string; logoUrl: string; services: ServiceLink[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/85 backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.5rem] lg:px-10">
        <Link href="/" className="shrink-0" aria-label={`${agencyName}, accueil`}>
          <Logo agencyName={agencyName} logoUrl={logoUrl} className="h-10 w-auto lg:h-12" />
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.filter((l) => l.href !== "/").map((item) =>
            item.href === "/services" && services.length > 0 ? (
              <div key={item.href} className="group relative">
                <div className="flex items-center">
                  <NavLink {...item} />
                  <ChevronDown className="-ml-2 size-3.5 text-subtle transition group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden />
                </div>
                <div className="invisible absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="rounded-2xl border border-border bg-white p-2 shadow-[var(--shadow-lift)]">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-muted">
                          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                            <ServiceIcon name={s.icon} className="size-4" />
                          </span>
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <NavLink key={item.href} {...item} />
            ),
          )}
        </nav>
        <Link href="/contact" className={`${btnPrimary} !py-2.5 max-lg:!hidden`}>
          Lancer un projet <ArrowRight className="size-4" aria-hidden />
        </Link>
        <MobileMenu items={NAV_LINKS} />
      </div>
    </header>
  );
}
