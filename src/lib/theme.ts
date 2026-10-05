/** Clé du choix « clair » ou « sombre » du visiteur, enregistré par le bouton de l'en-tête. */
export const THEME_KEY = "jenga-theme";

/** Applique le choix enregistré avant le premier affichage, pour éviter un flash de la mauvaise couleur. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
