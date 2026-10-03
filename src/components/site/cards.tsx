import { ArrowRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ContentItem } from "@/lib/content/schemas";
import { ServiceIcon } from "./service-icon";

const fr = (v: { fr: string } | undefined) => v?.fr ?? "";

export function ServiceCard({ service }: { service: ContentItem<"services"> }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition hover:-translate-y-1 hover:border-accent-light hover:shadow-lg"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-white">
        <ServiceIcon name={service.icon} className="size-6" />
      </span>
      <h3 className="mt-5 text-lg font-bold text-ink">{fr(service.title)}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{fr(service.shortDescription)}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-mid">
        En savoir plus <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}

export function ProjectCard({ project }: { project: ContentItem<"projects"> }) {
  return (
    <Link href={`/realisations/${project.slug}`} className="group block overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.coverAlt || fr(project.title)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="brand-gradient flex h-full items-center justify-center p-6 text-center text-lg font-bold text-white">{fr(project.title)}</div>
        )}
      </div>
      <div className="p-5">
        {project.sector || project.year ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-mid">
            {[project.sector, project.year].filter(Boolean).join(" · ")}
          </p>
        ) : null}
        <h3 className="mt-1 text-lg font-bold text-ink">{fr(project.title)}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{fr(project.summary)}</p>
      </div>
    </Link>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: ContentItem<"testimonials"> }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm">
      <Quote className="size-8 text-accent-light" aria-hidden />
      {testimonial.rating ? (
        <p className="mt-3 flex gap-0.5" aria-label={`${testimonial.rating} sur 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`size-4 ${i < (testimonial.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-border"}`} aria-hidden />
          ))}
        </p>
      ) : null}
      <blockquote className="mt-3 flex-1 leading-relaxed text-ink/90">« {fr(testimonial.quote)} »</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {testimonial.photo ? (
          <Image src={testimonial.photo} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
        ) : (
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
            {testimonial.author.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span>
          <span className="block font-semibold text-ink">{testimonial.author}</span>
          <span className="block text-sm text-muted-foreground">{[testimonial.role, testimonial.company].filter(Boolean).join(", ")}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TeamCard({ member }: { member: ContentItem<"team"> }) {
  return (
    <article className="text-center">
      <div className="relative mx-auto aspect-square w-full max-w-60 overflow-hidden rounded-2xl bg-muted">
        {member.photo ? (
          <Image src={member.photo} alt={member.name} fill sizes="240px" className="object-cover" />
        ) : (
          <div className="brand-gradient flex h-full items-center justify-center text-5xl font-bold text-white">{member.name.slice(0, 1)}</div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-bold text-ink">{member.name}</h3>
      <p className="text-sm font-medium text-brand-mid">{fr(member.role)}</p>
      {fr(member.bio) ? <p className="mt-2 text-sm text-muted-foreground">{fr(member.bio)}</p> : null}
    </article>
  );
}

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="brand-gradient relative overflow-hidden rounded-3xl px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Un projet en tête ?</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
          Parlez-nous de votre idée : nous vous répondons rapidement avec des conseils et un devis gratuit.
        </p>
        <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand transition hover:bg-accent-light">
          Démarrer mon projet <ArrowRight className="size-5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
