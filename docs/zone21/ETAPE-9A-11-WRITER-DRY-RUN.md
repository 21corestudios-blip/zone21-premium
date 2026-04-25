# ETAPE 9A-11 — Writer GED dry-run

## Statut du document

Document de description du writer GED ZONE 21 implémenté en mode `dry-run`.

Cette étape n'active aucune écriture documentaire réelle. Le composant code ne fait que simuler les contrôles, les chemins théoriques, l'archivage théorique et l'aperçu de journal d'audit.

## 1. Ce qui est codé

La couche `writer` a été préparée en serveur avec :

- des types dédiés ;
- un validateur de règles GED phase 1 ;
- un service `dry-run` ;
- une route `GET` de test ;
- une simulation d'aperçu de journal d'audit.

## 2. Ce qui est simulé

Le dry-run simule uniquement :

- la création `DOCX` ;
- la création `PDF` ;
- l'archivage de l'ancienne version ;
- le calcul du chemin cible ;
- le calcul du chemin d'archive ;
- le statut final ;
- le retour d'un aperçu du journal d'audit.

## 3. Ce qui est interdit

Rien dans cette étape ne doit :

- écrire dans `ZONE21_DEV` ;
- écrire dans Google Drive ;
- écrire dans le NAS ;
- générer un vrai `DOCX` ;
- générer un vrai `PDF` ;
- déplacer un fichier ;
- archiver un fichier réel ;
- exposer une route d'écriture `POST`, `PUT`, `PATCH` ou `DELETE`.

## 4. Règles intégrées au dry-run

Le dry-run applique les règles suivantes :

- préfixes autorisés : `NOTE-Z21`, `PROC-Z21`
- domaines actifs : `DOC`, `MEDIA`, `WEAR`, `OPS`, `IA`
- domaines sous réserve : `PROD`, `SITE`
- domaine interdit : `FIN`
- objets autorisés par domaine selon les arbitrages 9A-8 et 9A-9
- chemins théoriques sous `/ZONE21_DEV/90_GED_PHASE_1/`

## 5. Comment tester

Route disponible :

- `GET /api/ged/writer/dry-run`

La route retourne :

- un exemple de simulation conforme ;
- un statut writer avec `enabled: false` ;
- les règles appliquées ;
- les domaines actifs, conditionnels et interdits ;
- les préfixes autorisés ;
- des scénarios bloqués de démonstration.

## 6. Limites du dry-run

Le dry-run ne prouve pas encore :

- la génération réelle des fichiers ;
- la compatibilité des bibliothèques `DOCX` ;
- la conversion réelle `PDF` ;
- la gestion effective des locks et de la concurrence ;
- la reprise réelle après échec ;
- la relecture physique post-écriture.

## 7. Utilité de cette étape

Cette étape sert à valider le comportement logique du futur writer sans prendre aucun risque documentaire. Elle permet de vérifier les conventions GED, les cas de blocage et les sorties attendues avant toute future activation d'un writer réel.
