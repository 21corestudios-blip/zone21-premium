# ETAPE 9A-21 — Test réel sur base ZONE21_DEV contrôlée

## Statut

Étape exécutée sur périmètre `TEST` et validée après reprise de la conversion PDF via Linux staging.

Le writer réel est validé sur le scénario nominal complet et sur le scénario de rollback contrôlé.

## Périmètre utilisé

Le test a été strictement limité à :

- `/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_1/TEST/`

Arborescence concernée :

- `NOTE-Z21/MEDIA/01_DOCX/`
- `NOTE-Z21/MEDIA/02_PDF/`
- `NOTE-Z21/MEDIA/99_ARCHIVES/01_DOCX/`
- `NOTE-Z21/MEDIA/99_ARCHIVES/02_PDF/`

Sauvegarde préalable conservée :

- `NOTE-Z21/MEDIA/00_PRE_TEST_BACKUP/`

## Préconditions validées

Configuration d'exécution :

- `NODE_ENV=staging`
- `WRITER_ENABLED=true`
- `WRITER_REAL_EXECUTION_CONFIRMED=true`
- `PDF_ENGINE=linux`
- `PDF_LINUX_INSTANCE=zone21-pdf-linux`
- `Z21_ACTIVE_BASE_PATH=/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_1/TEST`

Environnement Linux :

- instance Lima active : `zone21-pdf-linux`
- LibreOffice Linux opérationnel : `LibreOffice 25.8.5.2`

Note de contexte :

- le blocage initial observé sur macOS venait de LibreOffice local en mode headless
- la validation finale a donc été rejouée avec conversion PDF déportée sur Linux staging

## Références testées

Scénario nominal :

- source : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0`
- cible : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1`

Scénario de rollback :

- source : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1`
- cible : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.2`

## Résultat du scénario nominal v1.0 -> v1.1

Pipeline exécuté :

- validation GED
- génération DOCX sandbox
- transfert vers Linux
- conversion PDF Linux
- récupération PDF sandbox
- archivage `v1.0`
- écriture `v1.1` DOCX
- écriture `v1.1` PDF
- relecture physique

Résultat global :

- `OK`

Contrôles constatés :

### DOCX

- fichier `v1.1` présent : `OK`
- taille `> 0` : `OK` (`3776` octets)
- structure DOCX lisible : `OK`
- archive OOXML ouvrable : `OK`

### PDF

- fichier `v1.1` présent : `OK`
- taille `> 0` : `OK` (`16738` octets)
- conversion LibreOffice Linux réussie : `OK`
- fichier reconnu comme PDF 1 page : `OK`

### Archivage

- `v1.0.docx` déplacé en archive : `OK`
- `v1.0.pdf` déplacé en archive : `OK`
- aucun doublon actif `v1.0` : `OK`

### Structure

- arborescence respectée : `OK`
- aucun fichier parasite créé par le scénario nominal : `OK`

### Logs

- pipeline complet tracé : `OK`
- aucune erreur silencieuse : `OK`

Étapes présentes dans les logs :

- `validation_ged_complete`
- `generation_docx_sandbox`
- `generation_pdf_sandbox`
- `archivage_version_precedente`
- `copie_docx_zone21_dev`
- `copie_pdf_zone21_dev`
- `relecture_physique_zone21_dev`

## Résultat du rollback contrôlé v1.1 -> v1.2

Méthode :

- erreur forcée sur la copie PDF finale via collision contrôlée sur le chemin cible `v1.2.pdf`

Point d'échec obtenu :

- après archivage `v1.1`
- après copie DOCX `v1.2`
- avant copie PDF `v1.2`

Résultat global :

- `OK`

Contrôles constatés après rollback :

- aucune `v1.2` finale active : `OK`
- `v1.1.docx` restauré en actif : `OK`
- `v1.1.pdf` restauré en actif : `OK`
- aucune archive résiduelle `v1.1` : `OK`
- archives `v1.0` conservées : `OK`
- aucun résidu parasite après nettoyage de l'injecteur de panne : `OK`

## Vérification physique finale de l'état TEST

État final confirmé après les deux scénarios :

- actif DOCX : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx`
- actif PDF : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.pdf`
- archives DOCX : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx`
- archives PDF : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf`

Absences confirmées :

- pas de `v1.0` en actif
- pas de `v1.2` en actif
- pas d'archive résiduelle `v1.1`

## Conclusion

Validation finale :

- scénario nominal complet : `VALIDÉ`
- rollback contrôlé : `VALIDÉ`
- writer GED réel sur périmètre `TEST` : `VALIDÉ`

La chaîne complète est donc validée sur ce périmètre contrôlé :

- `DOCX`
- `PDF`
- archivage
- écriture
- relecture physique
- rollback
