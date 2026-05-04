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

## Stripe

- Webhook signé.
- Event idempotency à persister.
- Ledger persisté.
- Transferts par brand testés.
- Refunds testés.

## Fulfillment

- Printify mapping complet.
- Gelato mapping complet.
- Shipping réel testé EU/US.
- Fallback fournisseur testé.
- Tracking et incidents persistés.

## LWS

- Variables configurées.
- Build production OK.
- Start Node OK.
- Logs accessibles.
- Rollback documenté.
