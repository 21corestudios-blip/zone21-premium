# ETAPE 9A-30 — Validation multi-documents PHASE_2

## Statut

Étape exécutée sur plusieurs cas réels successifs en `PHASE_2`, sans parallélisation et sans sortie du périmètre autorisé.

Constat final :

- robustesse writer multi-documents : `VALIDÉE`
- rollback multi-documents : `VALIDÉ`
- absence d'effets de bord entre documents : `VALIDÉE`
- visibilité immédiate dans le RDM web : `NON VALIDÉE EN L'ÉTAT`

En conséquence, la robustesse opérationnelle du writer est confirmée sur plusieurs cas successifs, mais l'étape n'est pas totalement validable tant que l'exposition immédiate de ces nouveaux documents dans le RDM reste incomplète.

## Périmètre utilisé

Périmètre strictement utilisé :

- `/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_2`

Sous-dossiers concernés :

- `NOTE-Z21/MEDIA/01_DOCX/`
- `NOTE-Z21/MEDIA/02_PDF/`
- `NOTE-Z21/MEDIA/99_ARCHIVES/01_DOCX/`
- `NOTE-Z21/MEDIA/99_ARCHIVES/02_PDF/`

Règles respectées :

- aucun batch
- aucune exécution parallèle
- aucun dossier hors `PHASE_2`
- aucune modification du writer, de la sécurité, du pipeline ou de la logique RDM pendant les tests

## Configuration utilisée

- `PHASE_2_ENABLED=true`
- `NODE_ENV=staging`
- `WRITER_ENABLED=true`
- `WRITER_REAL_EXECUTION_CONFIRMED=true`
- `PDF_ENGINE=linux`
- `PDF_LINUX_INSTANCE=zone21-pdf-linux`
- `Z21_ACTIVE_BASE_PATH=/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV/90_GED_PHASE_2`

Environnement Linux confirmé :

- instance Lima active : `zone21-pdf-linux`
- LibreOffice Linux opérationnel : `LibreOffice 25.8.5.2`

## Cas réellement testés

Les exemples initiaux `PLAN-CONTENU` et `FICHE-PROJET` n'ont pas été retenus, car ils ne correspondent pas aux objets `MEDIA` actuellement autorisés par les règles GED phase 1.

Cas conformes utilisés :

- `NOTE-Z21-MEDIA-SCRIPT-CONTENU-v1.0` -> `NOTE-Z21-MEDIA-SCRIPT-CONTENU-v1.1`
- `NOTE-Z21-MEDIA-CALENDRIER-PUBLICATION-v1.0` -> `NOTE-Z21-MEDIA-CALENDRIER-PUBLICATION-v1.1`

Cas de rollback contrôlé :

- `NOTE-Z21-MEDIA-SCRIPT-CONTENU-v1.1` -> `NOTE-Z21-MEDIA-SCRIPT-CONTENU-v1.2`

## Résultat du cas 1 — SCRIPT-CONTENU v1.0 -> v1.1

Résultat global :

- `OK`

DOCX :

- `v1.1` créé : `OK`
- lisible : `OK`
- type détecté : `Microsoft Word 2007+`
- taille `> 0` : `OK` (`3768` octets)

PDF :

- `v1.1` créé : `OK`
- conversion Linux réussie : `OK`
- lisible : `OK`
- type détecté : `PDF document, version 1.7, 1 page`
- taille `> 0` : `OK` (`15942` octets)

Archivage :

- `v1.0.docx` archivé : `OK`
- `v1.0.pdf` archivé : `OK`
- aucune collision : `OK`
- aucun doublon actif `v1.0` : `OK`

Logs :

- trace complète : `OK`
- aucune erreur silencieuse : `OK`
- étapes observées :
  - `validation_ged_complete`
  - `generation_docx_sandbox`
  - `generation_pdf_sandbox`
  - `archivage_version_precedente`
  - `copie_docx_zone21_dev`
  - `copie_pdf_zone21_dev`
  - `coherence_rdm_zone21_dev`
  - `relecture_physique_zone21_dev`

## Résultat du cas 2 — CALENDRIER-PUBLICATION v1.0 -> v1.1

Résultat global :

- `OK`

DOCX :

- `v1.1` créé : `OK`
- lisible : `OK`
- type détecté : `Microsoft Word 2007+`
- taille `> 0` : `OK` (`3780` octets)

PDF :

- `v1.1` créé : `OK`
- conversion Linux réussie : `OK`
- lisible : `OK`
- type détecté : `PDF document, version 1.7, 1 page`
- taille `> 0` : `OK` (`16343` octets)

Archivage :

- `v1.0.docx` archivé : `OK`
- `v1.0.pdf` archivé : `OK`
- aucune collision : `OK`
- aucun doublon actif `v1.0` : `OK`

Logs :

- trace complète : `OK`
- aucune erreur silencieuse : `OK`
- mêmes étapes nominales observées que sur le cas précédent

## Vérification RDM

Constat de synchronisation applicative :

- la cohérence physique writer/fichiers est correcte
- la relecture post-écriture est correcte
- les fichiers sont bien présents et téléchargeables par chemin réel

Limite actuelle :

- les nouveaux documents `PHASE_2` testés ne remontent pas encore dans la vue RDM web courante
- la recherche par référence sur ces nouveaux cas retourne actuellement une liste vide

Cause identifiée :

- le portail RDM repose encore sur un registre documentaire statique pour l'inventaire initial
- les nouveaux cas `PHASE_2` testés ne sont pas encore indexés dans ce registre

Conclusion sur ce point :

- critère `visible immédiatement dans le RDM` : `KO`
- ce point ne remet pas en cause le succès writer/fichiers, mais empêche une validation fonctionnelle complète du volet RDM pour cette étape

## Résultat du rollback contrôlé — SCRIPT-CONTENU v1.1 -> v1.2

Méthode :

- panne contrôlée injectée sur la copie PDF finale via collision volontaire sur le chemin cible `v1.2.pdf`

Point d'échec obtenu :

- après archivage `v1.1`
- après copie DOCX `v1.2`
- avant copie PDF `v1.2`

Résultat global :

- `OK`

Contrôles après rollback :

- aucune `v1.2` finale active : `OK`
- `v1.1.docx` restauré en actif : `OK`
- `v1.1.pdf` restauré en actif : `OK`
- aucune archive résiduelle `v1.1` : `OK`
- archives `v1.0` conservées : `OK`
- aucun résidu parasite final : `OK`

## Vérification absence d'effets de bord

Constats :

- aucun impact d'un document sur l'autre : `OK`
- aucune collision de chemins : `OK`
- aucune erreur cumulative entre exécutions successives : `OK`
- structure `PHASE_2` restée propre après nominal + rollback : `OK`

État final confirmé :

Actifs :

- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx`
- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.pdf`
- `NOTE-Z21-MEDIA-SCRIPT-CONTENU-v1.1.docx`
- `NOTE-Z21-MEDIA-SCRIPT-CONTENU-v1.1.pdf`
- `NOTE-Z21-MEDIA-CALENDRIER-PUBLICATION-v1.1.docx`
- `NOTE-Z21-MEDIA-CALENDRIER-PUBLICATION-v1.1.pdf`

Archives :

- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx`
- `NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf`
- `NOTE-Z21-MEDIA-SCRIPT-CONTENU-v1.0.docx`
- `NOTE-Z21-MEDIA-SCRIPT-CONTENU-v1.0.pdf`
- `NOTE-Z21-MEDIA-CALENDRIER-PUBLICATION-v1.0.docx`
- `NOTE-Z21-MEDIA-CALENDRIER-PUBLICATION-v1.0.pdf`

Absences confirmées :

- aucun `v1.0` restant en actif sur les cas testés
- aucune `v1.2` résiduelle
- aucune archive parasite `v1.1`

## Conclusion

Validation multi-documents `PHASE_2` :

- exécutions successives nominales : `VALIDÉ`
- conversion PDF Linux répétée : `VALIDÉ`
- archivage sans collision : `VALIDÉ`
- rollback contrôlé : `VALIDÉ`
- absence d'effets de bord inter-documents : `VALIDÉ`
- visibilité immédiate dans le RDM web : `NON VALIDÉ`

Conclusion générale :

- la robustesse technique et opérationnelle du writer GED sur plusieurs cas réels successifs est confirmée
- la validation fonctionnelle complète de l'étape reste partielle tant que le portail RDM n'expose pas immédiatement ces nouveaux cas `PHASE_2`
