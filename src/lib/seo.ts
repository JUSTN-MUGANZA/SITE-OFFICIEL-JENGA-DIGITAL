import type { Metadata } from "next";

/** Nom affiché dans les aperçus de partage et les données structurées. */
export const SITE_NAME = "JENGA Digital";

/** Image de partage du site (src/app/opengraph-image.jpg). */
const DEFAULT_SHARE_IMAGE = { url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "JENGA Digital, agence digitale" };

/**
 * Métadonnées complètes d'une page publique : titre, description, adresse canonique,
 * aperçus Open Graph (Facebook, WhatsApp, LinkedIn) et Twitter / X.
 * Sans image, l'image de partage par défaut du site (opengraph-image) est utilisée.
 */

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  /** Titre utilisé tel quel, sans « | JENGA Digital » (page d'accueil). */
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  // Sans image propre à la page, on reprend l'image de partage du site (définir openGraph remplace celle du parent).
  const images = [image ? { url: image } : DEFAULT_SHARE_IMAGE];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "fr_FR",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: path,
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
