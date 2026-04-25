# ETAPE 9A-6 — Modèle GED phase 1

## Statut du document

Document de normalisation rédactionnelle et fonctionnelle pour la GED ZONE 21 phase 1.

Ce document ne déclenche aucune écriture documentaire, n'active aucun workflow technique et ne modifie aucun comportement applicatif. Il stabilise les termes, les champs minimaux et les règles de blocage à respecter avant toute implémentation.

## A. Glossaire GED phase 1

### Brouillon

État de travail initial d'un document en préparation dans la base applicative. Un brouillon n'a aucune valeur documentaire officielle tant qu'il n'a pas été validé puis matérialisé correctement dans `ZONE21_DEV`.

### Soumis

État intermédiaire indiquant qu'un brouillon est prêt à être examiné. Le document n'est pas encore validé et peut encore être rejeté ou renvoyé à correction.

### En validation

État de contrôle formel dans lequel le document est examiné par les rôles autorisés. Cet état doit être traité comme verrouillé pour éviter des modifications concurrentes non tracées.

### Validé

Décision de workflow positive indiquant que le document a franchi les contrôles métier et documentaires. Ce terme ne vaut pas exposition comme statut documentaire officiel tant que les contrôles physiques et de conformité ne sont pas confirmés dans `ZONE21_DEV`.

### Rejeté

Décision de workflow négative indiquant qu'un brouillon ou une révision n'est pas accepté en l'état. Le document doit être corrigé, abandonné ou resoumis selon les règles retenues.

### Archivé

État appliqué à une version antérieure conservée après remplacement par une version suivante. L'archivage implique conservation, traçabilité et maintien du lien avec la version qui la remplace.

### Version source

Version documentaire d'origine à partir de laquelle une modification, une correction ou une évolution est préparée.

### Version cible

Version documentaire attendue après traitement du changement. Elle doit être explicitement calculée et justifiée selon les règles de versioning.

### Journal d’audit

Ensemble structuré d'événements retraçant qui a demandé, modifié, soumis, validé, rejeté ou tenté de publier un document, avec horodatage, rôle, contexte et résultat.

### Writer unique

Principe architectural selon lequel un seul service serveur sera autorisé, à terme, à écrire dans `ZONE21_DEV`. Aucun autre composant ne devra contourner cette règle.

### Contrôle physique ZONE21_DEV

Vérification effective de l'existence et de la conformité matérielle du document dans `ZONE21_DEV`, incluant au minimum présence fichier, chemin cible et cohérence des métadonnées documentaires attendues.

## B. Modèle minimal d’un brouillon GED

### Champs obligatoires

- identifiant du brouillon
- type documentaire
- titre
- référence cible provisoire
- version cible
- entité propriétaire
- catégorie documentaire
- auteur
- rôle auteur
- état workflow
- statut documentaire cible
- contenu structuré
- justification
- date création
- date dernière modification

### Intention du modèle

Ce modèle représente le minimum nécessaire pour préparer un document sans faire de la base applicative une source documentaire parallèle. Il doit rester orienté préparation, contrôle et traçabilité.

## C. Modèle minimal de validation

### Champs obligatoires

- identifiant de validation
- identifiant du brouillon
- validateur
- rôle validateur
- décision
- motif
- date décision
- contrôles passés
- contrôles échoués
- statut final proposé

### Principe

La validation doit rester explicite, motivée et auditée. Une décision positive de validation ne doit pas suffire à exposer un document comme officiellement `Validé` si les contrôles physiques et de conformité ne sont pas satisfaits.

## D. Modèle minimal du journal d’audit

### Champs stabilisés

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

### Règle directrice

Le journal d'audit doit permettre une reconstitution complète des décisions, des transitions et des tentatives de publication, y compris en cas d'échec.

## E. Règles de nommage phase 1

### NOTE-Z21-*

Les notes autorisées en phase 1 doivent respecter une structure de référence homogène, prévisible et contrôlable. Le préfixe `NOTE-Z21-` doit être obligatoire, suivi d'un segment métier explicite, puis d'un identifiant documentaire stable et d'une version normalisée.

### PROC-Z21-*

Les procédures autorisées en phase 1 doivent respecter le préfixe `PROC-Z21-`, suivi d'un périmètre métier lisible, d'un identifiant stable et d'une version explicite.

### Documents opérationnels non maîtres

Les documents opérationnels non maîtres autorisés doivent suivre une convention cadrée avant développement. Cette convention devra imposer :

- un préfixe documentaire stable
- une référence unique
- un titre cohérent avec la référence
- une version conforme
- un emplacement compatible avec la charte documentaire

## F. Règles de blocage

Un document reste bloqué si l'un des cas suivants est constaté :

- référence non conforme
- version incohérente
- chemin cible absent
- rôle non autorisé
- contrôle physique non confirmé
- anomalie de gouvernance ouverte

### Conséquence

Tant qu'un blocage subsiste, le document ne doit pas être exposé comme officiellement `Validé` dans le RDM web.

## G. Décisions encore ouvertes

Les arbitrages suivants restent à trancher avant développement :

- moteur DOCX
- moteur PDF
- emplacement exact des brouillons
- format réel du journal d'audit
- authentification réelle
- notifications

## Principe directeur

La GED phase 1 doit rester limitée, traçable, réversible et strictement alignée sur la chaîne de vérité documentaire : le workflow applicatif prépare, le futur writer unique écrira, `ZONE21_DEV` fera foi, et le RDM web ne devra exposer qu'un état physiquement confirmé.
