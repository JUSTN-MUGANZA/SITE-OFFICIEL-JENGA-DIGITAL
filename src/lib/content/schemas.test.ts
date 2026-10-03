import { describe, expect, it } from "vitest";
import { faqSchema, homeSchema, isLive, projectSchema, serviceSchema } from "./schemas";
import { slugify } from "./slug";

describe("slugify", () => {
  it("retire accents, apostrophes et espaces", () => {
    expect(slugify("Création de site Web")).toBe("creation-de-site-web");
    expect(slugify("L'agence d’Abidjan !")).toBe("l-agence-d-abidjan");
    expect(slugify("  --Hello--  ")).toBe("hello");
  });
});

describe("schémas de contenu", () => {
  it("complète un projet minimal avec les valeurs par défaut", () => {
    const p = projectSchema.parse({ slug: "site-vitrine", title: { fr: "Site vitrine" }, summary: { fr: "Résumé" } });
    expect(p.status).toBe("draft");
    expect(p.title.en).toBe("");
    expect(p.gallery).toEqual([]);
    expect(p.seo.title).toBe("");
  });

  it("refuse un slug avec des majuscules ou des espaces", () => {
    const r = serviceSchema.safeParse({ slug: "Mon Service", title: { fr: "x" }, shortDescription: { fr: "y" } });
    expect(r.success).toBe(false);
  });

  it("refuse une question sans réponse en français", () => {
    expect(faqSchema.safeParse({ question: { fr: "Q ?" }, answer: { fr: "" } }).success).toBe(false);
  });

  it("refuse une image en javascript:", () => {
    const r = projectSchema.safeParse({ slug: "a", title: { fr: "a" }, summary: { fr: "a" }, coverImage: "javascript:alert(1)" });
    expect(r.success).toBe(false);
  });

  it("donne un ordre de sections par défaut à l'accueil", () => {
    const h = homeSchema.parse({ hero: { title: { fr: "Bienvenue" } } });
    expect(h.sections[0]).toEqual({ key: "services", visible: true });
  });
});

describe("isLive", () => {
  const base = { status: "published" as const, publishAt: "", deletedAt: null };
  it("affiche un contenu publié", () => expect(isLive(base)).toBe(true));
  it("masque un brouillon", () => expect(isLive({ ...base, status: "draft" })).toBe(false));
  it("masque un contenu en corbeille", () => expect(isLive({ ...base, deletedAt: "2026-01-01" })).toBe(false));
  it("attend la date de publication programmée", () => {
    const now = Date.parse("2026-10-03T12:00:00Z");
    expect(isLive({ ...base, publishAt: "2026-10-04T08:00:00Z" }, now)).toBe(false);
    expect(isLive({ ...base, publishAt: "2026-10-02T08:00:00Z" }, now)).toBe(true);
  });
});
