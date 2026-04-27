# ETAPE 9A-29 — Synchronisation RDM et source de vérité

## Statut

Étape de stabilisation du RDM réalisée pour réduire le risque de divergence silencieuse entre le portail et la base active `ZONE21_DEV`.

## Principe retenu

Le RDM web reste une vue applicative.

La source de vérité documentaire reste exclusivement :

- `ZONE21_DEV`

Le portail ne doit jamais être considéré comme une source autonome d'état documentaire.

## Règle de cohérence appliquée

Le RDM continue de s'appuyer sur les métadonnées `rdmRecords`, mais l'état de cohérence exposé n'est plus considéré comme fiable par simple déclaration statique.

Il est désormais dérivé de la réalité physique de la base active :

- fichiers présents : `à jour`
- fichier manquant : `à vérifier`
- erreur de résolution ou base active indisponible : `bloqué`
- document archivé : `archivé`

## Vue dynamique minimale

La stabilisation ne transforme pas encore le RDM en indexeur dynamique complet.

En revanche, elle impose désormais une relecture effective des chemins documentaires pour :

- l'hydratation `fileAvailability`
- le calcul de `governanceSyncStatus`
- les téléchargements `DOCX` et `PDF`

## Contrôle après écriture writer

Après écriture réelle, le writer doit maintenant :

- réinitialiser le cache de base active
- résoudre à nouveau les chemins logiques RDM
- vérifier que les chemins résolus correspondent aux fichiers réellement écrits
- confirmer l'existence physique des deux fichiers
- bloquer si une incohérence est détectée

## Risques évités

Cette étape réduit les risques suivants :

- portail indiquant `à jour` alors que le fichier est absent
- téléchargement exposé alors que le fichier n'existe plus
- incohérence silencieuse entre chemin logique RDM et chemin physique écrit
- double source implicite entre métadonnée portail et base active réelle

## Portée

Cette étape ne change pas :

- le pipeline writer
- la sécurité writer
- les scopes `TEST` et `PHASE_2`
- la logique GED métier

Elle renforce uniquement la fiabilité de la vue RDM vis-à-vis de la base active.
