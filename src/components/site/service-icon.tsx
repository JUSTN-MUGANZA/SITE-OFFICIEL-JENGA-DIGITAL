import {
  Code,
  Globe,
  GraduationCap,
  Megaphone,
  Monitor,
  Palette,
  PenTool,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  code: Code,
  monitor: Monitor,
  globe: Globe,
  smartphone: Smartphone,
  "pen-tool": PenTool,
  palette: Palette,
  megaphone: Megaphone,
  settings: Settings,
  wrench: Wrench,
  "graduation-cap": GraduationCap,
  users: Users,
  "shopping-cart": ShoppingCart,
  search: Search,
  shield: ShieldCheck,
  sparkles: Sparkles,
};

/** Icône d'un service, choisie par son nom dans le tableau de bord. */
export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = SERVICE_ICONS[name] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
