import { describe, expect, it } from "vitest";
import { isBootstrapEmail } from "./bootstrap";

describe("isBootstrapEmail", () => {
  it("accepte l'adresse configurée si elle est vérifiée", () => {
    expect(isBootstrapEmail("Boss@Agence.com", true, "boss@agence.com")).toBe(true);
  });

  it("refuse une adresse non vérifiée", () => {
    expect(isBootstrapEmail("boss@agence.com", false, "boss@agence.com")).toBe(false);
  });

  it("refuse quand rien n'est configuré", () => {
    expect(isBootstrapEmail("boss@agence.com", true, undefined)).toBe(false);
  });

  it("accepte une liste séparée par des virgules", () => {
    expect(isBootstrapEmail("b@x.com", true, "a@x.com, b@x.com")).toBe(true);
  });
});
