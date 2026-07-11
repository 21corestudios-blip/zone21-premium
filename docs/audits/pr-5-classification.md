# Audit PR #5 - Classification des fichiers

Date d'audit: 2026-07-11  
Repository: `21corestudios-blip/zone21-premium`  
Branche auditee: `codex/cokain-gelato-recette`  
PR: `#5 - [codex] Backup current repository state`  
Base: `52a3e9687564f623282ca3da5ccdb14aa5e47cb8` (`main`)  
Head: `0c9165de9b6c7ed3557e9a1769487d617d663a4a`

## Synthese

La PR #5 melange plusieurs perimetres incompatibles pour une fusion directe:

- SEO technique deja globalement coherent et extractible.
- Reprise visuelle/editoriale de l'accueil avec nouveaux assets.
- Recette CO-KAIN/Gelato avec script monolithique et appels externes.
- Mutation RDM vers lecture/ecriture Drive, critique cote securite.
- Portail collaborateurs et RBAC modifies en meme temps que le RDM.
- Nettoyage/suppression d'assets et composants historiques a verifier visuellement.

Conclusion: ne pas fusionner la PR #5 telle quelle. Extraire en PR petites, reversibles et testees.

## Risques majeurs immediats

1. RDM ecriture: les routes `POST /api/rdm` et `POST /api/rdm/[id]` reposent sur une session prototype et des roles serveur issus du portail actuel. En production, l'ecriture doit rester desactivee par defaut tant qu'une authentification forte n'est pas implementee.
2. Assets accueil: de nombreux fichiers avec espaces et noms `ChatGPT Image ...` sont ajoutes; certains anciens assets sont supprimes. Risque de regression visuelle et de liens casses sans audit automatise.
3. Gelato: le script `commerce-cokain-recette.ts` contient un chemin local personnel par defaut, peut appeler Gelato par defaut, et melange reporting, API, pricing et Stripe.
4. PR trop large: 106 fichiers, 2666 additions, 1429 suppressions. Le commit `backup` ne doit pas devenir un commit final de production.

## Decoupage recommande

| PR cible | Perimetre | Statut recommande |
|---|---|---|
| PR A | SEO technique | Extraire en premier, faible risque visuel |
| PR B | Accueil et assets editoriaux | Extraire apres captures visuelles |
| PR C | CO-KAIN / Gelato recette | Refactoriser avant PR finale |
| PR D | RDM central officiel | Securiser avant toute exposition production |
| PR E | Portail collaborateurs / auth / RBAC | A isoler du RDM et rendre lecture seule en prod |
| PR F | CI, tests, audits assets | Peut accompagner ou suivre les PR A-E |

## Classification detaillee

Legende nature:

- `Volontaire`: changement coherent avec l'objectif annonce.
- `Volontaire probable`: coherent mais demande validation.
- `A verifier`: impossible a confirmer sans validation visuelle/metier.
- `Accidentel probable`: fichier temporaire, local ou suppression risquee.

### Fichiers locaux et secrets potentiels

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `Gelato Products/classic collection` | Suppression de donnees locales Gelato. | Volontaire probable | Peut contenir identifiants prives; suppression correcte si remplace par env. | Script CO-KAIN, Gelato. | PR C | Confirmer contenu historique, garder supprime si local/sensible, documenter env. |
| `Gelato Products/store id` | Suppression de donnees locales Gelato. | Volontaire probable | Store id potentiellement sensible. | Gelato. | PR C | Garder hors Git; ajouter `.gitignore` si dossier local revient. |

### Documentation

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `docs/zone21/rapports-tests/CREATION-5J-RDM-CENTRAL-OFFICIEL-MINIMAL.md` | Rapport de creation RDM central minimal. | Volontaire | Peut documenter un mode ecriture pas encore securise. | RDM, portail collaborateurs. | PR D | Conserver avec avertissement prototype/lecture seule prod. |

### Scripts npm et CI

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `package.json` | Ajout du script `commerce:cokain:recette`. | Volontaire | Script peut lancer appels externes si mal parametre. | `scripts/commerce-cokain-recette.ts`. | PR C | Conserver apres ajout mode dry-run par defaut et documentation. |

### Assets Wear / CO-KAIN

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `public/images/brands/21-wear/BLONDE T-SHIRT ROSE 16-9.jpg` | Nouveau hero Wear. | Volontaire probable | Nom avec espaces; impact visuel direct. | `src/data/wear.data.ts`, page Wear. | PR B ou C | Conserver si valide visuellement, renommer dans PR assets dediee. |
| `public/images/brands/21-wear/BR_CO-KAIN_HERO.webp` | Nouveau visuel CO-KAIN. | Volontaire probable | Verifier usage reel. | Donnees Wear/CO-KAIN. | PR C | Conserver si reference; sinon signaler inutilise. |

### Assets editoriaux accueil

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `public/images/editorial/ARC-manifeste-accueil-0003.webp` | Suppression ancien asset manifeste. | A verifier | Peut casser rollback ou fallback non audite. | `home.data.ts`, Storyblok fallback. | PR B | Confirmer absence de reference avant suppression finale. |
| `public/images/editorial/ARC-manifeste-accueil-0004.webp` | Suppression ancien asset manifeste. | A verifier | Risque regression si encore reference. | `home.data.ts` ancien. | PR B | Confirmer par assets:audit. |
| `public/images/editorial/ARC_IMAGE-3_ACCUEIL.webp` | Nouvel asset editorial. | Volontaire probable | Nom OK mais usage a verifier. | Homepage/storyblok. | PR B | Conserver si affiche dans branche reference. |
| `public/images/editorial/ARC_MANIFESTO_1-1.webp` | Nouvel asset manifeste. | Volontaire probable | Verifier poids/usage. | Homepage/storyblok. | PR B | Conserver si reference. |
| `public/images/editorial/BR-ARC-ASS-WEB-SECTION-IMAGE-2-v1.0.webp` | Nouvel asset section image. | Volontaire probable | Verifier reference reelle. | Homepage/storyblok. | PR B | Conserver si reference. |
| `public/images/editorial/ChatGPT Image 10 juil. 2026, 07_26_50.webp` | Nouvel asset fallback Storyblok. | Volontaire probable | Nom avec espaces/date; URL peu propre. | `home.story.ts`. | PR B | Conserver temporairement; renommer avec references dans PR assets. |
| `public/images/editorial/ChatGPT Image 10 juil. 2026, 10_32_33.webp` | Nouvel asset editorial. | A verifier | Possible doublon avec hero meme hash. | Assets homepage. | PR B | Auditer doublons hash. |
| `public/images/editorial/ChatGPT Image 10 juil. 2026, 10_45_38.webp` | Nouvel asset editorial. | A verifier | Usage non confirme. | Homepage. | PR B | Auditer usage. |
| `public/images/editorial/ChatGPT Image 10 juil. 2026, 11_49_08.webp` | Nouvel asset editorial. | A verifier | Usage non confirme. | Homepage. | PR B | Auditer usage. |
| `public/images/editorial/ChatGPT Image 10 juil. 2026, 17_57_28.webp` | Nouvel asset maisons ARCANE. | Volontaire probable | Nom avec espaces/date. | `home.story.ts`. | PR B | Conserver si rendu valide; renommer plus tard. |
| `public/images/editorial/ChatGPT Image 9 juil. 2026, 18_34_49.webp` | Nouvel asset editorial. | A verifier | Usage non confirme. | Homepage. | PR B | Auditer usage. |
| `public/images/home/ChatGPT Image 10 juil. 2026, 18_06_14.webp` | Nouvel asset zone image accueil. | Volontaire probable | Nom avec espaces/date. | `home.story.ts`. | PR B | Conserver si rendu valide; renommer plus tard. |
| `public/images/home/ChatGPT Image 9 juil. 2026, 18_42_49.webp` | Nouvel asset home. | A verifier | Peut etre doublon avec hero. | Homepage. | PR B | Auditer usage/hash. |

### Assets hero accueil

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `public/images/home/hero/ARC-hero-accueil-0001.webp` | Suppression ancien hero. | A verifier | Fort risque rollback visuel. | Ancienne homepage. | PR B | Supprimer seulement apres captures et audit references. |
| `public/images/home/hero/ARC-hero-accueil-0002.webp` | Suppression ancien hero. | A verifier | `home.data.ts` le reference avant PR. | `home.data.ts` ancien. | PR B | Confirmer remplacement visuel. |
| `public/images/home/hero/ARC-hero-accueil.webp` | Suppression ancien hero. | A verifier | Peut etre encore reference hors src. | Assets legacy. | PR B | Auditer references globales. |
| `public/images/home/hero/ARCANE_HOME PAGE_IMAGE 02_HERO.webp` | Nouvel hero. | Volontaire probable | Nom avec espaces. | Homepage. | PR B | Conserver si reference; renommer dans PR assets. |
| `public/images/home/hero/ARCANE_HOME PAGE_IMAGE 03_HERO.webp` | Nouvel hero. | Volontaire probable | Nom avec espaces. | Homepage. | PR B | Conserver si reference; renommer dans PR assets. |
| `public/images/home/hero/BR-ARC-ASS-WEB-HERO-v1.2.webp` | Nouvel hero. | Volontaire probable | Version dans nom; usage a verifier. | Homepage. | PR B | Conserver si reference. |
| `public/images/home/hero/ChatGPT Image 10 juil. 2026, 08_16_47.webp` | Nouvel hero. | A verifier | Nom avec espaces/date. | Homepage. | PR B | Auditer usage. |
| `public/images/home/hero/ChatGPT Image 10 juil. 2026, 10_32_33.webp` | Nouveau hero principal dans fallback. | Volontaire probable | Nom avec espaces/date; impact LCP. | `home.data.ts`. | PR B | Conserver si reference visuelle actuelle; renommer plus tard. |
| `public/images/home/hero/ChatGPT Image 9 juil. 2026, 18_08_41.png` | PNG hero ajoute. | A verifier | 1.8 Mo; probable doublon WebP. | Assets homepage. | PR B | Supprimer seulement si WebP equivalent confirme. |
| `public/images/home/hero/ChatGPT Image 9 juil. 2026, 18_08_41.webp` | WebP hero ajoute. | A verifier | Possible doublon du PNG. | Assets homepage. | PR B | Auditer hash/dimensions. |
| `public/images/home/hero/ChatGPT Image 9 juil. 2026, 18_42_49.webp` | WebP hero ajoute. | A verifier | Usage non confirme. | Homepage. | PR B | Auditer usage. |

### CO-KAIN / Gelato / commerce

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `scripts/commerce-cokain-recette.ts` | Script de recette Gelato/Stripe/reporting. | Volontaire | Tres haut: chemin personnel, appels externes, Stripe optionnel, monolithe. | Gelato API, Stripe, fichiers POD locaux. | PR C | Refactoriser en modules, dry-run par defaut, env obligatoires, redaction secrets. |
| `src/lib/commerce/providers/gelato/client.ts` | Passage `fileUrl` vers `files: [{ type, url }]`. | Volontaire probable | Moyen: changement contrat API Gelato; doit etre teste. | Checkout/quote Gelato. | PR C | Conserver si conforme API; ajouter test. |
| `src/lib/commerce/wear/quote.ts` | Bloque shipping Gelato sans prix numerique. | Volontaire | Moyen: peut refuser des quotes auparavant acceptees. | Gelato quote, checkout. | PR C | Conserver avec test erreur `gelato_shipping_price_missing`. |
| `src/data/wear.data.ts` | Remplace hero Wear par nouvelle image. | Volontaire probable | Visuel direct. | Wear page. | PR B/C | Valider capture avant fusion. |

### SEO technique

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `src/config/site.ts` | Centralise marque, URL, locale, logo, social image. | Volontaire | Faible a moyen: fallback dev pointe encore production dans ce commit. | Layout, robots, sitemap, SEO. | PR A | Ajuster fallback dev a `http://localhost:3000`; garder prod obligatoire. |
| `src/lib/seo/createMetadata.ts` | Helper metadata/canonical/OG/Twitter/noindex. | Volontaire | Faible. | Pages App Router. | PR A | Conserver; ajouter tests. |
| `src/app/layout.tsx` | Utilise siteConfig, retire keywords, JSON-LD sans prop. | Volontaire | Faible. | siteConfig, OrganizationJsonLd. | PR A | Conserver. |
| `src/components/seo/OrganizationJsonLd.tsx` | JSON-LD depuis siteConfig, id ARCANE. | Volontaire | Faible; logo Z21 a confirmer avec marque. | siteConfig. | PR A | Conserver avec note marque/logo. |
| `src/app/robots.ts` | Robots renforce, sitemap via siteConfig. | Volontaire | Faible. | siteConfig. | PR A | Conserver; tester generation. |
| `src/app/sitemap.ts` | Sitemap etendu, plus de faux lastModified. | Volontaire | Moyen: risque routes invalides si donnees incoherentes. | Donnees produits/services/artistes. | PR A | Conserver avec test routes; filtrage produits BACKSPIN deja utile. |

### Metadonnees pages publiques

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `src/app/(zone21)/page.tsx` | Utilise `createMetadata`. | Volontaire | Faible. | SEO helper, Storyblok. | PR A | Conserver. |
| `src/app/(zone21)/a-propos/page.tsx` | Utilise `createMetadata`. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(zone21)/contact/page.tsx` | Utilise `createMetadata`. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(zone21)/ecosysteme/page.tsx` | Utilise `createMetadata`. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(zone21)/mentions-legales/page.tsx` | Utilise `createMetadata`, robots index. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(wear)/wear/page.tsx` | Utilise `createMetadata` avec image Wear. | Volontaire | Faible SEO, moyen visuel social. | Wear asset. | PR A | Conserver si image existe. |
| `src/app/(wear)/wear/[collection]/page.tsx` | Metadata collection via helper. | Volontaire | Faible. | wearCollections. | PR A | Conserver. |
| `src/app/(wear)/wear/[collection]/[productId]/page.tsx` | Canonical/OG produit. | Volontaire | Faible. | wearProducts. | PR A | Conserver. |
| `src/app/(core)/core-studios/page.tsx` | Metadata via helper. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(core)/core-studios/[service]/page.tsx` | Metadata service via helper. | Volontaire | Faible. | coreServices. | PR A | Conserver. |
| `src/app/(core)/core-studios/[service]/[productId]/page.tsx` | Metadata produit Core. | Volontaire | Faible. | coreProducts. | PR A | Conserver. |
| `src/app/(production)/prod/page.tsx` | Metadata BACKSPIN via helper. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(production)/prod/[artist]/page.tsx` | Metadata artiste. | Volontaire | Faible. | productionArtists. | PR A | Conserver. |
| `src/app/(production)/prod/[artist]/[productId]/page.tsx` | Metadata produit production. | Volontaire | Moyen: certains produits pointent artistes absents dans SSG. | productionProducts/artists. | PR A/Donnees | Filtrer sitemap et clarifier artistes manquants. |
| `src/app/(production)/prod/[artist]/albums/page.tsx` | Metadata categorie. | Volontaire | Faible. | productionStorefront. | PR A | Conserver. |
| `src/app/(production)/prod/[artist]/drum-kits/page.tsx` | Metadata categorie. | Volontaire | Faible. | productionStorefront. | PR A | Conserver. |
| `src/app/(production)/prod/[artist]/loops/page.tsx` | Metadata categorie. | Volontaire | Faible. | productionStorefront. | PR A | Conserver. |
| `src/app/(production)/prod/[artist]/midi/page.tsx` | Metadata categorie. | Volontaire | Faible. | productionStorefront. | PR A | Conserver. |
| `src/app/(production)/prod/[artist]/templates/page.tsx` | Metadata categorie. | Volontaire | Faible. | productionStorefront. | PR A | Conserver. |
| `src/app/(production)/prod/[artist]/tracks/page.tsx` | Metadata categorie. | Volontaire | Faible. | productionStorefront. | PR A | Conserver. |
| `src/app/(talents)/talents-agency/page.tsx` | Metadata EKKO via helper. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(talents)/talents-agency/[division]/page.tsx` | Metadata division. | Volontaire | Faible. | talentDivisions. | PR A | Conserver. |
| `src/app/(talents)/talents-agency/[division]/[productId]/page.tsx` | Metadata produit EKKO. | Volontaire | Faible. | talentsProducts. | PR A | Conserver. |

### Noindex pages non indexables

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `src/app/(wear)/wear/panier/page.tsx` | Ajout noindex. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(wear)/wear/checkout/page.tsx` | Ajout noindex. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(wear)/wear/checkout/success/page.tsx` | Ajout noindex. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(core)/core-studios/panier/page.tsx` | Ajout noindex. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(production)/prod/panier/page.tsx` | Ajout noindex. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |
| `src/app/(talents)/talents-agency/panier/page.tsx` | Ajout noindex. | Volontaire | Faible. | SEO helper. | PR A | Conserver. |

### Accueil, Storyblok et composants editoriaux

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `src/app/(zone21)/_components/home/HeroSection.tsx` | Suppression ancienne arborescence homepage. | Volontaire probable | Moyen: verifier aucune importation restante. | Ancienne homepage. | PR B | Supprimer seulement si Storyblok/fallback remplace completement. |
| `src/app/(zone21)/_components/home/HomePageSections.tsx` | Suppression ancienne composition homepage. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Valider absence reference. |
| `src/app/(zone21)/_components/home/Zone01Manifesto.tsx` | Suppression ancienne section. | Volontaire probable | Moyen visuel/rollback. | Ancienne homepage. | PR B | Valider rendu actuel. |
| `src/app/(zone21)/_components/home/Zone02Image.tsx` | Suppression ancienne section image. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Valider rendu actuel. |
| `src/app/(zone21)/_components/home/Zone03Maisons.tsx` | Suppression ancienne section maisons. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Valider rendu actuel. |
| `src/app/(zone21)/_components/home/Zone04Image.tsx` | Suppression ancienne section image. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Valider rendu actuel. |
| `src/app/(zone21)/_components/home/Zone05About.tsx` | Suppression ancienne section about. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Valider rendu actuel. |
| `src/app/(zone21)/_components/home/Zone06Image.tsx` | Suppression ancienne section image. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Valider rendu actuel. |
| `src/app/(zone21)/_components/home/Zone07Contact.tsx` | Suppression ancienne section contact. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Valider rendu actuel. |
| `src/app/(zone21)/_components/home/Zone08Image.tsx` | Suppression ancienne section image. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Valider rendu actuel. |
| `src/app/(zone21)/_components/home/shared/EditorialManifesto.tsx` | Suppression composant partage. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Confirmer remplacant. |
| `src/app/(zone21)/_components/home/shared/Hero.tsx` | Suppression composant partage. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Confirmer non reference. |
| `src/app/(zone21)/_components/home/shared/ImmersiveImageSection.tsx` | Suppression composant partage. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Confirmer non reference. |
| `src/app/(zone21)/_components/home/shared/MaisonGrid.tsx` | Suppression composant partage. | Volontaire probable | Moyen. | Ancienne homepage. | PR B | Confirmer non reference. |
| `src/app/(zone21)/_components/home/shared/ManifestoOverlayContent.tsx` | Nouveau rendu manifeste overlay. | Volontaire probable | Fort: changement visuel volontaire de section. | `ManifestoBlock`. | PR B | Captures obligatoires avant/apres. |
| `src/components/storyblok/Hero.tsx` | Ajout className image desktop/mobile pilotables. | Volontaire | Moyen: peut changer cadrage hero. | Storyblok types/fallback. | PR B | Conserver si necessaire au rendu reference; tester responsive. |
| `src/components/storyblok/ManifestoBlock.tsx` | Remplace SplitShowcase par overlay plein ecran. | Volontaire probable | Fort: changement visuel manifeste. | ManifestoOverlayContent. | PR B | Isoler et valider par captures. |
| `src/lib/storyblok/types.ts` | Ajout champs className image hero. | Volontaire | Faible. | Hero Storyblok. | PR B | Conserver avec fallback. |
| `src/data/home.data.ts` | Remplace images homepage fallback. | Volontaire probable | Moyen: rendu/asset. | Assets homepage. | PR B | Verifier source de verite; eviter doublons. |
| `src/data/storyblok/home.story.ts` | Modifie fallback Storyblok et images. | Volontaire probable | Moyen: source de verite/fallback. | Assets, StoryblokRenderer. | PR B | Conserver si Storyblok indisponible; factoriser plus tard. |

### Portail collaborateurs

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `src/app/(collaborateurs)/collaborateurs/_components/CollaboratorAccessGate.tsx` | Texte passe lecture seule -> ecriture controlee. | Volontaire | Haut: donne impression production-ready. | Auth prototype. | PR E | Remplacer par avertissement prototype / lecture seule prod. |
| `src/app/(collaborateurs)/collaborateurs/layout.tsx` | Texte footer portail lecture/ecriture. | Volontaire | Haut: meme risque. | Auth prototype. | PR E | Documenter modes dev/prod. |
| `src/app/(collaborateurs)/collaborateurs/page.tsx` | Ajoute resume registre et formulaire creation RDM. | Volontaire | Critique: expose ecriture via UI selon role prototype. | RDM, RBAC, auth. | PR E/D | Desactiver ecriture en prod par feature flag serveur. |
| `src/app/(collaborateurs)/collaborateurs/documents/[id]/page.tsx` | Ajoute formulaire modification/upload. | Volontaire | Critique: ecriture fichier Drive via UI. | RDM service, RBAC, auth. | PR E/D | Desactiver en prod; ajouter CSRF/auth forte avant activation. |

### API RDM et documents

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `src/app/api/rdm/route.ts` | Ajoute POST creation RDM. | Volontaire | Critique: ecriture sans auth forte, erreurs detaillees. | auth, RBAC, rdm-service. | PR D/E | Bloquer par defaut avec `RDM_WRITE_ENABLED=false`; erreurs generiques. |
| `src/app/api/rdm/[id]/route.ts` | Ajoute POST update/upload. | Volontaire | Critique: ecriture/update fichier. | auth, RBAC, rdm-service. | PR D/E | Bloquer par defaut; validation stricte et CSRF. |
| `src/app/api/documents/[id]/download/route.ts` | Petit ajustement download. | A verifier | Moyen si change exposition chemin/format. | rdm-service, auth. | PR D | Inspecter diff complet; tester acces roles. |

### RDM central officiel

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `src/data/rdm.records.ts` | Supprime registre Git statique au profit Drive. | Volontaire | Haut: depend de fichier Drive disponible. | rdm-service. | PR D | Conserver seulement si fallback controle existe. |
| `src/lib/rdm-types.ts` | Nouveaux statuts/types et schema registre. | Volontaire | Moyen: migration casse anciennes donnees. | RDM service, UI, tests. | PR D | Conserver avec migration et validation schema. |
| `src/lib/rdm-service.ts` | Lecture/ecriture registre Drive, archivage, upload. | Volontaire | Critique: ecriture non atomique, validation incomplete, warning Turbopack. | fs/path, active base, API. | PR D | Securiser: atomic write, symlink, validation stricte, server-only. |
| `src/lib/rdm-presenters.ts` | Adapte libelles/statuts RDM. | Volontaire | Moyen: affichage/statuts. | UI collaborateurs. | PR D/E | Conserver apres test visuel. |
| `src/tests/rdm.sync.test.ts` | Tests RDM Drive minimal lecture/ecriture. | Volontaire | Moyen: couverture insuffisante securite. | rdm-service. | PR D | Etendre avec auth/flag/concurrence/path traversal. |

### Gouvernance, permissions, RBAC

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `src/lib/permissions.ts` | Simplifie roles vers lecteur/editeur/admin. | Volontaire probable | Haut: casse anciens roles et peut sur-permissionner. | auth, RBAC, UI. | PR E | Valider modele role; ne pas confondre avec auth production. |
| `src/lib/rbac.ts` | Met a jour permissions roles. | Volontaire probable | Haut: ecriture autorisee par role prototype. | permissions, API RDM. | PR E | Ajouter refus serveur par defaut en prod. |
| `src/lib/governance-policy.ts` | Passe frontWriteAllowed false -> true. | Volontaire | Critique: contradiction avec securite demandee. | RDM UI/API. | PR D/E | Corriger: ecriture prototype uniquement, false en prod. |
| `src/lib/governance-service.ts` | Adapte validations aux nouveaux statuts/chemins optionnels. | Volontaire | Moyen: validations moins bloquantes fichiers absents. | RDM records. | PR D | Revoir criteres bloquants selon statut. |
| `src/lib/governance-types.ts` | Source ZONE 21 HOLDING et writerMode Drive. | Volontaire | Moyen. | governance-policy. | PR D | Conserver avec modes dev/prod. |

### Pages publiques hors SEO direct

| Fichier | Raison du changement | Nature | Risque | Dependances | PR cible | Action |
|---|---|---:|---|---|---|---|
| `src/app/(core)/core-studios/page.tsx` | SEO helper uniquement dans diff observe. | Volontaire | Faible. | PR A. | PR A | Conserver. |
| `src/app/(production)/prod/page.tsx` | SEO helper uniquement dans diff observe. | Volontaire | Faible. | PR A. | PR A | Conserver. |
| `src/app/(talents)/talents-agency/page.tsx` | SEO helper uniquement dans diff observe. | Volontaire | Faible. | PR A. | PR A | Conserver. |

## Fichiers a supprimer ou garder hors Git

| Fichier/groupe | Recommandation |
|---|---|
| `Gelato Products/*` | Garder hors Git si identifiants locaux/sensibles; documenter variables d'env. |
| Assets `ChatGPT Image ...` | Ne pas supprimer avant audit, mais renommer dans PR assets dediee si conserves. |
| PNG/WebP doublons hero | Supprimer PNG seulement si WebP equivalent reference et valide visuellement. |
| Anciennes images `ARC-hero-*`, `ARC-manifeste-*` | Supprimer seulement apres audit references + validation captures. |

## Fichiers a verifier en priorite

1. `src/lib/rdm-service.ts`: atomicite, validation registre, chemins, symlinks, redaction erreurs, import server-only.
2. `src/app/api/rdm/route.ts` et `src/app/api/rdm/[id]/route.ts`: feature flag ecriture, auth forte, CSRF, erreurs generiques.
3. `scripts/commerce-cokain-recette.ts`: refactor, dry-run, chemin local, timeouts/retry/logs.
4. `src/app/(collaborateurs)/collaborateurs/page.tsx`: UI ecriture visible uniquement en dev autorise.
5. Assets homepage: usage, doublons, poids, noms.
6. `src/config/site.ts`: fallback dev doit eviter canonical vers production.

## Plan d'extraction propose

### PR A - SEO technique

Inclure:

- `src/config/site.ts`
- `src/lib/seo/createMetadata.ts`
- `src/app/layout.tsx`
- `src/components/seo/OrganizationJsonLd.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- toutes les pages modifiees uniquement pour metadata/noindex

Corrections avant PR:

- fallback dev `http://localhost:3000`;
- tests `siteConfig`, `createMetadata`, sitemap, robots;
- verifier pages inexistantes et canoniques.

### PR B - Accueil et assets

Inclure:

- nouveaux composants homepage/Storyblok;
- `home.data.ts`, `home.story.ts`, `storyblok/types.ts`;
- assets strictement references.

Preconditions:

- captures 1440/1024/768/390;
- audit assets automatise;
- aucune suppression d'ancien asset sans preuve.

### PR C - CO-KAIN / Gelato

Inclure:

- script recette refactorise;
- client Gelato;
- quote Wear;
- donnees/visuels CO-KAIN necessaires;
- `.env.example` et docs.

Preconditions:

- `--dry-run` par defaut;
- `CO_KAIN_POD_DIR` obligatoire ou fixture locale;
- pas de chemin personnel;
- tests pricing/decisions/API errors;
- pas de Stripe/Gelato destructif par defaut.

### PR D - RDM central officiel

Inclure:

- RDM types/service/API;
- tests RDM;
- documentation RDM.

Preconditions:

- `RDM_WRITE_ENABLED=false` par defaut;
- ecriture atomique;
- validation schema stricte;
- path traversal/symlink tests;
- erreurs client redigees;
- warning Turbopack analyse.

### PR E - Portail collaborateurs et auth

Inclure:

- UI collaborateurs;
- permissions/RBAC;
- auth/session.

Preconditions:

- mode production lecture seule;
- selecteur role seulement dev;
- bannieres prototype;
- auth forte hors scope clairement documentee.

## Commandes de baseline a executer apres cette classification

Commandes demandees, non relancees dans ce document:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm run test:ged-writer
node --import tsx --test src/tests/rdm.sync.test.ts
```

Note: lors du travail precedent, `npm run typecheck`, `npm run lint` et `npm run build` passaient sur `0c9165d`; le build conservait un warning Turbopack lie a `src/lib/rdm-service.ts`. Cette classification doit etre suivie d'une baseline complete et consignee.
