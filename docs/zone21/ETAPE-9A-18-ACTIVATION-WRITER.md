# ETAPE 9A-18 — Activation contrôlée du writer GED

## Statut

Cette étape formalise la stratégie d'activation future du writer GED réel. Aucun code n'est modifié et aucune écriture n'est autorisée à ce stade dans `ZONE21_DEV`, Google Drive ou le NAS.

## Principe général

L'activation du writer GED ne doit jamais être implicite. Elle doit résulter d'une décision explicite, documentée, testée et validée humainement.

Le writer réel ne peut être autorisé que si :

- la chaîne de vérité reste strictement respectée ;
- `ZONE21_DEV` demeure la seule source documentaire officielle ;
- le portail web n'agit jamais comme source documentaire parallèle ;
- toute écriture réelle est traçable, vérifiable et réversible logiquement.

## Conditions obligatoires d'activation

Avant toute activation réelle, les conditions suivantes doivent être réunies :

- tous les tests applicatifs et documentaires sont au vert ;
- les tests sandbox sont validés ;
- `docxtemplater` est validé sur les modèles réellement retenus ;
- LibreOffice est installé, détecté et opérationnel ;
- la sécurité technique du writer est validée ;
- les garde-fous anti-double-source sont validés ;
- la stratégie de lock/concurrence est validée ;
- la journalisation est validée ;
- la validation humaine explicite est obtenue ;
- une revue de gouvernance documentaire autorise le passage à l'écriture réelle.

## Mécanisme d'activation proposé

Le mécanisme d'activation recommandé est le suivant :

- variable d'environnement dédiée : `WRITER_ENABLED=true`
- activation uniquement dans un environnement contrôlé
- activation impossible par défaut
- activation jamais autorisée en production directe sans validation préalable

Principes associés :

- l'absence de variable d'environnement doit laisser le writer désactivé ;
- toute valeur autre que la valeur explicitement attendue doit être traitée comme un refus d'activation ;
- le garde-fou applicatif existant doit continuer à bloquer tant que l'activation réelle n'a pas été revue et approuvée.

## Niveaux d'environnement

### DEV

Règle :

- sandbox uniquement

Usage attendu :

- tests techniques locaux
- validation des modèles
- validation du pipeline DOCX/PDF
- aucune écriture dans `ZONE21_DEV`

### STAGING

Règle :

- écriture réelle autorisée sous conditions strictes

Conditions minimales :

- environnement isolé et contrôlé
- accès restreint
- journal d'audit actif
- verrouillage documentaire actif
- validation documentaire confirmée
- possibilité de contrôler physiquement les fichiers générés

### PROD

Règle :

- écriture autorisée avec validation renforcée

Conditions minimales :

- double validation obligatoire
- authentification réelle active
- journal d'audit complet
- contrôles pré-écriture et post-écriture actifs
- supervision documentaire active
- procédure de reprise connue et testée

## Garde-fous obligatoires

Les garde-fous minimaux à imposer avant toute activation sont :

- double validation obligatoire pour `PROD`
- journal d'audit obligatoire
- vérification du chemin avant écriture
- vérification de la référence
- vérification de la version
- vérification du titre
- vérification du statut documentaire cible
- blocage automatique en cas d'incohérence
- rollback logique en cas d'échec
- relecture physique obligatoire après écriture

Un document ne doit jamais être considéré comme réellement validé si :

- le `DOCX` officiel n'existe pas ;
- le `PDF` requis n'existe pas ;
- le chemin est incorrect ;
- la référence est incorrecte ;
- la version est incorrecte ;
- le titre est incohérent ;
- une anomalie de gouvernance reste ouverte.

## Processus d'écriture réel cible

Le processus cible à respecter est le suivant :

1. validation GED complète
2. génération `DOCX`
3. conversion `PDF`
4. archivage de la version précédente
5. écriture dans `ZONE21_DEV`
6. relecture physique des fichiers générés
7. mise à jour du RDM

Contraintes essentielles :

- chaque étape doit être journalisée ;
- chaque étape doit pouvoir bloquer la suite si une incohérence est détectée ;
- la mise à jour du RDM ne doit intervenir qu'après confirmation physique dans `ZONE21_DEV`.

## Risques à maîtriser

Les principaux risques d'activation réelle sont :

- écriture accidentelle dans un mauvais emplacement
- corruption `DOCX`
- conflit de version
- désynchronisation Drive/NAS
- erreur humaine
- validation documentaire incomplète
- double source de vérité implicite

## Stratégies de mitigation

Les stratégies minimales recommandées sont :

- lock par document
- lock par référence
- version strictement contrôlée
- audit trail complet
- tests pré-écriture obligatoires
- blocage automatique en cas d'écart
- relecture physique post-écriture
- refus d'écriture en cas de doute
- activation réservée à des rôles explicitement autorisés

## Validation humaine obligatoire

L'activation réelle du writer ne doit jamais être purement technique.

Elle doit être précédée par :

- une validation humaine documentaire
- une validation humaine sécurité
- une validation humaine gouvernance

En pratique, cela implique qu'aucun simple changement de variable d'environnement ne devrait suffire sans décision formelle associée.

## Points à surveiller reportés

- monitoring
- logs
- volumétrie
- montée en charge
- sécurité des accès collaborateurs

## Conclusion

Le writer réel ne pourra être activé que lorsque :

- les moteurs documentaires seront validés en conditions réelles ;
- les garde-fous seront confirmés ;
- les environnements seront cloisonnés ;
- la gouvernance documentaire aura approuvé explicitement l'ouverture de l'écriture réelle.

Tant que ces conditions ne sont pas réunies, le mode sûr actuel doit rester la norme.
