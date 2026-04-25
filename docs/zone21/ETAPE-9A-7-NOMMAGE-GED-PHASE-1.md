# ETAPE 9A-7 — Nommage GED phase 1

## Statut du document

Document de formalisation des règles de nommage GED ZONE 21 pour la phase 1.

Ce document ne déclenche aucune écriture documentaire, n'active aucun workflow technique et ne modifie aucun comportement applicatif. Il précise les conventions attendues avant toute implémentation.

## 1. Principe général

Les références GED phase 1 doivent être lisibles, stables, strictement normalisées et compatibles avec la charte documentaire de `ZONE21_DEV`.

La référence documentaire doit être :

- unique ;
- explicite ;
- stable dans le temps ;
- conforme au type documentaire ;
- identique au nom de fichier sans extension.

## 2. Formats cibles

### A. NOTE-Z21

Format cible :

`NOTE-Z21-[DOMAINE]-[OBJET]-vX.X`

### B. PROC-Z21

Format cible :

`PROC-Z21-[DOMAINE]-[OBJET]-vX.X`

## 3. Règles obligatoires

Les règles suivantes s'appliquent à toutes les références GED phase 1 :

- majuscules obligatoires ;
- aucun accent ;
- aucun espace ;
- séparateur tiret ;
- version obligatoire ;
- objet court, stable, explicite ;
- référence identique au nom de fichier sans extension.

### Interprétation complémentaire

- `DOMAINE` désigne le périmètre métier ou fonctionnel principal ;
- `OBJET` désigne l'objet documentaire concret ;
- la version doit suivre le format `vX.X` ;
- la structure ne doit contenir aucun caractère décoratif ou libre hors convention.

## 4. Exemples conformes

Les références suivantes sont considérées comme conformes au modèle phase 1 :

- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0`
- `NOTE-Z21-WEAR-LANCEMENT-PRODUIT-v1.0`
- `PROC-Z21-DOC-VALIDATION-NOTE-v1.0`
- `PROC-Z21-WEAR-PUBLICATION-FICHE-PRODUIT-v1.0`

## 5. Exemples interdits

Les références suivantes sont interdites :

- `note-zone21-test.docx`
- `NOTE Z21 MEDIA v1`
- `PROC-Z21-Validation-v1`
- `NOTE-Z21-MÉDIA-BRIEF-v1.0`

### Motifs d'interdiction

- casse non conforme ;
- présence d'espaces ;
- version non conforme ;
- accent interdit ;
- absence de domaine ou d'objet suffisamment cadré ;
- confusion entre référence documentaire et nom de fichier complet avec extension.

## 6. Emplacements cibles théoriques

Les emplacements ci-dessous sont théoriques et devront être confirmés avant implémentation.

### Documents actifs DOCX

- `.../<famille_documentaire>/01_DOCX/`

### Documents actifs PDF

- `.../<famille_documentaire>/02_PDF/`

### Archives DOCX

- `.../<famille_documentaire>/99_ARCHIVES/01_DOCX/`

### Archives PDF

- `.../<famille_documentaire>/99_ARCHIVES/02_PDF/`

### Principe directeur

La référence documentaire doit rester cohérente avec :

- le type documentaire ;
- le nom de fichier ;
- la version ;
- le chemin cible ;
- la logique d'archivage.

## 7. Règles complémentaires de cohérence

### Référence

La référence est la clé documentaire principale. Elle doit pouvoir être relue sans ambiguïté dans le RDM, dans le journal d'audit et dans le stockage physique.

### Titre

Le titre peut être plus lisible que la référence, mais doit rester cohérent avec elle. Il ne doit pas introduire une ambiguïté métier ou documentaire.

### Version

La version doit toujours être explicitement présente dans la référence. Une référence sans version est non conforme.

### Fichier

Le nom de fichier physique doit reprendre exactement la référence, suivie de l'extension adaptée :

- `.docx`
- `.pdf`

## 8. Points à surveiller reportés

Les points suivants restent à confirmer avant développement :

- confirmer les domaines autorisés ;
- confirmer les objets documentaires autorisés ;
- confirmer les emplacements définitifs dans `ZONE21_DEV` ;
- confirmer si certains documents opérationnels non maîtres nécessitent un préfixe dédié autre que `NOTE` ou `PROC`.

## Principe directeur de phase 1

Les règles de nommage GED phase 1 doivent être suffisamment strictes pour éviter toute ambiguïté documentaire, toute dérive locale et toute création de doublons logiques. La convention de référence doit être contrôlable automatiquement avant toute future écriture vers `ZONE21_DEV`.
