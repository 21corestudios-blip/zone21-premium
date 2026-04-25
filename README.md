## Zone 21 Premium

Portail Next.js de consultation et d'exploitation pour l'écosystème ZONE 21.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Copier `.env.example` vers `.env.local` et compléter les valeurs nécessaires.

## RDM collaborateurs — configuration locale

Le portail RDM lit les métadonnées sans configuration supplémentaire.

Pour activer la vérification réelle des fichiers et les téléchargements DOCX/PDF, créer un fichier `.env.local` avec :

```bash
Z21_ACTIVE_BASE_PATH="/Users/gregloupiac/Library/CloudStorage/GoogleDrive-21corestudios@gmail.com/Mon Drive/ZONE21_DEV"
```

Règles :

- ne jamais coder ce chemin en dur dans les fichiers TypeScript ;
- le code doit lire uniquement `process.env.Z21_ACTIVE_BASE_PATH` ;
- le message `BASE ACTIVE À VÉRIFIER` est normal si la variable est absente ;
- ce message disparaît dès que `Z21_ACTIVE_BASE_PATH` est correctement renseignée dans `.env.local`.
