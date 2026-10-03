# Site officiel JENGA Digital

Site vitrine de l'agence JENGA Digital, avec un dashboard d'administration pour gérer tout le contenu sans toucher au code.

**Stack** : Next.js 16 (App Router, TypeScript, Tailwind CSS) · Firebase (Auth, Firestore, Storage) · Resend (emails) · hébergement Vercel.

Le cahier des charges complet et la feuille de route en 5 phases sont dans le document de projet partagé.

## État actuel : phase 1 (socle et accès admin)

- Connexion admin par email + mot de passe ou Google, mot de passe oublié, déconnexion
- Session sécurisée par cookie httpOnly (5 jours), vérifiée côté serveur à chaque page
- Accès sur invitation uniquement, 4 rôles : Super admin, Éditeur, Commercial, Lecteur
- Tableau de bord (compteurs, activité récente, liste de mise en route)
- Paramètres du site : nom, slogan, logo, favicon, coordonnées, email de réception du formulaire, réseaux sociaux, horaires, liens et texte du pied de page, mode maintenance
- Gestion des utilisateurs : invitation par email, changement de rôle, désactivation
- Journal d'audit des actions admin
- Règles de sécurité Firestore et Storage, en-têtes de sécurité, admin exclu de l'indexation
- `robots.txt` qui autorise Google, Bing et les robots des IA (ChatGPT, Claude, Perplexity, Gemini…)

## Backend (en place, interface du dashboard à venir)

- Modèle de données des contenus (projets, services, équipe, histoire, témoignages, FAQ, page d'accueil) avec validation Zod, statuts brouillon/publié/archivé, publication programmée, ordre d'affichage, corbeille de 30 jours, champs SEO et textes prêts pour l'anglais : `src/lib/content`
- Actions serveur du dashboard (créer, modifier, publier, corbeille, restaurer, supprimer, réordonner), toutes réservées au rôle Éditeur ou Super admin et journalisées : `src/app/admin/(protected)/contenus/actions.ts`
- API du formulaire de contact `POST /api/contact` : champ piège, délai minimal, limite de 5 envois par IP toutes les 10 minutes, Cloudflare Turnstile si configuré ; enregistrement du contact et de son historique, notification par email à l'adresse des Paramètres (le bouton « Répondre » écrit au visiteur), accusé de réception au visiteur une fois le domaine vérifié dans Resend
- Tâche quotidienne qui vide la corbeille de plus de 30 jours (`vercel.json`)

## Configuration automatique de Firebase

Une fois le projet Firebase créé (avec Firestore, Storage et Authentication démarrés dans la console) et la clé du compte de service disponible :

```bash
FIREBASE_SERVICE_ACCOUNT='{…json…}' CONTACT_EMAIL=adresse@exemple.com NEXT_PUBLIC_SITE_URL=https://… npm run firebase:setup
```

Le script déploie les règles de sécurité et les index, active la connexion email/mot de passe, ajoute le domaine du site aux domaines autorisés, crée l'application Web et affiche ses variables `NEXT_PUBLIC_FIREBASE_*`, puis crée les paramètres du site et la page d'accueil de départ. Il peut être relancé sans risque. Seule la connexion Google reste à activer à la main (Authentication > Sign-in method > Google).

## Mise en route manuelle

### 1. Firebase

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** > Sign-in method : activez **Adresse e-mail/Mot de passe** et **Google**.
3. **Firestore Database** : créez la base (mode production).
4. **Storage** : activez-le.
5. Paramètres du projet > **Vos applications** > ajoutez une application Web : copiez la configuration dans les variables `NEXT_PUBLIC_FIREBASE_*`.
6. Paramètres du projet > **Comptes de service** > *Générer une nouvelle clé privée* : collez le JSON complet dans `FIREBASE_SERVICE_ACCOUNT` (ou reportez `project_id`, `client_email` et `private_key` dans `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`). Cette clé est secrète : ne la partagez jamais.
7. Authentication > Settings > **Domaines autorisés** : ajoutez le domaine du site (et le domaine Vercel).
8. Déployez les règles de sécurité : `npx firebase-tools deploy --only firestore:rules,storage`.

### 2. Resend

1. Créez un compte sur [resend.com](https://resend.com), de préférence avec l'adresse qui doit recevoir les messages.
2. Créez une clé API et placez-la dans `RESEND_API_KEY`.
3. Tant que votre domaine n'est pas vérifié dans Resend, gardez `EMAIL_FROM` sur `onboarding@resend.dev` : Resend n'enverra alors qu'à l'adresse du compte.

### 3. Variables d'environnement

Copiez `.env.example` en `.env.local` et remplissez-le. Sur Vercel, ajoutez les mêmes variables dans *Settings > Environment Variables*.

`BOOTSTRAP_SUPER_ADMIN_EMAIL` est l'adresse qui devient super admin à sa première connexion (avec Google ou une adresse vérifiée). Les autres personnes sont ensuite invitées depuis le dashboard, page **Utilisateurs**.

### 4. Développement

```bash
npm install
npm run dev          # http://localhost:3000, admin sur /admin
npm run lint
npm run typecheck
npm test
npm run build
```

## Organisation du code

```
src/
  app/
    admin/login, admin/mot-de-passe-oublie   pages publiques de connexion
    admin/(protected)/                       pages protégées (tableau de bord, paramètres, utilisateurs)
    api/auth/session                         création et suppression du cookie de session
    api/contact                              réception du formulaire de contact
    robots.ts, not-found.tsx, page.tsx
  components/ui, components/admin
  lib/auth          rôles, session, premier super admin
  lib/firebase      clients navigateur et serveur
  lib/settings      schéma, lecture et formulaire des paramètres
  lib/email         envoi Resend et modèles
  lib/content       modèle de données et accès Firestore des contenus
  lib/contact       formulaire de contact : validation, anti-spam, enregistrement
  proxy.ts          redirige /admin vers la connexion sans cookie
firestore.rules, storage.rules, firestore.indexes.json
scripts/firebase-setup.mts   configuration automatique de Firebase
```

Toutes les écritures passent par le serveur (Firebase Admin SDK) après vérification du rôle : les règles Firestore interdisent toute écriture directe depuis le navigateur.
