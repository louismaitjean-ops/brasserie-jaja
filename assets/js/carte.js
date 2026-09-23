/*
 * CARTE DE LA BRASSERIE JAJA
 * ---------------------------------------------------------------
 * Ce fichier est la seule source de la carte affichée sur le site.
 * Pour modifier un plat : changer le nom, la description ou le prix
 * puis enregistrer. Rien d'autre à toucher.
 *
 * diet    : "veg" (végétarien), "vegan", "gf" (sans gluten), "lf" (sans lactose)
 * allergens : gluten, crustaces, oeufs, poisson, arachide, soja, lait,
 *             fruits-a-coque, celeri, moutarde, sesame, sulfites, lupin, mollusques
 * img     : photo du plat (dossier assets/img), facultatif
 * video   : lien d'une vidéo (mp4 ou YouTube), facultatif
 *
 * Mise à jour sans toucher au code : voir SITE_CONFIG.menuSheetUrl
 * dans assets/js/config.js (Google Sheets publié en CSV).
 */
window.CARTE = [
  {
    id: "entrees",
    title: { fr: "Entrées", en: "Starters" },
    items: [
      { name: "Œufs mimosa", desc: { fr: "Herbes fraîches", en: "Devilled eggs, fresh herbs" }, price: 7.5, diet: ["veg", "gf", "lf"], allergens: ["oeufs", "moutarde"] },
      { name: "Velouté potimarron", desc: { fr: "De saison", en: "Red kuri squash velouté" }, price: 10, diet: ["veg", "gf"], allergens: ["lait", "celeri"] },
      { name: "Terrine de campagne", desc: { fr: "Cornichons, pain grillé", en: "Country-style pâté, pickles, toast" }, price: 9.5, diet: ["lf"], allergens: ["gluten", "oeufs", "sulfites"] },
      { name: "Soupe à l'oignon", desc: { fr: "Baguette gratinée au comté", en: "French onion soup, comté-gratinated baguette" }, price: 12, diet: [], allergens: ["gluten", "lait", "celeri"], img: "soupe-oignon.jpg" },
      { name: "Nems aux légumes", desc: { fr: "Sucrine, menthe", en: "Vegetable spring rolls, lettuce, mint" }, price: 11, diet: ["veg", "vegan", "lf"], allergens: ["gluten", "soja"] }
    ]
  },
  {
    id: "salades",
    title: { fr: "Salades & toasts", en: "Salads & toasts" },
    items: [
      { name: "Beau boon", desc: { fr: "Nems aux légumes, vermicelles, sucrine, concombre, chou rouge, oignons frits, cacahuètes, citronnelle, menthe, coriandre", en: "Vegetable spring rolls, vermicelli, lettuce, cucumber, red cabbage, fried onions, peanuts, lemongrass, mint, coriander" }, price: 17, diet: ["veg", "vegan", "lf"], allergens: ["gluten", "arachide", "soja"], img: "beau-boon.jpg" },
      { name: "Salade chèvre chaud", desc: { fr: "Salade mixte, tomates cerises, poitrine fumée, brick chèvre miel, noix", en: "Mixed leaves, cherry tomatoes, smoked bacon, goat's cheese & honey brick, walnuts" }, price: 18, diet: [], allergens: ["gluten", "lait", "fruits-a-coque"] },
      { name: "Salade césar", desc: { fr: "Salade romaine, parmesan, croûtons, poulet croustillant, œuf mollet, sauce césar", en: "Romaine, parmesan, croutons, crispy chicken, soft-boiled egg, Caesar dressing" }, price: 19, diet: [], allergens: ["gluten", "lait", "oeufs", "poisson", "moutarde"] },
      { name: "Avocado toast", desc: { fr: "Purée d'avocat, œufs mollets, feta, salade verte, grenade", en: "Smashed avocado, soft-boiled eggs, feta, green salad, pomegranate" }, price: 19, diet: ["veg"], allergens: ["gluten", "oeufs", "lait"], img: "dejeuner-terrasse.jpg" }
    ]
  },
  {
    id: "partager",
    title: { fr: "À partager", en: "To share" },
    items: [
      { name: "Caviar d'aubergines", desc: { fr: "Maison A Peasena", en: "Aubergine dip, A Peasena" }, price: 10, diet: ["veg", "vegan", "gf", "lf"], allergens: ["sesame"] },
      { name: "Rillettes de thon à l'aneth", desc: { fr: "Pain grillé", en: "Tuna & dill rillettes, toast" }, price: 9.5, diet: [], allergens: ["poisson", "lait", "gluten"] },
      { name: "Houmous", desc: { fr: "Pois chiches, tahini", en: "Chickpeas, tahini" }, price: 11, diet: ["veg", "vegan", "gf", "lf"], allergens: ["sesame"] },
      { name: "Guacamole", desc: { fr: "Avocat, citron vert, coriandre", en: "Avocado, lime, coriander" }, price: 13, diet: ["veg", "vegan", "gf", "lf"], allergens: [] },
      { name: "Poulet crispy", desc: { fr: "Sauce maison", en: "Crispy chicken, house sauce" }, price: 13, diet: ["lf"], allergens: ["gluten", "oeufs"] },
      { name: "Stracciatella", desc: { fr: "Huile d'olive, pain grillé", en: "Olive oil, toasted bread" }, price: 16, diet: ["veg"], allergens: ["lait", "gluten"] },
      { name: "Croque truffé", desc: { fr: "Jambon, comté 12 mois", en: "Truffle croque, ham, 12-month comté" }, price: 14, diet: [], allergens: ["gluten", "lait"] },
      { name: "Frites", desc: { fr: "Maison", en: "Homemade fries" }, price: 6, diet: ["veg", "vegan", "gf", "lf"], allergens: [] },
      { name: "Planche de charcuterie", desc: { fr: "Maison Conquet", en: "Cured meats from Maison Conquet" }, price: 22, diet: ["lf"], allergens: ["gluten", "sulfites"] },
      { name: "Planche de fromages", desc: { fr: "Sélection du moment", en: "Cheese board" }, price: 22, diet: ["veg"], allergens: ["lait", "gluten"] },
      { name: "Planche végétarienne", desc: { fr: "Caviar d'aubergines, houmous, guacamole", en: "Aubergine dip, hummus, guacamole" }, price: 22, diet: ["veg", "vegan", "lf"], allergens: ["sesame", "gluten"] },
      { name: "Planche mixte", desc: { fr: "Charcuterie & fromages", en: "Cured meats & cheese" }, price: 24, diet: [], allergens: ["lait", "gluten", "sulfites"], img: "planche-cafe.jpg" }
    ]
  },
  {
    id: "plats",
    title: { fr: "Plats", en: "Mains" },
    items: [
      { name: "Pièce du boucher", desc: { fr: "Voir l'ardoise du jour", en: "Butcher's cut — see today's board" }, price: null, priceLabel: { fr: "Ardoise", en: "See board" }, diet: ["gf", "lf"], allergens: [], img: "piece-du-boucher.jpg" },
      { name: "Bœuf bourguignon", desc: { fr: "Écrasé de pommes de terre", en: "Beef bourguignon, crushed potatoes" }, price: 23, diet: [], allergens: ["lait", "sulfites", "celeri", "gluten"], img: "boeuf-bourguignon.jpg" },
      { name: "Tartare de bœuf au couteau", desc: { fr: "Préparé, frites", en: "Hand-cut beef tartare, fries" }, price: 22, diet: ["gf", "lf"], allergens: ["oeufs", "moutarde"] },
      { name: "Bacon cheeseburger", desc: { fr: "Bacon, cheddar, chutney d'oignons, tomate, salade, pickles, frites", en: "Bacon, cheddar, onion chutney, tomato, lettuce, pickles, fries" }, price: 19.5, diet: [], allergens: ["gluten", "lait", "moutarde", "sesame"], img: "bacon-cheeseburger.jpg" },
      { name: "Coquillettes truffées", desc: { fr: "Jambon, comté 12 mois", en: "Truffle pasta, ham, 12-month comté" }, price: 19, diet: [], allergens: ["gluten", "lait", "oeufs"] },
      { name: "Rigatoni à la tomate", desc: { fr: "Parmesan, basilic", en: "Tomato rigatoni, parmesan, basil" }, price: 17.5, diet: ["veg"], allergens: ["gluten", "lait"] },
      { name: "Milanaise de veau", desc: { fr: "Rigatoni tomates, parmesan, basilic", en: "Veal Milanese, tomato rigatoni, parmesan, basil" }, price: 24, diet: [], allergens: ["gluten", "oeufs", "lait"] },
      { name: "Croque truffé", desc: { fr: "Jambon, comté 12 mois, frites, salade", en: "Truffle croque, ham, 12-month comté, fries, salad" }, price: 19, diet: [], allergens: ["gluten", "lait"] },
      { name: "Fish & chips", desc: { fr: "Dans sa feuille de brick, sauce tartare, frites", en: "In brick pastry, tartare sauce, fries" }, price: 19.5, diet: [], allergens: ["gluten", "poisson", "oeufs", "moutarde"] },
      { name: "Filet mignon de porc", desc: { fr: "Écrasé de pommes de terre, crème d'ail", en: "Pork tenderloin, crushed potatoes, garlic cream" }, price: 20, diet: ["gf"], allergens: ["lait"] }
    ]
  },
  {
    id: "desserts",
    title: { fr: "Desserts", en: "Desserts" },
    items: [
      { name: "Crème brûlée", desc: { fr: "Vanille", en: "Vanilla" }, price: 10, diet: ["veg", "gf"], allergens: ["oeufs", "lait"] },
      { name: "Mousse au chocolat", desc: { fr: "Crumble cacao", en: "Chocolate mousse, cocoa crumble" }, price: 10, diet: ["veg"], allergens: ["oeufs", "lait", "gluten"] },
      { name: "Moelleux chocolat", desc: { fr: "Crème anglaise pistache", en: "Chocolate fondant, pistachio custard" }, price: 10, diet: ["veg"], allergens: ["gluten", "oeufs", "lait", "fruits-a-coque"] },
      { name: "Brioche perdue", desc: { fr: "Glace vanille, sirop d'érable", en: "French toast brioche, vanilla ice cream, maple syrup" }, price: 13, diet: ["veg"], allergens: ["gluten", "oeufs", "lait"] },
      { name: "Pannacotta", desc: { fr: "Fruits rouges", en: "Red berries" }, price: 10, diet: ["veg", "gf"], allergens: ["lait"] },
      { name: "Salade de fruits", desc: { fr: "Fruits frais de saison", en: "Fresh seasonal fruit" }, price: 9, diet: ["veg", "vegan", "gf", "lf"], allergens: [] },
      { name: "Café gourmand", desc: { fr: "Café et mignardises", en: "Coffee with mini desserts" }, price: 11, diet: ["veg"], allergens: ["gluten", "oeufs", "lait"] },
      { name: "Assiette de fromages", desc: { fr: "Sélection du moment", en: "Cheese plate" }, price: 14, diet: ["veg"], allergens: ["lait", "gluten"] },
      { name: "Glaces", desc: { fr: "Vanille, chocolat, fraise, framboise, cassis, pistache, citron, café, mangue, passion", en: "Vanilla, chocolate, strawberry, raspberry, blackcurrant, pistachio, lemon, coffee, mango, passion fruit" }, price: null, priceLabel: { fr: "4 · 7 · 9", en: "4 · 7 · 9" }, diet: ["veg", "gf"], allergens: ["lait"] }
    ]
  },
  {
    id: "petit-dej",
    title: { fr: "Petit déjeuner", en: "Breakfast" },
    note: { fr: "Servi dès l'ouverture. Supp. cappuccino ou chocolat chaud 2 €, crème 1,50 €, lait végétal 1 €.", en: "Served from opening time. Cappuccino or hot chocolate +€2, cream +€1.50, plant milk +€1." },
    items: [
      { name: "Formule rapide", desc: { fr: "Boisson chaude, viennoiserie, jus pressé ou nectar", en: "Hot drink, pastry, fresh juice or nectar" }, price: 10, diet: ["veg"], allergens: ["gluten", "oeufs", "lait"] },
      { name: "Formule moins rapide", desc: { fr: "Boisson chaude, œufs brouillés, fromage blanc muesli fruits rouges ou avocado toast, jus pressé ou nectar", en: "Hot drink, scrambled eggs, fromage blanc with muesli & berries or avocado toast, fresh juice or nectar" }, price: 16, diet: ["veg"], allergens: ["gluten", "oeufs", "lait"], img: "oeufs-brouilles.jpg" },
      { name: "Viennoiserie", desc: { fr: "Croissant ou pain au chocolat", en: "Croissant or pain au chocolat" }, price: 3, diet: ["veg"], allergens: ["gluten", "oeufs", "lait"] },
      { name: "Œufs brouillés nature", desc: { fr: "Supp. bacon 4 €", en: "Plain scrambled eggs — add bacon €4" }, price: 10, diet: ["veg", "gf"], allergens: ["oeufs", "lait"] },
      { name: "Fromage blanc", desc: { fr: "Muesli, fruits rouges", en: "Fromage blanc, muesli, red berries" }, price: 9, diet: ["veg"], allergens: ["lait", "gluten", "fruits-a-coque"] },
      { name: "Avocado toast", desc: { fr: "Version petit déjeuner", en: "Breakfast size" }, price: 10, diet: ["veg"], allergens: ["gluten", "oeufs", "lait"] }
    ]
  }
];

/* Carte des vins : [nom, précision, verre, 50 cl, bouteille] */
window.VINS = [
  {
    title: { fr: "Blancs", en: "White" },
    items: [
      ["Chardonnay", "IGP Pays d'Oc · à la verse", 5.5, 19, 25],
      ["Sauvignon", "IGP Pays d'Oc · à la verse", 6, 20, 27],
      ["Tariquet Classic", "IGP Côtes de Gascogne", 6, 20, 27],
      ["Viognier", "Château Pesquié", 6.5, 22, 29],
      ["Tariquet Premières Grives", "IGP Côtes de Gascogne", 7, 24, 34],
      ["Bourgogne Aligoté", "Domaine Vincent Wengier", 8, 26, 39],
      ["Mâcon Villages", "Cuvée Alphonse", 8.5, 29, 41],
      ["Petit Chablis", "Domaine Vincent Wengier", 9, 32, 44],
      ["Château Fontainebleau", "Côtes de Provence", null, null, 38],
      ["Sancerre « Grande Réserve »", "Famille Bourgeois", null, null, 49],
      ["Chablis", "La Vigne aux Songes 2019", null, null, 52],
      ["Auxey-Duresses", "Domaine Vaudoysey-Creusefond 2018", null, null, 69],
      ["Givry 1er Cru", "Petit Marole 2018", null, null, 89]
    ]
  },
  {
    title: { fr: "Rouges", en: "Red" },
    items: [
      ["Merlot", "IGP d'Oc · à la verse", 5.5, 19, 25],
      ["Petit Fontainebleau", "Domaine Fontainebleau en Provence · à la verse", 6, 20, 27],
      ["Pinot Noir", "Cœur de Pinot", 6.5, 22, 29],
      ["Syrah Viognier", "IGP Pays d'Oc", 7, 24, 34],
      ["Côtes du Rhône", "Paul Jaboulet · Parallèle 45 bio", 7.5, 26, 36],
      ["Le B de Maucaillou", "Bordeaux Supérieur", 7.5, 26, 36],
      ["Chinon", "Le Logis de la Bouchardière", 8, 28, 39],
      ["Côte de Brouilly", "Domaine des Fournelles", 8.5, 29, 41],
      ["Bourgogne Pinot Noir", "Vignes Saint Germain", null, null, 44],
      ["Alliance", "Château de Bois-Brinçon", null, null, 46],
      ["Crozes-Hermitage", "Maison Paul Jaboulet", null, null, 48],
      ["Hautes-Côtes de Nuits", "Les Fournaches", null, null, 49],
      ["Haut-Médoc", "Château La Lagune 2020", null, null, 52],
      ["Moulis-en-Médoc", "Maucaillou 2018", null, null, 69],
      ["Châteauneuf-du-Pape", "Les Cèdres bio 2019", null, null, 76],
      ["Pommard", "Domaine Vaudoysey-Creusefond 2019", null, null, 88]
    ]
  },
  {
    title: { fr: "Rosés", en: "Rosé" },
    items: [
      ["Peyrassol", "IGP Méditerranée · à la verse", 6.5, 22, 27],
      ["Château Fontainebleau", "Côtes de Provence", 7.5, 26, 34],
      ["Château Sainte Marguerite", "Fantastique, cru classé", null, null, 62]
    ]
  },
  {
    title: { fr: "Bulles", en: "Sparkling" },
    items: [
      ["San Martino", "Prosecco DOC", 7, null, 32],
      ["Haton & Fils Réserve", "Champagne", 14, null, 69],
      ["Haton & Fils Blanc de Blancs", "Champagne", null, null, 89]
    ]
  }
];
