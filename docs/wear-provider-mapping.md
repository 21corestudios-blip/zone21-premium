# Wear Provider Mapping

## Rôle

Les mappings Wear relient le catalogue interne aux fournisseurs.
Ils sont la source opérationnelle pour quotes et fulfillment.

## Tables

- `provider_product_mappings`
- `provider_variant_mappings`

## Champs clés

Produit :

- `brand`
- `internal_product_id`
- `provider`
- `provider_product_id`
- `provider_shop_id`
- `provider_region`
- `currency`
- `active`
- `metadata_json`

Variante :

- `internal_product_id`
- `internal_variant_id`
- `provider`
- `provider_product_id`
- `provider_variant_id`
- `sku`
- `active`

## Régions

- `US` : priorité Printify.
- `EU` : priorité Gelato.

## Seed et validation

Le fichier `db/seeds/wear-provider-mappings.json` contient des placeholders inactifs.
Ils ne doivent jamais etre actives tels quels.

Commandes :

```bash
npm run commerce:validate:wear-mappings
npm run commerce:seed:wear-mappings
```

Avant staging avance :

1. remplacer les ids `TODO_*` ;
2. ajouter les fichiers/imprimés Gelato dans `metadata.fileUrl` ou `GELATO_DEFAULT_FILE_URL` ;
3. activer les mappings validés ;
4. tester quote et commande fournisseur sur une commande de recette.

## Produits testables

Statut actuel du repo :

- aucun mapping actif reel n'est commite ;
- `classic-tee-01` possede une structure de mapping inactive pour Gelato EU et Printify US ;
- la validation echoue volontairement tant qu'aucun mapping actif reel n'est renseigne.

## Champs par produit/variant

Pour chaque mapping actif, documenter :

- internal product id ;
- internal variant id ;
- provider ;
- provider product id ;
- provider variant id ;
- provider shop/store id si requis ;
- region prioritaire ;
- fallback provider ;
- statut actif/inactif.

Un mapping actif contenant `TODO`, `PLACEHOLDER`, `REPLACE` ou `XXX` est bloque par le script de validation.
