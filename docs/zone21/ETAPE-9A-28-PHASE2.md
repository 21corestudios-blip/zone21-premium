# ETAPE 9A-28 — Activation opérationnelle PHASE_2

## Statut

Étape exécutée et validée sur un périmètre réel strictement limité à `PHASE_2`.

Le writer GED a été utilisé sur un seul cas réel `MEDIA` hors `TEST`, avec succès sur le scénario nominal et succès sur le rollback contrôlé.

## Périmètre utilisé

Périmètre actif :

- `/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_2`

Sous-dossiers utilisés :

- `NOTE-Z21/MEDIA/01_DOCX/`
- `NOTE-Z21/MEDIA/02_PDF/`
- `NOTE-Z21/MEDIA/99_ARCHIVES/01_DOCX/`
- `NOTE-Z21/MEDIA/99_ARCHIVES/02_PDF/`

Volume traité :

- `1` document source
- `1` scénario nominal
- `1` scénario de rollback

## Configuration utilisée

- `PHASE_2_ENABLED=true`
- `NODE_ENV=staging`
- `WRITER_ENABLED=true`
- `WRITER_REAL_EXECUTION_CONFIRMED=true`
- `PDF_ENGINE=linux`
- `PDF_LINUX_INSTANCE=zone21-pdf-linux`
- `Z21_ACTIVE_BASE_PATH=/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_2`

## Cas réellement testé

Le libellé d'exemple initial `NOTE-Z21-MEDIA-INTRO-BRAND-v1.0` n'a pas été utilisé, car il n'est pas conforme à la liste d'objets `MEDIA` autorisés.

Cas conforme retenu :

- source : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0`
- cible nominale : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1`
- cible rollback : `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.2`

## Résultat du scénario nominal v1.0 -> v1.1

Pipeline exécuté :

- validation GED
- génération DOCX sandbox
- conversion PDF Linux
- archivage `v1.0`
- écriture `v1.1` DOCX
- écriture `v1.1` PDF
- relecture physique

Résultat global :

- `OK`

Contrôles constatés :

### DOCX

- `v1.1` créé : `OK`
- taille `> 0` : `OK` (`3791` octets)
- fichier lisible : `OK`
- type détecté : `Microsoft Word 2007+`

### PDF

- `v1.1` créé : `OK`
- taille `> 0` : `OK` (`16652` octets)
- conversion Linux réussie : `OK`
- fichier lisible : `OK`
- type détecté : `PDF document, version 1.7, 1 page`

### Archivage

- `v1.0.docx` déplacé en archive : `OK`
- `v1.0.pdf` déplacé en archive : `OK`
- aucun doublon actif `v1.0` : `OK`

### Structure

- arborescence respectée : `OK`
- aucun fichier parasite final : `OK`

### Logs

- scope `PHASE_2` visible : `OK`
- pipeline complet tracé : `OK`
- aucune erreur silencieuse : `OK`

Étapes observées :

- `validation_ged_complete`
- `generation_docx_sandbox`
- `generation_pdf_sandbox`
- `archivage_version_precedente`
- `copie_docx_zone21_dev`
- `copie_pdf_zone21_dev`
- `relecture_physique_zone21_dev`

## Résultat du rollback contrôlé v1.1 -> v1.2

Méthode :

- injection d'une panne sur la copie PDF finale via collision contrôlée sur le chemin cible `v1.2.pdf`

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
- aucun résidu parasite final après nettoyage de l'injecteur : `OK`

## Anomalies rencontrées puis levées

- l'exemple `INTRO-BRAND` était non conforme aux objets `MEDIA` autorisés
- l'accès Lima depuis le sandbox local nécessitait une exécution autorisée
- la résolution physique des chemins scoped dupliquait `90_GED_PHASE_2` dans certains cas

Ces points ont été corrigés avant la validation finale du test `PHASE_2`.

## État final confirmé

Actif :

- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx`
- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.pdf`

Archives :

- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx`
- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf`

Absences confirmées :

- pas de `v1.0` en actif
- pas de `v1.2` en actif
- pas d'archive résiduelle `v1.1`

## Conclusion

Validation opérationnelle `PHASE_2` :

- usage réel hors `TEST` : `VALIDÉ`
- conversion PDF Linux : `VALIDÉ`
- archivage : `VALIDÉ`
- relecture physique : `VALIDÉ`
- rollback contrôlé : `VALIDÉ`

Le writer GED peut donc être utilisé sur le périmètre limité `PHASE_2` tel qu'il est défini aujourd'hui, sans extension à d'autres types ni à d'autres dossiers.
