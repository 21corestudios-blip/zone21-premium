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

## Seed

Le fichier `db/seeds/wear-provider-mappings.json` contient des placeholders inactifs.
Avant production :

1. remplacer les ids `TODO_*` ;
2. ajouter les fichiers/imprimés Gelato dans `metadata.fileUrl` ou `GELATO_DEFAULT_FILE_URL` ;
3. activer les mappings validés ;
4. tester quote et commande fournisseur sur une commande de recette.
