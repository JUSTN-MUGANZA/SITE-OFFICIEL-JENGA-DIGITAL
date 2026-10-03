import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/mot-de-passe-oublie"];

/**
 * Premier filtre devant /admin : sans cookie de session, retour à la connexion.
 * La vérification complète (signature, révocation, rôle) est faite côté serveur
 * par requireAdmin() dans chaque page et action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  if (!request.cookies.has("__session")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
