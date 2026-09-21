# KINŪ — Ce qu'on retient de la vidéo « This UI/UX Redesign Will Teach You More Than 100 Tutorials Combined »

**Date : 21 septembre 2026**
Source : https://www.youtube.com/watch?v=GGg61sdEjeI — chaîne **uxpeak**, 13 min 32, publiée le 27 août 2026.
Document d'analyse uniquement : aucun fichier du thème n'a été modifié. Il complète `DIRECTION-ARTISTIQUE.md`, qui reste la référence. En cas de conflit, c'est elle qui l'emporte, sauf décision contraire du client.

---

## 0. Méthode réellement employée

- Métadonnées, description et sous-titres automatiques anglais récupérés avec `yt-dlp` (transcription complète, horodatée).
- Vidéo téléchargée en 720p. **Une image extraite toutes les 5 secondes (162 images)**, montées en 14 planches-contacts d'une minute, relues une par une. Plus quatre images en pleine résolution de la version finale (11:30 à 13:10).
- La vidéo n'a pas de chapitres. Les horodatages ci-dessous viennent de la transcription et sont précis à ±5 s.

---

## 1. Ce que montre la vidéo

Un tutoriel de redesign pas à pas. Le point de départ est la fiche produit mobile d'une appli d'épicerie bio (« Organic Strawberries – 1 kg »), volontairement ratée. Le présentateur relève **15 erreurs**, les corrige une par une, puis ajoute **3 améliorations d'expérience**.

| # | Horodatage | Erreur ou amélioration | Correction montrée |
|---|---|---|---|
| 1 | 00:33 | Icônes de navigation posées sur la photo | Pastille de fond discrète et fin contour derrière chaque icône, pour qu'elle reste lisible quelle que soit la photo (démonstration avec un ananas sur fond blanc) |
| 2 | 02:00 | Photo produit | 6 options comparées. La gagnante : produit entier, fond neutre clair, même lumière partout. Raison : elle doit tenir **dans la grille du catalogue**, pas seulement seule |
| 3 | 03:27 | Alignement | Une marge unique (24 px) que tout respecte |
| 4 | 04:13 | Couleurs trop saturées | Palette adoucie et naturelle, un seul accent vert |
| 5 | 04:45 | Trop de styles de police | Une seule famille (Lato). La hiérarchie passe par la taille, la graisse, la couleur et l'interlignage |
| 6 | 05:17 | Étiquettes | Petites capitales plus espacées. Badge « 20% OFF DISCOUNT + icône » réduit à « 20% off » |
| 7 | 05:45 | Titre | « Doit ressortir sans crier » : taille et graisse rééquilibrées. « 1 kg » retiré du titre |
| 8 | 06:17 | Paragraphe | Interlignage augmenté, contraste légèrement réduit : « les titres attirent, les paragraphes font comprendre » |
| 9 | 06:45 | Avis | Les étoiles remontent **juste sous le titre** : quoi, noté comment, fiable ou non |
| 10 | 08:17 | Pictos d'arguments | Un seul style (trait fin, même graisse), une seule couleur, espacement resserré |
| 11 | 08:50 | Filets de séparation | Adoucis : ils séparent sans découper la page |
| 12 | 09:17 | Espacements | Resserrés là où le blanc déconnectait des blocs liés |
| 13 | 09:40 | Libellé « Price : » | Supprimé : un chiffre avec une devise se lit tout seul. Soit on étiquette tout, soit rien |
| 14 | 10:15 | Position du prix | Remonté sous la note : quoi → noté comment → combien |
| 15 | 10:50 | Bouton d'ajout | Moins criard (fin des capitales). **Quantité collée au bouton.** Unité dans le sélecteur. **Prix total dans le bouton** : « Add to cart · $6.20 » |
| A1 | 11:40 | Carte de contenu qui glisse | Le contenu remonte en carte arrondie par-dessus la photo. Le titre passe dans la barre du haut au défilement |
| A2 | 12:08 | Barre d'achat collante | Quantité et bouton restent visibles pendant la lecture. « Souvent acheté avec » apparaît plus bas |
| A3 | 12:37 | Quantités prédéfinies | 0,5 / 1 / 2 / 3 kg en tuiles (« Snack, Regular, Family, Party »), avec le prix de chacune |

**Rendu final observé (12:50 à 13:10)** : fond blanc pur, texte presque noir, CTA vert olive (≈ `#5E8A2E`), badge promo rouge (≈ `#C8102E`), étoiles jaunes (≈ `#F5A623`), Lato partout, coins arrondis de 8 à 12 px, ombres douces, pictos au trait vert. L'habillage violet et dégradé de la vidéo est **la mise en scène de la chaîne**, pas le design proposé.

---

## 2. Ce que j'en comprends comme référence

**La vidéo n'est pas une référence esthétique pour KINŪ. C'est une référence de méthode pour la fiche produit.**

Sa thèse tient en une phrase, dite à 11:35 : *une belle fiche ne suffit pas, il faut une fiche qui rend l'achat évident*. Trois idées reviennent tout au long de la vidéo :

1. **Penser système, pas écran** (00:33, 02:00, 13:00). Une fiche doit tenir avec toutes les photos, tous les produits, dans la grille du catalogue. C'est déjà l'esprit de la DA KINŪ.
2. **Une information à l'endroit où l'on en a besoin** (06:45, 10:15, 11:05). La note près du titre, le prix près du produit, la quantité près du bouton, le total dans le bouton.
3. **Retirer ce qui répète** (05:20, 09:40, 10:15). Libellés redondants, badges bavards, informations dans le mauvais champ.

**Ce qui est incompatible avec KINŪ et qu'on ne reprend pas** : les coins arrondis et les ombres (DA §5.4 : rayon 0, zéro ombre), la carte qui glisse sur la photo (DA §8 : aucun parallaxe, aucun effet piloté par le défilement), le blanc pur (DA §3.6), le rouge promo (DA §7.3), les étoiles jaunes (hors palette), Lato (deux familles déjà fixées), le bouton en casse normale (les capitales des boutons font partie de la grammaire KINŪ, DA §4.2). Aucun risque de proximité avec une marque : la vidéo est un tutoriel sur une maquette fictive.

---

## 3. La DA actuelle de KINŪ, en bref

- **Concept** : du vêtement technique suisse mis en scène comme une galerie. Fond ivoire `#F7F5F0`, encre `#1B1A16`, un seul accent, le vert forêt `#1E4D3B`, posé en aplats bord à bord (panneau de navigation, univers Amplitude, pied de page `#163A2C`). Sauge `#E6EAE3` pour les fonds de packshot.
- **Typographie** : DM Sans (titres, interface, boutons en capitales espacées) et Montserrat (texte courant), réglées dans `config/settings_data.json`. Noms et prix de produit à l'échelle d'étiquette (11 px sur ordinateur, capitales, espacement positif) : c'est « l'image qui parle seule » (amendement du 23 août).
- **Layout** : angles vifs partout, filets de 1 px à 14 % d'encre, échelle d'espacement de 8 px, grille produits de 2 à 5 colonnes, fiche produit en deux colonnes (galerie 7/12 collante, lecture 5/12), galerie plein cadre sur mobile.
- **Motion** : quatre durées (160, 240, 320 et 560 ms), le header qui bascule en vert au défilement, un fondu croisé sur les cartes. Pas de zoom, pas de parallaxe.
- **Fiche produit aujourd'hui** (`sections/kn-main-product.liquid`) : fil d'Ariane, filet de territoire, sur-titre `FEMME — FLUID-MOTION`, titre et prix, mention TVA, options (couleur, taille, guide des tailles), bloc QUANTITÉ étiqueté, **puis** bouton pleine largeur « AJOUTER AU PANIER » (sans prix), puis « Disponibilité : En stock » et « Référence : XXX », retrait en magasin, accordéons (Description, Matière & entretien, Livraison & retours), fiche technique, « Vous aimerez aussi ». Un bandeau d'achat collant (mobile uniquement) affiche nom, prix et bouton.

**Déjà conforme aux leçons de la vidéo, rien à faire :**
- Erreur 1 (icônes sur la photo) : le header transparent sur la vidéo d'accueil a déjà un voile en dégradé (`assets/kn-home.css`, `.kn-hero__scrim`). Sur la fiche, le header reste ivoire et ne chevauche pas la photo.
- Erreurs 3, 11 et 12 : marges, échelle de 8 px et filets doux sont déjà cadrés par la DA (§5.3, `--kn-line`).
- Erreur 4 : un seul accent, pas de saturation.
- Erreur 8 : texte courant à 16 px et 1,65 d'interlignage.
- Amélioration A2 : le bandeau collant mobile existe déjà (`snippets/kn-product-sticky-bar.liquid`).

---

## 4. Améliorations priorisées

Chaque point respecte la DA existante, sauf mention contraire marquée **À VALIDER**.

### P1 — Le prix total dans le bouton d'ajout

- **Quoi** : « AJOUTER AU PANIER — CHF 140.– ». Le montant suit la variante **et** la quantité (2 × 140 → CHF 280.–). Même chose dans le bouton du bandeau collant, qui n'a alors plus besoin d'afficher le prix à part.
- **Pourquoi** : le client sait ce qu'il va payer avant de cliquer, ce qui lève un doute au moment décisif. C'est le geste le plus fort de la vidéo pour l'effort le plus faible. Côté DA, le prix garde ses chiffres tabulaires et le bouton garde ses capitales. Le séparateur est un tiret cadratin, pas un point médian, pour rester dans la ponctuation KINŪ (`FEMME — FLUID-MOTION`).
- **Où** : `snippets/kn-product-buy.liquid` (ajouter un `<span data-kn-btn-total>` dans le bouton), `snippets/kn-product-sticky-bar.liquid`, `assets/kn-product.js` (la fonction qui met à jour `[data-kn-btn-label]` et `[data-kn-price]`, vers les lignes 360 et 508 : ajouter le calcul prix × quantité, au format de la boutique). Masquer le total quand le bouton affiche « Épuisé » ou « Indisponible ».
- **Effort** : faible.
- **Vidéo** : 11:15.

### P2 — La quantité sur la même ligne que le bouton

- **Quoi** : sélecteur de quantité compact (3 × 44 px, filets 1 px, angles vifs) à gauche, bouton d'ajout qui prend le reste de la ligne à droite. L'étiquette QUANTITÉ reste au-dessus du sélecteur seul. Sous 360 px de large, on revient à l'empilement.
- **Pourquoi** : on choisit combien, puis on ajoute. Deux gestes liés doivent se toucher. Aujourd'hui le bloc QUANTITÉ puis le bouton pleine largeur ajoutent une rangée entière et repoussent le bouton sous la ligne de flottaison mobile. La DA (§7.7) interdit « un bloc sans nom posé à côté du bouton » : ici il garde son nom, donc la règle est tenue.
- **Où** : `assets/kn-product.css` (`.kn-buy__actions` passe en grille `auto 1fr`, alignée sur le bas), `snippets/kn-product-buy.liquid` (structure déjà prête, rien à déplacer). Même disposition dans le bandeau collant : [– 1 +] [AJOUTER — CHF 140.–], le nom du produit y étant déjà lisible sur la page.
- **Effort** : faible.
- **Vidéo** : 11:05, 12:08.

### P3 — Retirer les libellés qui répètent, sous le bouton

- **Quoi** :
  - « Disponibilité : En stock » devient « En stock », précédé du point d'état. Le mot « Disponibilité » n'apprend rien.
  - La **Référence (SKU)** sort de la zone d'achat. Elle passe en dernière ligne de la fiche technique, ou elle est désactivée (réglage `show_sku` déjà présent dans l'éditeur).
  - La mention « TVA incluse… » descend sous le bouton, en `--kn-fs-sm` gris, au lieu de s'intercaler entre le prix et les options.
- **Pourquoi** : c'est l'erreur 13 de la vidéo. Entre le prix et le bouton, chaque ligne qui n'aide pas à acheter éloigne l'un de l'autre. La référence sert au service client, pas à l'acheteur.
- **Où** : `snippets/kn-product-buy.liquid` (bloc `kn-buy__meta`), `sections/kn-main-product.liquid` (position de `kn-pdp__tax`), `snippets/kn-product-spec.liquid` pour y accueillir la référence.
- **Effort** : faible.
- **Vidéo** : 09:40.

### P4 — Une ligne de réassurance à pictos, sous le bouton

- **Quoi** : une seule rangée de 3 arguments, pictos au trait de 1,5 px en encre, 20 px, libellé à l'échelle `--kn-fs-sm` : **Livraison offerte dès CHF 65** · **Retours sous 30 jours** · **Conçu en Suisse** (à adapter aux vraies conditions). Ni cadre ni fond : trois colonnes égales entre deux filets de 1 px. Textes réglables dans l'éditeur, pictos pris dans `snippets/kn-icon.liquid`.
- **Pourquoi** : la vidéo montre qu'un bloc d'arguments rassure s'il reste **homogène** (même trait, une couleur, 08:17). Aujourd'hui l'info livraison n'existe que dans un accordéon fermé, alors qu'elle pèse sur la décision. Le seuil de 65 CHF figure déjà dans `templates/product.json`.
- **Où** : nouveau petit snippet `snippets/kn-product-assurance.liquid`, appelé dans `sections/kn-main-product.liquid` juste après `kn-product-buy`. Réglages dans le schéma de la section. Style dans `assets/kn-product.css`.
- **Effort** : faible.
- **Vidéo** : 08:17 (style des pictos), 11:20 (lever l'incertitude).

### P5 — Charte photo catalogue, écrite et appliquée

- **Quoi** : une page de règles pour le shooting et la retouche, à remettre au client :
  1. Première image de chaque produit : **packshot porté ou à plat sur fond sauge `#E6EAE3` uni**, lumière diffuse venue de la gauche, pas d'ombre dure.
  2. Cadrage 3:4, le vêtement occupe 78 à 82 % de la hauteur, centré, même point de vue pour une même catégorie (toutes les brassières de face, tous les joggers en pied).
  3. Deuxième image (celle du fondu au survol) : porté en situation, décor réel neutre (DA §6).
  4. Détail matière en 1:1, placé avant le premier coloris dans la galerie (le groupement par coloris le laisse visible en toutes couleurs).
- **Pourquoi** : c'est le passage le plus fort de la vidéo (02:00 à 03:20). L'image gagnante n'était pas la plus belle, c'était celle qui **tient dans la grille**. KINŪ affiche jusqu'à 5 colonnes au-delà de 1280 px : si les fonds, lumières et cadrages varient, la grille paraît en désordre, quel que soit le soin du code. C'est le levier de qualité perçue le plus puissant, et il ne coûte aucune ligne de code.
- **Où** : aucun fichier du thème. Production photo, puis ordre des médias dans l'admin Shopify.
- **Effort** : fort côté production, nul côté thème.
- **Vidéo** : 02:00 à 03:20.

### P6 — Le titre produit un cran plus présent (À VALIDER)

- **Quoi** : sur ordinateur, passer le titre de 11 px à **13 px** (`--kn-fs-btn`), toujours DM Sans 500 en capitales espacées. Le prix reste à 11 px. Sur mobile, rien ne change (14 px).
- **Pourquoi** : le titre dit ce qu'on achète. Il doit « ressortir sans crier » (05:45). Aujourd'hui, sur ordinateur, le titre, le prix, le sur-titre et les étiquettes COULEUR / TAILLE ont tous la même taille. Seule la graisse les sépare, et le nom se perd au milieu des libellés d'interface. Deux pixels suffisent à rétablir l'ordre de lecture sans casser la retenue voulue le 23 août.
- **Tension** : l'amendement du 23 août a demandé explicitement « une seule taille de caractère ». Cette recommandation l'infléchit : **elle demande l'accord du client.**
- **Où** : `assets/kn-product.css`, règle `@media (min-width: 768px) { .kn-pdp__title, .kn-pdp__price … }` (vers la ligne 363) : sortir `.kn-pdp__title` du sélecteur.
- **Effort** : faible.
- **Vidéo** : 05:45.

### P7 — « Complétez la tenue » dans la colonne d'achat

- **Quoi** : sous les accordéons, un petit rang de 2 produits **complémentaires** (brassière → legging de la même collection), vignettes 3:4 de 96 px, nom et prix à l'échelle d'étiquette, lien vers la fiche. Pas d'ajout direct au panier dans un premier temps. « Vous aimerez aussi » reste en bas de page, pour les produits similaires.
- **Pourquoi** : la vidéo place le « souvent acheté avec » là où l'acheteur hésite encore (12:00). Pour de la tenue de sport, l'achat par ensemble est naturel, et il fait monter le panier moyen. Les deux blocs ne se font pas doublon : l'un propose des produits **similaires** (« related »), l'autre des produits **complémentaires** (« complementary »).
- **Où** : nouveau snippet dans `sections/kn-main-product.liquid` (colonne `kn-pdp__spec`), alimenté par l'API de recommandations Shopify avec `intent=complementary`. Les produits complémentaires se règlent produit par produit dans l'application gratuite **Shopify Search & Discovery**. Le bloc disparaît de lui-même tant qu'aucun produit n'est renseigné.
- **Effort** : moyen.
- **Vidéo** : 12:05 à 12:20.

### P8 — Avis clients près du titre, quand il y en aura

- **Quoi** : une ligne sous le titre : 5 étoiles au trait de 12 px, **en encre** (pleines et vides, jamais jaunes), note en tabulaire, puis « (24 avis) » en gris, qui descend vers la section avis. Affichée seulement à partir de 3 avis, pour qu'une fiche neuve ne montre jamais « 0 avis ». Même ligne, en plus petit, sur la carte produit si le client le souhaite.
- **Pourquoi** : c'est la preuve sociale la plus forte de l'e-commerce, et la vidéo la place au seul bon endroit, contre le titre (06:45). KINŪ n'a aucun système d'avis aujourd'hui.
- **Où** : prérequis, installer une application d'avis qui écrit les métachamps standards `reviews.rating` et `reviews.rating_count` (Judge.me ou Shopify Product Reviews). Ensuite, snippet `snippets/kn-product-rating.liquid` appelé après `kn-pdp__title` dans `sections/kn-main-product.liquid`. Données structurées à ajouter à `snippets/kn-product-json-ld.liquid`.
- **Effort** : moyen (application + intégration).
- **Vidéo** : 06:45.

### P9 — Badges courts et chiffrés

- **Quoi** : le badge soldes affiche la remise calculée (« −20 % ») et rien d'autre. Les badges éditoriaux (métachamp `kn.badge`) sont limités à 2 mots : « Nouveau », « Édition limitée ». Toujours aplat forêt, texte ivoire, pilule (DA §7.3). Jamais de rouge.
- **Pourquoi** : un badge se lit d'un coup d'œil ou pas du tout (05:20). Un chiffre dit plus qu'un mot.
- **Où** : `snippets/kn-product-card.liquid` (vers la ligne 58, calcul `compare_at_price` / `price` quand aucun badge n'est forcé). Consigne éditoriale pour le métachamp.
- **Effort** : faible.
- **Vidéo** : 05:20.

### P10 — Le choix de taille rendu plus rassurant (transposition de A3)

- **Quoi** : les quantités prédéfinies de la vidéo ne s'appliquent pas à du vêtement. L'équivalent KINŪ, c'est la **taille**, qui est la vraie décision d'achat. Deux ajouts discrets dans la légende de l'option Taille :
  1. Une ligne de coupe sous les carrés, tirée d'un métachamp : « Coupe ajustée — prenez votre taille habituelle ».
  2. Quand une seule taille reste en stock pour la couleur choisie, « Dernière pièce » en gris (information, pas pression : pas de compteur, pas de rouge, conforme au §9).
- **Pourquoi** : la leçon de 12:37, c'est de supprimer les manipulations inutiles en anticipant le choix le plus courant. Pour KINŪ, l'hésitation porte sur la taille, pas sur le nombre.
- **Où** : `snippets/kn-product-options.liquid` (légende de l'option dont le nom contient « taille »), métachamp produit `custom.coupe` à créer, `assets/kn-product.js` pour la mention de stock.
- **Effort** : moyen.
- **Vidéo** : 12:37.

---

## 5. Ce qu'on ne reprend pas, et pourquoi

| Élément de la vidéo | Horodatage | Pourquoi on le refuse pour KINŪ |
|---|---|---|
| Carte de contenu arrondie qui glisse sur la photo | 11:40 | Coins arrondis + ombre + effet lié au défilement : trois interdits de la DA (§5.4, §8). Sur KINŪ, la galerie plein cadre puis les infos sur ivoire font déjà ce travail, sans effet |
| Titre qui passe dans la barre du haut au défilement | 11:55 | Le bandeau collant mobile porte déjà le nom. Deux rappels du même nom sur un seul écran feraient doublon, et le header KINŪ ne change jamais de contenu (§7.1) |
| Bouton en casse normale « pour moins crier » | 10:55 | Les capitales espacées à 13 px ne crient pas chez KINŪ : c'est la taille modeste qui les calme. Elles font partie de la grammaire de marque |
| Pastilles de fond derrière les icônes | 00:55 | Inutile, le header de fiche est ivoire. Sur l'accueil, le voile en dégradé règle déjà le problème sans ajouter d'objet |
| Palette finale (blanc pur, vert olive, rouge promo, étoiles jaunes) | 13:00 | Hors palette KINŪ (§3.2, §3.6) |
| Lato en police unique | 05:05 | La DA fixe DM Sans + Montserrat. La réserve sur Montserrat (§4.1, passer à Archivo) reste la seule question typographique ouverte |
| Barre d'achat collante sur ordinateur | 12:08 | Interdite par la DA (§9). La galerie collante sur ordinateur garde déjà le bouton à portée |

---

## 6. Ordre d'exécution conseillé

1. **Lot rapide, une demi-journée** : P1, P2, P3, P9. Aucun contenu à produire, gain de conversion direct.
2. **Lot réassurance** : P4, puis P6 une fois validé par le client.
3. **Lot contenu** : P5 (brief photo au client), P7 (relier les produits complémentaires dans Search & Discovery).
4. **Lot application** : P8, puis P10.

---

## En une phrase

> **On prend la méthode de la vidéo (chaque information là où l'acheteur en a besoin, et le prix dans le bouton), pas son habillage : KINŪ reste ivoire, vert forêt, angles vifs et sans ombre.**
