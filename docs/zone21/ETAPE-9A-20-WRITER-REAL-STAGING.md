# ETAPE 9A-20 — Writer réel STAGING avec écriture contrôlée

## Statut

Cette étape autorise les premières écritures réelles du writer GED uniquement en `staging`, avec double confirmation et garde-fous de rollback.

## Conditions exactes d'écriture

L'écriture réelle n'est autorisée que si toutes les conditions suivantes sont réunies :

- `NODE_ENV=staging`
- `WRITER_ENABLED=true`
- `WRITER_REAL_EXECUTION_CONFIRMED=true`
- validation GED complète
- chemins documentaires cohérents
- génération sandbox `DOCX` réussie
- conversion sandbox `PDF` réussie

En dehors de ce cadre :

- `development` : interdit
- `production` : interdit
- absence de flag : interdit
- validation incomplète : interdit

## Procédure d'activation

1. préparer un environnement `staging`
2. vérifier `Z21_ACTIVE_BASE_PATH`
3. activer `WRITER_ENABLED=true`
4. activer `WRITER_REAL_EXECUTION_CONFIRMED=true`
5. vérifier les modèles documentaires
6. vérifier LibreOffice
7. lancer les tests de validation
8. exécuter avec validation humaine préalable

## Checklist avant exécution

- tests GED au vert
- sandbox validé
- `docxtemplater` validé
- LibreOffice opérationnel
- base active accessible
- référence conforme
- version conforme
- titre conforme
- archivage source identifiable si nécessaire
- rôle validateur autorisé

## Pipeline réel

Le pipeline d'écriture suit cet ordre :

1. validation GED
2. génération `DOCX` dans le sandbox
3. conversion `PDF` dans le sandbox
4. archivage de la version précédente si requis
5. copie `DOCX` vers `ZONE21_DEV`
6. copie `PDF` vers `ZONE21_DEV`
7. relecture physique
8. confirmation de taille strictement positive
9. retour `written`

## Procédure de rollback

Si une erreur survient après une écriture partielle :

- suppression des nouveaux fichiers créés
- restauration des archives déplacées
- journalisation de l'échec
- blocage immédiat du pipeline

Le rollback est logique et séquentiel. Il doit être tenté en ordre inverse des opérations déjà exécutées.

## Journalisation

Le logger trace désormais des niveaux explicites :

- `start`
- `step`
- `success`
- `failure`

Chaque étape importante du pipeline doit produire une trace.

## Validation humaine obligatoire

L'exécution réelle ne doit être autorisée qu'après validation humaine explicite.

À documenter côté gouvernance :

- qui valide
- comment valider
- dans quels cas autoriser
- quand refuser

## Risques réels

- écriture accidentelle dans la base active
- corruption documentaire
- conflit de version
- rollback incomplet
- désynchronisation Drive/NAS
- erreur humaine

## Limites

- aucune exposition via API publique
- aucune écriture depuis le front
- aucune activation en `production`
- dépendance au bon paramétrage de `Z21_ACTIVE_BASE_PATH`

## Conclusion

Le writer réel devient techniquement capable d'écrire en `staging`, mais seulement sous double confirmation, avec journalisation détaillée et rollback logique.
