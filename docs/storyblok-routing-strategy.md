# Storyblok Routing Strategy

## Objectif

Étendre Storyblok aux pages éditoriales sans capturer les routes commerce, API ou internes.

## Stratégie retenue

Pas de catch-all global.
Le routing Storyblok passe par une table explicite :

```ts
{
  "/": "home",
  "/a-propos": "a-propos",
  "/ecosysteme": "ecosysteme",
  "/contact": "contact",
  "/mentions-legales": "mentions-legales"
}
```

Cette table vit dans `src/lib/storyblok/routes.ts`.

## Routes exclues

Storyblok ne doit jamais intercepter :

- `/api/*`
- `/wear/*`
- `/prod/*`
- `/core-studios/*`
- `/talents-agency/*`
- `/collaborateurs/*`
- futures routes backend commerce.

## Migration progressive

1. Home : déjà migrée avec fallback local.
2. `a-propos` : migrer hero, origines, valeurs.
3. `ecosysteme` : migrer hero et grille éditoriale.
4. `contact` : migrer textes et blocs institutionnels.
5. `mentions-legales` : migrer après validation juridique.

## Metadata

Les metadata restent dans les pages Next jusqu'à stabilisation du modèle SEO Storyblok.
Le CMS pourra ensuite porter :

- `seoTitle`
- `seoDescription`
- `ogImage`
- `canonical`

La couche Next restera responsable de la validation finale.
