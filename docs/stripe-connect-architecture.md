# Stripe Connect Architecture

## Choix d'architecture

ZONE 21 fonctionne comme plateforme.
Chaque brand dispose d'un compte connecté Stripe.

Modèle retenu :

- checkout unique côté plateforme ;
- PaymentIntent rattaché à un `transfer_group` ;
- ledger interne par ligne et par brand ;
- transferts par brand après paiement confirmé.

## Pourquoi ce modèle

Un panier global peut contenir plusieurs brands.
Un paiement unique ne peut pas être un simple destination charge vers une seule brand.
Le ledger interne permet de calculer les parts nettes avant transfert.

## Comptes connectés

Variables :

- `STRIPE_CONNECT_ACCOUNT_WEAR`
- `STRIPE_CONNECT_ACCOUNT_CORE`
- `STRIPE_CONNECT_ACCOUNT_PRODUCTION`
- `STRIPE_CONNECT_ACCOUNT_TALENTS`

Les comptes doivent être créés avec l'approche Connect Accounts v2.
Les responsabilités, dashboard access et capabilities doivent être explicitement définis.

## Ledger

Chaque ligne stocke :

- brand ;
- gross amount ;
- platform fee ;
- net amount ;
- transfer status ;
- refund status ;
- fulfillment provider.

## Webhook

Endpoint :

```txt
/api/commerce/webhooks/stripe
```

Il vérifie la signature Stripe.
Il marque la commande comme payée sur `checkout.session.completed`.

## À durcir avant production

- persistance base de données ;
- idempotence par event id ;
- transferts réels par brand ;
- remboursements ;
- retries ;
- monitoring.

## Validation Lot 6 attendue

Le scénario Stripe Connect test est considéré prouvé uniquement avec :

- `checkoutSessionId` ;
- `paymentIntentId` ;
- `transferGroup` ;
- `stripeTransferId` par brand ;
- destination account par brand ;
- montant brut, frais plateforme et net amount persistés ;
- replay webhook sans nouveau transfert.

Statut actuel : non prouvé.

Raison : comptes connectés test, webhook HTTPS public et vrais mappings Wear non disponibles dans l'environnement de validation local.
