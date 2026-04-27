# ETAPE 9A-25 — Extension contrôlée du writer GED

## Objectif

Autoriser l'usage du writer GED réel sur un périmètre restreint hors `TEST`, sans ouvrir l'ensemble de `ZONE21_DEV`.

## Périmètre autorisé

Écritures réelles autorisées uniquement si `Z21_ACTIVE_BASE_PATH` pointe vers l'un de ces périmètres :

- `/90_GED_PHASE_1/TEST/`
- `/90_GED_PHASE_2/`

Tout autre périmètre est refusé.

## Configuration retenue

Variable exposée :

- `GED_ALLOWED_WRITE_PATHS=["/90_GED_PHASE_1/TEST/","/90_GED_PHASE_2/"]`

Comportement :

- si la variable est absente, le fallback interne conserve exactement cette whitelist
- si la variable est mal formée, le fallback interne est conservé

## Règles strictes

- `NODE_ENV=staging` obligatoire
- `WRITER_ENABLED=true` obligatoire
- `WRITER_REAL_EXECUTION_CONFIRMED=true` obligatoire
- `Z21_ACTIVE_BASE_PATH` doit correspondre à un périmètre autorisé
- aucune écriture hors `TEST` ou `PHASE_2`
- aucune exposition au front
- aucun relâchement du rollback
- aucune modification du pipeline DOCX/PDF

## Journalisation

Chaque écriture réelle est désormais tracée avec un scope explicite :

- `TEST`
- `PHASE_2`

Les logs GED distinguent ainsi clairement :

- l'exécution de test contrôlée
- l'exécution réelle limitée phase 2

## Procédure d'extension future

Pour ouvrir un nouveau périmètre :

1. créer le dossier cible dans `ZONE21_DEV`
2. ajouter explicitement le chemin à `GED_ALLOWED_WRITE_PATHS`
3. ajouter des tests dédiés
4. documenter la nouvelle portée
5. ne jamais étendre sans revue

## Structure phase 2 préparée

La base active reçoit un squelette limité sous :

- `/90_GED_PHASE_2/NOTE-Z21/MEDIA/01_DOCX/`
- `/90_GED_PHASE_2/NOTE-Z21/MEDIA/02_PDF/`
- `/90_GED_PHASE_2/NOTE-Z21/MEDIA/99_ARCHIVES/01_DOCX/`
- `/90_GED_PHASE_2/NOTE-Z21/MEDIA/99_ARCHIVES/02_PDF/`

## Validation attendue

Les tests doivent confirmer :

- écriture autorisée sur `TEST`
- écriture autorisée sur `PHASE_2`
- refus immédiat hors périmètre
