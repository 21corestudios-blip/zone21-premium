# ETAPE 9A-8 — Domaines et objets GED phase 1

## Statut du document

Document de cadrage des domaines, objets documentaires et préfixes autorisés pour la GED ZONE 21 phase 1.

Ce document ne déclenche aucune écriture documentaire, n'active aucun workflow technique et ne modifie aucun comportement applicatif. Il transforme les règles de nommage de l'étape 9A-7 en listes contrôlées utilisables avant implémentation.

## 1. Domaines autorisés phase 1

Les domaines suivants sont autorisés en phase 1 :

- `DOC`
- `MEDIA`
- `WEAR`
- `PROD`
- `SITE`
- `OPS`
- `FIN`
- `IA`

## 2. Objets autorisés par domaine

### DOC

Objets autorisés :

- `VALIDATION-NOTE`
- `VALIDATION-PROC`
- `CONTROLE-RDM`
- `CONTROLE-CODIFICATION`

### MEDIA

Objets autorisés :

- `BRIEF-CAMPAGNE`
- `SCRIPT-CONTENU`
- `CALENDRIER-PUBLICATION`

### WEAR

Objets autorisés :

- `LANCEMENT-PRODUIT`
- `FICHE-PRODUIT`
- `SUIVI-COLLECTION`

### PROD

Objets autorisés :

- `CHECKLIST-PUBLICATION`
- `SUIVI-PRODUCTION`
- `CONTROLE-QUALITE`

### SITE

Objets autorisés :

- `MAJ-CONTENU`
- `AJOUT-SECTION`
- `MODIFICATION-PAGE`

### OPS

Objets autorisés :

- `SUIVI-TACHE`
- `COMPTE-RENDU`
- `PLAN-ACTION`

### FIN

Objets autorisés :

- `SUIVI-BUDGET`
- `NOTE-COUT`
- `PREVISIONNEL`

### IA

Objets autorisés :

- `PROMPT-SYSTEME`
- `CONTROLE-SOURCE`
- `CONSIGNE-AGENT`

## 3. Préfixes autorisés en phase 1

Les seuls préfixes autorisés en phase 1 sont :

- `NOTE-Z21`
- `PROC-Z21`

### Règle complémentaire

Tout autre préfixe reste interdit en phase 1.

Sont donc exclus à ce stade :

- tout préfixe documentaire non cadré
- tout préfixe expérimental
- tout préfixe métier spécifique non arbitré

## 4. Références type attendues

La structure de référence phase 1 reste :

- `NOTE-Z21-[DOMAINE]-[OBJET]-vX.X`
- `PROC-Z21-[DOMAINE]-[OBJET]-vX.X`

Les domaines et objets employés dans une référence doivent obligatoirement appartenir aux listes autorisées dans ce document.

## 5. Emplacements cibles théoriques dans ZONE21_DEV

Les chemins ci-dessous sont théoriques et restent à confirmer avant implémentation.

### NOTE-Z21

Emplacements cibles théoriques :

- actifs DOCX : `.../NOTE-Z21/01_DOCX/`
- actifs PDF : `.../NOTE-Z21/02_PDF/`
- archives DOCX : `.../NOTE-Z21/99_ARCHIVES/01_DOCX/`
- archives PDF : `.../NOTE-Z21/99_ARCHIVES/02_PDF/`

### PROC-Z21

Emplacements cibles théoriques :

- actifs DOCX : `.../PROC-Z21/01_DOCX/`
- actifs PDF : `.../PROC-Z21/02_PDF/`
- archives DOCX : `.../PROC-Z21/99_ARCHIVES/01_DOCX/`
- archives PDF : `.../PROC-Z21/99_ARCHIVES/02_PDF/`

### Principe de cohérence

L'emplacement physique devra rester cohérent avec :

- le préfixe documentaire ;
- le domaine ;
- l'objet ;
- la version ;
- la stratégie d'archivage ;
- la charte documentaire globale de `ZONE21_DEV`.

## 6. Règles de contrôle associées

Une référence de phase 1 ne peut être considérée comme conforme que si :

- son préfixe est autorisé ;
- son domaine est autorisé ;
- son objet est autorisé pour ce domaine ;
- sa version est présente ;
- son nom de fichier reprend exactement la référence sans extension ;
- son chemin cible reste cohérent avec sa famille documentaire.

## 7. Points à surveiller reportés

Les points suivants restent à confirmer avant développement :

- valider définitivement les domaines avec la gouvernance ZONE21 ;
- décider si `FIN` doit rester actif en phase 1 ou être reporté ;
- confirmer les chemins exacts dans `ZONE21_DEV` ;
- vérifier si `SITE` et `PROD` nécessitent des sous-domaines ;
- confirmer que les objets listés suffisent pour les premiers tests GED.

## Principe directeur de phase 1

Les domaines, objets et préfixes de la GED phase 1 doivent rester volontairement limités afin de permettre un contrôle strict, un test progressif et une validation documentaire fiable avant toute écriture future dans `ZONE21_DEV`.
