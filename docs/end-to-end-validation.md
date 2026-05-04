# Validation end-to-end Lot 5

## Perimetre vise

- au moins une ligne Wear
- au moins une ligne autre brand
- checkout Stripe test
- webhook Stripe signe
- order persistee
- transfert Stripe Connect par brand
- commande fournisseur Wear
- refresh statut fournisseur

## Statut d'execution

Non execute en conditions reelles dans ce passage local.

Raison : les donnees operationnelles suivantes ne sont pas presentes dans le repo ni dans l'environnement :

- mappings actifs Printify/Gelato
- cles provider exploitables
- comptes connectes Stripe test valides
- endpoint LWS/staging expose en HTTPS
- secret webhook Stripe staging

## Ce qui est validable maintenant

- build Next.js
- typecheck
- lint
- absence de catch-all Storyblok conflictuel
- presence des outils de seed/validation mapping
- presence du replay webhook controle
- presence du refresh fournisseur
- blocage des estimated quotes hors local

## Recette a executer en staging

1. Renseigner les vrais mappings dans `db/seeds/wear-provider-mappings.json`.
2. Lancer `npm run commerce:validate:wear-mappings`.
3. Lancer `npm run commerce:migrate`.
4. Lancer `npm run commerce:seed:wear-mappings`.
5. Deployer sur LWS/staging.
6. Configurer le webhook Stripe test vers `/api/commerce/webhooks/stripe`.
7. Lancer `COMMERCE_STAGING_SCENARIO_RUN=true npm run commerce:staging:scenario`.
8. Payer la Checkout Session Stripe test.
9. Rejouer le webhook avec `npm run commerce:webhooks:replay -- --event=evt_xxx --force`.
10. Lancer `npm run commerce:provider-orders:refresh`.

## Preuves attendues

- `checkoutSessionId`
- `paymentIntentId`
- `transferGroup`
- `stripeTransferId` par brand
- `providerOrderId`
- entree `webhook_events` processed
- entree `provider_order_events`
- tracking provider si disponible
