# Scenario Stripe Connect test

Objectif : valider la chaine panier, checkout, webhook, order, transferts par brand et commande fournisseur Wear en mode test.

## Pre-requis

- `APP_ENV=staging`
- `WEAR_ALLOW_ESTIMATED_QUOTES=false`
- `DATABASE_URL` configure et migre
- mappings Wear actifs valides
- cles Stripe test
- comptes connectes Stripe test par brand
- webhook Stripe pointe vers `/api/commerce/webhooks/stripe`
- cles Printify/Gelato test ou sandbox disponibles

## Preflight

```bash
npm run commerce:migrate
npm run commerce:seed:wear-mappings
npm run commerce:validate:wear-mappings
npm run typecheck
npm run lint
npm run build
```

## Creation de checkout

La commande suivante refuse de partir si l'environnement critique est incomplet.

```bash
npm run commerce:staging:scenario
```

Pour creer une vraie Checkout Session test :

```bash
COMMERCE_STAGING_SCENARIO_RUN=true npm run commerce:staging:scenario
```

Conserver les IDs retournes :

- `orderId`
- `checkoutSessionId`
- URL Checkout

## Paiement test

Payer avec une carte Stripe test. Verifier ensuite :

- evenement `checkout.session.completed` recu
- order marquee `paid`
- `paymentIntentId` persiste
- `transferGroup` persiste
- transferts Stripe crees ou erreurs explicites par brand
- commande fournisseur Wear creee si la ligne Wear est validee

## Retry attendu

Rejouer le webhook :

```bash
npm run commerce:webhooks:replay -- --event=evt_xxx --force
```

Resultat attendu :

- pas de deuxieme order
- pas de deuxieme transfert Stripe
- pas de deuxieme commande fournisseur
- attempts observables

## Statut actuel

Le scenario n'a pas ete execute dans ce lot faute de secrets, comptes connectes et mappings provider reels disponibles dans l'environnement local.
