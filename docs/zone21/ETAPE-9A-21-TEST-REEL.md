# ETAPE 9A-21 — Test réel sur base ZONE21_DEV contrôlée

## Statut

Étape préparée et partiellement exécutée.

Le test réel complet n'est pas validé à ce stade.

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

## Vérifications effectuées

Contrôles positifs :

- périmètre `TEST` isolé créé
- sauvegarde préalable créée
- fichiers `v1.0` présents
- tailles strictement positives
- structure documentaire de base prête pour un essai manuel

## Blocages constatés

### 1. LibreOffice absent sur cette machine

Le binaire `soffice` n'est pas installé ou pas détectable localement.

Conséquence :

- la génération PDF réelle `v1.1` ne peut pas être validée honnêtement ;
- le test complet `DOCX + PDF + archivage + écriture + relecture` ne peut pas être approuvé dans l'état actuel de la machine.

### 2. Chemin de base actif réaligné

La variable `Z21_ACTIVE_BASE_PATH` a été réalignée sur le chemin réellement utilisé :

- `/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV`

Ce prérequis n'est donc plus bloquant.

## Résultat

Le test réel complet `v1.0 -> v1.1` n'a pas été lancé jusqu'au bout, volontairement, pour éviter :

- une validation incomplète sans moteur PDF réel ;
- une écriture potentiellement trompeuse sur base active.

## Rollback

Le rollback réel sur base active n'a pas été validé dans cette étape, car le test d'écriture complète n'a pas été autorisé dans ces conditions.

## Validation

Statut de l'étape :

- périmètre test : prêt
- fichiers source : prêts
- sauvegarde préalable : faite
- référence de test : conforme
- base active : réalignée
- writer réel complet : non validé
- rollback réel sur base active : non validé

## Anomalies à lever avant nouveau test

- installer et valider LibreOffice sur la machine de test
- relancer ensuite un unique test manuel contrôlé

## Conclusion

Cette étape n'est pas validée fonctionnellement comme test réel complet du writer.

En revanche, elle a permis de préparer un périmètre isolé, de créer les sources initiales, d'assurer la sauvegarde préalable et d'identifier précisément les trois blocages empêchant une validation honnête :

- LibreOffice absent
- test réel complet encore non relancé après correction des prérequis
