/** Clé du choix « clair » ou « sombre » du visiteur, enregistré par le bouton de l'en-tête. */
export const THEME_KEY = "jenga-theme";

/**
 * Applique le thème avant le premier affichage, pour éviter un flash de la mauvaise couleur :
 * le choix enregistré par le visiteur, sinon le mode sombre (souhait de JUSTIN, 5 octobre 2026).
 * Le tableau de bord reste en clair.
 */
export const THEME_SCRIPT = `try{var d=document.documentElement,t=null;try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}if(t==="light"||t==="dark")d.dataset.theme=t;else if(location.pathname.indexOf("/admin")!==0)d.dataset.theme="dark"}catch(e){}`;
