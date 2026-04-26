# ETAPE 9A-22 — Validation conversion PDF sur Linux staging

## Statut

Étape exécutée.

Résultat principal :

- la conversion `DOCX -> PDF` via LibreOffice fonctionne en environnement Linux contrôlé ;
- le blocage observé précédemment n'est donc pas un blocage général du pipeline documentaire ;
- le problème restant est cohérent avec un comportement spécifique à LibreOffice/macOS dans le contexte local de test ;
- l'étape `9A-21` ne doit toujours pas être validée à ce stade.

## Rappel de périmètre

Cette étape a été menée hors writer GED :

- aucun appel au writer réel pour écrire dans `ZONE21_DEV` ;
- aucune écriture dans `ZONE21_DEV` depuis l'environnement Linux ;
- aucune modification de la logique GED ;
- aucun couplage avec le pipeline nominal de publication.

Le test a porté uniquement sur la capacité de LibreOffice à convertir correctement des fichiers `DOCX` en `PDF` sous Linux.

## Environnement utilisé

Environnement Linux local contrôlé :

- hôte : macOS `14.8.4`
- virtualisation : `Lima`
- instance : `zone21-pdf-linux`
- système invité : Ubuntu Linux

Commande de validation environnement :

```bash
soffice --version
```

Résultat :

- `LibreOffice 25.8.5.2 580(Build:2)`

## Fichiers testés

Trois cas ont été testés.

### 1. DOCX simple

Fichier :

- `plain.docx`

Origine :

- document texte simple converti en `docx`

### 2. DOCX template

Fichier :

- `note-z21-standard-v1.docx`

Origine :

- template réel utilisé pour la génération documentaire GED

### 3. DOCX rendu sur template

Fichier :

- `templated-rendered.docx`

Origine :

- rendu indépendant via `docxtemplater` sur le template réel, sans appel au writer

## Commandes testées

Préparation des répertoires Linux :

```bash
mkdir -p /tmp/zone21_pdf_linux_vm/in /tmp/zone21_pdf_linux_vm/out
```

Conversion Linux :

```bash
soffice --headless --convert-to pdf --outdir /tmp/zone21_pdf_linux_vm/out /tmp/zone21_pdf_linux_vm/in/plain.docx
soffice --headless --convert-to pdf --outdir /tmp/zone21_pdf_linux_vm/out /tmp/zone21_pdf_linux_vm/in/note-z21-standard-v1.docx
soffice --headless --convert-to pdf --outdir /tmp/zone21_pdf_linux_vm/out /tmp/zone21_pdf_linux_vm/in/templated-rendered.docx
```

## Résultats Linux

### DOCX simple

- conversion : `OK`
- PDF généré : `plain.pdf`
- taille : `13776` octets
- type détecté : `PDF document, version 1.7, 1 page`

### DOCX template

- conversion : `OK`
- PDF généré : `note-z21-standard-v1.pdf`
- taille : `13862` octets
- type détecté : `PDF document, version 1.7, 1 page`

### DOCX rendu sur template

- conversion : `OK`
- PDF généré : `templated-rendered.pdf`
- taille : `16650` octets
- type détecté : `PDF document, version 1.7, 1 page`

## Résultat synthétique

| Cas | Linux LibreOffice | Taille > 0 | PDF reconnu |
|---|---|---:|---|
| DOCX simple | OK | Oui | Oui |
| DOCX template | OK | Oui | Oui |
| DOCX rendu sur template | OK | Oui | Oui |

## Comparaison avec macOS

Un test miroir a été lancé sur macOS avec le `DOCX` simple :

```bash
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf --outdir /tmp/zone21_pdf_macos_probe /tmp/zone21_pdf_linux_inputs/plain.docx
```

Résultat :

- échec `EXIT:134`

Version LibreOffice macOS locale :

- `LibreOffice 26.2.2.2`

Conclusion comparative :

- même type de fichier `DOCX`
- même logique de conversion
- `Linux : OK`
- `macOS local : KO`

Le blocage précédemment observé est donc fortement corrélé à l'environnement LibreOffice/macOS local, et non à une impossibilité générale de convertir les documents GED en PDF.

## Interprétation technique

Ce que cette étape permet d'affirmer :

- le template réel `DOCX` est exploitable par LibreOffice sur Linux ;
- un `DOCX` rendu sur ce template est également convertible en PDF sous Linux ;
- le moteur de conversion LibreOffice reste donc une option viable à condition d'être isolé sur un environnement Linux contrôlé ;
- le problème rencontré jusque-là ne suffit plus à incriminer le template ou le principe de génération `DOCX`.

Ce que cette étape ne valide pas encore :

- le pipeline nominal complet du writer dans `ZONE21_DEV` ;
- l'archivage réel nominal ;
- la relecture physique finale sur base active ;
- la validation fonctionnelle complète de `9A-21`.

## Décision technique

Décision recommandée à ce stade :

- retenir en priorité une exécution `LibreOffice headless` sur environnement Linux staging contrôlé ;
- ne pas s'appuyer sur LibreOffice/macOS local pour valider le nominal ;
- conserver `Aspose.Words` comme alternative de secours si la filière Linux staging devient impraticable ;
- conserver `ONLYOFFICE` comme option de service intermédiaire, mais non prioritaire à ce stade.

## Conclusion

Le test `9A-22` établit une preuve exploitable :

- `LibreOffice` sait convertir correctement les trois cas `DOCX -> PDF` sous Linux ;
- le blocage observé auparavant est spécifique au contexte local macOS ;
- la suite logique consiste à isoler la conversion PDF du pipeline GED sur une cible Linux contrôlée ;
- `9A-21` reste non validée tant que ce moteur Linux n'est pas réinjecté proprement dans le scénario nominal complet.
