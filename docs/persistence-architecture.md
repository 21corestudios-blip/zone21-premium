# Persistence Architecture

## Choix retenu

La cible production est MySQL/MariaDB.

Raison :

- LWS/cPanel fournit généralement MySQL ou MariaDB.
- Le modèle relationnel convient aux commandes, lignes, ledger, webhooks et tentatives.
- Les contraintes uniques permettent une idempotence robuste.
- Le runtime Next Node peut utiliser `mysql2` côté serveur.

## Environnements

Local :

- `DATABASE_URL` optionnel.
- Sans `DATABASE_URL`, le repository utilise `.data/commerce-db.json`.
- Ce fallback est durable, mais réservé au dev.

Staging :

- `DATABASE_URL` obligatoire.
- Base MySQL/MariaDB dédiée.
- Webhooks Stripe test et fournisseurs sandbox.

Production :

- `DATABASE_URL` obligatoire.
- Le fallback fichier est refusé sous `NODE_ENV=production`.

## Schéma

Migration :

```txt
db/migrations/001_commerce_core.sql
```

Tables :

- `orders`
- `order_items`
- `ledger_entries`
- `webhook_events`
- `stripe_transfers`
- `provider_product_mappings`
- `provider_variant_mappings`
- `provider_orders`
- `provider_order_events`
- `fulfillment_attempts`

## Accès applicatif

Le code métier passe par :

```txt
src/lib/commerce/persistence/repository.ts
```

Le repository choisit :

- MySQL si `DATABASE_URL` existe ;
- fichier local uniquement hors production.

## Commande de migration

```bash
npm run commerce:migrate
```

## Seed mappings Wear

Seed local :

```txt
db/seeds/wear-provider-mappings.json
```

Les ids fournisseurs sont volontairement inactifs tant qu'ils n'ont pas été remplacés par des ids Printify/Gelato réels.
