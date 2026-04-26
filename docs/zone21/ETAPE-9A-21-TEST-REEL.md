# ETAPE 9A-21 — Test réel sur base ZONE21_DEV contrôlée

## Statut

Étape exécutée sur périmètre `TEST`, mais non validée.

Le writer réel n'est pas validé à ce stade.

## Périmètre préparé

Un périmètre isolé a été créé dans la base active locale :

- `/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_1/TEST/NOTE-Z21/MEDIA/01_DOCX/`
- `/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_1/TEST/NOTE-Z21/MEDIA/02_PDF/`
- `/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_1/TEST/NOTE-Z21/MEDIA/99_ARCHIVES/01_DOCX/`
- `/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_1/TEST/NOTE-Z21/MEDIA/99_ARCHIVES/02_PDF/`

Une sauvegarde préalable a aussi été créée :

- `/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_1/TEST/NOTE-Z21/MEDIA/00_PRE_TEST_BACKUP/`

## Sources créées manuellement

Les fichiers source de test `v1.0` ont été préparés avec une référence conforme :

- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx`
- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf`

Les deux fichiers sont présents, non vides et lisibles au niveau structurel :

- DOCX : archive ZIP OOXML valide
- PDF : document PDF 1 page valide

## Préparation d'exécution

Le test réel a été lancé avec :

- `NODE_ENV=staging`
- `WRITER_ENABLED=true`
- `WRITER_REAL_EXECUTION_CONFIRMED=true`
- `Z21_ACTIVE_BASE_PATH=/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_1/TEST`

Le périmètre `TEST` a été contraint via un miroir interne afin que le writer n'écrive que dans :

- `/90_GED_PHASE_1/TEST/NOTE-Z21/MEDIA/...`

## Résultat du test réel principal v1.0 -> v1.1

Référence source :

- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0`

Référence cible :

- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1`

Résultat global :

- échec du pipeline au stade conversion PDF LibreOffice

Erreur observée :

- le writer a bien généré le `DOCX` sandbox `v1.1`
- LibreOffice a échoué avec un code retour `134`
- aucun `PDF` `v1.1` n'a été produit
- aucune écriture finale n'a été faite dans le périmètre `TEST`

## Contrôle détaillé OK / KO

### A. DOCX

- `v1.1` créé dans `ZONE21_DEV/TEST` : `KO`
- taille `> 0` dans la cible finale : `KO`
- ouverture OK dans la cible finale : `KO`

Complément :

- un `v1.1.docx` sandbox a bien été généré
- archive ZIP valide
- contenu XML cohérent

### B. PDF

- `v1.1` créé dans `ZONE21_DEV/TEST` : `KO`
- taille `> 0` : `KO`
- conversion LibreOffice réussie : `KO`

### C. Archivage

- `v1.0` déplacé en `99_ARCHIVES` : `KO`
- aucun doublon : `OK`

Précision :

- l'échec est intervenu avant toute écriture finale ; la source `v1.0` est donc restée en place

### D. Structure

- aucun fichier parasite dans `TEST` : `OK`
- arborescence respectée : `OK`

### E. Logs

- étapes complètes présentes : `OK`
- aucune erreur silencieuse : `OK`

Étapes tracées :

- `start`
- `validation_ged_complete`
- `generation_docx_sandbox`
- `failure`

## Analyse de l'anomalie principale

Le blocage réel n'est plus un problème de configuration ou d'absence de LibreOffice.

Le problème observé est plus précis :

- le `DOCX` généré par le writer est structurellement lisible comme archive OOXML minimale ;
- LibreOffice échoue néanmoins lors de la conversion réelle en PDF ;
- cela indique que le document généré n'est pas encore suffisamment compatible pour une conversion LibreOffice stable en conditions réelles.

## Test de rollback contrôlé

Un second scénario contrôlé a été lancé sur le même périmètre `TEST` pour valider le rollback.

Erreur provoquée :

- échec forcé au moment de la copie PDF finale

Résultat :

- archivage temporaire déclenché
- copie DOCX déclenchée
- rollback exécuté
- restauration complète de `v1.0`
- absence de `v1.1` final
- archives revenues à l'état vide

Statut rollback :

- restauration complète `v1.0` : `OK`
- absence de `v1.1` corrompu dans `TEST` : `OK`
- absence de doublon final : `OK`

## Validation

Statut de l'étape :

- périmètre test : prêt
- fichiers source : prêts
- sauvegarde préalable : faite
- référence de test : conforme
- base active : réalignée
- test réel principal : non validé
- rollback réel sur base active : validé sur scénario d'erreur contrôlé

## Anomalies à lever avant nouveau test

- corriger la compatibilité LibreOffice du `DOCX` généré par le writer
- relancer ensuite un unique test manuel contrôlé `v1.0 -> v1.1`
- ne pas déclarer le writer validé tant que :
  - `DOCX` final créé
  - `PDF` final créé
  - archivage final confirmé
  - rollback confirmé
  - relecture physique confirmée

## Conclusion

Cette étape n'est pas validée fonctionnellement comme validation réelle complète du writer.

Ce qui est validé :

- périmètre réel `TEST`
- configuration `staging`
- logs d'exécution
- rollback contrôlé

Ce qui n'est pas validé :

- conversion PDF réelle sur le `DOCX` produit par le writer
- création complète `v1.1` en base active `TEST`
- archivage réel final associé au scénario nominal
