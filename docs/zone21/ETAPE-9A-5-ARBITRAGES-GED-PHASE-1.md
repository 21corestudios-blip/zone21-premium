# ETAPE 9A-5 — Arbitrages fonctionnels GED phase 1

## Statut du document

Document de cadrage décisionnel pour la phase 1 GED ZONE 21.

Ce document ne déclenche aucune écriture documentaire et n'active aucun workflow technique. Il formalise uniquement les arbitrages fonctionnels retenus avant développement.

## 1. Documents autorisés en phase 1

### Documents autorisés

- `NOTE-Z21-*` : autorisé
- `PROC-Z21-*` : autorisé
- documents opérationnels non maîtres : autorisé

### Documents exclus de la phase 1

- fiches entités : exclues en phase 1
- `DOC-Z21-*` : exclu
- `DIR-Z21-*` : exclu
- `REF-Z21-*` : exclu
- `RDM-Z21-*` : exclu

### Justification

La phase 1 doit démarrer sur un périmètre documentaire à risque réduit, fortement structurable et non maître. Les documents normatifs, référentiels, directives, registres et fiches entités portent un niveau de sensibilité trop élevé pour une première mise en écriture contrôlée.

## 2. Rôles phase 1

### Lecteur

- consulte les documents exposés dans le portail
- télécharge les documents selon les règles d'accès existantes
- ne crée rien
- ne modifie rien
- ne soumet rien
- ne valide rien

### Contributeur

- crée un brouillon sur les types autorisés en phase 1
- modifie ses brouillons tant qu'ils ne sont pas verrouillés
- soumet un brouillon pour revue
- consulte l'historique de son document
- ne valide pas
- n'archive pas
- ne publie pas dans `ZONE21_DEV`

### Éditeur

- crée un brouillon sur les types autorisés
- modifie un brouillon
- reprend un document rejeté
- prépare les métadonnées documentaires
- soumet à validation
- ne valide pas seul
- n'écrit pas directement dans `ZONE21_DEV`

### Validateur

- consulte les brouillons soumis
- passe un document en `en validation`
- valide ou rejette sur le plan métier et documentaire
- ne contourne pas les contrôles physiques obligatoires
- ne doit pas pouvoir publier un document déclaré conforme si les garde-fous ne sont pas satisfaits

### Admin documentaire

- contrôle codification, référence, version, statut, titre et emplacement cible
- vérifie la conformité au modèle documentaire
- supervise l'archivage logique prévu
- supervise la cohérence du journal d'audit
- autorise la publication documentaire côté processus
- ne doit pas pouvoir court-circuiter la chaîne de vérité

### Direction

- intervient uniquement sur documents sensibles ou arbitrages exceptionnels
- peut demander validation, rejet ou suspension d'un flux
- ne doit pas devenir un rôle d'édition opérationnelle courante
- ne doit pas remplacer les contrôles documentaires et techniques

## 3. Workflow phase 1

Workflow cible retenu :

`brouillon -> soumis -> en validation -> valide ou rejete -> archive si remplace`

### Définition des états

- `brouillon` : document en préparation, modifiable par les rôles autorisés
- `soumis` : document proposé à revue, plus stable, prêt pour contrôle
- `en validation` : document verrouillé pour arbitrage et contrôles
- `validé` : document accepté dans le workflow, sous réserve de matérialisation documentaire conforme
- `rejeté` : document non accepté, à corriger ou à abandonner
- `archivé` : ancienne version conservée après remplacement par une nouvelle version officielle

### Principe important

Les états de workflow ne remplacent pas les statuts documentaires officiels. Un document peut atteindre un état de workflow favorable sans être exposé comme `Validé` dans le RDM tant que la base active `ZONE21_DEV` n'est pas physiquement conforme.

## 4. Versioning phase 1

### Règles retenues

- modification mineure : `v1.0 -> v1.1`
- modification majeure : `v1.0 -> v2.0`
- aucun écrasement autorisé
- ancienne version toujours conservée

### Principes complémentaires

- le changement de version doit être explicite et motivé
- le type d'évolution doit être tracé dans le journal d'audit
- toute nouvelle version doit conserver un lien documentaire avec la version précédente
- une version ne doit jamais être remplacée silencieusement

## 5. Archives phase 1

### Principe retenu

L'ancienne version doit être déplacée vers un espace d'archives interne à `ZONE21_DEV`, dans la même famille documentaire que le document actif, afin de préserver la lisibilité métier et la cohérence de classement.

### Emplacement cible proposé

Structure cible à cadrer par famille documentaire :

- dossier métier courant
- sous-dossier `99_ARCHIVES`
- puis conservation distincte des formats `DOCX` et `PDF`

Exemple de logique cible :

- `.../<famille_documentaire>/99_ARCHIVES/01_DOCX/`
- `.../<famille_documentaire>/99_ARCHIVES/02_PDF/`

### Règles d'archivage associées

- le `DOCX` précédent est conservé
- le `PDF` précédent est conservé s'il existe
- le RDM doit refléter le lien `remplace` / `remplacé par`
- une décision registre peut être liée si le niveau de gouvernance l'exige

## 6. Journal d’audit

### Champs obligatoires

- identifiant unique d'événement
- horodatage
- identifiant du document
- référence documentaire
- type documentaire
- version source
- version cible
- état workflow avant action
- état workflow après action
- statut documentaire avant action
- statut documentaire après action
- action effectuée
- nature du changement : mineur ou majeur
- utilisateur initiateur
- rôle de l'utilisateur initiateur
- utilisateur validateur si applicable
- rôle du validateur si applicable
- justification ou motif
- résultat du contrôle de conformité
- résultat du contrôle physique `ZONE21_DEV`
- emplacement cible
- emplacement archive si applicable
- lien vers version remplacée si applicable
- code d'anomalie ou d'échec si applicable

### Exigence

Le journal d'audit doit permettre de reconstituer intégralement qui a demandé quoi, qui a validé quoi, sur quelle version, à quel moment, avec quel résultat.

## 7. Décisions restantes

Les arbitrages suivants restent à confirmer avant développement :

- liste exacte des documents opérationnels non maîtres autorisés en phase 1
- granularité précise des droits entre contributeur et éditeur
- cas où la direction intervient réellement dans le workflow
- moteur DOCX retenu
- moteur PDF retenu
- structure d'archives définitive dans `ZONE21_DEV`
- format exact du journal d'audit
- niveau de détail du verrouillage pendant `en validation`
- règle de gestion des rejets successifs
- stratégie de notification
- stratégie d'authentification réelle
- règles de contrôle automatique de la charte documentaire

## Règle directrice de phase 1

La phase 1 GED doit rester prudente, traçable et limitée à un périmètre documentaire non maître. La base applicative ne doit contenir que des états transitoires, des brouillons, des métadonnées de workflow et des journaux d'audit. `ZONE21_DEV` reste la seule source documentaire officielle.
