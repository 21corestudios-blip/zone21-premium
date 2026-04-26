# ETAPE 9A-23 — Intégration conversion PDF Linux

## Statut

Intégration technique préparée et branchée dans le writer réel.

La conversion PDF n'utilise plus en priorité LibreOffice local sur macOS. Le writer s'appuie désormais sur un service dédié de conversion Linux en environnement contrôlé.

## Architecture retenue

Composants ajoutés :

- `src/services/ged/pdf/linux-pdf.service.ts`
- `src/services/ged/writer/real/writer.real.pdf.ts` mis à jour pour appeler ce service
- `src/config/ged.config.ts` enrichi avec la configuration du moteur PDF Linux

## Flux retenu

Flux nominal :

1. génération `DOCX` en sandbox hôte ;
2. transfert du `DOCX` vers l'environnement Linux ;
3. conversion `LibreOffice --headless` côté Linux ;
4. récupération du `PDF` généré vers le sandbox hôte ;
5. vérification du fichier `PDF` local ;
6. poursuite du writer uniquement si le `PDF` est valide.

## Mode de communication

Mode actuellement implémenté :

- `PDF_LINUX_MODE=local`
- transport via `limactl copy --backend=scp`
- exécution distante via `limactl shell`

Le dossier de travail Linux est configuré par :

- `PDF_LINUX_PATH`

Le nom d'instance Linux par défaut est :

- `zone21-pdf-linux`

## Configuration

Variables prises en charge :

- `PDF_ENGINE=linux|local`
- `PDF_LINUX_PATH`
- `PDF_LINUX_MODE=local|remote`
- `PDF_LINUX_INSTANCE`
- `GED_CONVERSION_TIMEOUT_MS`
- `GED_SANDBOX_PATH`

Comportement par défaut :

- `PDF_ENGINE=linux`
- `PDF_LINUX_MODE=local`

## Gestion des erreurs

Les cas suivants sont gérés :

- timeout conversion ;
- erreur distante `limactl` ;
- fichier non généré ;
- fichier généré mais taille `0` ;
- nom de fichier incohérent.

En cas d'échec :

- le `PDF` local de sandbox est supprimé ;
- les artefacts distants Linux sont nettoyés ;
- le writer ne poursuit pas l'écriture finale en base active ;
- le rollback existant côté writer reste intact.

## Rollback

Le rollback du writer n'a pas été élargi ni cassé.

Le principe reste :

- tant que `DOCX` et `PDF` ne sont pas tous deux valides,
- aucune écriture finale ne doit être considérée comme nominalement réussie.

Le service Linux ajoute un nettoyage complémentaire :

- suppression des fichiers distants de travail ;
- suppression du `PDF` local récupéré s'il est invalide.

## Fallback

Un fallback technique reste disponible :

- `PDF_ENGINE=local`

Dans ce cas, le writer revient au chemin historique de conversion locale LibreOffice. Ce fallback est conservé pour compatibilité et tests, mais il n'est plus la voie recommandée.

## Limites actuelles

- le mode `PDF_LINUX_MODE=remote` n'est pas encore implémenté ;
- l'intégration repose sur un environnement Linux local ou accessible par `limactl` ;
- l'étape ne valide pas à elle seule le scénario nominal complet de `9A-21` ;
- la limitation opérationnelle au périmètre `TEST` reste une règle de déploiement et de validation, pas une ouverture de périmètre documentaire.

## Conclusion

Cette étape isole la conversion PDF dans un environnement Linux plus stable que le runtime macOS local, tout en conservant :

- la logique GED existante ;
- le rollback du writer ;
- le périmètre d'écriture actuel ;
- le contrôle final par le writer avant toute écriture en base active.
