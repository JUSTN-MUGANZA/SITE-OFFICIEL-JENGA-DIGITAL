/** Messages d'erreur Firebase Auth en français, sans révéler si un compte existe. */
export function authErrorMessage(code: string | undefined): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Email ou mot de passe incorrect.";
    case "auth/too-many-requests":
      return "Trop de tentatives. Pour votre sécurité, l'accès est bloqué quelques minutes.";
    case "auth/user-disabled":
      return "Ce compte a été désactivé. Contactez un super admin.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Connexion Google annulée.";
    case "auth/popup-blocked":
      return "La fenêtre Google a été bloquée par le navigateur. Autorisez les pop-ups et réessayez.";
    case "auth/network-request-failed":
      return "Problème de connexion internet. Réessayez.";
    default:
      return "La connexion a échoué. Réessayez.";
  }
}
