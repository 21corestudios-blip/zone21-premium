# Storyblok Migration Plan

## Intention

Storyblok devient la source éditoriale progressive de ZONE 21.
Le code reste le socle du rendu, des routes et du commerce.
La migration doit préserver le ton premium, la direction visuelle et les chemins d'images.

## Contenus à migrer maintenant

- Home éditoriale : hero, manifeste, images immersives, sections "Maisons", "À propos" et "Contact".
- Textes institutionnels courts : titres, surtitres, paragraphes, CTA éditoriaux.
- Alt texts éditoriaux liés aux visuels de pages.
- Présentations non transactionnelles des maisons.
- Blocs manifesto, brand intro, imageBlock et paragraph.

## Contenus à migrer plus tard

- Pages `a-propos`, `ecosysteme`, `contact` et `mentions-legales`.
- Introductions éditoriales de `21 Wear`, `21 Core Studios`, `21 Production` et `21 Talents Agency`.
- Storytelling de collections Wear.
- Pages éditoriales de campagnes et lancements.
- Pages artistes, talents et univers de marque, hors prix et achat.

## Contenus à laisser hors Storyblok pour le moment

- Produits commerce et SKU.
- Prix, paniers, checkout, états de paiement.
- Logique Stripe.
- Logique Printify et Gelato.
- Données de fulfilment, stocks, variantes, taxes et livraison.
- Données GED/RDM collaborateurs.

## Dépendances visuelles sensibles

- Les sections home sont full-screen et très dépendantes des classes `object-position`.
- Les slogans conservent leurs retours à la ligne volontaires lorsqu'ils sont présents.
- Les chemins d'images ne doivent pas être réécrits par Storyblok sans validation.
- Les CTA doivent rester sobres.
- Les blocs Storyblok doivent accepter un fallback local pour éviter un écran vide.

## Points de vigilance SEO

- Les metadata Next restent dans les fichiers App Router tant que le modèle SEO Storyblok n'est pas stabilisé.
- Les titres courts restent maîtrisés côté code pour éviter les dérives éditoriales.
- Les alt texts doivent rester sobres, utiles et non descriptifs à l'excès.
- Les contenus draft ne doivent pas fuiter en production.
- Le token public ne doit servir qu'au contenu published.

## Première tranche réalisée

La home est rendue par un renderer Storyblok.
La story locale `homeStoryFallback` reprend les contenus actuels.
Quand Storyblok sera configuré, la story `home` pourra remplacer ce fallback sans changer la route `/`.
