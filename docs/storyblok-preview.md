# Storyblok Preview

## Variables nécessaires

```env
STORYBLOK_PUBLIC_TOKEN=
STORYBLOK_PREVIEW_TOKEN=
STORYBLOK_PREVIEW_SECRET=
STORYBLOK_API_BASE_URL=https://api.storyblok.com
```

`STORYBLOK_PUBLIC_TOKEN` sert au contenu published.
`STORYBLOK_PREVIEW_TOKEN` sert au contenu draft.
`STORYBLOK_PREVIEW_SECRET` protège l'entrée en preview.

## Entrée en preview

Route locale :

```txt
/api/storyblok/preview?secret=SECRET&slug=home
```

Effet :

- vérifie le secret ;
- active le draft mode Next.js ;
- redirige vers `/` pour `home` ;
- charge la version `draft` si Storyblok est configuré.

## Sortie de preview

Route :

```txt
/api/storyblok/exit-preview?slug=/
```

Un petit bandeau apparaît en draft mode pour quitter la preview.

## Comportement sans Storyblok

Si aucun token n'est configuré, la page utilise le fallback local.
Le build reste stable.
Le rendu principal ne dépend pas du CMS.

## Sécurité

- Ne jamais exposer `STORYBLOK_PREVIEW_SECRET` côté client.
- Garder un token published séparé du token preview.
- Ne pas utiliser le draft mode pour servir du contenu public.
- Ne pas brancher le commerce sur le mode preview.
