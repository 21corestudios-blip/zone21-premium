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

## Statut d'exécution Lot 6

Non exécuté en conditions réelles dans ce passage local.

Raison : les donnees operationnelles suivantes ne sont pas presentes dans le repo ni dans l'environnement :

- mappings actifs Printify/Gelato
- cles provider exploitables
- comptes connectes Stripe test valides
- endpoint LWS/staging expose en HTTPS
- secret webhook Stripe staging

## Vérifications exécutées Lot 6

- preflight staging ajouté via `npm run commerce:staging:check` ;
- validation mappings existante conservée via `npm run commerce:validate:wear-mappings` ;
- vérification quotes réelles ajoutée via `npm run commerce:wear:quote-check` ;
- scénario checkout staging conservé via `npm run commerce:staging:scenario` ;
- replay webhook conservé via `npm run commerce:webhooks:replay` ;
- refresh provider order conservé via `npm run commerce:provider-orders:refresh`.

Résultats réels :

- `commerce:staging:check` : bloqué, URL locale et variables critiques absentes.
- `commerce:validate:wear-mappings` : bloqué, aucun mapping actif.
- `commerce:wear:quote-check` : bloqué, mappings manquants EU/US.
- `commerce:staging:scenario` : bloqué, variables critiques absentes.

## IDs réels

Aucun ID réel n'a été généré dans ce lot :

- aucun `checkoutSessionId` réel ;
- aucun `paymentIntentId` réel ;
- aucun `transferId` réel ;
- aucun `providerOrderId` réel.

Cette absence est un blocker go-live.

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
