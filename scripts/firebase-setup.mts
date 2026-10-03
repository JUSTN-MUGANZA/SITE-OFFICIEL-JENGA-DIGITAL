/**
 * Configure le projet Firebase de bout en bout à partir du compte de service.
 *
 *   FIREBASE_SERVICE_ACCOUNT='{"project_id": …}' CONTACT_EMAIL=… npm run firebase:setup
 *
 * Étapes (chacune peut être relancée sans risque) :
 *  1. règles de sécurité Firestore + Storage, index Firestore (firebase-tools) ;
 *  2. connexion par email/mot de passe activée, domaines autorisés ;
 *  3. application Web Firebase créée si besoin, et ses variables NEXT_PUBLIC_* affichées ;
 *  4. données de départ : paramètres du site et page d'accueil (si absentes).
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { readServiceAccount } from "../src/lib/firebase/credentials.ts";
import { DEFAULT_SETTINGS } from "../src/lib/settings/schema.ts";

const account = readServiceAccount();
if (!account) {
  console.error("✗ Compte de service introuvable : définissez FIREBASE_SERVICE_ACCOUNT (JSON complet).");
  process.exit(1);
}
const { projectId } = account;
const credential = cert(account);
const app = initializeApp({ credential, projectId });
const db = getFirestore(app);

const results: { step: string; ok: boolean; detail?: string }[] = [];
const record = (step: string, ok: boolean, detail?: string) => {
  results.push({ step, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${step}${detail ? ` — ${detail}` : ""}`);
};

async function google(method: string, url: string, body?: unknown) {
  const { access_token } = await credential.getAccessToken();
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error((json.error as { message?: string } | undefined)?.message ?? `HTTP ${res.status}`);
  return json;
}

// 1. Règles et index
function deployRules() {
  const dir = mkdtempSync(join(tmpdir(), "firebase-sa-"));
  const keyFile = join(dir, "key.json");
  writeFileSync(
    keyFile,
    JSON.stringify({ type: "service_account", project_id: projectId, client_email: account!.clientEmail, private_key: account!.privateKey }),
    { mode: 0o600 },
  );
  const env = { ...process.env, GOOGLE_APPLICATION_CREDENTIALS: keyFile };
  const run = (only: string) =>
    execFileSync("npx", ["--yes", "firebase-tools@latest", "deploy", "--only", only, "--project", projectId, "--non-interactive"], {
      env,
      stdio: "inherit",
    });
  try {
    try {
      run("firestore");
      record("Règles et index Firestore déployés", true);
    } catch {
      record("Règles et index Firestore", false, "créez d'abord la base Firestore dans la console");
    }
    try {
      run("storage");
      record("Règles Storage déployées", true);
    } catch {
      record("Règles Storage", false, "activez d'abord Storage dans la console");
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// 2. Authentification
async function configureAuth() {
  const base = `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config`;
  try {
    const config = await google("GET", base);
    const domains = new Set<string>((config.authorizedDomains as string[] | undefined) ?? []);
    for (const url of [process.env.NEXT_PUBLIC_SITE_URL, ...(process.env.EXTRA_AUTH_DOMAINS ?? "").split(",")]) {
      if (!url?.trim()) continue;
      domains.add(url.includes("://") ? new URL(url).hostname : url.trim());
    }
    await google("PATCH", `${base}?updateMask=signIn.email.enabled,signIn.email.passwordRequired,authorizedDomains`, {
      signIn: { email: { enabled: true, passwordRequired: true } },
      authorizedDomains: [...domains],
    });
    record("Connexion email/mot de passe activée", true, `domaines autorisés : ${[...domains].join(", ")}`);

    const google_ = await google("GET", `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/defaultSupportedIdpConfigs/google.com`).catch(
      () => null,
    );
    record(
      "Connexion Google",
      Boolean(google_?.enabled),
      google_?.enabled ? "activée" : "à activer dans la console : Authentication > Sign-in method > Google",
    );
  } catch (error) {
    record("Authentification", false, `${(error as Error).message}. Ouvrez Authentication > « Commencer » dans la console, puis relancez.`);
  }
}

// 3. Application Web et variables publiques
async function webAppConfig() {
  const base = `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`;
  try {
    let apps = ((await google("GET", base)).apps as { appId: string }[] | undefined) ?? [];
    if (!apps.length) {
      await google("POST", base, { displayName: "Site JENGA Digital" });
      // La création est asynchrone : on attend qu'elle apparaisse.
      for (let i = 0; i < 10 && !apps.length; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        apps = ((await google("GET", base)).apps as { appId: string }[] | undefined) ?? [];
      }
    }
    if (!apps.length) throw new Error("application Web non créée");
    const cfg = await google("GET", `${base}/${apps[0].appId}/config`);
    record("Application Web Firebase prête", true);
    console.log("\nVariables à copier dans Vercel :");
    console.log(`NEXT_PUBLIC_FIREBASE_API_KEY=${cfg.apiKey}`);
    console.log(`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${cfg.authDomain}`);
    console.log(`NEXT_PUBLIC_FIREBASE_PROJECT_ID=${cfg.projectId}`);
    console.log(`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${cfg.storageBucket ?? ""}`);
    console.log(`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${cfg.messagingSenderId}`);
    console.log(`NEXT_PUBLIC_FIREBASE_APP_ID=${cfg.appId}\n`);
  } catch (error) {
    record("Application Web Firebase", false, (error as Error).message);
  }
}

// 4. Données de départ
async function seed() {
  try {
    const settingsRef = db.collection("settings").doc("site");
    if (!(await settingsRef.get()).exists) {
      const email = process.env.CONTACT_EMAIL ?? "";
      await settingsRef.set({ ...DEFAULT_SETTINGS, email, contactRecipientEmail: email, updatedAt: FieldValue.serverTimestamp(), updatedBy: "setup" });
      record("Paramètres du site créés", true, email ? `messages du formulaire envoyés à ${email}` : "adresse de réception à renseigner");
    } else {
      record("Paramètres du site déjà présents", true);
    }

    const homeRef = db.collection("pages").doc("home");
    if (!(await homeRef.get()).exists) {
      await homeRef.set({
        hero: {
          title: { fr: "Votre agence digitale", en: "" },
          subtitle: { fr: "Sites web, applications et stratégie digitale pour faire grandir votre activité.", en: "" },
          ctaLabel: { fr: "Parlons de votre projet", en: "" },
          ctaHref: "/contact",
          image: "",
        },
        stats: [],
        sections: ["services", "projects", "about", "testimonials", "cta"].map((key) => ({ key, visible: true })),
        about: { fr: "", en: "" },
        seo: { title: "", description: "", ogImage: "" },
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: "setup",
      });
      record("Page d'accueil créée", true);
    } else {
      record("Page d'accueil déjà présente", true);
    }
  } catch (error) {
    record("Données de départ", false, (error as Error).message);
  }
}

console.log(`Configuration du projet Firebase « ${projectId} »\n`);
if (!process.argv.includes("--skip-deploy")) deployRules();
await configureAuth();
await webAppConfig();
await seed();

const failed = results.filter((r) => !r.ok);
console.log(failed.length ? `\n${failed.length} étape(s) à reprendre, voir ci-dessus.` : "\nTout est configuré.");
process.exit(failed.length ? 1 : 0);
