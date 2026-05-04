# Production Readiness Checklist

## Validation code

- `npm run commerce:staging:check`
- `npm run commerce:validate:wear-mappings`
- `npm run commerce:wear:quote-check`
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
- Mappings Wear seedés et validés.
- Commandes persistées après redémarrage.

## Stripe

- Webhook signé.
- Event idempotency persistée.
- Ledger persisté.
- Transferts par brand testés.
- Refunds testés.
- Replay webhook sans double transfert.
- `npm run commerce:webhooks:replay -- --event=evt_xxx --force` validé en staging.

## Fulfillment

- Printify mapping complet.
- Gelato mapping complet.
- Shipping réel testé EU/US.
- Fallback fournisseur testé.
- Tracking et incidents persistés.
- Replay webhook sans double commande fournisseur.
- Refresh statut fournisseur testé via `npm run commerce:provider-orders:refresh`.
- `WEAR_ALLOW_ESTIMATED_QUOTES=false` en production.

## LWS

- Variables configurées.
- Build production OK.
- Start Node OK.
- Logs accessibles.
- Rollback documenté.

## Decision go-live

- Staging avance : possible apres vrais mappings et secrets test.
- Go-live : bloque tant que le scenario e2e reel n'est pas prouve.

## Lot 6

- Environnement staging reel : non prouve dans ce passage local.
- Quotes Wear reelles : non prouvees faute de mappings actifs.
- Checkout Stripe Connect test : non execute.
- Webhook public reel : non execute.
- Transferts brand reels : non executes.
- Provider order Wear reelle : non creee.
