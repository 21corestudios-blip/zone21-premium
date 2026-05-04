# Environment Matrix

## Principe

Les exemples d'environnement doivent être publiables.
Aucun chemin machine local ne doit vivre dans `.env.example`.
Les secrets restent dans `.env.local`, LWS/cPanel ou le gestionnaire de secrets de production.

## Local

Variables minimales :

- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `APP_ENV=local`
- `APP_SECRET`
- `STORYBLOK_PUBLIC_TOKEN`
- `STORYBLOK_PREVIEW_TOKEN`
- `STORYBLOK_PREVIEW_SECRET`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

Variables optionnelles :

- `PRINTIFY_API_TOKEN`
- `PRINTIFY_SHOP_ID`
- `GELATO_API_KEY`
- `GELATO_STORE_ID`
- `DATABASE_URL`
- `COMMERCE_FILE_DB_PATH`
- `WEAR_ALLOW_ESTIMATED_QUOTES=true` uniquement si les mappings fournisseurs ne sont pas encore activés.

## Staging

Objectif : valider Storyblok draft/published, checkout test Stripe, webhooks test et routing fournisseur Wear.

Variables :

- `APP_ENV=staging`
- `NEXT_PUBLIC_SITE_URL=https://staging.example.com`
- tokens Storyblok staging ou space principal en preview.
- clés Stripe test.
- comptes Connect test par brand.
- tokens Printify/Gelato sandbox si disponibles.
- `DATABASE_URL` staging.
- `WEAR_ALLOW_ESTIMATED_QUOTES=false` pour valider les quotes réelles.

## Production

Objectif : servir les contenus published, paiements live, webhooks signés, commandes persistées.

Variables :

- `APP_ENV=production`
- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://zone21.com`
- `STORYBLOK_PUBLIC_TOKEN`
- `STORYBLOK_PREVIEW_TOKEN`
- `STORYBLOK_PREVIEW_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_CONNECT_ACCOUNT_WEAR`
- `STRIPE_CONNECT_ACCOUNT_CORE`
- `STRIPE_CONNECT_ACCOUNT_PRODUCTION`
- `STRIPE_CONNECT_ACCOUNT_TALENTS`
- `PRINTIFY_API_TOKEN`
- `PRINTIFY_SHOP_ID`
- `GELATO_API_KEY`
- `GELATO_STORE_ID`
- `DATABASE_URL`
- `WEAR_ALLOW_ESTIMATED_QUOTES=false`
- `GELATO_DEFAULT_FILE_URL`

## LWS / cPanel Node

LWS doit exposer les variables dans l'interface Node.js, pas dans le dépôt.
Le build attendu reste :

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run start
```

Points sensibles :

- `PORT` doit venir de LWS si imposé.
- les webhooks Stripe doivent viser `/api/commerce/webhooks/stripe`.
- les tokens fournisseurs restent backend-only.
- `.env.local` ne doit jamais être publié.
- `DATABASE_URL` doit pointer vers MySQL/MariaDB LWS.
