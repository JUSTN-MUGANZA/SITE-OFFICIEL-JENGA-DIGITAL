import { describe, expect, it } from "vitest";
import { contactSchema, looksLikeBot } from "./schema";

const base = { name: "Awa Diallo", email: "Awa@Example.com", message: "Bonjour, je voudrais un site vitrine." };

describe("contactSchema", () => {
  it("accepte un message valide et normalise l'email", () => {
    const r = contactSchema.parse(base);
    expect(r.email).toBe("awa@example.com");
    expect(r.consentMarketing).toBe(false);
  });

  it("refuse un message trop court", () => {
    expect(contactSchema.safeParse({ ...base, message: "Salut" }).success).toBe(false);
  });

  it("refuse un email invalide", () => {
    expect(contactSchema.safeParse({ ...base, email: "awa@" }).success).toBe(false);
  });
});

describe("looksLikeBot", () => {
  const now = 1_000_000;
  it("laisse passer un humain", () => {
    expect(looksLikeBot(contactSchema.parse({ ...base, startedAt: now - 20_000 }), now)).toBe(false);
  });
  it("repère le champ piège rempli", () => {
    expect(looksLikeBot(contactSchema.parse({ ...base, website: "http://spam" }), now)).toBe(true);
  });
  it("repère un envoi en moins de 3 secondes", () => {
    expect(looksLikeBot(contactSchema.parse({ ...base, startedAt: now - 500 }), now)).toBe(true);
  });
  it("repère un message rempli de liens", () => {
    const message = "Visitez https://a.com https://b.com https://c.com https://d.com";
    expect(looksLikeBot(contactSchema.parse({ ...base, message }), now)).toBe(true);
  });
});
