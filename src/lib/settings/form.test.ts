import { describe, expect, it } from "vitest";
import { linksToText, settingsFromForm } from "./form";
import { siteSettingsSchema } from "./schema";

describe("settingsFromForm", () => {
  it("lit les liens « Libellé | URL » ligne par ligne", () => {
    const form = new FormData();
    form.set("links", "Mentions légales | /mentions-legales\n\nBlog | https://blog.example.com?a=1|2");
    const parsed = settingsFromForm(form);
    expect(parsed.links).toEqual([
      { label: "Mentions légales", url: "/mentions-legales" },
      { label: "Blog", url: "https://blog.example.com?a=1|2" },
    ]);
  });

  it("produit un objet valide à partir d'un formulaire rempli", () => {
    const form = new FormData();
    form.set("agencyName", "JENGA Digital");
    form.set("email", "contact@agence.com");
    form.set("contactRecipientEmail", "boite@agence.com");
    form.set("socials.instagram", "https://instagram.com/jenga");
    form.set("maintenance", "on");
    const result = siteSettingsSchema.safeParse(settingsFromForm(form));
    expect(result.success).toBe(true);
    expect(result.data?.maintenance).toBe(true);
    expect(result.data?.socials.instagram).toBe("https://instagram.com/jenga");
  });

  it("relit les liens dans le même format", () => {
    expect(linksToText([{ label: "A", url: "/a" }])).toBe("A | /a");
  });
});
