# Storyblok Content Model

## Principes

Le modèle reste minimal.
Il sert le storytelling, pas le commerce.
Chaque bloc doit produire des phrases courtes, denses et premium.

## page

Rôle : racine d'une story.

Champs :

- `body` : blocks, requis.

Contraintes :

- Utiliser une story `home` pour la route `/`.
- Ne pas stocker la logique de route dans le contenu.

## section

Rôle : groupe sémantique de blocs.

Champs :

- `body` : blocks, requis.
- `sectionId` : text, optionnel.
- `ariaLabel` : text, optionnel.
- `className` : text, optionnel, réservé aux intégrateurs.

Contraintes :

- Garder les ids existants si une navigation les utilise.

## hero

Rôle : introduction visuelle d'une page ou d'une maison.

Champs :

- `title` : text, requis.
- `imageDesktop` : asset, requis pour les pages visuelles.
- `imageMobile` : asset, optionnel.
- `imageAlt` / `imageDesktopAlt` / `imageMobileAlt` : text, optionnel.
- `variant` : option `home`, `brand`, `editorial`.
- `priority` : boolean, optionnel.

Contraintes :

- Ne pas transformer les slogans en titres SEO lourds.
- Garder les chemins d'images validés.

## paragraph

Rôle : texte éditorial simple.

Champs :

- `eyebrow` : text, optionnel.
- `title` : text, optionnel.
- `text` : textarea, optionnel.
- `paragraphs` : list text, optionnel.
- `theme` : option `light` ou `dark`.

Contraintes :

- Une idée par phrase.
- Pas de jargon marketing.

## richText

Rôle : contenu long contrôlé.

Champs :

- `body` : richtext, requis.

Contraintes :

- À réserver aux pages légales ou éditoriales longues.
- Garder les titres sobres.

## imageBlock

Rôle : image immersive ou image contenue.

Champs :

- `image` : asset, optionnel.
- `src` : text, optionnel pour conserver les chemins actuels.
- `alt` : text, optionnel.
- `layout` : option `immersive` ou `contained`.
- `imageClassName` : text, optionnel.
- `overlayClassName` : text, optionnel.
- `backgroundClassName` : text, optionnel.

Contraintes :

- Ne pas modifier les chemins d'images sans validation.
- Garder les images décoratives avec `alt` vide.

## gallery

Rôle : série de visuels éditoriaux.

Champs :

- `images` : assets, requis.
- `columns` : option 2, 3 ou 4.

Contraintes :

- Pas de galerie commerce comme source produit.

## audioBlock

Rôle : aperçu sonore éditorial.

Champs :

- `title` : text, optionnel.
- `audio` : asset, optionnel.
- `src` : text, optionnel.
- `caption` : text, optionnel.

Contraintes :

- Sert la narration musicale.
- Ne remplace pas un backend de distribution.

## cta

Rôle : lien éditorial.

Champs :

- `label` : text, requis.
- `href` : text, optionnel.
- `link` : link, optionnel.

Contraintes :

- CTA sobre.
- Pas de promesse commerciale agressive.

## manifestoBlock

Rôle : section manifeste avec image.

Champs :

- `eyebrow` : text.
- `title` : text.
- `paragraphs` : list text.
- `image` ou `imageSrc`.
- `imageAlt`.
- `imagePosition` : `left` ou `right`.
- `theme` : `light` ou `dark`.
- `ctaHref`, `ctaLabel` : optionnels.
- `imageClassName`, `sectionClassName` : optionnels.

Contraintes :

- Bloc prioritaire pour la home et les pages institutionnelles.

## brandIntro

Rôle : introduction éditoriale d'une maison ou d'une section.

Champs :

- mêmes champs que `manifestoBlock`.

Contraintes :

- Présenter l'univers.
- Ne pas stocker prix, SKU ou règles d'achat.

## productEditorial

Rôle : storytelling produit ou collection.

Champs :

- mêmes champs que `brandIntro`.
- `productReference` : text, optionnel.

Contraintes :

- Peut enrichir une fiche produit.
- Ne devient jamais la source de vérité commerce.

## legalBlock

Rôle : contenu légal structuré.

Champs :

- `title` : text.
- `paragraphs` : list text.

Contraintes :

- À migrer après validation juridique.

## Compatibilité roadmap

- LWS : compatible avec rendu Next et variables d'environnement.
- Stripe Connect : hors Storyblok.
- Panier global : hors Storyblok.
- Printify/Gelato : backend-only.
- Storyblok : contenu, storytelling, visuels et SEO éditorial.
