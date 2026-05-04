# Commerce Product Schema

## Rôle

Le produit commerce unifié sert de contrat backend.
Il ne remplace pas Storyblok.
Il sépare les données de vente, de fulfillment et d'éditorial.

## Champs clés

- `id` : identifiant interne stable.
- `slug` : slug d'affichage.
- `brand` : `wear`, `core`, `production`, `talents`.
- `source` : `internal`, `printify`, `gelato`.
- `sourceProductId` : identifiant fournisseur si applicable.
- `sourceVariantId` : identifiant variante fournisseur si applicable.
- `sku` : SKU interne ou fournisseur.
- `title` : nom commerce.
- `descriptionShort` : résumé commerce.
- `media` : visuels utiles à l'achat.
- `editorialContentRef` : référence vers Storyblok ou route éditoriale.
- `displayPrice` : prix affiché.
- `checkoutPrice` : prix réellement envoyé au checkout.
- `currency` : devise.
- `availability` : disponibilité commerce.
- `shippingProfile` : profil logistique.
- `fulfillmentProvider` : `internal`, `digital`, `service`, `printify`, `gelato`.
- `sellable` : booléen serveur.
- `metadata` : détails non critiques.

## Règle majeure

Storyblok peut enrichir `editorialContentRef`.
Storyblok ne décide jamais du prix, du stock, du SKU ou du fournisseur.
