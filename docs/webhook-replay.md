# Webhook replay controle

Le replay webhook est un outil d'exploitation local/staging. Il ne remplace pas la signature Stripe en entree. Il rejoue uniquement un evenement deja persiste dans `webhook_events`.

## Commandes

Lister les derniers evenements Stripe :

```bash
npm run commerce:webhooks:replay
```

Lister les evenements en erreur :

```bash
npm run commerce:webhooks:replay -- --status=failed
```

Rejouer un evenement precis :

```bash
npm run commerce:webhooks:replay -- --event=evt_xxx
```

Forcer le replay d'un evenement deja traite :

```bash
npm run commerce:webhooks:replay -- --event=evt_xxx --force
```

## Garde-fous

- Le replay est bloque en production sauf si `COMMERCE_ADMIN_REPLAY_ENABLED=true`.
- Le replay repasse par les handlers idempotents.
- Un replay ne doit pas creer deux transferts Stripe.
- Un replay ne doit pas creer deux commandes fournisseur Wear.
- Les evenements non supportes echouent explicitement.

## Recette attendue

1. Executer un checkout Stripe test.
2. Verifier que `checkout.session.completed` est persiste.
3. Rejouer l'evenement avec `--force`.
4. Verifier que les transferts et commandes fournisseur gardent les memes cles d'idempotence.
5. Verifier que les compteurs d'attempts sont observables.
