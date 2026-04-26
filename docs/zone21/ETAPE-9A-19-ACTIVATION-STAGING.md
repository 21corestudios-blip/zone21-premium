# ETAPE 9A-19 — Activation contrôlée du writer en STAGING

## Statut

Cette étape prépare et implémente l'activation contrôlée du writer GED réel uniquement pour l'environnement `staging`.

Le comportement cible est le suivant :

- aucune écriture réelle en `development`
- aucune écriture réelle en `production`
- aucune écriture réelle sans `WRITER_ENABLED=true`
- aucune écriture réelle sans validation GED complète

## Fonctionnement général

L'activation réelle du writer dépend désormais de deux conditions cumulatives :

- `WRITER_ENABLED=true`
- `NODE_ENV=staging`

Si une de ces conditions manque :

- l'activation réelle est refusée
- le système doit retomber sur le plan théorique du writer

## Règles d'environnement

### DEV

- écriture réelle interdite
- fallback vers plan théorique

### STAGING

- écriture réelle autorisable
- uniquement si le flag d'activation est explicitement positionné
- uniquement si la validation GED est complète

### PROD

- écriture réelle explicitement bloquée
- le writer ne doit jamais être activé directement

## Double sécurité

Deux niveaux de protection sont maintenus :

- `assertSandboxPath` pour toute génération intermédiaire
- `assertZone21DevPath` pour toute écriture finale

Conséquence :

- la génération continue de passer par le sandbox
- seule la copie finale peut viser `ZONE21_DEV`
- toute incohérence de chemin bloque l'exécution

## Processus d'exécution réelle

En `staging`, l'exécution réelle suit l'ordre suivant :

1. validation GED complète
2. génération DOCX dans le sandbox
3. conversion PDF dans le sandbox
4. archivage de la version précédente si demandé
5. copie vers la cible réelle dans `ZONE21_DEV`
6. relecture physique des fichiers écrits
7. retour de statut

Chaque étape peut échouer et bloquer immédiatement la suite.

## Journalisation

Une couche d'audit dédiée trace notamment :

- utilisateur
- action
- fichier
- version
- statut
- erreurs

Cette journalisation vise à rendre visible :

- un blocage d'activation
- un blocage de validation
- un succès d'écriture réelle

## Limites actuelles

- aucune activation n'est faite automatiquement
- aucune route API d'écriture n'est encore exposée
- l'environnement local courant reste hors `staging`
- l'écriture réelle n'est donc pas activée dans l'usage courant du projet

## Risques surveillés

- activation accidentelle
- écriture hors périmètre
- erreur de validation documentaire
- conflit de version
- archivage incomplet

## Conclusion

Le writer réel devient activable en `staging` uniquement, sous conditions strictes. Le mode courant du projet reste inchangé tant que l'environnement n'est pas explicitement préparé pour cette activation.
