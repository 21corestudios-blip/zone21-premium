# ETAPE 9A-17 — Validation réelle DOCX/PDF en sandbox

## Statut

Cette étape active une validation technique réelle des moteurs DOCX et PDF uniquement dans un bac à sable local. Aucun accès en écriture n'est autorisé vers `ZONE21_DEV`, Google Drive ou le NAS.

## Fonctionnement sandbox

Le sandbox est défini par :

- `GED_SANDBOX_PATH`
- valeur par défaut : `/tmp/zone21_ged_sandbox`

Le writer réel conserve ses chemins logiques en `/ZONE21_DEV/...` pour la cohérence documentaire, mais toute exécution de validation est remappée vers le sandbox local.

Exemple :

- cible logique : `/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/...`
- cible sandbox réelle : `/tmp/zone21_ged_sandbox/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/...`

## Conditions d'exécution

La validation réelle n'est autorisée que si :

- `realExecutionSandboxOnly` reste à `true`
- le chemin cible résolu est strictement dans `GED_SANDBOX_PATH`
- le chemin ne contient jamais `/ZONE21_DEV/`

Dans le cas contraire, l'exécution est refusée immédiatement.

## Validation DOCX

Le moteur DOCX :

- charge un modèle en mémoire ;
- injecte les données avec `docxtemplater` ;
- génère un vrai fichier `.docx` dans le sandbox uniquement ;
- relit le fichier produit ;
- vérifie la cohérence minimale du contenu injecté.

## Validation PDF

Le moteur PDF :

- prépare une conversion réelle via LibreOffice ;
- exécute la conversion uniquement si le binaire LibreOffice est présent ;
- écrit le PDF uniquement dans le sandbox ;
- vérifie le nom de fichier et la taille produite.

Si LibreOffice est absent sur la machine de test, la validation PDF réelle est marquée comme indisponible et le test correspondant est ignoré proprement.

## Nettoyage automatique

Les tests d'intégration suppriment automatiquement :

- les fichiers DOCX générés ;
- les fichiers PDF générés ;
- le dossier sandbox temporaire.

## Résultats attendus

- DOCX réel généré dans le sandbox
- PDF réel généré dans le sandbox si LibreOffice est disponible
- refus explicite de tout chemin hors sandbox
- refus explicite de tout chemin contenant `/ZONE21_DEV/`
- absence d'accumulation de fichiers après test

## Limites actuelles

- aucune écriture n'est autorisée dans la base active documentaire
- la conversion PDF réelle dépend de la présence locale de LibreOffice
- le writer réel reste non activé pour la production
- aucune route API d'écriture n'est exposée

## Validation moteurs

Cette étape valide :

- la sécurité du remappage sandbox
- la génération réelle DOCX hors base active
- la conversion PDF réelle hors base active quand LibreOffice est disponible
- la robustesse du nettoyage de fin de test
