# Production Readiness Checklist

## Validation code

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Storyblok

- Home published vérifiée.
- Preview protégée par secret.
- Pas de catch-all global.
- Routes commerce non interceptées.

## Commerce

- Catalogue unifié validé.
- Panier global validé côté serveur.
- Prix checkout recalculés serveur.
- Produits Wear routés serveur.
- Aucun prix ou stock contrôlé par Storyblok.
- `DATABASE_URL` configurée.
- Migrations commerce exécutées.
- Commandes persistées après redémarrage.

## Stripe

- Webhook signé.
- Event idempotency persistée.
- Ledger persisté.
- Transferts par brand testés.
- Refunds testés.
- Replay webhook sans double transfert.

## Fulfillment

- Printify mapping complet.
- Gelato mapping complet.
- Shipping réel testé EU/US.
- Fallback fournisseur testé.
- Tracking et incidents persistés.
- Replay webhook sans double commande fournisseur.
- `WEAR_ALLOW_ESTIMATED_QUOTES=false` en production.

## LWS

- Variables configurées.
- Build production OK.
- Start Node OK.
- Logs accessibles.
- Rollback documenté.
