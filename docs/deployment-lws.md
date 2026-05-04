# Deployment LWS

## Cible recommandée

Option A : app Next Node-compatible sur LWS.

Justification :

- le projet utilise App Router ;
- Storyblok et les routes API restent dans Next ;
- Stripe webhooks et backend commerce peuvent vivre dans `/api`;
- moins de fragmentation pour le lot 3.

Option B, frontend + backend séparés, reste possible plus tard si LWS limite les webhooks ou les processus Node.

## Build

```bash
npm install
npm run commerce:migrate
npm run commerce:seed:wear-mappings
npm run commerce:validate:wear-mappings
npm run typecheck
npm run lint
npm run build
npm run start
```

Ordre recommandé :

1. configurer les variables LWS ;
2. lancer `npm install` ;
3. lancer `npm run commerce:migrate` ;
4. lancer `npm run commerce:seed:wear-mappings` ;
5. lancer `npm run commerce:validate:wear-mappings` ;
6. lancer `npm run typecheck` ;
7. lancer `npm run lint` ;
8. lancer `npm run build` ;
9. démarrer l'app Node avec `npm run start`.

## Variables

Toutes les variables doivent être configurées dans LWS/cPanel.
Ne pas publier `.env.local`.

Variables bloquantes production :

- `DATABASE_URL`
- `APP_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `STORYBLOK_PUBLIC_TOKEN`
- `STORYBLOK_PREVIEW_TOKEN`
- `STORYBLOK_PREVIEW_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- comptes `STRIPE_CONNECT_ACCOUNT_*`
- `PRINTIFY_API_TOKEN`
- `PRINTIFY_SHOP_ID`
- `GELATO_API_KEY`
- `GELATO_DEFAULT_FILE_URL`
- `WEAR_ALLOW_ESTIMATED_QUOTES=false`
- `COMMERCE_ADMIN_REPLAY_ENABLED=false` en production, sauf fenetre de maintenance controlee

## Webhooks

Stripe :

```txt
https://zone21.com/api/commerce/webhooks/stripe
```

Fournisseurs :

- à ajouter uniquement si Printify/Gelato exigent des webhooks utiles ;
- toujours vérifier signature ou secret partagé ;
- stocker les events pour retries.

## Logs

Surveiller :

- erreurs build ;
- erreurs webhooks ;
- erreurs checkout ;
- erreurs fournisseurs ;
- timeouts API.

## Rollback

Conserver le build précédent.
Garder le fallback local Storyblok.
Désactiver temporairement le checkout global si le ledger ou les webhooks échouent.

## Recette exécutable

1. Ouvrir `/` et vérifier la home Storyblok/fallback.
2. Appeler `/api/storyblok/preview` sans secret et vérifier `401`.
3. Valider un panier via `/api/commerce/cart/validate`.
4. Creer une Checkout Session via `COMMERCE_STAGING_SCENARIO_RUN=true npm run commerce:staging:scenario`.
5. Payer avec une carte Stripe test.
6. Vérifier `webhook_events`.
7. Vérifier `orders` et `order_items`.
8. Vérifier `stripe_transfers`.
9. Vérifier `provider_orders` pour les lignes Wear.
10. Rejouer le meme webhook avec `npm run commerce:webhooks:replay -- --event=evt_xxx --force`.
11. Lancer `npm run commerce:provider-orders:refresh`.
12. Verifier qu'aucun doublon order, transfer ou provider order n'est cree.

## Validation reelle LWS

Statut actuel : non execute sur l'instance cible dans ce lot local.

Blockers :

- URL HTTPS LWS/staging a confirmer ;
- variables cPanel/Node a renseigner ;
- webhook Stripe test a pointer vers l'URL publique ;
- mappings Wear actifs requis avant scenario complet.
