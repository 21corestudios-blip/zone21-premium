# Storyblok vs Commerce Boundaries

## Ce qui ira dans Storyblok

- Pages éditoriales.
- Heroes et manifestos.
- Présentations de maisons.
- Storytelling de collections.
- Visuels et alt texts éditoriaux.
- Blocs de lancement.
- Rich text institutionnel.
- Narration produit non transactionnelle.

## Ce qui restera backend-only

- Produits comme source de vérité commerce.
- SKU et variantes.
- Prix.
- Taxes.
- Stocks.
- Paniers.
- Checkout.
- Paiements.
- Webhooks.
- Comptes Stripe Connect.
- Fulfillment Printify et Gelato.
- Commandes et statuts logistiques.

## Raccords futurs

### LWS

LWS devra recevoir les variables Storyblok et les tokens par environnement.
Le build doit rester valide sans CMS disponible.

### Stripe Connect

Stripe Connect sera branché côté backend.
Storyblok pourra afficher des contenus de marque, mais ne décidera pas du marchand, du compte connecté ou du split de paiement.

### Panier global

Le panier global devra agréger les marques côté application.
Storyblok pourra enrichir les pages, pas gérer les lignes panier.

### Wear fulfillment

Printify et Gelato devront alimenter le backend Wear.
Storyblok servira les textes de collection, campagnes, visuels éditoriaux et narrations.

## Règle de séparation

Storyblok raconte.
Le backend vend, facture, livre et synchronise.
