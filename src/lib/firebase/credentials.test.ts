import { describe, expect, it } from "vitest";
import { describeServiceAccount, readServiceAccount } from "./credentials";

describe("readServiceAccount", () => {
  it("lit le JSON complet du compte de service", () => {
    const json = JSON.stringify({ project_id: "p", client_email: "c@p.iam", private_key: "-----KEY-----\n" });
    expect(readServiceAccount({ FIREBASE_SERVICE_ACCOUNT: json })).toEqual({
      projectId: "p",
      clientEmail: "c@p.iam",
      privateKey: "-----KEY-----\n",
    });
  });

  it("lit les variables séparées et rétablit les retours à la ligne", () => {
    const account = readServiceAccount({
      FIREBASE_PROJECT_ID: "p",
      FIREBASE_CLIENT_EMAIL: "c",
      FIREBASE_PRIVATE_KEY: "a\\nb",
    });
    expect(account?.privateKey).toBe("a\nb");
  });

  it("retourne null sans configuration ou avec un JSON invalide", () => {
    expect(readServiceAccount({})).toBeNull();
    expect(readServiceAccount({ FIREBASE_SERVICE_ACCOUNT: "{pas du json" })).toBeNull();
  });
});

describe("describeServiceAccount", () => {
  const key = "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n";

  it("signale chaque problème de configuration", () => {
    expect(describeServiceAccount({})).toBe("absent");
    expect(describeServiceAccount({ FIREBASE_SERVICE_ACCOUNT: '{"project_id": "p"' })).toBe("json-invalide");
    expect(describeServiceAccount({ FIREBASE_SERVICE_ACCOUNT: '{"project_id": "p"}' })).toBe("champs-manquants");
    const bad = JSON.stringify({ project_id: "p", client_email: "c", private_key: "xyz" });
    expect(describeServiceAccount({ FIREBASE_SERVICE_ACCOUNT: bad })).toBe("cle-privee-mal-formee");
  });

  it("accepte un fichier JSON complet", () => {
    const json = JSON.stringify({ project_id: "p", client_email: "c", private_key: key });
    expect(describeServiceAccount({ FIREBASE_SERVICE_ACCOUNT: json })).toBe("ok");
  });
});
