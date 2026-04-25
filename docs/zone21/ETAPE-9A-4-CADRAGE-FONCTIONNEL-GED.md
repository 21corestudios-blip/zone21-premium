# ETAPE 9A-4 — Cadrage fonctionnel GED ZONE 21

## A. Rappel du principe de vérité

- ZONE21_DEV reste la seule source documentaire officielle.
- Google Drive est le support de stockage actuel de ZONE21_DEV.
- Le NAS Synology est une copie synchronisée passive.
- Le RDM web est une interface de consultation et de gouvernance contrôlée.
- La base applicative ne doit jamais devenir une source documentaire parallèle.

La base applicative ne peut contenir que :

- des brouillons ;
- des états transitoires ;
- des métadonnées de workflow ;
- des journaux d'audit.

Elle ne doit jamais être considérée comme référentiel documentaire officiel, même si elle contient des données structurées utiles au pilotage.

## B. Chaîne de vérité obligatoire

La chaîne de vérité à respecter est la suivante :

1. workflow applicatif prépare ;
2. service documentaire écrit ;
3. ZONE21_DEV fait foi ;
4. RDM web relit ;
5. RDM web expose.

Conséquence directe :

- le front ne peut jamais faire foi ;
- le support Google Drive ne peut jamais faire foi ;
- le NAS ne peut jamais faire foi ;
- aucune validation logique ne peut remplacer la présence physique et conforme des fichiers dans ZONE21_DEV.

## C. Périmètre futur des actions GED

Actions envisagées à cadrer, sans activation en 9A-4 :

- créer un brouillon ;
- modifier un brouillon ;
- soumettre à validation ;
- rejeter ;
- valider ;
- archiver l'ancienne version ;
- créer une version suivante ;
- générer DOCX ;
- générer PDF ;
- réindexer le RDM après écriture physique confirmée.

Ces actions restent futures. Elles ne doivent être activées qu'après validation complète du writer serveur unique et des garde-fous anti-double-source.

## D. Rôles et droits fonctionnels

### Lecteur

- consulter les enregistrements autorisés ;
- télécharger les documents autorisés ;
- ne créer aucun document ;
- ne modifier aucun brouillon ;
- ne déclencher aucun workflow.

### Contributeur

- créer un brouillon dans son périmètre ;
- modifier ses brouillons ou les brouillons autorisés ;
- soumettre à validation ;
- ne pas valider ;
- ne pas archiver ;
- ne pas écrire dans ZONE21_DEV.

### Éditeur

- créer et enrichir des brouillons ;
- modifier les brouillons autorisés ;
- préparer le contenu documentaire et les métadonnées ;
- soumettre à validation ;
- ne pas valider seul ;
- ne pas écrire directement dans ZONE21_DEV.

### Validateur

- relire ;
- accepter ou rejeter un contenu soumis ;
- contrôler la cohérence documentaire ;
- ne pas contourner le contrôle physique final ;
- ne pas constituer une seconde source de vérité.

### Admin documentaire

- piloter la gouvernance documentaire ;
- contrôler codification, version, emplacements et archivage ;
- déclencher les actions documentaires autorisées côté service documentaire ;
- superviser le RDM ;
- maintenir la cohérence globale du système.

### Direction

- arbitrer les cas sensibles ;
- intervenir sur les documents stratégiques ;
- valider les décisions de gouvernance à forte portée ;
- ne pas court-circuiter les garde-fous physiques et documentaires.

## E. États documentaires de workflow

États de workflow à distinguer clairement :

- brouillon ;
- soumis ;
- en validation ;
- validé ;
- archivé ;
- rejeté.

Important :

Ces états de workflow ne remplacent pas les statuts documentaires officiels.

Les statuts documentaires officiels restent :

- Document de travail ;
- Validé ;
- Archivé.

Le workflow décrit une étape de traitement.
Le statut documentaire officiel décrit l'état documentaire reconnu dans ZONE21_DEV.

## F. Documents éligibles en phase 1

Périmètre prudent recommandé :

- NOTE-Z21-* : oui ;
- PROC-Z21-* : oui ;
- documents opérationnels non maîtres : oui ;
- fiches entités : à arbitrer ;
- documents maîtres DOC-Z21-* : non en phase 1 ;
- directives DIR-Z21-* : non en phase 1 ;
- référentiels REF-Z21-* : non en phase 1.

Raison :

- la phase 1 doit prioriser les documents les plus structurés, les moins critiques et les plus faciles à modéliser sans risque de dérive normative ;
- les documents maîtres, directives et référentiels exigent un niveau de sûreté documentaire supérieur.

## G. Règles de versioning à cadrer

Règles cibles à formaliser :

- correction mineure : v1.0 -> v1.1 ;
- modification structurante : v1.0 -> v2.0 ;
- archivage automatique de l'ancienne version ;
- interdiction d'écrasement silencieux ;
- journal d'audit obligatoire.

Compléments à verrouiller :

- qui décide du changement mineur ou majeur ;
- à quel moment la nouvelle version devient officielle ;
- comment relier automatiquement les champs `remplace` et `remplacé par`.

## H. Règles d'archivage à cadrer

L'archivage devra couvrir :

- déplacement de l'ancienne version vers dossier d'archive ;
- conservation DOCX/PDF ;
- mise à jour RDM ;
- lien `remplacé par` / `remplace` ;
- décision registre liée si nécessaire.

Principes à maintenir :

- aucune suppression silencieuse ;
- aucune perte de traçabilité ;
- aucune disparition d'une version antérieure sans conservation contrôlée.

## I. Génération documentaire

Prérequis à cadrer avant toute implémentation :

- moteur DOCX ;
- moteur PDF ;
- modèles de documents ;
- contrôle de codification ;
- contrôle des chemins ;
- contrôle titre / référence / version / statut.

Un document généré ne pourra être considéré comme publiable que si :

- sa référence est conforme ;
- sa version est cohérente ;
- son titre est cohérent ;
- son statut documentaire est cohérent ;
- son emplacement cible respecte la charte ;
- le contrôle post-écriture dans ZONE21_DEV réussit.

## J. Writer unique

Principe à verrouiller :

- un seul service serveur pourra écrire dans ZONE21_DEV ;
- aucune écriture directe depuis le front ;
- aucune écriture directe collaborateur dans Drive ;
- aucune écriture directe NAS ;
- relecture physique obligatoire après écriture.

Conséquence d'architecture :

- le writer serveur est le seul point d'écriture logique ;
- Google Drive et NAS restent des supports techniques ;
- toute divergence observée doit être traitée comme incident de synchronisation, pas comme vérité alternative.

## K. Garde-fous avant validation

Un document ne peut jamais être affiché comme Validé si :

- DOCX absent ;
- PDF requis absent ;
- chemin non conforme ;
- référence non conforme ;
- version non conforme ;
- titre absent ou incohérent ;
- statut non conforme ;
- anomalie de gouvernance ouverte.

En cas de doute :

- le document doit rester `à vérifier` ou `bloqué` ;
- jamais `Validé par confort`.

## L. Risques ouverts

Risques à surveiller :

- corruption DOCX ;
- conflit Drive/NAS ;
- perte de version ;
- double source de vérité ;
- sécurité des accès ;
- droits trop larges ;
- synchronisation incomplète ;
- exposition d'un document non validé.

Lecture recommandée :

- ces risques doivent être traités en priorité avant toute activation d'écriture documentaire réelle ;
- aucun gain fonctionnel ne justifie une dilution de la vérité documentaire.

## M. Décisions à prendre avant implémentation

Arbitrages nécessaires :

- quels documents sont éditables en phase 1 ;
- qui valide quoi ;
- moteur DOCX retenu ;
- moteur PDF retenu ;
- emplacement des archives ;
- format du journal d'audit ;
- règles de versioning définitives ;
- règles de notification ;
- stratégie d'authentification réelle.

## Synthèse de cadrage

Le cadrage fonctionnel GED ZONE 21 doit rester aligné sur trois principes non négociables :

1. ZONE21_DEV reste seule source documentaire officielle ;
2. la base applicative reste un espace transitoire de pilotage et d'audit ;
3. aucune validation n'est reconnue sans écriture contrôlée et relecture physique conforme de ZONE21_DEV.

À ce stade :

- aucune écriture documentaire n'est active ;
- aucun archivage réel n'est actif ;
- aucune génération réelle DOCX/PDF n'est active ;
- aucun workflow d'écriture n'est activé ;
- le portail reste en lecture seule.
