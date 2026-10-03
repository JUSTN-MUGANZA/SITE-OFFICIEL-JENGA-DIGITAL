import { NextResponse, type NextRequest } from "next/server";
import { purgeExpiredTrash } from "@/lib/content/repository";
import { CONTENT_COLLECTIONS } from "@/lib/content/schemas";
import { isAdminConfigured } from "@/lib/firebase/admin";

/** Tâche quotidienne (Vercel Cron) : vide la corbeille de plus de 30 jours. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isAdminConfigured()) return NextResponse.json({ error: "Firebase non configuré." }, { status: 503 });

  const purged: Record<string, number> = {};
  for (const collection of CONTENT_COLLECTIONS) purged[collection] = await purgeExpiredTrash(collection);
  return NextResponse.json({ ok: true, purged });
}
