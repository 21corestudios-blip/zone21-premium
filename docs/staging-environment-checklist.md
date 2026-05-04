# Staging environment checklist

## Objectif

Prouver que l'environnement staging est joignable, securise et capable d'executer une recette commerce reelle.

## Commande de preflight

```bash
npm run commerce:staging:check
```

Pour verifier aussi les routes publiques :

```bash
COMMERCE_STAGING_PUBLIC_CHECK=true npm run commerce:staging:check
```

## Variables bloquantes

- `DATABASE_URL`
- `APP_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `STORYBLOK_PUBLIC_TOKEN`
- `STORYBLOK_PREVIEW_TOKEN`
- `STORYBLOK_PREVIEW_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_CONNECT_ACCOUNT_WEAR`
- `PRINTIFY_API_TOKEN`
- `PRINTIFY_SHOP_ID`
- `GELATO_API_KEY`
- `GELATO_STORE_ID`

Variables multi-brand a valider avant recette complete :

- `STRIPE_CONNECT_ACCOUNT_CORE`
- `STRIPE_CONNECT_ACCOUNT_PRODUCTION`
- `STRIPE_CONNECT_ACCOUNT_TALENTS`

## Garde-fous

- `WEAR_ALLOW_ESTIMATED_QUOTES=false` en staging.
- `NEXT_PUBLIC_SITE_URL` doit etre une URL publique HTTPS.
- Aucun placeholder `xxx`, `TODO`, `PLACEHOLDER`, `REPLACE` ou `change-me`.
- Le webhook Stripe test doit pointer vers `/api/commerce/webhooks/stripe`.

## Routes critiques

- `/`
- `/a-propos`
- `/ecosysteme`
- `/contact`
- `/api/commerce/checkout`
- `/api/commerce/webhooks/stripe`

## Statut Lot 6 local

Validation reelle staging : non validee.

Commande exécutée :

```bash
npm run commerce:staging:check
```

Résultat : `blocked`.

Raisons observées :

- `APP_ENV` non renseigné dans l'environnement de validation.
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, donc aucun webhook public Stripe ne peut être validé.
- `DATABASE_URL` absent.
- `APP_SECRET` absent.
- tokens Storyblok staging absents.
- `STRIPE_CONNECT_ACCOUNT_WEAR` absent.
- comptes Connect Core/Production/Talents absents.
- `PRINTIFY_API_TOKEN` absent.
- `PRINTIFY_SHOP_ID` absent.
- `GELATO_STORE_ID` absent.
- `GELATO_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` et `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` sont détectés comme configurés, sans validation fonctionnelle complète.
- les mappings Wear actifs restent absents.
- aucun endpoint HTTPS LWS/staging n'a été fourni pour test public.

## Decision

Le staging est pret a etre teste avec les scripts, mais il n'est pas encore prouve.
