import { faqSchema, historyStepSchema, serviceSchema, type ContentItem, type ContentMeta } from "./schemas";

/**
 * Contenus affichés tant que rien n'est publié depuis le tableau de bord,
 * pour que le site ne soit jamais vide. Ils disparaissent dès qu'un élément
 * de la même catégorie est publié.
 */
const meta = (id: string, order: number): ContentMeta => ({
  id,
  order,
  publishedAt: null,
  deletedAt: null,
  createdAt: null,
  updatedAt: null,
  updatedBy: null,
});

const SERVICES = [
  {
    slug: "developpement-web",
    icon: "code",
    title: "Développement Web",
    shortDescription: "Sites vitrines, plateformes web et applications sur mesure, modernes et performants.",
    deliverables: ["Site sur mesure et responsive", "Optimisation de la vitesse", "Référencement de base inclus", "Formation à la prise en main"],
  },
  {
    slug: "applications-mobiles",
    icon: "smartphone",
    title: "Applications Mobiles",
    shortDescription: "Des applications sur mesure pour iOS et Android, simples à utiliser et fiables.",
    deliverables: ["Analyse des besoins", "Conception de l'interface", "Développement et tests", "Publication sur les stores"],
  },
  {
    slug: "design-graphique",
    icon: "pen-tool",
    title: "Design Graphique",
    shortDescription: "Logos, identité visuelle et supports de communication qui marquent les esprits.",
    deliverables: ["Logo et déclinaisons", "Charte graphique", "Supports imprimés et digitaux", "Maquettes d'interface (UI/UX)"],
  },
  {
    slug: "communication-digitale",
    icon: "megaphone",
    title: "Communication Digitale",
    shortDescription: "Stratégie et gestion de vos réseaux sociaux pour gagner en visibilité.",
    deliverables: ["Stratégie de communication", "Gestion des réseaux sociaux", "Création de contenus", "Rapports de performance"],
  },
  {
    slug: "maintenance-informatique",
    icon: "settings",
    title: "Maintenance Informatique",
    shortDescription: "Mises à jour, sécurité et assistance technique pour vos sites et vos systèmes.",
    deliverables: ["Mises à jour régulières", "Sauvegardes", "Surveillance et sécurité", "Assistance technique"],
  },
  {
    slug: "formation-et-accompagnement",
    icon: "graduation-cap",
    title: "Formation & Accompagnement",
    shortDescription: "Montée en compétences de vos équipes et conseils pour réussir votre transformation digitale.",
    deliverables: ["Formations pratiques", "Ateliers en équipe", "Conseil stratégique", "Suivi personnalisé"],
  },
];

export const DEFAULT_SERVICES: ContentItem<"services">[] = SERVICES.map((s, i) => ({
  ...serviceSchema.parse({
    status: "published",
    slug: s.slug,
    icon: s.icon,
    title: { fr: s.title },
    shortDescription: { fr: s.shortDescription },
    deliverables: s.deliverables,
  }),
  ...meta(`default-${s.slug}`, i),
}));

const FAQS = [
  {
    q: "Quels sont vos délais de réalisation ?",
    a: "Cela dépend du projet : quelques semaines pour un site vitrine, davantage pour une application ou une boutique en ligne. Nous fixons ensemble un planning clair dès le départ.",
  },
  {
    q: "Combien coûtent vos services ?",
    a: "Chaque projet est différent : le prix dépend des fonctionnalités et du contenu. Décrivez-nous votre besoin et nous vous envoyons un devis gratuit et détaillé.",
  },
  {
    q: "Travaillez-vous avec des clients à distance ?",
    a: "Oui. Nous accompagnons des clients partout, par visioconférence, téléphone, WhatsApp et email, à chaque étape du projet.",
  },
  {
    q: "Proposez-vous un accompagnement après la livraison ?",
    a: "Oui : formation à la prise en main, maintenance, mises à jour et assistance technique pour que votre outil reste fiable.",
  },
  {
    q: "Quels sont les moyens de paiement ?",
    a: "Nous vous indiquons les moyens de paiement disponibles avec le devis, ainsi qu'un échéancier adapté à votre projet.",
  },
  {
    q: "Comment se déroule une collaboration ?",
    a: "Un premier échange pour comprendre vos objectifs, une proposition claire, puis la conception et le développement avec des validations régulières, jusqu'à la mise en ligne.",
  },
];

export const DEFAULT_FAQS: ContentItem<"faqs">[] = FAQS.map((f, i) => ({
  ...faqSchema.parse({ status: "published", question: { fr: f.q }, answer: { fr: f.a } }),
  ...meta(`default-faq-${i}`, i),
}));

const HISTORY = [
  { year: 2020, title: "Création de JENGA Digital", text: "Tout a commencé avec une vision : offrir des solutions digitales innovantes et accessibles à tous." },
  { year: 2021, title: "Premiers projets", text: "Nous avons réalisé nos premiers projets et commencé à construire notre réputation." },
  { year: 2022, title: "Développement de nouveaux services", text: "Nous avons élargi notre offre au design, à la communication et aux applications mobiles." },
  { year: 2023, title: "Agrandissement de l'équipe", text: "Nous avons renforcé notre équipe avec des talents passionnés." },
  { year: 2024, title: "Nouveaux partenariats", text: "De nouveaux partenaires nous ont fait confiance pour accompagner leur croissance digitale." },
  { year: 2025, title: "Aujourd'hui", text: "JENGA Digital continue d'innover et d'accompagner ses clients vers un avenir digital meilleur." },
];

export const DEFAULT_HISTORY: ContentItem<"history">[] = HISTORY.map((h, i) => ({
  ...historyStepSchema.parse({ status: "published", year: h.year, title: { fr: h.title }, description: { fr: h.text } }),
  ...meta(`default-history-${h.year}`, i),
}));
