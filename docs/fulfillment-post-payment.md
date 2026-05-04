# Fulfillment Post Payment

## Déclencheur

Le seul déclencheur fiable est le webhook Stripe.
La page success ne crée jamais de commande fournisseur.

## Pipeline

1. Recevoir `checkout.session.completed`.
2. Persister l'événement webhook.
3. Marquer l'événement `processing`.
4. Retrouver la commande par `order_id` ou `checkout_session_id`.
5. Marquer la commande payée.
6. Créer les transferts Stripe par brand.
7. Créer les commandes fournisseur Wear.
8. Marquer l'événement `processed`.

## Provider Orders

Chaque commande fournisseur est persistée dans `provider_orders`.

Champs suivis :

- provider ;
- provider order id ;
- statut ;
- raw response ;
- idempotency key.

## Attempts

Chaque tentative est persistée dans `fulfillment_attempts`.
Un retry réutilise la même clé stable.

## Tracking

Le tracking sera alimenté par :

- polling fournisseur ;
- webhook fournisseur si disponible ;
- outil admin de refresh.

Commande de refresh :

```bash
npm run commerce:provider-orders:refresh
```

## Garde-fous

- Pas de double commande fournisseur.
- Pas de commande fournisseur si mapping absent.
- Pas de commande fournisseur si adresse shipping absente.
- Pas de déclenchement côté front.

## Validation Lot 6

Statut actuel : provider order réelle non créée.

Raison : aucun paiement Stripe test réel, aucun webhook public réel et aucun mapping Wear actif réel n'ont été validés dans l'environnement disponible.

Preuve attendue avant go-live :

- `providerOrderId` Printify ou Gelato ;
- raw response persistée ;
- refresh statut fournisseur exécuté ;
- replay webhook sans duplication de provider order.
