import { faqSchema, serviceSchema, type ContentItem, type ContentMeta } from "./schemas";

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
    slug: "creation-de-sites-web",
    icon: "globe",
    title: "Création de sites web",
    shortDescription: "Sites vitrines et sites d'entreprise rapides, modernes et pensés pour convertir vos visiteurs en clients.",
    deliverables: ["Site sur mesure et responsive", "Optimisation de la vitesse", "Référencement de base inclus", "Formation à la prise en main"],
  },
  {
    slug: "applications-web-et-mobiles",
    icon: "smartphone",
    title: "Applications web et mobiles",
    shortDescription: "Des applications métier et mobiles qui simplifient le travail de vos équipes et de vos clients.",
    deliverables: ["Analyse des besoins", "Conception de l'interface", "Développement et tests", "Mise en ligne et suivi"],
  },
  {
    slug: "e-commerce",
    icon: "shopping-cart",
    title: "E-commerce",
    shortDescription: "Boutiques en ligne sécurisées, avec paiement, gestion des commandes et suivi des ventes.",
    deliverables: ["Catalogue produits", "Paiement en ligne", "Gestion des commandes", "Statistiques de ventes"],
  },
  {
    slug: "referencement-seo",
    icon: "search",
    title: "Référencement (SEO)",
    shortDescription: "Être trouvé sur Google et par les assistants IA, grâce à un site bien structuré et un contenu utile.",
    deliverables: ["Audit de référencement", "Optimisation technique", "Stratégie de contenu", "Suivi des positions"],
  },
  {
    slug: "marketing-digital",
    icon: "megaphone",
    title: "Marketing digital",
    shortDescription: "Réseaux sociaux, campagnes publicitaires et emailing pour faire connaître votre marque.",
    deliverables: ["Stratégie de communication", "Gestion des réseaux sociaux", "Campagnes publicitaires", "Rapports de performance"],
  },
  {
    slug: "identite-visuelle",
    icon: "palette",
    title: "Identité visuelle et design",
    shortDescription: "Logo, charte graphique et supports visuels pour une image professionnelle et cohérente.",
    deliverables: ["Logo et déclinaisons", "Charte graphique", "Supports imprimés et digitaux", "Maquettes d'interface"],
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
    q: "Combien coûte un site web ?",
    a: "Chaque projet est différent : le prix dépend du nombre de pages, des fonctionnalités et du contenu à produire. Décrivez-nous votre besoin et nous vous envoyons un devis gratuit et détaillé.",
  },
  {
    q: "Combien de temps faut-il pour créer un site ?",
    a: "Comptez généralement de deux à six semaines pour un site vitrine, davantage pour une boutique en ligne ou une application. Nous fixons un planning clair dès le départ.",
  },
  {
    q: "Pourrai-je modifier mon site moi-même ?",
    a: "Oui. Nous livrons un espace d'administration simple pour modifier vos textes, images et pages, et nous vous formons à son utilisation.",
  },
  {
    q: "Mon site sera-t-il visible sur Google ?",
    a: "Nos sites sont construits pour le référencement : pages rapides, structure claire, données lisibles par Google et par les assistants IA. Nous pouvons aussi vous accompagner sur la durée.",
  },
  {
    q: "Proposez-vous la maintenance et l'hébergement ?",
    a: "Oui, nous assurons l'hébergement, les mises à jour, les sauvegardes et le support technique pour que votre site reste rapide et sécurisé.",
  },
];

export const DEFAULT_FAQS: ContentItem<"faqs">[] = FAQS.map((f, i) => ({
  ...faqSchema.parse({ status: "published", question: { fr: f.q }, answer: { fr: f.a } }),
  ...meta(`default-faq-${i}`, i),
}));
