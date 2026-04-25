# ETAPE 9A-9 — Arbitrage domaines, chemins et sous-domaines GED phase 1

## Statut du document

Document d'arbitrage final des domaines, préfixes, sous-domaines à surveiller et chemins théoriques GED ZONE 21 pour la phase 1.

Ce document ne déclenche aucune écriture documentaire, n'active aucun workflow technique et ne modifie aucun comportement applicatif. Il transforme les listes théoriques de l'étape 9A-8 en décisions fonctionnelles stabilisées pour la phase 1.

## 1. Arbitrage final des domaines phase 1

### Domaines actifs

- `DOC` : actif
- `MEDIA` : actif
- `WEAR` : actif
- `OPS` : actif
- `IA` : actif

### Domaines actifs sous réserve

- `PROD` : actif sous réserve
- `SITE` : actif sous réserve

### Domaine reporté hors phase 1

- `FIN` : reporté hors phase 1

## 2. Justification du report de FIN

Le domaine `FIN` est reporté hors phase 1 pour les raisons suivantes :

- domaine sensible ;
- risque de confidentialité ;
- besoin de règles d'accès plus strictes ;
- à traiter après authentification réelle et journal d'audit renforcé.

### Conséquence de cadrage

Aucun document GED phase 1 ne doit être ouvert en écriture contrôlée sur le domaine `FIN` tant que les mécanismes d'authentification réelle, de segmentation d'accès et de traçabilité renforcée ne sont pas formellement validés.

## 3. Sous-domaines à surveiller

### SITE

Sous-domaines à surveiller :

- `CONTENU`
- `PAGE`
- `SEO`

### PROD

Sous-domaines à surveiller :

- `PUBLICATION`
- `PRODUCTION`
- `QUALITE`

### Interprétation

En phase 1, ces sous-domaines ne deviennent pas encore obligatoires dans la référence documentaire. Ils sont identifiés comme axes de structuration probable si les tests GED montrent qu'un niveau de granularité supplémentaire devient nécessaire.

## 4. Préfixes autorisés en phase 1

Les seuls préfixes autorisés en phase 1 sont :

- `NOTE-Z21`
- `PROC-Z21`

### Règle d'exclusion

Aucun autre préfixe n'est autorisé en phase 1.

Sont donc exclus à ce stade :

- tout préfixe documentaire non arbitré ;
- tout préfixe spécifique à un domaine non validé ;
- tout préfixe expérimental ou transitoire.

## 5. Chemins définitifs théoriques dans ZONE21_DEV

Les chemins ci-dessous sont retenus comme base théorique de cadrage pour la phase 1. Ils devront être confirmés avant toute implémentation effective.

### Pour NOTE-Z21

- `/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/[DOMAINE]/01_DOCX/`
- `/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/[DOMAINE]/02_PDF/`
- `/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/[DOMAINE]/99_ARCHIVES/01_DOCX/`
- `/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/[DOMAINE]/99_ARCHIVES/02_PDF/`

### Pour PROC-Z21

- `/ZONE21_DEV/90_GED_PHASE_1/PROC-Z21/[DOMAINE]/01_DOCX/`
- `/ZONE21_DEV/90_GED_PHASE_1/PROC-Z21/[DOMAINE]/02_PDF/`
- `/ZONE21_DEV/90_GED_PHASE_1/PROC-Z21/[DOMAINE]/99_ARCHIVES/01_DOCX/`
- `/ZONE21_DEV/90_GED_PHASE_1/PROC-Z21/[DOMAINE]/99_ARCHIVES/02_PDF/`

### Principe de cohérence

Ces chemins ont pour objectif de :

- isoler le périmètre GED phase 1 ;
- éviter toute confusion avec les documents maîtres historiques ;
- distinguer clairement documents actifs et archives ;
- conserver une structure lisible par type documentaire et par domaine.

## 6. Objets retenus pour les premiers tests GED

Les objets suivants sont retenus pour les premiers tests GED phase 1 :

- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0`
- `NOTE-Z21-WEAR-LANCEMENT-PRODUIT-v1.0`
- `PROC-Z21-DOC-VALIDATION-NOTE-v1.0`
- `PROC-Z21-OPS-PLAN-ACTION-v1.0`

### Rôle de ces objets

Ces objets doivent servir de base de test limitée, représentative et contrôlable pour vérifier la cohérence future entre :

- nommage ;
- domaine ;
- type documentaire ;
- version ;
- chemin cible ;
- logique d'archivage.

## 7. Points à surveiller reportés

Les points suivants restent à confirmer avant développement :

- vérifier que `/90_GED_PHASE_1/` est acceptable dans l'arborescence `ZONE21_DEV` ;
- valider ou renommer ce dossier selon la charte ;
- confirmer le report de `FIN` avec la gouvernance ;
- décider si les sous-domaines `SITE` et `PROD` deviennent obligatoires ;
- vérifier si les chemins doivent être inscrits dans le RDM central.

## Principe directeur de phase 1

La phase 1 GED doit rester limitée à un périmètre documentaire non maître, strictement contrôlé et clairement séparé du reste de l'arborescence documentaire. Les domaines actifs, les préfixes autorisés et les chemins théoriques doivent être suffisamment stables pour préparer l'implémentation sans créer d'ambiguïté documentaire.
