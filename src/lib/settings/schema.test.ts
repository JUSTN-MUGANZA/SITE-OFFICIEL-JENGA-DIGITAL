import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, siteSettingsSchema, withDefaults } from "./schema";

const valid = {
  ...DEFAULT_SETTINGS,
  email: "contact@agence.com",
  contactRecipientEmail: "boite@agence.com",
};

describe("siteSettingsSchema", () => {
  it("accepte des paramètres complets", () => {
    expect(siteSettingsSchema.safeParse(valid).success).toBe(true);
  });

  it("refuse une adresse de réception invalide", () => {
    const result = siteSettingsSchema.safeParse({ ...valid, contactRecipientEmail: "pas-un-email" });
    expect(result.success).toBe(false);
  });

  it("refuse un lien de réseau social sans https", () => {
    const result = siteSettingsSchema.safeParse({ ...valid, socials: { ...valid.socials, facebook: "javascript:alert(1)" } });
    expect(result.success).toBe(false);
  });
});

describe("withDefaults", () => {
  it("utilise l'adresse de secours quand aucune adresse n'est enregistrée", () => {
    const s = withDefaults(undefined, "secours@agence.com");
    expect(s.contactRecipientEmail).toBe("secours@agence.com");
    expect(s.agencyName).toBe("JENGA Digital");
  });

  it("garde l'adresse enregistrée", () => {
    const s = withDefaults({ contactRecipientEmail: "a@b.com" }, "secours@agence.com");
    expect(s.contactRecipientEmail).toBe("a@b.com");
  });

  it("complète les réseaux sociaux manquants", () => {
    const s = withDefaults({ socials: { facebook: "https://fb.com/x" } as never });
    expect(s.socials.facebook).toBe("https://fb.com/x");
    expect(s.socials.instagram).toBe("");
  });

  it("refuse un lien de pied de page dangereux ou externe sans protocole", () => {
    for (const url of ["javascript:alert(1)", "//evil.com", "evil.com"]) {
      const result = siteSettingsSchema.safeParse({ ...valid, links: [{ label: "X", url }] });
      expect(result.success).toBe(false);
    }
    expect(siteSettingsSchema.safeParse({ ...valid, links: [{ label: "X", url: "/mentions-legales" }] }).success).toBe(true);
  });
});
