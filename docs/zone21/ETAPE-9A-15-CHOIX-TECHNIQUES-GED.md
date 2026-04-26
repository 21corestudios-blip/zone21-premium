# ETAPE 9A-15 — Choix techniques GED

## Statut du document

Document d'analyse et d'arbitrage des technologies nécessaires au futur writer réel GED ZONE 21.

Cette étape ne déclenche aucune écriture documentaire réelle, aucune génération réelle `DOCX` ou `PDF`, n'active pas le writer et ne modifie aucun service applicatif existant.

## 1. Périmètre de décision

Les décisions techniques à cadrer concernent :

- le moteur de génération `DOCX`
- la stratégie de génération `PDF`
- la gestion des locks et de la concurrence
- la reprise après échec
- la gestion des conflits de version
- la pertinence du dossier `/90_GED_PHASE_1/`
- l'intégration future avec le RDM

## 2. Analyse des solutions DOCX

### A. `docx` (npm)

Sources officielles consultées :

- [docx API](https://docx.js.org/api/)
- [Packer](https://docx.js.org/api/classes/Packer.html)
- [patchDocument](https://docx.js.org/api/functions/patchDocument.html)

#### Avantages

- intégration naturelle avec `Node` et `Next.js`
- bibliothèque TypeScript solide
- génération OOXML directe
- possibilité de créer un document depuis zéro
- possibilité de modifier un `.docx` existant via `patchDocument`
- bonne cohérence avec la stack actuelle du projet

#### Limites

- plus orienté développeur que métier
- maintenance potentiellement lourde si le rendu documentaire devient très riche
- plus contraignant pour des modèles Word pilotés directement par des utilisateurs non techniques
- la fidélité de mise en page dépend plus fortement du code produit

#### Intégration avec Node / Next

Très bonne.

#### Compatibilité ZONE21

Bonne pour des documents très structurés et fortement contrôlés. Moins idéale si ZONE 21 veut déléguer l'évolution fine des modèles à des profils documentaires non techniques.

### B. `docxtemplater`

Sources officielles consultées :

- [documentation officielle](https://docxtemplater.com/docs/)
- [présentation produit](https://docxtemplater.com/)
- [installation Node](https://docxtemplater.com/docs/installation/)

#### Avantages

- approche template Word très adaptée à la gouvernance documentaire
- remplacement de balises, boucles et conditions bien compris
- les modèles peuvent être conçus ou maintenus dans Word par des profils non développeurs
- intégration `Node.js` claire
- très bon compromis entre cadrage métier et automatisation

#### Limites

- certaines capacités avancées reposent sur des modules payants
- la qualité du résultat dépend fortement de la qualité des modèles `.docx`
- la discipline de templating doit être stricte
- ne convertit pas lui-même le `DOCX` en `PDF`

#### Intégration avec Node / Next

Très bonne.

#### Compatibilité ZONE21

Très bonne. C'est aujourd'hui l'option la plus cohérente si ZONE 21 veut piloter des modèles documentaires Word maîtrisés par la gouvernance et remplir ces modèles à partir de données applicatives.

### C. `python-docx` via microservice

Source officielle consultée :

- [quickstart python-docx](https://python-docx.readthedocs.io/en/stable/user/quickstart.html)

#### Avantages

- mature et bien connu
- riche pour manipuler des documents Word en Python
- utile si une brique Python documentaire devient stratégique
- intéressant si l'écosystème documentaire ou IA s'oriente vers des pipelines Python

#### Limites

- impose une seconde stack technique
- complexifie l'exploitation, le déploiement et l'observabilité
- moins naturel dans le projet actuel centré `Node/Next`
- peut créer une frontière technique supplémentaire à maintenir

#### Intégration avec Node / Next

Moyenne, car nécessite un microservice ou un worker externe.

#### Compatibilité ZONE21

Possible, mais moins cohérente à court terme pour une phase 1 qui doit rester simple, lisible et bien intégrée au portail existant.

### D. LibreOffice headless

Source officielle consultée :

- [PDF export command line parameters](https://help.libreoffice.org/latest/sq/text/shared/guide/pdf_params.html)

#### Avantages

- excellent pour le rendu bureautique réel
- très utile pour la conversion `DOCX -> PDF`
- exécution locale possible sans dépendre d'une API externe
- bon niveau de fidélité si le `.docx` source est propre

#### Limites

- n'est pas le bon choix comme moteur principal de génération métier
- plus lourd à opérer qu'une simple bibliothèque npm
- dépendance système à fiabiliser
- observabilité et concurrence à cadrer sérieusement

#### Intégration avec Node / Next

Bonne comme outil système appelé par un worker ou un service dédié, moins pertinente comme moteur documentaire principal.

#### Compatibilité ZONE21

Très bonne comme brique de conversion PDF, moins pertinente comme brique centrale de génération DOCX.

## 3. Analyse des solutions PDF

### A. Conversion `DOCX -> PDF` via LibreOffice

Source officielle consultée :

- [LibreOffice PDF export parameters](https://help.libreoffice.org/latest/sq/text/shared/guide/pdf_params.html)

#### Avantages

- cohérence forte avec un document Word maître
- rendu PDF généralement plus fidèle qu'une reconstruction HTML
- logique simple : le `DOCX` officiel sert de base au `PDF` officiel
- compatible avec la doctrine ZONE 21 d'une source documentaire unique

#### Limites

- dépendance système
- monitoring à prévoir
- stratégie de lock et de reprise obligatoire

### B. Puppeteer (`HTML -> PDF`)

Source officielle consultée :

- [Puppeteer PDF generation](https://pptr.dev/guides/pdf-generation)

#### Avantages

- très intégré à l'écosystème Node
- pratique pour produire des PDF de documents HTML natifs
- utile pour des rendus web, rapports ou exports purement HTML

#### Limites

- crée un second rendu logique si le document maître est un `DOCX`
- risque fort de divergence entre Word et PDF
- moins compatible avec une gouvernance documentaire centrée sur un document Word officiel

### C. API externe

#### Avantages

- délègue la conversion et parfois la génération
- peut offrir une haute qualité de rendu

#### Limites

- dépendance fournisseur
- enjeux de confidentialité et de souveraineté
- coûts récurrents
- surface de risque supplémentaire

#### Compatibilité ZONE21

Faible à moyenne pour la phase 1, sauf besoin très spécifique.

## 4. Recommandation retenue

### Solution retenue pour le DOCX

`docxtemplater`

### Solution retenue pour le PDF

Conversion `DOCX -> PDF` via `LibreOffice headless`

### Justification

Cette combinaison est la plus cohérente avec ZONE 21 car elle permet :

- un modèle Word gouverné par la documentation
- un remplissage fiable depuis des données structurées
- un `PDF` dérivé du `DOCX` officiel, sans double rendu concurrent
- une meilleure maîtrise de la chaîne de vérité documentaire
- une intégration technique raisonnable dans l'architecture actuelle

### Recommandation secondaire

`docx` (npm) reste une bonne option de secours ou de complément si ZONE 21 doit produire certains documents très structurés directement en TypeScript, sans dépendre d'un template Word éditable.

## 5. Stratégie de lock et de concurrence

### Principe

Le verrouillage doit se faire à deux niveaux :

- lock par document
- lock par référence

### Lock par document

Un même brouillon ou une même révision ne doit pas pouvoir être publié en parallèle par deux exécutions.

### Lock par référence

Une référence documentaire cible ne doit pas pouvoir être générée simultanément par deux flux concurrents.

### Gestion des collisions

En cas de collision :

- blocage immédiat
- aucune écriture partielle
- journalisation de l'incident
- retour d'un statut bloqué ou à vérifier

## 6. Stratégie de reprise

### Rollback logique

Le rollback doit être logique avant d'être filesystem.

Tant qu'aucune écriture réelle n'est confirmée :

- l'état workflow reste non publié
- le RDM ne change pas
- l'audit conserve la tentative et l'échec

### Reprise après échec

En cas d'échec :

- journaliser l'étape échouée
- bloquer la publication
- exiger une relance explicite
- empêcher toute hypothèse de succès implicite

### Journalisation

Le journal doit indiquer :

- l'étape concernée
- l'erreur remontée
- le document cible
- la version cible
- le moment de l'échec
- l'utilisateur ou le processus initiateur

## 7. Gestion des conflits de version

### Détection

Le conflit de version doit être détecté avant toute tentative de génération finale :

- référence déjà présente
- version cible déjà utilisée
- nouvelle version incohérente par rapport à la version source

### Blocage

Le conflit doit être bloquant.

### Résolution

La résolution doit être explicite :

- correction manuelle de la version
- arbitrage documentaire
- relance contrôlée

## 8. Validation du dossier GED

### Analyse de `/90_GED_PHASE_1/`

Ce dossier est pertinent pour :

- isoler la GED phase 1 du reste de l'arborescence
- éviter la confusion avec les documents maîtres historiques
- tester la chaîne complète sans polluer les structures documentaires normatives existantes

### Compatibilité avec ZONE21_DEV

La proposition est cohérente à court terme, mais doit être confirmée par la charte d'arborescence documentaire.

### Alternatives possibles

Si `90_GED_PHASE_1` ne convient pas, alternatives possibles :

- un dossier pilote GED explicitement nommé selon la charte
- un sous-espace documentaire technique plus neutre
- une intégration future dans une arborescence documentaire définitive par domaine

### Recommandation

Conserver `90_GED_PHASE_1` comme espace pilote tant que la phase reste expérimentale et contrôlée.

## 9. Intégration future avec le RDM

### Rafraîchissement

Après écriture réelle confirmée, le RDM devra être rafraîchi à partir de l'état physique de `ZONE21_DEV`.

### Synchronisation

La synchronisation doit rester descendante :

- le writer écrit
- `ZONE21_DEV` fait foi
- le RDM relit

### Contrôle de vérité

Un document ne doit être exposé comme `Validé` que si :

- le `DOCX` officiel est physiquement confirmé
- le `PDF` requis est physiquement confirmé
- le chemin est conforme
- la référence et la version sont conformes
- aucune anomalie ouverte n'est présente

## 10. Points à surveiller reportés

- validation finale des moteurs `DOCX/PDF` en conditions réelles ;
- compatibilité avec NAS ;
- performance génération ;
- sécurité des accès ;
- volumétrie future.

## 11. Conclusion

La stratégie technique recommandée pour ZONE 21 est :

- `docxtemplater` pour la génération `DOCX`
- `LibreOffice headless` pour la conversion `PDF`
- lock par document et par référence
- reprise par rollback logique, journalisation et relance explicite
- détection bloquante des conflits de version
- maintien de `/90_GED_PHASE_1/` comme espace pilote sous réserve de validation documentaire finale

Cette combinaison offre aujourd'hui le meilleur compromis entre cohérence documentaire, maintenabilité, contrôle métier et compatibilité avec l'architecture ZONE 21.
