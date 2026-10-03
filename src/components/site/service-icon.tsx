import { Code, Globe, Megaphone, Palette, Search, ShieldCheck, ShoppingCart, Smartphone, Sparkles, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  smartphone: Smartphone,
  "shopping-cart": ShoppingCart,
  search: Search,
  megaphone: Megaphone,
  palette: Palette,
  code: Code,
  shield: ShieldCheck,
};

/** Icône d'un service, choisie par son nom dans le tableau de bord. */
export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
