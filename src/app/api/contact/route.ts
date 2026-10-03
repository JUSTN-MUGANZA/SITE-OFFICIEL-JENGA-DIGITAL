import { NextResponse, type NextRequest } from "next/server";
import { consumeRateLimit, hashIp, verifyTurnstile } from "@/lib/contact/protection";
import { contactSchema, looksLikeBot } from "@/lib/contact/schema";
import { submitContact } from "@/lib/contact/submit";
import { isAdminConfigured } from "@/lib/firebase/admin";
import { fieldErrorsOf } from "@/lib/forms/result";

const OK = { ok: true, message: "Merci ! Votre message a bien été envoyé. Nous vous répondons rapidement." };

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** Réception du formulaire « Nous contacter ». */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ ok: false, message: "Origine refusée." }, { status: 403 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: false, message: "Le formulaire n'est pas encore disponible." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Certains champs sont à corriger.", fieldErrors: fieldErrorsOf(parsed.error) },
      { status: 400 },
    );
  }

  // Un robot reçoit une réponse « succès » sans que rien ne soit enregistré.
  if (looksLikeBot(parsed.data)) return NextResponse.json(OK);

  const ip = clientIp(request);
  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, message: "Vérification anti-robot échouée. Rechargez la page et réessayez." }, { status: 400 });
  }

  const ipHash = hashIp(ip);
  if (!(await consumeRateLimit(ipHash))) {
    return NextResponse.json(
      { ok: false, message: "Vous avez envoyé plusieurs messages en peu de temps. Réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  try {
    await submitContact(parsed.data, ipHash);
  } catch (error) {
    console.error("Échec de l'enregistrement du contact", error);
    return NextResponse.json({ ok: false, message: "L'envoi a échoué. Réessayez ou écrivez-nous directement par email." }, { status: 500 });
  }
  return NextResponse.json(OK);
}
