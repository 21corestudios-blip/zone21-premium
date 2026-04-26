# ETAPE 9A-19 — Activation contrôlée du writer en STAGING

## Statut

Cette étape prépare et implémente l'activation contrôlée du writer GED uniquement pour l'environnement `staging`, sans encore autoriser l'écriture physique dans `ZONE21_DEV`.

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

- activation théorique autorisable
- uniquement si le flag d'activation est explicitement positionné
- uniquement si la validation GED est complète

### PROD

- écriture réelle explicitement bloquée
- le writer ne doit jamais être activé directement

## Double sécurité

Deux niveaux de protection sont maintenus :

- `assertSandboxPath` pour le périmètre sandbox
- `assertZone21DevPath` pour vérifier la cible documentaire théorique

Conséquence :

- le périmètre sandbox reste strictement contrôlé
- la cible documentaire reste bornée à `/ZONE21_DEV/` sur le plan logique
- toute incohérence de chemin bloque l'exécution
- aucune copie finale n'est encore autorisée

## Processus d'activation contrôlée

En `staging`, le writer suit désormais l'ordre suivant :

1. validation GED complète
2. autorisation `staging` confirmée
3. vérification théorique des chemins cibles
4. retour d'un statut non-écrivant

L'écriture finale dans `ZONE21_DEV` reste explicitement non activée à ce stade.

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
- une activation théorique autorisée en `staging`

## Limites actuelles

- aucune activation n'est faite automatiquement
- aucune route API d'écriture n'est encore exposée
- l'environnement local courant reste hors `staging`
- l'écriture réelle finale dans `ZONE21_DEV` n'est pas encore activée

## Risques surveillés

- activation accidentelle
- écriture hors périmètre
- erreur de validation documentaire
- conflit de version
- archivage incomplet

## Conclusion

Le writer devient autorisable théoriquement en `staging` uniquement, sous conditions strictes. Le mode courant du projet reste inchangé et non-écrivant tant qu'une future étape n'activera pas explicitement l'écriture finale dans `ZONE21_DEV`.
