# Provider order status flow

Le suivi fournisseur Wear reste backend-only. Storyblok ne porte aucun statut de commande.

## Commande de refresh

```bash
npm run commerce:provider-orders:refresh
```

Filtres utiles :

```bash
npm run commerce:provider-orders:refresh -- --provider=gelato --status=submitted
npm run commerce:provider-orders:refresh -- --provider=printify --limit=50
```

## Etats normalises

- `submitted` : commande envoyee au fournisseur.
- `accepted` : commande acceptee ou en attente fournisseur.
- `in_production` : production imprimeur active.
- `shipped` : expedition detectee.
- `failed` : erreur fournisseur, rejet ou refresh impossible.
- `skipped` : aucune creation fournisseur attendue.

## Donnees persistees

- `provider_orders.status`
- `provider_orders.tracking_json`
- `provider_orders.raw_response_json`
- `provider_order_events`
- `fulfillment_attempts`

## Regles de support

Une commande fournisseur sans `provider_order_id` est bloquee. Le refresh trace alors une tentative en erreur.

Un refresh repete ne doit pas creer de nouvelle commande fournisseur. Il lit uniquement l'ordre existant chez Printify ou Gelato.

Le tracking est stocke tel que retourne par le provider. Il sera normalise plus finement apres validation staging avec des reponses reelles.
