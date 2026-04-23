# Z21 AI Guardian

Orchestrateur local pour faire travailler GPT sur les documents rédactionnels sous contrôle des documents maîtres de `ZONE21_DEV`, puis faire relire la production par Gemini afin de détecter les dérives et proposer les mises à jour système utiles.

## Ce que fait ce socle

- charge les documents maîtres de référence depuis `00_MASTER_SYSTEM/01_SOURCES_ET_DIRECTIVES`
- construit un contexte de gouvernance pour le rédacteur et le contrôleur
- lance un agent de rédaction GPT via une commande locale configurable
- lance un agent de contrôle Gemini via une commande locale configurable
- stocke la rédaction, le rapport de contrôle, l'alerte et la proposition de mise à jour du registre

## Structure

- `z21_ai_guardian.py` : orchestrateur principal
- `config.example.json` : configuration à copier en `config.json`
- `prompts/gpt_system.txt` : consigne système pour GPT
- `prompts/gemini_system.txt` : consigne système pour Gemini
- `runs/` : sorties générées

## Prérequis

- macOS avec `textutil` disponible
- `python3`
- une commande locale utilisable pour GPT
- une commande locale utilisable pour Gemini

## Apps macOS locales

Les executables suivants existent bien sur la machine :

- `/Applications/ChatGPT.app/Contents/MacOS/ChatGPT`
- `/Applications/Gemini.app/Contents/MacOS/Gemini`

Dans l'etat, ils doivent etre consideres comme des executables d'applications GUI macOS, pas comme des CLI fiables lisant un prompt sur `stdin` et renvoyant une reponse sur `stdout`.

Consequence pratique :

- le mode `prepare` est deja parfaitement adapte a un usage avec ces apps
- le mode `cycle` completement automatise demande plutot une vraie CLI, une API, ou un wrapper externe deja scriptable
- une automatisation par interface graphique macOS reste possible, mais elle est plus fragile et depend des permissions Accessibilite

## Installation

1. Copier `config.example.json` vers `config.json`
2. Remplir les commandes `gpt.command` et `gemini.command`
3. Vérifier les chemins des documents maîtres si besoin

## Format des commandes

Les commandes sont exécutées via le shell, avec remplacement de variables.

Variables disponibles :

- `{system_file}`
- `{user_file}`
- `{output_file}`
- `{review_file}`
- `{draft_file}`
- `{task_file}`
- `{run_dir}`

Exemple théorique :

```sh
my-gpt-cli --system-file "{system_file}" --prompt-file "{user_file}" > "{output_file}"
```

Exemple théorique pour Gemini :

```sh
my-gemini-cli --system-file "{system_file}" --prompt-file "{user_file}" > "{output_file}"
```

## Usage

Créer un dossier de run avec le prompt utilisateur directement en ligne de commande :

```sh
python3 z21_ai_guardian.py cycle \
  --config config.json \
  --task "Rédige une note stratégique pour la marque 21 CORE STUDIOS." \
  --target-path "/ZONE21_DEV/04_BRANDS/BR-21-CORE/01_DOCX/..." \
  --doc-title "Note stratégique 21 CORE STUDIOS" \
  --doc-ref "DOC-Z21-STRAT-21CORE-v1.0"
```

Ou à partir d'un fichier texte :

```sh
python3 z21_ai_guardian.py cycle \
  --config config.json \
  --task-file /chemin/vers/demande.txt \
  --target-path "/ZONE21_DEV/03_MEDIA/02_LIGNE_EDITORIALE/01_DOCX/..." \
  --doc-title "Ligne éditoriale" \
  --doc-ref "DOC-Z21-MED-LIGNE-EDITORIALE-v1.0"
```

Modes disponibles :

- `draft` : exécute uniquement GPT
- `review` : exécute uniquement Gemini sur un brouillon existant
- `cycle` : exécute GPT puis Gemini
- `prepare` : génère seulement les fichiers de contexte sans appeler de modèle

## Sorties

Chaque run crée un dossier horodaté dans `runs/` contenant notamment :

- `task.txt`
- `gpt_system.txt`
- `gpt_user.txt`
- `draft.txt`
- `gemini_system.txt`
- `gemini_user.txt`
- `review.json`
- `alert.md`
- `register_update.md`
- `manifest.json`

## Convention de contrôle Gemini

Le prompt Gemini lui demande de rendre un JSON avec :

- `status` : `pass`, `warn` ou `block`
- `summary`
- `violations`
- `required_updates`
- `register_central_updates`
- `revised_instructions_for_gpt`

Si Gemini détecte une dérive, le système génère aussi :

- une alerte synthétique
- une proposition d'inscription dans le registre central

## Limites actuelles

- le socle ne sait pas encore découvrir automatiquement ton binaire Gemini
- les executables GUI ChatGPT et Gemini ne sont pas traites ici comme des CLI robustes
- il n'écrit pas directement dans les `.docx`
- il ne met pas à jour seul les documents maîtres : il produit d'abord des propositions formalisées

## Étape suivante conseillée

Brancher la vraie commande locale de GPT et celle de Gemini, puis tester un premier cycle sur un document non critique. Une fois le flux validé, on peut ajouter :

- une surveillance automatique d'un dossier
- un tableau JSON des runs
- des règles de blocage avant validation
- une mise à jour semi-automatique du registre central
