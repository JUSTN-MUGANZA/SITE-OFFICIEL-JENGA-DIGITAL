import { describe, expect, it } from "vitest";
import { contactNotificationEmail } from "./templates";

describe("contactNotificationEmail", () => {
  const params = {
    agencyName: "JENGA Digital",
    name: "<script>alert(1)</script>",
    email: "a@b.com",
    phone: "",
    company: "",
    subject: "Devis",
    serviceName: "",
    message: "Ligne 1\nLigne 2",
    sourcePage: "/services/site-web",
    dashboardUrl: null,
  };

  it("échappe le HTML saisi par le visiteur", () => {
    const { html } = contactNotificationEmail(params);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("garde les retours à la ligne et omet les champs vides", () => {
    const { html, text, subject } = contactNotificationEmail(params);
    expect(html).toContain("Ligne 1<br>Ligne 2");
    expect(text).not.toContain("Téléphone");
    expect(subject).toBe("Nouveau message : Devis");
  });
});
