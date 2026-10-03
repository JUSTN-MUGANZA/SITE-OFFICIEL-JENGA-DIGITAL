import { describe, expect, it } from "vitest";
import { can, isRole } from "./roles";

describe("roles", () => {
  it("donne tous les droits au super admin", () => {
    expect(can("super_admin", "users:manage")).toBe(true);
    expect(can("super_admin", "settings:edit")).toBe(true);
  });

  it("limite l'éditeur au contenu", () => {
    expect(can("editor", "content:edit")).toBe(true);
    expect(can("editor", "settings:edit")).toBe(false);
    expect(can("editor", "contacts:manage")).toBe(false);
  });

  it("limite le commercial aux contacts", () => {
    expect(can("sales", "contacts:manage")).toBe(true);
    expect(can("sales", "content:edit")).toBe(false);
  });

  it("ne laisse le lecteur que consulter", () => {
    expect(can("viewer", "dashboard:view")).toBe(true);
    expect(can("viewer", "content:edit")).toBe(false);
  });

  it("refuse tout sans rôle", () => {
    expect(can(null, "dashboard:view")).toBe(false);
  });

  it("reconnaît les rôles valides", () => {
    expect(isRole("editor")).toBe(true);
    expect(isRole("admin")).toBe(false);
    expect(isRole(undefined)).toBe(false);
  });
});
