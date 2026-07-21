# Audit nettoyage site - 2026-07-21

## Sauvegarde

- Branche de sauvegarde poussee : `backup/current-site-20260721`.
- Commit de sauvegarde : `bb02ad8 chore: backup current site state`.
- Branche de nettoyage : `cleanup/site-deep-clean`.

## Constat initial

Le site contenait plusieurs sources de verite concurrentes pour la page d'accueil :

- page active : `src/app/(zone21)/page.tsx` avec rendu Storyblok ;
- fallback local : `src/data/storyblok/home.story.ts` ;
- ancienne home locale non utilisee : `src/app/(zone21)/_components/home/*`.

Les chemins d'images de plusieurs sections existaient a la fois dans le fallback Storyblok et dans les anciens composants `ZoneXX`.

## Nettoyage effectue

- Centralisation des images et textes de home dans `src/data/home.data.ts`.
- Reconnexion du fallback Storyblok home a `homeData`.
- Deplacement du composant partage `SplitShowcaseSection` vers `src/components/sections/`.
- Suppression de l'ancienne home locale non importee.
- Correction des references d'assets cassees.
- Suppression des fichiers macOS parasites suivis par Git.
- Suppression du doublon `contact 2.jpg` apres remplacement par `contact.jpg`.
- Suppression de deux images identiques non referencees par hash.
- Ajout du script `npm run assets:audit`.
- Remplacement des anciens logos ARCANE par le lot institutionnel V2 valide.

## Brands prises en compte

| Brand | Section | Route locale actuelle | Logo local |
| --- | --- | --- | --- |
| CO-KAIN | wear | `/wear` | `/images/ui/cokain-logo-blanc.svg` |
| EKKO | talents | `/talents-agency` | `/images/ui/ekko-logo-couleur-blanc.svg` |
| CYPHER | events | `/contact` provisoire | `/images/ui/cypher-logo-couleur-blanc.svg` |
| BACKSPIN | music | `/prod` | `/images/ui/BACKSPIN_LOGO_PRINCIPAL_ROUGE-SUR-BLANC_v2.svg` |
| CORE STUDIOS | design | `/core-studios` | `/images/ui/core-studios-logo-couleur-blanc.svg` |

`CYPHER` est integre dans l'ecosysteme, mais il n'existe pas encore de route locale `/events`. Le lien pointe donc provisoirement vers `/contact` pour eviter une 404.

## Audit assets apres nettoyage

Commande :

```bash
npm run assets:audit
```

Resultat :

- references cassees : 0 ;
- doublons par hash : 0 ;
- fichiers publics : 152 ;
- assets publics references : 59.

## Reste a arbitrer

L'audit liste encore 93 assets publics non references. Ils n'ont pas ete supprimes en masse car cette liste contient :

- des fonts chargees via `next/font/local` avec des chemins relatifs ;
- des variantes editoriales probablement conservees comme reserve creative ;
- des anciens logos historiques non appeles par le code ;
- des exports d'images generatives avec noms temporaires.

Prochaine passe recommandee : valider visuellement les assets editoriaux non references, puis supprimer par famille complete au lieu de retirer fichier par fichier sans intention creative claire.
