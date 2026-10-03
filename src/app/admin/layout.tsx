import type { Metadata } from "next";

// L'administration ne doit jamais apparaître dans les moteurs de recherche.
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
