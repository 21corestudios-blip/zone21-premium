# ETAPE 9A-27 — Verrouillage strict du scope TEST

## Objectif

Empêcher toute écriture réelle en dehors de `/90_GED_PHASE_1/TEST/` tant que `PHASE_2` n'est pas explicitement activée.

## Verrou TEST strict

Le scope `TEST` n'autorise plus aucun préfixe virtuel large sous `PHASE_1`.

Préfixe autorisé :

- `/90_GED_PHASE_1/TEST/`

Préfixe explicitement supprimé :

- `/90_GED_PHASE_1/`

Conséquence :

- toute tentative d'écriture vers un chemin `PHASE_1` hors `TEST` est refusée
- le périmètre `TEST` est désormais totalement isolé

## Activation volontaire de PHASE_2

Le scope `PHASE_2` est maintenant désactivé par défaut.

Activation obligatoire :

- `PHASE_2_ENABLED=true`

Sans ce flag :

- un `Z21_ACTIVE_BASE_PATH` pointant sur `PHASE_2` est refusé
- toute tentative de cible `PHASE_2` est bloquée

Avec ce flag :

- `PHASE_2` devient utilisable explicitement
- l'activation est traçable dans les logs GED

## Sécurité renforcée

Le contrôle combine désormais :

- le périmètre actif (`Z21_ACTIVE_BASE_PATH`)
- le scope virtuel autorisé
- le flag d'activation `PHASE_2_ENABLED`
- la résolution physique finale du chemin

Cela évite :

- l'élargissement implicite depuis `TEST` vers toute `PHASE_1`
- l'usage involontaire de `PHASE_2`
- les activations silencieuses hors validation explicite

## Journalisation

Les logs GED tracent maintenant :

- tentative `PHASE_2` sans activation
- activation explicite `PHASE_2`
- scope utilisé lors des contrôles de chemin

## Résultat attendu

- `TEST` totalement isolé
- `PHASE_2` désactivé par défaut
- activation volontaire obligatoire
- aucune modification du pipeline writer, du rollback ou du moteur PDF Linux
