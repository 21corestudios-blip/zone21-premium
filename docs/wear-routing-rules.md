# Wear Routing Rules

## Objectif

21 Wear doit pouvoir router chaque ligne vers Printify ou Gelato côté serveur.
Le front ne voit jamais la logique fournisseur.

## Priorités

Destination US :

- priorité Printify US ;
- fallback Gelato.

Destination EU :

- priorité Gelato EU ;
- fallback Printify.

Autres destinations :

- priorité Gelato ;
- fallback Printify si disponible et rentable.

## Validation serveur

Avant paiement, le backend doit recalculer :

- produit interne ;
- variante ;
- SKU ;
- fournisseur retenu ;
- disponibilité fournisseur ;
- shipping réel ;
- prix final.

## Cas d'erreur

- variante invalide ;
- destination non desservie ;
- fournisseur indisponible ;
- shipping trop élevé ;
- mapping fournisseur manquant ;
- prix fournisseur incohérent.

## Statut du lot 3

Le routeur et le service de quote sont prêts.
Les appels fournisseurs réels restent conditionnés aux tokens et aux mappings source.
