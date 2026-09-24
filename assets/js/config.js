/*
 * RÉGLAGES DU SITE — Brasserie Jaja
 */
window.SITE_CONFIG = {
  // Réservation en ligne (Zenchef, identifiant déjà utilisé par la brasserie)
  zenchefId: "373777",

  // Avis Google : mis à jour automatiquement chaque jour dans assets/data/avis.json
  // (scripts/update-avis.mjs). Tant que ce fichier n'existe pas, le site affiche
  // la note et la sélection d'avis ci-dessous (relevées sur Google le 24/09/2026).
  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=Brasserie+Jaja+47+rue+d%27Amsterdam+75008+Paris",

  // Statistiques de visite sans cookie (Plausible, conforme CNIL, pas de bandeau nécessaire).
  // Créer le site sur plausible.io puis indiquer ici le domaine, ex. "brasseriejaja.fr".
  plausibleDomain: "",

  // Carte modifiable sans agence : publier un Google Sheets en CSV
  // (Fichier > Partager > Publier sur le Web > CSV) et coller le lien ici.
  // Colonnes : categorie, nom, description, description_en, prix, regimes, allergenes, photo
  // Laisser vide pour utiliser assets/js/carte.js.
  menuSheetUrl: "",

  rating: 4.4,
  reviewCount: 954,
  reviews: [
    { author: "Mélodie G.", rating: 5, when: { fr: "il y a 6 mois", en: "6 months ago" }, text: "Nous avons passé une bonne soirée. La carte est diversifiée et les produits sont frais. Les plats sont savoureux et les portions sont généreuses. Le personnel est agréable et efficace, le rapport qualité prix est tout à fait raisonnable. Nous recommandons cet établissement !" },
    { author: "Anne-Fleur S.", rating: 5, when: { fr: "récemment", en: "recently" }, text: "C'est notre quartier général ! Nous venons pour notre afterwork mensuel et plein d'autres fois en plus petit comité. Bonne ambiance, bonne musique, équipe au top, boissons parfaites — notamment les cocktails, bières et vins — planches et tapas nickel !" },
    { author: "Bruno", rating: 5, when: { fr: "récemment", en: "recently" }, text: "Excellente brasserie. Des plats simples mais très bien cuisinés. Un service irréprochable et chaleureux. Un cadre très agréable. Je recommande sans réserve." },
    { author: "Jean-Pierre B.", rating: 5, when: { fr: "il y a 4 mois", en: "4 months ago" }, text: "Excellente bière maison. La carte des boissons est variée et l'accueil est parfait, ainsi que le service rapide malgré l'affluence. La terrasse est très calme." },
    { author: "Ipek G.", rating: 5, when: { fr: "il y a 5 mois", en: "5 months ago" }, text: "Un bœuf bourguignon et une pièce du boucher, servis très vite. Tout le monde est super sympathique et l'ambiance est incroyable, avec une très bonne playlist. Je recommande fortement pour manger et boire un coup le soir." },
    { author: "PeggyM", rating: 5, when: { fr: "récemment", en: "recently" }, text: "Brasserie parisienne avec une carte gourmande. Houmous, frites de patates douces, poulet et croque à la truffe, le tout à partager à deux. On s'est régalés." },
    { author: "Ana C.", rating: 5, when: { fr: "récemment", en: "recently" }, text: "D'une grande gentillesse et d'un grand professionnalisme. J'adore aller dans cette brasserie qui ne m'a jamais déçue : les plats sont incroyables et le rapport qualité prix parfait. À bientôt !" }
  ]
};
