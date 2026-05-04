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
npm run typecheck
npm run lint
npm run build
npm run start
```

## Variables

Toutes les variables doivent être configurées dans LWS/cPanel.
Ne pas publier `.env.local`.

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
