import { faqSchema, projectSchema, serviceSchema, teamMemberSchema, type ContentItem, type ContentMeta } from "./schemas";

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

/** Photos libres de droits (licence Unsplash), en attendant des photos de l'agence. */
const SERVICES = [
  {
    slug: "developpement-web",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80",
    icon: "code",
    title: "Développement Web",
    shortDescription: "Sites vitrines, plateformes web et applications sur mesure, modernes et performants.",
    deliverables: ["Site sur mesure et responsive", "Optimisation de la vitesse", "Référencement de base inclus", "Formation à la prise en main"],
  },
  {
    slug: "applications-mobiles",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1600&q=80",
    icon: "smartphone",
    title: "Applications Mobiles",
    shortDescription: "Des applications sur mesure pour iOS et Android, simples à utiliser et fiables.",
    deliverables: ["Analyse des besoins", "Conception de l'interface", "Développement et tests", "Publication sur les stores"],
  },
  {
    slug: "design-graphique",
    image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1600&q=80",
    icon: "pen-tool",
    title: "Design Graphique",
    shortDescription: "Logos, identité visuelle et supports de communication qui marquent les esprits.",
    deliverables: ["Logo et déclinaisons", "Charte graphique", "Supports imprimés et digitaux", "Maquettes d'interface (UI/UX)"],
  },
  {
    slug: "communication-digitale",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1600&q=80",
    icon: "megaphone",
    title: "Communication Digitale",
    shortDescription: "Stratégie et gestion de vos réseaux sociaux pour gagner en visibilité.",
    deliverables: ["Stratégie de communication", "Gestion des réseaux sociaux", "Création de contenus", "Rapports de performance"],
  },
  {
    slug: "maintenance-informatique",
    image: "https://images.unsplash.com/photo-1604754742629-3e5728249d73?auto=format&fit=crop&w=1600&q=80",
    icon: "settings",
    title: "Maintenance Informatique",
    shortDescription: "Mises à jour, sécurité et assistance technique pour vos sites et vos systèmes.",
    deliverables: ["Mises à jour régulières", "Sauvegardes", "Surveillance et sécurité", "Assistance technique"],
  },
  {
    slug: "formation-et-accompagnement",
    image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=1600&q=80",
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
    image: s.image,
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

/** Membres de l'équipe envoyés par JUSTIN, en attendant leur gestion depuis le tableau de bord. */
export const DEFAULT_TEAM: ContentItem<"team">[] = [
  {
    ...teamMemberSchema.parse({
      status: "published",
      name: "Justin Muganza",
      role: { fr: "Ingénieur logiciel" },
      bio: {
        fr: "Conçoit, développe et met en ligne des applications web fiables, rapides et faciles à faire évoluer. De l'architecture à la mise en production, il transforme les besoins des clients en solutions concrètes, avec une attention particulière à la qualité du code, à la sécurité et à l'expérience utilisateur.",
      },
      skills: ["Angular", "Next.js", "React", "Firebase", "Supabase", "Git & GitHub"],
      photo: "/team/justin-muganza.jpg",
      location: "Bukavu",
      socials: {
        github: "https://github.com/JUSTN-MUGANZA",
        linkedin: "https://www.linkedin.com/in/justin-muganza-35a0182b0/",
        x: "https://x.com/JustinMuganzaL",
        website: "https://lubunga-portfolio.netlify.app/",
      },
    }),
    ...meta("default-team-justin-muganza", 0),
  },
  {
    ...teamMemberSchema.parse({
      status: "published",
      name: "Calliste Mukamba Songa",
      role: { fr: "Développeur mobile" },
      bio: {
        fr: "Développe des applications mobiles Android pensées pour le terrain : simples à prendre en main, rapides et fiables, de la maquette jusqu'à la publication.",
      },
      skills: ["Android", "Kotlin", "Applications mobiles"],
      photo: "/team/calliste-mukamba-songa.jpg",
      location: "Bukavu",
      socials: {
        linkedin: "https://www.linkedin.com/in/calliste-mukamba-songa-265182301",
        x: "https://x.com/CallisteM92422",
      },
    }),
    ...meta("default-team-calliste-mukamba-songa", 1),
  },
];

const MAYUNDO = "/realisations/mayundo-party-caisse";

/** Réalisations envoyées par JUSTIN, affichées tant qu'aucun projet n'est publié depuis le tableau de bord. */
export const DEFAULT_PROJECTS: ContentItem<"projects">[] = [
  {
    ...projectSchema.parse({
      status: "published",
      slug: "mayundo-party-caisse",
      title: { fr: "MAYUNDO Party : application de gestion de caisse" },
      client: "Étudiants de BAC 3 Informatique de gestion, ISP",
      sector: "Événementiel",
      year: 2026,
      summary: {
        fr: "Une application web pour encaisser les paiements, enregistrer les sorties et suivre en temps réel la caisse de la fête Mayundo Party.",
      },
      body: {
        fr: [
          "Les étudiants de BAC 3 Informatique de gestion de l'ISP organisaient la fête Mayundo Party et devaient suivre de nombreux petits paiements : frais de fête, t-shirts, défense, frais de comité. Tenue à la main, la caisse devenait difficile à vérifier.",
          "Nous avons réalisé une application web accessible depuis un simple téléphone, qui s'installe comme une application. Le caissier enregistre chaque paiement en quelques secondes et toute l'équipe dispose d'un historique clair et vérifiable.",
          [
            "- Espace caissier sécurisé, avec connexion",
            "- Plusieurs frais encaissés en une seule fois (fête, t-shirt, défense…)",
            "- Paiements en dollars (USD) et en francs congolais (FC)",
            "- Enregistrement des sorties de caisse",
            "- Historique regroupé par personne, avec recherche et filtres",
            "- Suivi précis des membres du comité",
            "- E-mail de confirmation après chaque paiement",
            "- Vue d'ensemble de la caisse",
          ].join("\n"),
        ].join("\n\n"),
      },
      coverImage: `${MAYUNDO}/couverture.jpg`,
      coverAlt: "Écrans de l'application MAYUNDO Party Caisse sur téléphone : historique des paiements et enregistrement d'un paiement",
      gallery: [
        { url: `${MAYUNDO}/ecran-historique.jpg`, alt: "Écran d'accueil de l'espace caissier avec l'historique récent des paiements" },
        { url: `${MAYUNDO}/ecran-paiement.jpg`, alt: "Formulaire d'enregistrement d'un paiement avec type de frais, devise et montant" },
      ],
      serviceIds: ["default-developpement-web"],
      technologies: ["Application web (PWA)", "Firebase"],
      liveUrl: "https://suivi-de-caisse.web.app/",
      featured: true,
      seo: {
        title: "MAYUNDO Party : application web de gestion de caisse",
        description: "Étude de cas : application web de caisse pour la fête Mayundo Party (ISP Bukavu) : paiements en USD et FC, sorties, historique et e-mails de confirmation.",
      },
    }),
    ...meta("default-project-mayundo-party-caisse", 0),
  },
];

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

/**
 * Photos de l'accueil (licence Unsplash), utilisées tant qu'aucune photo n'est choisie dans le tableau de bord.
 * Volontairement sans personnes : du code, un bureau, un poste de travail.
 */
export const DEFAULT_HERO_IMAGES = [
  unsplash("photo-1607706009771-de8808640bcf"),
  unsplash("photo-1519086588705-c935fdedcc14"),
  unsplash("photo-1609921212029-bb5a28e60960"),
];
