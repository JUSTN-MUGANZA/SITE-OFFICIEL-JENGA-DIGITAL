import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { ServiceIcon } from "./service-icon";

type ServiceLink = { slug: string; title: string; icon: string };

export function SiteHeader({ agencyName, logoUrl, services }: { agencyName: string; logoUrl: string; services: ServiceLink[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="shrink-0" aria-label={`${agencyName}, accueil`}>
          <Logo agencyName={agencyName} logoUrl={logoUrl} className="h-10 w-auto lg:h-11" />
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center lg:flex">
          {NAV_LINKS.filter((l) => l.href !== "/contact").map((item) =>
            item.href === "/services" && services.length > 0 ? (
              <div key={item.href} className="group relative">
                <div className="flex items-center">
                  <NavLink {...item} />
                  <ChevronDown className="-ml-1.5 size-3.5 text-white/60 transition group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden />
                </div>
                <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="rounded-2xl border border-border bg-white p-2 shadow-2xl">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-brand-soft">
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
          <NavLink href="/contact" label="Contact" />
        </nav>
        <Link
          href="/contact"
          className="hidden items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-mid lg:inline-flex"
        >
          Nous contacter <ArrowRight className="size-4" aria-hidden />
        </Link>
        <MobileMenu items={NAV_LINKS} />
      </div>
    </header>
  );
}
