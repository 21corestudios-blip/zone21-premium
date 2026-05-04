# Wear Quote Flow

## Objectif

Le shipping Wear est recalculé côté serveur.
Le front ne décide jamais du fournisseur ni du montant final.

## Flow

1. Lire la ligne panier.
2. Valider produit et variante.
3. Construire les candidats fournisseur selon destination.
4. Lire le mapping persisté.
5. Appeler la quote fournisseur.
6. Sélectionner la quote exploitable.
7. Retourner provider, raison, shipping, total et raw quote.

## Gelato

API utilisée :

```txt
POST https://order.gelatoapis.com/v4/orders:quote
```

Le résultat fournit des shipment methods et prix.
Le `shipmentMethodUid` peut être utilisé lors de la création de commande.

## Printify

API préparée :

```txt
POST /shops/{shop_id}/orders/shipping.json
```

Selon disponibilité API/compte, cette route doit être validée en staging.
Si Printify ne fournit pas une quote exploitable pour un produit, la ligne passe au fallback provider.

## Estimation locale

`WEAR_ALLOW_ESTIMATED_QUOTES=true` autorise une estimation de secours en local.
Cette variable doit rester `false` en production.

## Erreurs métier

- `WEAR_PRODUCT_NOT_FOUND`
- `WEAR_VARIANT_INVALID`
- `WEAR_VARIANT_UNAVAILABLE`
- `WEAR_REAL_QUOTE_UNAVAILABLE`
- `mapping_missing`
- `gelato_quote_empty`
- `printify_quote_empty`
