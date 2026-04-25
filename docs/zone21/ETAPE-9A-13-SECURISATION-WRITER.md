# ETAPE 9A-13 — Sécurisation du writer GED

## Statut du document

Document de sécurisation du writer GED ZONE 21 en mode `dry-run`.

Cette étape renforce les garde-fous techniques pour empêcher toute activation accidentelle d'un writer réel. Elle ne déclenche aucune écriture documentaire, aucune génération réelle et n'ouvre aucune route d'écriture.

## 1. Garde-fous ajoutés

Les protections suivantes sont mises en place :

- flag global `WRITER_ENABLED = false`
- guard serveur dédié
- vérification runtime du verrouillage
- champ `writerLocked: true` exposé par la route `GET`
- tests de sécurité dédiés
- contrôle statique d'absence de mutation filesystem
- vérification explicite qu'aucune route autre que `GET` n'est exposée

## 2. Principe de verrouillage

Le writer est verrouillé par défaut.

Tant que `WRITER_ENABLED` reste à `false` :

- aucune écriture réelle ne peut être activée ;
- aucune publication documentaire ne peut être déclenchée ;
- aucune mutation de fichier ne doit être possible ;
- la couche writer reste limitée à la simulation.

Le guard global doit lever une erreur si une tentative d'activation apparaît sans modification explicite du code.

## 3. Conditions nécessaires avant un writer réel

Avant toute activation d'un writer réel, il faudra au minimum :

- une décision explicite de gouvernance ;
- une revue de sécurité dédiée ;
- une stratégie de lock et de concurrence validée ;
- un journal d'audit renforcé ;
- une authentification réelle stabilisée ;
- une validation de la génération DOCX ;
- une validation de la conversion PDF ;
- une relecture physique post-écriture ;
- une stratégie de reprise après échec.

## 4. Risques évités

Les garde-fous actuels permettent d'éviter :

- une écriture accidentelle dans `ZONE21_DEV`
- une activation implicite du writer réel
- une mutation filesystem introduite sans contrôle
- une route d'écriture exposée par erreur
- une divergence entre simulation et publication réelle
- une validation documentaire sans verrou de sécurité

## 5. Portée de la sécurisation

Cette sécurisation ne transforme pas encore le writer en composant de production. Elle garantit uniquement que le mode `dry-run` reste techniquement verrouillé tant qu'une activation réelle n'a pas été décidée, développée et revue explicitement.
