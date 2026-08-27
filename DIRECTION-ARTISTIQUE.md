# KINŪ — Direction Artistique

**Version 1.0 — 10 août 2026**
Cible : thème Shopify **Horizon** (OS 2.0), personnalisé via `assets/custom.css` (chargé en dernier dans `layout/theme.liquid`, ligne 46).
Toutes les classes créées sont préfixées `kn-`. **Mobile-first sans exception.**

---

## 1. Synthèse du brief client

Le PDF `note-instructrice-webdesigner.pdf` (3 pages) est la source de vérité. Ce qu'il demande, en clair :

| Sujet | Demande du client | Statut dans cette DA |
|---|---|---|
| Ton général | Site épuré, premium, l'image produit prime sur la navigation | Retenu tel quel |
| Header | **Aucun libellé de menu visible.** 3 icônes seulement : compte, recherche, panier. Navigation par burger ou survol | Retenu jusqu'au 27 août, puis **amendé** : libellés rétablis sur ordinateur (§7.1) |
| Fond | Off-white / blanc cassé, **pas de blanc pur clinique** — ex. `#F7F5F0` | Retenu, `#F7F5F0` confirmé |
| Accent | Vert forêt au survol des menus — ex. `#1E4D3B` | Retenu, `#1E4D3B` confirmé, et **massivement étendu** (voir §3) |
| Typo titres/menus | DM Sans | Retenu |
| Typo corps | Montserrat | Retenu, **avec une réserve à valider** (voir §4) |
| Hover menu | Option A : soulignement (skims). Option B : les autres items grisent, le survolé reste net (arte-antwerp) | **Tranché : B + vert**, voir §3.6 |
| Accueil | Bannière vidéo "KINŪ" plein largeur, autoplay, boucle, muet. Puis les 3 univers + nouveautés | Retenu |
| Arborescence | Navigation par **besoin** (Femme / Homme / Unisexe / Toutes les collections), les noms de collection en second niveau | Retenu, et transformé en **système de couleur** (voir §3.4) |
| Univers | Fluid-Motion → Femme · CrossOver → Homme · Amplitude → Unisexe | Retenu |
| Multilingue | FR / EN, sélecteur discret (header ou footer) | Retenu → footer |
| Pages | CGV, FAQ, Confidentialité, À propos, Blog, Footer social + newsletter | Retenu |

**Ce que le brief ne dit pas et que cette DA tranche :** la mécanique d'application de la couleur, l'échelle typographique, la grille, le traitement des images, le motion, et les jetons CSS.

---

## 2. Positionnement & ambiance

> **KINŪ, c'est du vêtement technique suisse mis en scène comme une galerie : un fond ivoire, une image produit qui respire, et un vert forêt qui n'est pas un détail mais un territoire — il inonde des pages entières.**

Cinq adjectifs : **calme, tranchant, matériel, discipliné, physique.**
Ni streetwear criard, ni luxe froid. La chaleur vient de l'ivoire, la rigueur vient de la grille, la personnalité vient de l'aplat vert.

---

## 3. Système de couleur — le cœur du sujet

### 3.1 Ce que fait vraiment Mover (analyse technique)

Analyse du thème Shopify de mover.eu (`/cdn/shop/t/19/assets/style.css` et `custom.css`) :

```css
:root { --yellow: #fff000; }
body#page-newsletter main,
body#product-stopplastic main,
body[data-collection=stop-plastic] main { background-color: var(--stopplastic, #fff000) !important; }
.main__nav.scrolled            { background-color: var(--yellow, #fff000) !important; }
.main__nav.scrolled .nav-link  { color: #000000a6 !important; }
.regular_dropdown              { background: #fff000; border-top: 1px solid rgba(0,0,0,.15); transition: .3s ease; }
.navbar-toggler                { background-color: var(--yellow, #fff000); }
.badge                         { background-color: var(--yellow, #fff000); }
.form-message, .input-error-message { background-color: #fff000; }
.hero__link a:before           { background-color: var(--yellow, #fff000); }
.card-heading strong           { color: var(--yellow, #fff000); }
```

Palette réelle de Mover : `#fff000` (jaune), `#1d1d1b` (encre), `#ffffff`, `#9f9f9f` (gris), `#797979` (gris hover), `#404040` (bordure focus). **Six valeurs. Une seule couleur.**

**La leçon — et c'est LE point à reproduire :**

1. **La couleur est une surface, jamais une décoration.** Aucun liseré, aucun dégradé, aucune ombre colorée. Le jaune arrive en **aplats pleine largeur** qui vont bord à bord.
2. **La couleur marque des territoires entiers.** Une collection complète (`body[data-collection=stop-plastic]`) et la page newsletter ont leur `main` intégralement jaune. Ce n'est pas une section colorée : c'est une page colorée.
3. **La couleur est déclenchée par l'interaction.** Le header est neutre en haut de page et **bascule en aplat plein au scroll**. Le méga-menu s'ouvre en plan de couleur plein. C'est là que naît le « waouh ».
4. **Proportion : ~10 % de couleur, ~90 % de neutre.** Les pages produit et collection standard sont blanches. Le jaune est rare, donc il frappe.
5. **Un seul accent chromatique.** Pas de secondaire, pas de tertiaire. Toute la nuance passe par les gris.
6. **Micro-usages ponctuels** : badge, bouton burger, message de formulaire, barre de soulignement animée, un mot en couleur dans un titre.

**Ce qu'on ne copie pas :** le jaune. Il est l'ADN visuel de Mover et suivre la référence à la lettre ferait de KINŪ une resucée. On reprend la **grammaire**, pas le **mot**.

### 3.2 Palette KINŪ

| Jeton | Hex | Rôle | Proportion cible |
|---|---|---|---|
| `--kn-ivory` | `#F7F5F0` | **Fond par défaut** de tout le site (brief) | **62 %** |
| `--kn-ink` | `#1B1A16` | Texte principal, boutons primaires, territoire « CrossOver », footer | **20 %** |
| `--kn-forest` | `#1E4D3B` | **Accent inondant** (brief) : sections pleines, panneau de nav, header scrollé, territoire « Amplitude » | **14 %** |
| `--kn-sage` | `#E6EAE3` | Teinte douce : blocs secondaires, fonds de packshot, états de chargement | **4 %** |
| `--kn-forest-deep` | `#163A2C` | Hover/pressed sur surface verte, filets sur vert | ponctuel |
| `--kn-forest-soft` | `#6FA98C` | Accent **sur fond sombre uniquement** (liens dans le footer encre) | ponctuel |
| `--kn-grey` | `#6E6B62` | Texte secondaire, prix barrés, placeholders, items de menu atténués | ponctuel |
| `--kn-white` | `#FFFFFF` | **Uniquement** l'intérieur d'un packshot détouré. Jamais un fond de page. | ponctuel |
| `--kn-line` | `rgba(27,26,22,.14)` | Filets 1px sur fond clair | — |
| `--kn-line-invert` | `rgba(247,245,240,.22)` | Filets 1px sur fond sombre/vert | — |
| `--kn-error` | `#A63A22` | Erreurs de formulaire, rupture de stock (terre cuite, **pas de rouge pur**) | ponctuel |
| `--kn-success` | `#1E4D3B` | Confirmations = le vert forêt lui-même | ponctuel |

Contrastes vérifiés : ivoire sur forêt ≈ 8,5:1 · encre sur ivoire ≈ 15:1 · gris sur ivoire ≈ 4,9:1 · ivoire sur encre ≈ 14:1. Tout est AA, l'essentiel est AAA.

### 3.3 Les trois surfaces (et rien d'autre)

Tout le site se construit avec **trois plans**, jamais un quatrième :

| Surface | Fond | Texte | Filets | Bouton primaire |
|---|---|---|---|---|
| **CLAIRE** (défaut) | `#F7F5F0` | `#1B1A16` | `--kn-line` | fond `#1B1A16`, texte `#F7F5F0` |
| **INONDÉE** | `#1E4D3B` | `#F7F5F0` | `--kn-line-invert` | fond `#F7F5F0`, texte `#1E4D3B` |
| **SOMBRE** | `#1B1A16` | `#F7F5F0` | `--kn-line-invert` | fond `#1E4D3B`, texte `#F7F5F0` |

La teinte `--kn-sage` est une **variante de la surface claire**, pas une quatrième surface : mêmes couleurs de texte, mêmes filets.

### 3.4 Mécanique d'application — les 12 règles fermes

**R1 — L'aplat va bord à bord.** Une section colorée occupe 100 % de la largeur du viewport. Interdiction absolue d'un « bloc vert arrondi flottant sur fond ivoire » : c'est exactement le tic que Mover n'a pas.

**R2 — Une section inondée toutes les 3 à 4 sections, maximum 2 par page.** Rythme de la page d'accueil :

```
[vidéo hero — plein premier écran, aucune couleur]
[ivoire]   les 3 univers
[FORÊT]    le manifeste / la promesse produit      ← inondation 1
[ivoire]   nouveautés (grille produits)            ← dernier plan clair
[encre]    footer (lettre d'information + menus + télémétrie)
```

> **Amendement du 27 août 2026 — le journal quitte l'accueil.** Le bandeau
> éditorial en sauge est retiré de la page d'accueil à la demande du client. La
> section reste dans le thème et se rajoute d'un clic dans l'éditeur. Ce sont
> les nouveautés qui tiennent désormais le dernier plan clair avant le footer
> encre — R12 reste satisfaite.

**R3 — Territoires de collection.** Chaque univers reçoit une **surface**, pas une nouvelle teinte. C'est la transposition directe du `body[data-collection=…] main` de Mover, et ça résout le problème d'arborescence du brief : le visiteur *voit* dans quel univers il se trouve.

| Univers | Catégorie affichée | Surface de la page collection |
|---|---|---|
| **Fluid-Motion** | Femme | CLAIRE (ivoire) |
| **CrossOver** | Homme | SOMBRE (encre) |
| **Amplitude** | Unisexe | INONDÉE (forêt) |

Implémentation Liquid : ajouter `data-kn-territory="fluid-motion|crossover|amplitude"` sur `<body>` dans `layout/theme.liquid`, et un sélecteur `[data-kn-territory="amplitude"] .kn-collection-main { … }` dans `custom.css`. **Seul le `main` bascule**, le header et le footer gardent leur propre logique.

**R4 — La page produit reste TOUJOURS claire.** Le brief est explicite : « l'image produit prime ». La page produit ne s'inonde jamais. Elle porte son territoire par un seul signe : un filet de 3 px dans la couleur du territoire, collé sous le fil d'Ariane, et le sur-titre `FEMME — FLUID-MOTION` en `--kn-grey`.

**R5 — Le header bascule au scroll.** C'est le geste signature, hérité de `.main__nav.scrolled`.

- Position haute (scrollY < 64 px) : fond `transparent` sur la vidéo hero, sinon `#F7F5F0`. Icônes et logo en `#1B1A16` (ou `#F7F5F0` sur la vidéo).
- Après 64 px : fond `#1E4D3B` plein, logo et icônes en `#F7F5F0`, filet bas `--kn-line-invert`.
- Transition `background-color 240ms cubic-bezier(.4,0,.2,1)`. **Le header ne change ni de hauteur, ni de taille de logo** — seule la couleur bouge. Aucun rétrécissement, aucune ombre portée.

**R6 — Le panneau de navigation est un plan vert plein.** Le burger ouvre un panneau (drawer latéral 100 % sur mobile, panneau déroulant pleine largeur sur desktop) en `#1E4D3B` bord à bord, texte `#F7F5F0`, aucun cadre, aucun coin arrondi, aucune ombre. Le fond de page derrière reçoit un voile `rgba(27,26,22,.4)`. Ouverture 560 ms `cubic-bezier(.22,1,.36,1)`.

**R7 — Hover des items de menu (tranché).** Le brief proposait A (soulignement, skims) ou B (les autres grisent, arte-antwerp). **On prend B, augmentée du vert du brief** — c'est la seule option qui fonctionne dans un panneau où les items sont gros et peu nombreux, et elle produit un effet de focus optique que le soulignement ne donne pas.

- Sur surface CLAIRE : au survol d'un item, l'item passe en `#1E4D3B`, **tous les autres** passent en `--kn-grey` (`#6E6B62`). Transition `color 240ms`.
- Sur surface INONDÉE (le panneau vert) : l'item survolé reste `#F7F5F0`, les autres passent à `rgba(247,245,240,.45)`.
- Pas de soulignement dans le menu. Le soulignement est réservé aux liens en ligne (R8).

**R8 — Le soulignement révélé.** Pour les liens dans le texte et les CTA tertiaires (équivalent du `.hero__link a:before` de Mover) : barre de 1 px positionnée en bas, `transform: scaleX(0)`, `transform-origin: left`, passe à `scaleX(1)` en 320 ms au survol. Couleur `#1E4D3B` sur clair, `#F7F5F0` sur inondé.

**R9 — Un mot en vert par titre, jamais deux.** Comme le `strong` jaune de Mover : dans un gros titre éditorial, un seul mot peut passer en `#1E4D3B`. Sur surface inondée, ce mécanisme est **désactivé** (pas de vert sur vert).

**R10 — Micro-surfaces vertes autorisées.** Bouton burger mobile (carré plein 44 × 44), pastille du compteur panier, badges (« Nouveau », « Édition limitée »), bandeau de message de formulaire, barre d'annonce défilante. Toutes en aplat plein, texte ivoire.

**R11 — Le vert n'écrit jamais de texte courant.** `#1E4D3B` en couleur de texte est réservé aux liens, à un mot de titre et aux libellés d'état. Un paragraphe entier en vert est interdit.

**R12 — Jamais deux surfaces colorées adjacentes.** Une section forêt ne touche jamais une section encre : il faut toujours un plan clair entre les deux. Plus d'exception depuis l'amendement du 27 août : la lettre d'information ayant rejoint le footer encre, la règle vaut désormais partout sans réserve.

### 3.5 États d'interaction

| Élément | Repos | Survol | Actif / pressé | Focus clavier |
|---|---|---|---|---|
| Bouton primaire (clair) | fond `#1B1A16`, texte `#F7F5F0` | fond `#1E4D3B` (240 ms) | fond `#163A2C` | outline 2px `#1E4D3B`, offset 2px |
| Bouton primaire (inondé) | fond `#F7F5F0`, texte `#1E4D3B` | fond `#E6EAE3` | fond `#D8DFD6` | outline 2px `#F7F5F0`, offset 2px |
| Bouton secondaire | transparent, filet 1px `#1B1A16` | remplissage `#1B1A16`, texte `#F7F5F0` | remplissage `#163A2C` | idem |
| Lien texte | `#1B1A16` | `#1E4D3B` + barre révélée | `#163A2C` | idem |
| Carte produit | — | image 2 en fondu 320 ms, titre → `#1E4D3B` | — | outline 2px offset 4px |
| Champ de saisie | filet 1px `--kn-line` | filet `#1B1A16` | — | filet 2px `#1E4D3B` |
| Icônes header | trait 1,5px courant | opacité 1 → couleur `#1E4D3B` (état clair) | — | outline 2px |

### 3.6 Combinaisons interdites

- `#1E4D3B` sur `#1B1A16` (vert sur encre : illisible, contraste 1,6:1)
- `#6E6B62` sur `#1E4D3B`
- `#FFFFFF` comme fond de page ou de section (le brief l'exclut explicitement)
- `#000000` pur, n'importe où
- Toute couleur hors de la liste du §3.2, y compris dans les visuels de campagne : les images doivent être castées dans cette palette.

> **Correction du 10/08/2026 (implémentation).** Cette liste interdisait « deux verts
> côte à côte (`--kn-forest` + `--kn-sage` adjacents) », ce qui contredisait le rythme
> de la page d'accueil imposé au §3.4 R2 (bandeau journal sauge suivi de l'inondation
> verte). C'est le §3.3 qui tranche : **la sauge est une variante de la surface claire,
> pas une quatrième surface** — l'enchaînement sauge → forêt n'est donc pas « deux
> surfaces colorées adjacentes » au sens de R12. Interdiction levée, R12 (forêt jamais
> collée à encre) reste en vigueur. Vérifié à l'écran : la marche fonctionne.

---

## 4. Typographie

### 4.1 Familles

| Usage | Famille | Graisses autorisées | Source |
|---|---|---|---|
| Titres, sur-titres, menus, boutons, prix, libellés UI | **DM Sans** | 400 · 500 · 700 | Bibliothèque de polices Shopify (`dm_sans_n4/n5/n7`) — aucun upload nécessaire |
| Texte courant : paragraphes, descriptions produit, blog, CGV | **Montserrat** | 400 · 500 | Bibliothèque de polices Shopify (`montserrat_n4/n5`) |

Les deux sont dans le brief et disponibles nativement dans Shopify → à définir dans les réglages du thème (`type_heading_font`, `type_body_font`, `type_subheading_font`, `type_accent_font`), **pas en `@font-face` custom**. Le thème expose ensuite `--font-heading--family` et `--font-body--family`, sur lesquels on branche nos jetons.

> ⚠️ **Réserve à faire valider par le client.** Montserrat est une géométrique large, conçue pour l'affichage ; en texte courant sous 16 px elle fatigue et, associée à DM Sans (également géométrique), elle produit un couple à faible contraste — les deux polices se ressemblent sans se répondre. Les références du brief (Mover utilise « Office », On utilise une grotesque suisse) sont toutes sur des **néo-grotesques**. **Recommandation : garder DM Sans en titres et remplacer Montserrat par Archivo** (gratuite, Google Fonts, dans la bibliothèque Shopify) pour le texte courant. Gain de lisibilité et de rigueur immédiat, coût nul. **En l'absence de validation, on applique le brief tel quel** avec le réglage fin ci-dessous.

**Réglage de secours si Montserrat est conservée :** jamais sous 16 px, `line-height` 1,65 minimum, `letter-spacing: -0.005em`, graisse 400 uniquement en paragraphe, jamais de capitales en texte long.

### 4.2 Échelle (mobile-first, base 16 px)

| Rôle | Taille | Police / graisse | Interlignage | Letter-spacing | Casse |
|---|---|---|---|---|---|
| `--kn-fs-display` | `clamp(2.75rem, 11vw, 7rem)` | DM Sans 700 | 0,94 | `-0.03em` | Normale |
| `--kn-fs-h1` | `clamp(2rem, 6.5vw, 3.75rem)` | DM Sans 700 | 1,02 | `-0.025em` | Normale |
| `--kn-fs-h2` | `clamp(1.625rem, 4.5vw, 2.5rem)` | DM Sans 700 | 1,08 | `-0.02em` | Normale |
| `--kn-fs-h3` | `clamp(1.25rem, 2.6vw, 1.75rem)` | DM Sans 500 | 1,18 | `-0.015em` | Normale |
| `--kn-fs-h4` | `1.125rem` | DM Sans 500 | 1,3 | `-0.01em` | Normale |
| `--kn-fs-lead` | `clamp(1.0625rem, 1.6vw, 1.25rem)` | Montserrat 400 | 1,55 | `-0.005em` | Normale |
| `--kn-fs-body` | `1rem` | Montserrat 400 | 1,65 | `-0.005em` | Normale |
| `--kn-fs-sm` | `0.875rem` | Montserrat 400 | 1,55 | `0` | Normale |
| `--kn-fs-label` | `0.6875rem` (11 px) | DM Sans 500 | 1,2 | `+0.12em` | **MAJUSCULES** |
| `--kn-fs-price` | `0.9375rem` | DM Sans 500, `font-variant-numeric: tabular-nums` | 1,2 | `0` | Normale |
| `--kn-fs-btn` | `0.8125rem` | DM Sans 500 | 1 | `+0.08em` | **MAJUSCULES** |

**Règles fermes**

- Deux familles, cinq graisses au total. Jamais de 300 (l'ivoire mange les traits fins), jamais de 800/900.
- **Les majuscules sont réservées aux libellés, boutons, badges, sur-titres et au fil d'Ariane.** Un titre éditorial n'est jamais en capitales — c'est ce qui sépare KINŪ du streetwear générique.
- Le letter-spacing est **négatif sur les gros titres** (-0,02 à -0,03em) et **positif sur les petits** (+0,08 à +0,12em). Jamais l'inverse. C'est le signal faible commun à Mover (`-.015em` sur h2-h4, `.06em` sur les titres capitales) et à On.
- Largeur de lecture maximale : **68 caractères** (`--kn-measure`). Un paragraphe pleine largeur sur desktop est interdit.
- Une seule taille de titre par section. Pas de titre qui « décroît » en trois paliers.
- Chiffres tabulaires partout où il y a un prix, une taille ou une quantité.

---

## 5. Grille & mise en page

### 5.1 Conteneurs

| Jeton | Valeur | Usage |
|---|---|---|
| `--kn-container` | `1560px` | Largeur max du contenu |
| `--kn-container-narrow` | `1120px` | Blocs éditoriaux, page produit |
| `--kn-measure` | `68ch` | Largeur max d'un bloc de texte |
| `--kn-gutter` | `clamp(1rem, 4vw, 2.5rem)` | Marge latérale : 16 px mobile → 40 px desktop |

Le réglage Horizon `page_width: "narrow"` est conservé, mais on force `--page-width: 1560px` et `--page-margin: var(--kn-gutter)` depuis `custom.css`.

> **Correction du 10/08/2026 (implémentation) — piège technique à connaître.**
> La technique full-bleed habituelle `width: 100vw; margin-inline: calc(50% - 50vw)`
> **est inutilisable dans Horizon**. Au-delà de 990 px, le thème donne
> `height: 100dvh; overflow-y: auto` à `.page-wrapper` : c'est ce conteneur qui
> défile, pas la fenêtre. `100vw` y vaut donc la largeur du conteneur **plus** la
> barre de défilement, ce qui provoque un débordement horizontal que
> `body { overflow-x: clip }` ne rattrape pas.
> **La bonne approche :** une section qui doit aller bord à bord n'a rien à faire —
> elle est enfant direct de `<main>`, qui est déjà pleine largeur. C'est son
> *contenu* qu'on contraint, avec `.kn-container`. Pour escamoter seulement la
> gouttière d'un conteneur, utiliser `.kn-bleed`
> (`margin-inline: calc(-1 * var(--kn-gutter))`). `100vw` reste légitime pour les
> éléments en `position: fixed` (tiroirs, lightbox), qui sont hors du flux.

### 5.2 Grille

- **12 colonnes** desktop (≥ 1024 px), **6 colonnes** tablette (640–1023 px), **4 colonnes** mobile.
- Gouttière : `clamp(1rem, 2vw, 1.5rem)` → 16 px mobile, 24 px desktop.
- Grille produits : **2 colonnes mobile** (jamais 1 — la comparaison visuelle fait vendre), 3 tablette, 4 desktop, **5 au-delà de 1280 px** (amendement du 23/08/2026 : la densité est ce qui fait la précision de la référence ; sous 1280 px, cinq colonnes donneraient des vignettes trop étroites pour juger un vêtement). `column-gap` 24 px, `row-gap` 64 px : l'écart vertical est toujours ~2,5× l'écart horizontal, c'est ce qui fait respirer une grille mode.
- Alignement par défaut : **fer à gauche**. Le centrage est réservé au bloc newsletter et aux messages d'état vides.

### 5.3 Rythme vertical

Échelle de 8 px, sans valeur intermédiaire improvisée :
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160`

- Padding de section standard : `--kn-section-y: clamp(3.5rem, 9vw, 7.5rem)` (56 → 120 px)
- Padding de section **inondée** : `--kn-section-y-flood: clamp(5rem, 12vw, 10rem)` (80 → 160 px). **Une surface colorée reçoit toujours plus d'air qu'une surface claire** — sinon l'aplat paraît serré et bon marché.
- Titre de section → contenu : 32 px mobile, 48 px desktop.

### 5.4 Coins, filets, ombres

- **Rayon = 0 partout.** Boutons, cartes, images, champs, drawer, popovers : angles vifs. Horizon arrive avec `button_border_radius_primary: 14` et `popover_border_radius: 14` — **à écraser**, c'est le tic visuel qui trahirait un thème par défaut.
- Seule exception : les **badges et la pastille du panier**, en pilule (`999px`). Le contraste entre un site 100 % anguleux et deux pastilles rondes est volontaire et lisible.
- Épaisseur de trait unique : **1 px**. 2 px uniquement pour l'anneau de focus et le filet de territoire (3 px, R4).
- **Zéro ombre portée.** Pas de `box-shadow` sur les cartes, les boutons, le header, les popovers. La hiérarchie passe par la couleur de surface et l'espace. Seule ombre autorisée : le voile de fond des overlays, `rgba(27,26,22,.4)`, qui est un fond, pas une ombre.

---

## 6. Traitement des images

| Contexte | Ratio | Traitement |
|---|---|---|
| Vidéo hero d'accueil | **Plein premier écran**, tous formats — `100dvh` moins la barre d'annonce | Autoplay, muet, boucle, `playsinline`, poster obligatoire, aucun contrôle visible, titre ancré en bas de cadre |
| Carte produit (grille) | **3:4** | `object-fit: cover`, fond `--kn-sage` derrière les packshots détourés |
| Galerie page produit | 3:4, premier visuel en 4:5 sur mobile | Zoom au clic (lightbox plein écran, fond `#1B1A16`), pas de zoom au survol |
| Bannière éditoriale / univers | 21:9 desktop, 4:5 mobile | Full-bleed |
| Portrait lookbook | 4:5 | — |
| Détail matière / accessoire | 1:1 | — |

**Règles**

- **Aucun filtre, aucune duotone, aucun grain, aucune vignette.** Le vêtement doit être vu tel qu'il est ; c'est la promesse d'un site premium.
- Un seul voile autorisé : `rgba(27,26,22,.35)` sur une bannière éditoriale **qui porte du texte**. Jamais sur une image produit.
- Les images ne débordent pas de leur cadre, ne sont jamais arrondies, ne portent jamais de bordure ni d'ombre.
- Cohérence de casting : arrière-plans réels neutres (béton, ivoire, bois clair, vert végétal), lumière naturelle diffuse, pas de flash direct, pas de fond studio coloré.
- **Survol de carte produit :** fondu croisé vers la 2ᵉ image du produit en 320 ms. **Pas de zoom, pas de translation, pas d'ombre.** Le réglage Horizon `card_hover_effect: "none"` est correct, on l'implémente nous-mêmes.
- Chargement : `loading="lazy"` sauf les 2 premières images de la vue, `fetchpriority="high"` sur le poster du hero, placeholder en `--kn-sage` uni — **jamais de skeleton scintillant**.

> **Amendement du 27 août 2026 — bannière plein écran.** Elle était réglée par
> ratio : 4:5 sur mobile, 16:9 plafonné à `88vh` au-delà. Elle ne remplissait
> donc jamais tout à fait la fenêtre, et la section suivante entamait toujours
> le premier écran. La demande client du 27 août la porte à `100dvh` moins la
> barre d'annonce — le header la chevauchant déjà, il n'entre pas dans le
> calcul. `dvh` et non `vh` : sur mobile, la barre d'URL se rétracte au
> défilement et `vh` laisserait un décalage permanent. Le titre reste ancré en
> bas de cadre, ce qui suffit à signaler qu'il y a une suite.

---

## 7. Composants clés

### 7.1 Header

- Hauteur fixe : **56 px mobile / 72 px desktop**. Ne change jamais au scroll.
- **Téléphone** : **[burger] — [logo KINŪ] — [recherche · compte · panier]**. La navigation vit dans le panneau.
- **Ordinateur** : **[logo KINŪ] — [Femme · Homme · Unisexe] — [recherche · compte · panier]**. Les entrées de premier niveau du menu passent dans la barre, à l'échelle d'étiquette (11 px, capitales, chasse positive), zone cliquable 44 px. Survol : les autres entrées s'atténuent, la survolée reste nette (§3.6). L'entrée de la page courante porte `aria-current` et passe en accent.

> **Amendement du 27 août 2026 — libellés dans la barre.** Le brief interdisait
> tout libellé de menu visible : le burger tenait la navigation sur les deux
> formats. La demande client du 27 août rétablit une barre classique sur
> ordinateur — « Accueil / Catalogue / Contact », le menu Shopify par défaut, ne
> disait rien d'une marque de vêtements, et le panneau était le seul endroit où
> le voir. Le burger disparaît donc sur ordinateur, faute d'avoir encore quelque
> chose à ouvrir, et reste la navigation du téléphone. Une seule source : le même
> menu alimente la barre et le panneau.
- Logo : wordmark `KINŪ`, hauteur 20 px mobile / 24 px desktop, aligné à gauche sur desktop, centré sur mobile.
- Icônes : trait **1,5 px**, taille 20 px, zone tactile 44 × 44 px, sans libellé. Le compteur du panier est une pastille verte de 16 px, chiffre 10 px DM Sans 500 en ivoire.
- Comportement au scroll : voir **R5**. Header sticky, jamais masqué au scroll descendant.
- Barre d'annonce : au-dessus du header, aplat `#1E4D3B`, hauteur 32 px, texte `--kn-fs-label` ivoire, défilement horizontal 40 s linéaire infini, **en pause au survol**, masquable.

### 7.2 Panneau de navigation

Voir **R6**. Contenu, dans cet ordre — c'est la réponse à la question « qu'est-ce que je cherche ? » du brief :

```
FEMME        (sur-titre discret : Fluid-Motion)
  Brassières · Leggings · Shorts · T-shirts · Vestes
HOMME        (sur-titre discret : CrossOver)
  T-shirts · Shorts
UNISEXE      (sur-titre discret : Amplitude)
  T-shirts · Hoodies · Joggers
─────────────────────────────
TOUTES LES COLLECTIONS
JOURNAL · À PROPOS
```

Niveau 1 en `--kn-fs-h4` DM Sans 500, capitales, chasse positive, ivoire ; niveau 2 en `--kn-fs-sm` `--kn-muted-invert`. Le nom de collection est un sur-titre `--kn-fs-label` en `--kn-muted-invert` : **présent comme signature de marque, jamais comme repère de navigation** (exigence explicite du brief).

> **Amendement du 27 août 2026 — le panneau en rangées.** Le niveau 1 était en
> `--kn-fs-h2` (48 px), une entrée par bloc empilé, sur-titre au-dessus. Trois
> entrées remplissaient un quart du panneau et rien ne disait qu'elles menaient
> quelque part. La demande client du 27 août, référence [olafhussein.com](https://olafhussein.com)
> à l'appui, les ramène à une **liste de rangées à filets 1 px, toutes au même
> corps**, fermées par une flèche qui avance de 4 px au survol. Le nom de
> collection et le compteur passent à droite de la rangée, comme la valeur d'une
> ligne de données. Les liens de service — Toutes les collections, puis le menu
> de bas de panneau — ferment la même liste au lieu d'un pied séparé : même
> rangée, même filet, corps atténué. R7 (l'item visé reste net, les autres
> s'effacent) reste en vigueur et porte désormais aussi la flèche.
>
> **Complément du même jour.** Un univers qui porte des catégories devient une
> **liste déroulante** : la rangée est un `summary`, la flèche cède au chevron
> qui pivote de 180° à l'ouverture, et les catégories s'empilent **une par
> ligne** sous le titre. En ligne, séparées par des points médians, elles
> débordaient sur deux lignes et laissaient un point orphelin en tête de la
> seconde. La collection entière reste joignable par une première ligne « Tout
> voir », en échelle d'étiquette pour ne pas se confondre avec une catégorie.
> Les univers sans catégorie gardent leur lien direct et leur flèche.

> **Correction du 10/08/2026 (implémentation).** Ce sur-titre était prévu en
> `--kn-faint-invert` (45 % d'ivoire). À 11 px sur l'aplat vert, cela donne 3,1:1 —
> sous le seuil AA de 4,5:1 annoncé au §3.2. Il passe à `--kn-muted-invert` (70 %,
> soit 5,2:1). **Règle générale qui en découle : `--kn-faint-invert` ne sert qu'à
> l'atténuation transitoire (les items de menu non survolés), jamais à du texte
> statique.** La hiérarchie du sur-titre tient par la taille et les capitales, pas
> par la transparence.

### 7.3 Carte produit

> **Amendement du 23 août 2026.** Le schéma ci-dessous décrivait quatre lignes de
> texte sous l'image : nom, sur-titre d'univers, prix. La carte en tient
> désormais **deux** — nom et prix, tous deux à l'échelle d'étiquette, en
> capitales, séparés par la seule graisse. Le sur-titre d'univers est éteint par
> défaut (`show_universe` à faux) ; il reste rallumable là où il apprend quelque
> chose, et l'univers demeure lisible dans le fil d'Ariane et sur la fiche. Motif :
> la référence tient sa cellule en deux lignes, et c'est cette retenue qui laisse
> l'image porter seule.

Alignée à gauche, sans cadre, sans fond, sans ombre — **la carte n'est pas un objet, c'est une colonne**.

```
[image 3:4]
8px
Nom du produit          — DM Sans 500, --kn-fs-body, #1B1A16
4px
Femme — Fluid-Motion    — --kn-fs-label, #6E6B62   (masqué sur la page de sa propre collection)
8px
CHF 140.–               — --kn-fs-price, tabular-nums
```

- Nuancier de couleurs : pastilles de 12 px, carrées (rayon 0), filet 1px `--kn-line`, écart 6 px, 5 maximum puis « +3 ».
- Badge : en haut à **gauche** de l'image (Horizon est réglé `top-right` → à changer), aplat `#1E4D3B`, texte ivoire `--kn-fs-label`, padding 4/8, pilule.
- Prix soldé : prix barré en `--kn-grey`, nouveau prix en `#1B1A16`. **Jamais de rouge.**
- Rupture de stock : image à `opacity .5`, libellé `ÉPUISÉ` en `--kn-fs-label` `--kn-grey`. Pas de bandeau.

### 7.4 Boutons

| Type | Spécification |
|---|---|
| Primaire | Hauteur **52 px mobile / 56 px desktop**, padding inline 32 px, rayon 0, `--kn-fs-btn` (majuscules, +0,08em), pleine largeur sur mobile. Couleurs et états : §3.5 |
| Secondaire | Mêmes dimensions, fond transparent, filet 1 px |
| Tertiaire | Lien texte + soulignement révélé (R8), hauteur libre |

Aucun bouton ne se déplace, ne grossit ni ne prend d'ombre au survol : **seule la couleur change.**

### 7.5 Panier (drawer)

- Ouverture par la droite, 100 % de largeur sur mobile, **440 px** sur desktop, rayon 0, sans ombre, filet gauche `--kn-line`.
- Fond `#F7F5F0`, texte `#1B1A16`, voile `rgba(27,26,22,.4)` derrière.
- En-tête : `PANIER (2)` en `--kn-fs-label`, croix de fermeture 20 px à droite, filet bas 1 px.
- Ligne article : vignette 3:4 de 72 px, nom, variante en `--kn-grey`, sélecteur de quantité en filets 1 px carrés, prix aligné à droite en tabulaire.
- Pied collant : sous-total, mention de livraison, puis bouton primaire pleine largeur **`PASSER COMMANDE`** — et c'est le seul endroit du site où le bouton primaire est directement en `#1E4D3B` (fond forêt, texte ivoire). Le vert marque la conversion.
- Panier vide : titre `--kn-fs-h3`, une phrase, un bouton secondaire. Pas d'illustration, pas d'emoji.

### 7.6 Footer

- Surface **SOMBRE** (`#1B1A16`), texte `#F7F5F0`, liens `rgba(247,245,240,.7)` → `--kn-forest-soft` (`#6FA98C`) au survol. **Un seul bloc**, trois rangées séparées par des filets 1 px : lettre + menus, télémétrie, ligne légale.
- **Rangée 1 — lettre d'information à gauche (5/12), menus à droite (7/12).** Sur-titre `[LETTRE]`, titre à l'échelle H3, une phrase de promesse, puis le formulaire. Champ e-mail en filet ivoire 1 px sur fond transparent, bouton `S'INSCRIRE` ivoire. Le filet est un **contour**, pas un trait bas : à partir de 640 px, champ et bouton tiennent dans une seule boîte, l'aplat ivoire du bouton en fermant le bord droit. Boîte bornée à 34 rem. Empilés sous 640 px, champ à filet bas et bouton pleine largeur.
- **Menus** : autant de colonnes que de menus réellement remplis (1 à 4), jamais quatre pistes figées — une colonne vide se voit. Accordéons repliés sur mobile. Ordre visé : Boutique · Aide (FAQ, Livraison, Retours) · Maison (À propos, Journal, Contact) · Légal (CGV, Confidentialité).
- Bas de footer : réseaux sociaux en icônes 18 px trait 1,5 px, **sélecteur de langue FR / EN** en `--kn-fs-label` séparé par un filet vertical, mention `© KINŪ 2026`.

> **Amendement du 27 août 2026 — la lettre entre dans le footer.** Elle était un
> aplat forêt pleine largeur posé au-dessus du footer encre, avec la marche
> franche que R12 tolérait en exception. La demande client du 27 août réunit les
> deux en un seul pied de page. Ce qui motive le changement : l'aplat portait
> trois lignes dans 340 px de vert et paraissait vide plutôt que généreux, tandis
> que le footer, avec deux colonnes de liens étalées sur quatre pistes, l'était
> tout autant. Réunis, les deux blocs se remplissent l'un l'autre. La page
> d'accueil perd son inondation 2 — R2 en tolère deux au maximum, une seule reste
> conforme.

### 7.7 Page collection & page produit

- **Collection** : en-tête sur la surface du territoire (R3) avec `H1` = la catégorie (`Femme`, en casse normale — le §4.2 et le §9 interdisent les titres éditoriaux en capitales, et c'est cette règle-là qui prime ; le libellé reste éditable si le client préfère les majuscules), sur-titre = la collection (`FLUID-MOTION`), une phrase de contexte max 68ch. Filtres dans un drawer latéral (pas de sidebar permanente), déclenché par `FILTRER (2)` en `--kn-fs-label`. Tri à droite. Filet 1 px sous la barre.
- **Fil d'Ariane** : `Accueil / Femme / T-shirts` en `--kn-fs-label` `--kn-grey`, séparateur `/`, présent sur collection et produit (exigence du brief).
- **Produit** : **deux colonnes desktop** — galerie 7/12 à gauche, colonne de lecture 5/12 à droite qui enchaîne achat puis caractéristiques ; une colonne mobile (galerie plein cadre, puis achat, puis caractéristiques). Le placement est explicite en grille : l'ordre du DOM reste galerie / achat / caractéristiques, qui est l'ordre de lecture juste sur petit écran et au clavier. Les accordéons se replient sur les deux formats, Description ouverte par défaut. Sélecteurs de taille en carrés de 44 px, filet 1 px, sélection = remplissage encre. La quantité est un choix comme les autres : même étiquette en capitales grises que `COULEUR` et `TAILLE`, contrôle dessous, puis le bouton d'ajout pleine largeur — jamais un bloc sans nom posé à côté du bouton. Accordéons (Description / Matière & entretien / Livraison) en filets 1 px, sans fond, chevrons 12 px.

---

## 8. Motion

**Durées** — quatre valeurs, pas une de plus :

| Jeton | Valeur | Usage |
|---|---|---|
| `--kn-dur-1` | `160ms` | Micro-états : icône, pastille, chevron |
| `--kn-dur-2` | `240ms` | Changement de couleur : header au scroll, hover de lien, bouton |
| `--kn-dur-3` | `320ms` | Révélation : soulignement, fondu croisé d'image produit |
| `--kn-dur-4` | `560ms` | Déplacement de plan : drawer, panneau de nav, apparition de section |

**Courbes**

- `--kn-ease-out: cubic-bezier(.22, 1, .36, 1)` — entrées, ouvertures de panneaux, apparitions au scroll
- `--kn-ease-state: cubic-bezier(.4, 0, .2, 1)` — tout changement de couleur
- `--kn-ease-inout: cubic-bezier(.65, 0, .35, 1)` — fermetures

**Ce qui bouge**

1. La couleur du header au scroll (240 ms) — le geste signature.
2. L'ouverture des panneaux : translation de 100 % → 0 (560 ms, `ease-out`), voile en fondu (240 ms).
3. L'apparition des sections au scroll : `opacity 0 → 1` + `translateY(16px → 0)`, 560 ms, décalage de 60 ms entre éléments d'une même grille, **une seule fois** (pas de rejeu au scroll inverse), déclenché à 15 % de visibilité.
4. Le fondu croisé de l'image produit au survol (320 ms).
5. Le soulignement révélé (320 ms, `scaleX`).
6. Le grisement des items de menu non survolés (240 ms).
7. La barre d'annonce défilante (40 s, linéaire, en pause au survol).

**Ce qui ne bouge PAS**

- Le scroll (aucun scroll-jacking, aucun *smooth scroll* forcé, aucun défilement horizontal piloté).
- Aucun parallaxe, sur aucune image.
- Aucun zoom au survol, ni sur les images, ni sur les cartes, ni sur les boutons.
- Aucune animation de texte lettre par lettre, aucun compteur animé, aucun typewriter.
- Aucun carrousel en lecture automatique.
- La hauteur du header et la taille du logo.

**Accessibilité :** sous `@media (prefers-reduced-motion: reduce)`, toutes les durées tombent à `1ms`, les révélations au scroll sont désactivées (contenu visible d'emblée), la vidéo hero est remplacée par son poster, la barre défilante s'arrête.

---

## 9. Ce qu'on NE fait PAS

**Couleur**

- Aucun dégradé, nulle part — surtout pas le dégradé violet/indigo par défaut.
- Aucune ombre colorée, aucun *glow*, aucun néon.
- Pas de blanc pur `#FFFFFF` ni de noir pur `#000000` en fond ou en texte.
- Pas de rouge sur les promotions ni sur les ruptures de stock.
- Pas de deuxième couleur d'accent « pour dynamiser ». Un accent. Un seul.
- Pas de bloc vert arrondi flottant : l'aplat va bord à bord ou n'existe pas.

**Typographie**

- Pas d'Inter (ni de police système par défaut) : les polices sont DM Sans et Montserrat, réglées dans le thème.
- Pas de troisième famille, pas de serif décoratif, pas d'italique.
- Pas de titre **éditorial** en majuscules. **Précision du 23/08/2026 :** un nom de produit n'est pas un titre éditorial. Sur la carte et sur la fiche, le nom et le prix descendent à l'échelle d'étiquette — capitales, chassé positif, hiérarchie portée par la graisse et la couleur, jamais par la taille. C'est la mécanique de la référence : une seule taille de caractère, et l'image qui parle seule. Les titres de section et les titres d'article restent en casse normale.
- Pas de graisse 300 ni 900.
- Pas de texte centré au-delà de 3 lignes.
- Pas de paragraphe dépassant 68 caractères de large.

**Layout**

- Pas de carte dans une carte. Pas de bloc encadré posé dans un bloc encadré.
- Pas de rayon 14 px hérité de Horizon : rayon 0 partout (sauf badges).
- Pas de `box-shadow`.
- Pas de sidebar de filtres permanente.
- Pas de grille produit à 1 colonne sur mobile. ~~Ni à 5+ colonnes sur desktop~~ — **levé le 23/08/2026** : 5 colonnes autorisées au-delà de 1280 px, jamais en deçà (voir §5.2).
- Pas de bandeau sticky supplémentaire en bas d'écran (« Ajouter au panier » collant) sur desktop ; toléré sur mobile page produit uniquement, en surface claire avec filet haut.

**Contenu & ton**

- Pas d'emoji, nulle part : ni dans l'interface, ni dans les libellés, ni dans les messages d'erreur.
- Pas de « Shop Now », pas de « Découvrir » générique : les libellés nomment la destination (`VOIR LES LEGGINGS`, `PASSER COMMANDE`).
- Pas de compte à rebours de promotion, pas de « 12 personnes regardent ce produit ».
- Pas de pop-up d'entrée dans les 30 premières secondes ; la newsletter vit dans le footer et dans une section dédiée.

**Références**

- Ne pas reprendre le jaune `#fff000` de Mover, ni sa police « Office », ni son compteur de déchets : on reprend sa **mécanique de couleur**, pas son identité. Un site KINŪ jaune serait un plagiat lisible au premier coup d'œil.
- Ne pas copier la mise en scène « héros produit sur fond dégradé » de On : notre priorité est le vêtement porté, pas le produit flottant.

---

## 10. Jetons CSS prêts à l'emploi

À placer dans `assets/custom.css`, en remplacement du bloc `:root` actuel (lignes 15–21), qui n'est qu'un placeholder.

```css
/* ==========================================================================
   KINŪ — Jetons de design
   ========================================================================== */
:root {
  /* ---- Couleurs ---------------------------------------------------- */
  --kn-ivory:        #F7F5F0;
  --kn-ink:          #1B1A16;
  --kn-forest:       #1E4D3B;
  --kn-forest-deep:  #163A2C;
  --kn-forest-soft:  #6FA98C;
  --kn-sage:         #E6EAE3;
  --kn-sage-deep:    #D8DFD6;
  --kn-grey:         #6E6B62;
  --kn-white:        #FFFFFF;
  --kn-error:        #A63A22;
  --kn-success:      var(--kn-forest);

  --kn-line:         rgba(27, 26, 22, .14);
  --kn-line-invert:  rgba(247, 245, 240, .22);
  --kn-scrim:        rgba(27, 26, 22, .40);
  --kn-muted-invert: rgba(247, 245, 240, .70);
  --kn-faint-invert: rgba(247, 245, 240, .45);

  /* ---- Surfaces (à appliquer via [data-kn-surface]) ----------------- */
  --kn-surface-bg:   var(--kn-ivory);
  --kn-surface-fg:   var(--kn-ink);
  --kn-surface-line: var(--kn-line);

  /* ---- Typographie -------------------------------------------------- */
  --kn-font-display: var(--font-heading--family, "DM Sans", sans-serif);
  --kn-font-ui:      var(--font-heading--family, "DM Sans", sans-serif);
  --kn-font-text:    var(--font-body--family, "Montserrat", sans-serif);

  --kn-fw-regular:   400;
  --kn-fw-medium:    500;
  --kn-fw-bold:      700;

  --kn-fs-display:   clamp(2.75rem, 11vw, 7rem);
  --kn-fs-h1:        clamp(2rem, 6.5vw, 3.75rem);
  --kn-fs-h2:        clamp(1.625rem, 4.5vw, 2.5rem);
  --kn-fs-h3:        clamp(1.25rem, 2.6vw, 1.75rem);
  --kn-fs-h4:        1.125rem;
  --kn-fs-lead:      clamp(1.0625rem, 1.6vw, 1.25rem);
  --kn-fs-body:      1rem;
  --kn-fs-sm:        0.875rem;
  --kn-fs-label:     0.6875rem;
  --kn-fs-price:     0.9375rem;
  --kn-fs-btn:       0.8125rem;

  --kn-lh-display:   0.94;
  --kn-lh-title:     1.08;
  --kn-lh-body:      1.65;
  --kn-lh-tight:     1.2;

  --kn-ls-display:  -0.03em;
  --kn-ls-title:    -0.02em;
  --kn-ls-body:     -0.005em;
  --kn-ls-label:     0.12em;
  --kn-ls-btn:       0.08em;

  --kn-measure:      68ch;

  /* ---- Espacement (échelle 8) --------------------------------------- */
  --kn-space-3xs:    0.25rem;   /*   4 */
  --kn-space-2xs:    0.5rem;    /*   8 */
  --kn-space-xs:     0.75rem;   /*  12 */
  --kn-space-sm:     1rem;      /*  16 */
  --kn-space-md:     1.5rem;    /*  24 */
  --kn-space-lg:     2rem;      /*  32 */
  --kn-space-xl:     3rem;      /*  48 */
  --kn-space-2xl:    4rem;      /*  64 */
  --kn-space-3xl:    6rem;      /*  96 */
  --kn-space-4xl:    8rem;      /* 128 */
  --kn-space-5xl:    10rem;     /* 160 */

  --kn-section-y:       clamp(3.5rem, 9vw, 7.5rem);
  --kn-section-y-flood: clamp(5rem, 12vw, 10rem);

  /* ---- Grille & conteneurs ------------------------------------------ */
  --kn-container:        1560px;
  --kn-container-narrow: 1120px;
  --kn-gutter:           clamp(1rem, 4vw, 2.5rem);
  --kn-grid-gap:         clamp(1rem, 2vw, 1.5rem);
  --kn-grid-row-gap:     var(--kn-space-2xl);
  --kn-grid-cols:        4;                 /* mobile */

  /* ---- Traits, rayons, cibles --------------------------------------- */
  --kn-radius:        0;
  --kn-radius-pill:   999px;
  --kn-stroke:        1px;
  --kn-stroke-strong: 2px;
  --kn-stroke-icon:   1.5px;
  --kn-territory-bar: 3px;
  --kn-tap:           44px;

  --kn-header-h:      56px;
  --kn-header-shift:  64px;   /* seuil de bascule couleur au scroll */
  --kn-drawer-w:      440px;

  /* ---- Motion -------------------------------------------------------- */
  --kn-dur-1:         160ms;
  --kn-dur-2:         240ms;
  --kn-dur-3:         320ms;
  --kn-dur-4:         560ms;
  --kn-ease-out:      cubic-bezier(.22, 1, .36, 1);
  --kn-ease-state:    cubic-bezier(.4, 0, .2, 1);
  --kn-ease-inout:    cubic-bezier(.65, 0, .35, 1);

  /* ---- Ratios d'image ------------------------------------------------ */
  --kn-ratio-card:      3 / 4;
  --kn-ratio-portrait:  4 / 5;
  --kn-ratio-square:    1 / 1;
  --kn-ratio-wide:      21 / 9;
  --kn-ratio-hero:      16 / 9;
}

@media (min-width: 640px)  { :root { --kn-grid-cols: 6; } }
@media (min-width: 1024px) { :root { --kn-grid-cols: 12; --kn-header-h: 72px; } }

/* --------------------------------------------------------------------------
   Surfaces — à poser sur n'importe quelle <section> ou sur <main>
   -------------------------------------------------------------------------- */
[data-kn-surface="light"] {
  --kn-surface-bg: var(--kn-ivory);
  --kn-surface-fg: var(--kn-ink);
  --kn-surface-line: var(--kn-line);
}
[data-kn-surface="sage"] {
  --kn-surface-bg: var(--kn-sage);
  --kn-surface-fg: var(--kn-ink);
  --kn-surface-line: var(--kn-line);
}
[data-kn-surface="flood"] {
  --kn-surface-bg: var(--kn-forest);
  --kn-surface-fg: var(--kn-ivory);
  --kn-surface-line: var(--kn-line-invert);
}
[data-kn-surface="dark"] {
  --kn-surface-bg: var(--kn-ink);
  --kn-surface-fg: var(--kn-ivory);
  --kn-surface-line: var(--kn-line-invert);
}
[data-kn-surface] {
  background-color: var(--kn-surface-bg);
  color: var(--kn-surface-fg);
}

/* Territoires de collection (R3) — posés sur <body> en Liquid */
[data-kn-territory="fluid-motion"] .kn-collection-main { --kn-surface-bg: var(--kn-ivory);  --kn-surface-fg: var(--kn-ink);   --kn-surface-line: var(--kn-line); }
[data-kn-territory="crossover"]    .kn-collection-main { --kn-surface-bg: var(--kn-ink);    --kn-surface-fg: var(--kn-ivory); --kn-surface-line: var(--kn-line-invert); }
[data-kn-territory="amplitude"]    .kn-collection-main { --kn-surface-bg: var(--kn-forest); --kn-surface-fg: var(--kn-ivory); --kn-surface-line: var(--kn-line-invert); }

/* --------------------------------------------------------------------------
   Pont vers les variables natives de Horizon
   -------------------------------------------------------------------------- */
:root,
.color-scheme-1,
.shopify-section {
  --color-background: var(--kn-ivory);
  --color-foreground: var(--kn-ink);

  --color-primary-button-background:       var(--kn-ink);
  --color-primary-button-text:             var(--kn-ivory);
  --color-primary-button-border:           var(--kn-ink);
  --color-primary-button-hover-background: var(--kn-forest);
  --color-primary-button-hover-text:       var(--kn-ivory);
  --color-primary-button-hover-border:     var(--kn-forest);
  --color-primary-button-focus-outline:    var(--kn-forest);

  --color-secondary-button-background:       transparent;
  --color-secondary-button-text:             var(--kn-ink);
  --color-secondary-button-border:           var(--kn-ink);
  --color-secondary-button-hover-background: var(--kn-ink);
  --color-secondary-button-hover-text:       var(--kn-ivory);
  --color-secondary-button-hover-border:     var(--kn-ink);

  --color-input-background: transparent;
  --color-input-text:       var(--kn-ink);
  --color-input-border:     var(--kn-line);
  --color-error:            var(--kn-error);
  --color-success:          var(--kn-success);
  --color-shadow:           transparent;

  --style-border-radius-buttons-primary:   var(--kn-radius);
  --style-border-radius-buttons-secondary: var(--kn-radius);
  --style-border-radius-inputs:            var(--kn-radius);
  --style-border-radius-popover:           var(--kn-radius);

  --page-width:  var(--kn-container);
  --page-margin: var(--kn-gutter);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --kn-dur-1: 1ms; --kn-dur-2: 1ms; --kn-dur-3: 1ms; --kn-dur-4: 1ms;
  }
}
```

### Réglages à modifier dans l'admin du thème

| Réglage Horizon | Valeur actuelle | Valeur KINŪ |
|---|---|---|
| `color_palette.background` | `#ffffff` | `#F7F5F0` |
| `color_palette.foreground` | `#000000` | `#1B1A16` |
| `color_palette.color1` | `#333333` | `#6E6B62` |
| `color_palette.color2` | `#DFDFDF` | `#E6EAE3` |
| `type_heading_font` / `type_accent_font` | `inter_n7` | `dm_sans_n7` |
| `type_subheading_font` | `inter_n5` | `dm_sans_n5` |
| `type_body_font` | `inter_n4` | `montserrat_n4` (ou `archivo_n4` si l'option §4.1 est validée) |
| `type_size_paragraph` | `14` | `16` |
| `button_border_radius_primary` / `secondary` | `14` | `0` |
| `popover_border_radius` | `14` | `0` |
| `inputs_border_radius` | `4` | `0` |
| `badge_position` | `top-right` | `top-left` |
| `badge_sale_background_color` | fond | `#1E4D3B` |
| `badge_sale_text_color` | premier plan | `#F7F5F0` |
| `card_hover_effect` | `none` | `none` (conservé — le fondu est géré en CSS) |
| `page_width` | `narrow` | conservé, surchargé par `--page-width` |
| `cart_type` | `drawer` | conservé |
| `page_transition_enabled` | `false` | conservé |

---

> **Amendement du 23 août 2026 — page produit à trois colonnes.** Ce paragraphe
> prescrivait deux colonnes (galerie 7/12, informations 5/12). La demande client
> du 23 août a tranché pour la disposition de [noartmusic.com](https://www.noartmusic.com) :
> caractéristiques à gauche, image au centre, achat à droite. Ce qui change, c'est
> l'endroit où le lecteur trouve la matière et l'entretien — plus sous le bouton
> d'achat, mais en regard de l'image. Le reste du §7.7 (sélecteurs de taille,
> filets, fil d'Ariane) reste en vigueur.
>
> **Amendement du 27 août 2026 — retour à deux colonnes.** La demande client du
> 27 août annule celui du 23 : description et composition reviennent du même côté
> que le prix et les options. La fiche redevient galerie 7/12 à gauche, colonne de
> lecture 5/12 à droite, qui enchaîne achat puis caractéristiques. Ce qui motive
> le retour : la disposition à trois colonnes séparait ce qui se lit en deux tas
> de part et d'autre de l'image, et obligeait le regard à traverser la page pour
> relier un coloris à sa composition. Les accordéons se replient donc à nouveau
> sur ordinateur — dépliés d'office, ils tenaient de la fiche technique en marge,
> ce qui n'a plus de sens sous un bouton d'achat. Le reste du §7.7 (sélecteurs de
> taille, filets, fil d'Ariane) reste en vigueur.

---

## 11. Couche signature — amendement du 22 août 2026

**Référence ajoutée : [noartmusic.com](https://www.noartmusic.com) (studio Boring).**
On en reprend la *grammaire*, jamais l'identité : ni son globe en rotation, ni sa
palette, ni sa mise en page. Ce qui est transposé, c'est sa manière de traiter
l'interface comme un **instrument de mesure** plutôt que comme une vitrine.

Cinq gestes, et pas un de plus. Ils vivent dans `assets/kn-signature.css`,
`assets/kn-signature.js`, `snippets/kn-datarow.liquid` et `snippets/kn-hud.liquid`.

### 11.1 Le crochet comme ponctuation système

Classe `.kn-brk`. Un libellé entre crochets signale qu'il s'agit d'une **donnée**,
pas d'une phrase : sur-titres, colonnes de pied de page, compteurs, index.
Les crochets sont tracés en `--kn-surface-muted` — le mot reste le sujet.

### 11.2 L'en-tête de section en ligne de données

Snippet `kn-datarow`. Remplace le sur-titre isolé :

```
[02]  TROIS UNIVERS ·············································· [03]
```

Index à gauche, sur-titre, pointillé de conduite, compteur à droite. Le vide
devient une mesure. **L'index est écrit par JavaScript**, à partir de la position
réelle de la section dans la page : déplacer une section dans l'éditeur de thème
renumérote tout, sans intervention.

### 11.3 Les repères de coupe

Classe `.kn-marks`. Quatre angles tracés en filet 1 px, comme sur une planche
d'imprimeur. Permanents sur la bannière, révélés au survol sur les cellules du
champ réglé et sur les cadres d'univers. Sur une photographie ils sont tracés en
`mix-blend-mode: difference` : lisibles sur une image claire comme sur une image
sombre, sans jamais poser d'aplat ni d'ombre.

> **Amendement du 27 août 2026 — repères désactivés.** La demande client du
> 27 août les retire de tout le site. Le réglage « Afficher les repères de
> coupe » (groupe *KINŪ · Signature*) passe à `false` par défaut ; la couche
> reste en place et se rallume d'une case à cocher. Il ne reste donc que quatre
> gestes de signature actifs sur les cinq du §11 — c'est un geste de moins, pas
> une grammaire différente.

### 11.4 La numérotation du champ réglé

Un compteur CSS sur `.kn-grid` : chaque cellule porte son rang `[01]`, `[02]`…
dans sa marge basse. Il se renumérote seul quand « Voir plus » ajoute une page.
Le numéro ne monte jamais sur l'image : le badge garde son angle.

### 11.5 La bande de télémétrie

Snippet `kn-hud`, deux variantes :

| Variante | Où | Contenu |
|---|---|---|
| `fixed` | Bas de fenêtre, **ordinateur uniquement** | Lieu, coordonnées, altitude, heure locale vivante, index de section, jauge de lecture |
| `inline` | Pied de page, **partout** | Quatre champs étiquetés : atelier, latitude, longitude, heure locale |

L'heure est calculée dans le navigateur du visiteur, dans le fuseau réglé en
admin (`Europe/Zurich` par défaut), et s'arrête quand l'onglet passe en arrière-plan.
La bande fixe **adopte la surface qu'elle recouvre** : ivoire sur ivoire, encre sur
encre, ivoire sur forêt. Elle est `pointer-events: none` et `aria-hidden` : elle
n'intercepte aucun clic et n'ajoute aucun bruit pour les lecteurs d'écran.

> **Amendement au §9.** Le §9 interdit « tout bandeau sticky supplémentaire en bas
> d'écran sur desktop ». Cette interdiction visait les barres d'**action** — le
> « Ajouter au panier » collant qui vole la place du contenu. La bande de
> télémétrie est une barre d'**état** : 30 px, aucun bouton, aucun lien, aucun
> événement de pointeur. Elle est autorisée à ce titre, et à ce titre seulement.
> Le pied de page compense sa hauteur par 30 px de marge basse supplémentaire.

### 11.6 Les compteurs de navigation

`Femme [12]` dans le panneau de navigation. Le chiffre dit la profondeur du
rayon — ce que le menu ne dit pas. Il ne remplace jamais le libellé : il le suit,
en exposant, atténué, et suit son entrée quand les autres s'estompent au survol.

### 11.7 Réglages

Groupe **« KINŪ · Signature »** dans les réglages du thème : activation de la
bande, lieu, coordonnées, altitude, fuseau horaire, index, repères de coupe.
Tout est désactivable sans casser la mise en page.

---

## En une phrase

> **Un fond ivoire, une seule couleur — le vert forêt — mais appliquée en aplats pleine largeur qui inondent des pages entières et font basculer le header au scroll : angles vifs, zéro ombre, l'image produit au centre.**
