# ETAPE 9A-26 — Path Security du writer GED

## Objectif

Renforcer la sécurité du writer GED au niveau de chaque fichier manipulé, afin d'empêcher toute écriture réelle hors périmètre autorisé même si un chemin cible est construit dynamiquement.

## Différence entre `basePath` et `targetPath`

`Z21_ACTIVE_BASE_PATH` :

- fixe la racine physique active utilisée par le writer
- limite déjà le périmètre global d'exécution

`targetPath` :

- représente chaque chemin virtuel individuel visé sous `/ZONE21_DEV/...`
- doit être contrôlé séparément avant toute opération filesystem

Le garde `basePath` seul ne suffit pas si un chemin cible dérive vers un emplacement inattendu.

## Règles appliquées

La fonction `assertTargetPathAllowed(targetPath)` :

- normalise le chemin cible
- refuse les chemins vides ou contenant un caractère nul
- impose un chemin logique sous `/ZONE21_DEV/`
- convertit le chemin en chemin relatif contrôlable
- vérifie que le chemin commence par l'un des périmètres autorisés

Whitelist actuelle :

- `/90_GED_PHASE_1/TEST/`
- `/90_GED_PHASE_2/`

## Opérations protégées

Le contrôle est appliqué :

- avant copie DOCX finale
- avant copie PDF finale
- avant archivage DOCX
- avant archivage PDF
- avant restauration rollback
- avant suppression rollback

Il est aussi appliqué directement dans la couche filesystem pour éviter tout contournement.

## Risques évités

- sortie de périmètre via chemin construit dynamiquement
- tentative d'écriture dans une phase non autorisée
- tentative d'injection de chemin via `..`
- suppression rollback hors périmètre
- archivage vers une cible non prévue

## Journalisation

Chaque contrôle de chemin cible trace :

- `targetPath`
- résultat du contrôle : `allowed` ou `blocked`
- scope détecté : `TEST` ou `PHASE_2` quand applicable

## Résultat attendu

Même avec un `Z21_ACTIVE_BASE_PATH` correctement cadré, aucune écriture fichier individuelle ne peut désormais sortir du périmètre explicitement autorisé.
