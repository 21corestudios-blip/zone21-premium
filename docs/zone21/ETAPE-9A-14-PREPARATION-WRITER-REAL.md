# ETAPE 9A-14 — Préparation du writer réel

## Statut du document

Document de préparation technique du futur writer GED réel ZONE 21.

Cette étape ne déclenche aucune écriture documentaire réelle. Elle prépare uniquement l'infrastructure de planification nécessaire à une future publication contrôlée.

## 1. Architecture du writer réel

La structure préparée est organisée en plusieurs couches :

- `writer.real.types.ts` : types du plan réel
- `writer.real.fs.ts` : construction et validation des chemins
- `writer.real.docx.ts` : plan de génération DOCX
- `writer.real.pdf.ts` : plan de génération PDF
- `writer.real.service.ts` : orchestration complète du plan réel

## 2. Séparation dry-run / réel

Le writer dry-run existant reste inchangé.

La nouvelle couche `real/` ne remplace pas le dry-run. Elle prépare uniquement ce qui serait exécuté par un writer réel, sans jamais activer :

- l'ecriture dans `ZONE21_DEV`
- la génération DOCX réelle
- la conversion PDF réelle
- l'archivage réel
- le déplacement de fichiers

## 3. Description des plans

Le writer réel préparé retourne un objet de plan complet contenant :

- un plan de génération DOCX
- un plan de génération PDF
- un plan d'archivage
- un plan d'ecriture fichier
- un plan de signalement vers audit et RDM

Chaque sous-plan reste marqué comme non exécutable.

## 4. Ce qui reste strictement interdit

Dans cette étape, rien ne doit :

- écrire dans `ZONE21_DEV`
- écrire dans Google Drive
- écrire dans le NAS
- générer un vrai `DOCX`
- générer un vrai `PDF`
- déplacer un fichier
- supprimer un fichier
- activer `WRITER_ENABLED`

## 5. Points à surveiller

Les points suivants restent ouverts avant toute activation réelle :

- choix du moteur DOCX
- choix du moteur PDF
- stratégie de lock et de concurrence
- stratégie de reprise
- gestion des conflits de version
- validation du dossier `/90_GED_PHASE_1/`
- intégration future avec le RDM central

## 6. Tests du plan réel

Les tests préparés vérifient :

- la génération correcte du plan
- la conformité des chemins
- l'absence totale d'exécution réelle
- la cohérence entre chemin cible et chemin d'archive

## 7. Conclusion

La structure du writer réel est prête pour l'étape suivante de préparation technique, mais elle reste totalement inactive. Le système produit uniquement une description structurée de ce qui serait exécuté si un writer réel était un jour autorisé.
