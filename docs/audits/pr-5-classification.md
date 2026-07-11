# Audit PR #5 - Classification de reprise

Date: 2026-07-11  
Branche d'audit: `audit/pr5`  
Base: `origin/main` / `52a3e9687564f623282ca3da5ccdb14aa5e47cb8`  
Backup analysee: `codex/cokain-gelato-recette` au commit `0c9165de9b6c7ed3557e9a1769487d617d663a4a`  
PR backup: `#5 - [codex] Backup current repository state`

## Position

La branche `codex/cokain-gelato-recette` est une sauvegarde et une source de comparaison. Elle ne doit pas etre fusionnee telle quelle. Les changements utiles doivent etre extraits depuis `origin/main` vers des branches dediees:

- `refactor/seo`
- `refactor/home-assets`
- `refactor/cokain-gelato`
- `refactor/rdm`
- `refactor/collaborator-auth`

Cette phase n'introduit aucun changement fonctionnel. Elle classifie les 106 fichiers du diff `52a3e968..0c9165d`.

## Synthese des risques

- **Critique**: RDM lecture/ecriture expose via une authentification prototype et un RBAC simplifie.
- **Haut**: script CO-KAIN/Gelato monolithique, avec chemin local personnel par defaut et appels externes.
- **Haut**: assets d'accueil ajoutes/supprimes sans audit automatise ni validation visuelle documentee.
- **Moyen**: SEO coherent mais a extraire proprement et tester depuis `origin/main`.
- **Moyen**: simplification des roles collaborateurs a isoler de toute ecriture RDM.

## Plan de decoupage

| Branche cible | Perimetre | Priorite |
|---|---|---:|
| `refactor/seo` | site config, metadata, JSON-LD, sitemap, robots, noindex | 1 |
| `refactor/home-assets` | accueil, Storyblok, fallback, assets reels, audit assets | 2 |
| `refactor/cokain-gelato` | recette CO-KAIN, Gelato, quote Wear, donnees internes | 3 |
| `refactor/rdm` | registre central, service, API, tests, securite chemins | 4 |
| `refactor/collaborator-auth` | portail, session, roles, permissions, CSRF/auth | 5 |

## Classification des 106 fichiers

| Chemin | Categories | Objectif apparent | Dependances | Risque | Donnees sensibles | Branche cible | Decision |
|---|---|---|---|---|---|---|---|
| `Gelato Products/classic collection` | fichiers locaux, Gelato, fichiers sensibles | Supprimer un fichier local de collection Gelato. | Gelato, script recette. | Haut si identifiants; suppression justifiee si local. | Possible identifiant/template. | `refactor/cokain-gelato` | Supprimer du Git si confirme local/sensible. |
| `Gelato Products/store id` | fichiers locaux, Gelato, fichiers sensibles | Supprimer un fichier local contenant probablement un store id. | Gelato. | Haut. | Probable store id. | `refactor/cokain-gelato` | Supprimer du Git; remplacer par `GELATO_STORE_ID`. |
| `docs/zone21/rapports-tests/CREATION-5J-RDM-CENTRAL-OFFICIEL-MINIMAL.md` | documentation, RDM | Documenter le RDM central minimal. | RDM service, registre Drive. | Moyen: peut presenter l'ecriture comme prete. | Non, a verifier chemins. | `refactor/rdm` | Conserver/corriger avec avertissement prototype. |
| `package.json` | commerce, Gelato, tests | Ajouter `commerce:cokain:recette`. | Script recette. | Moyen: script peut appeler externe. | Non. | `refactor/cokain-gelato` | Extraire apres mode dry-run par defaut. |
| `public/images/brands/21-wear/BLONDE T-SHIRT ROSE 16-9.jpg` | assets, Wear, accueil visuel | Nouveau visuel Wear hero. | `src/data/wear.data.ts`. | Moyen: nom avec espaces, rendu visible. | Non. | `refactor/home-assets` ou `refactor/cokain-gelato` | Revoir par capture, renommer plus tard si conserve. |
| `public/images/brands/21-wear/BR_CO-KAIN_HERO.webp` | assets, Wear, CO-KAIN | Ajouter hero CO-KAIN. | Produits/collections Wear. | Moyen: usage a confirmer. | Non. | `refactor/cokain-gelato` | Extraire seulement si utilise. |
| `public/images/editorial/ARC-manifeste-accueil-0003.webp` | assets, accueil, fichiers a supprimer | Supprimer ancien asset manifeste. | Ancienne homepage/fallback. | Moyen: regression si encore reference. | Non. | `refactor/home-assets` | Supprimer seulement apres audit references. |
| `public/images/editorial/ARC-manifeste-accueil-0004.webp` | assets, accueil, fichiers a supprimer | Supprimer ancien asset manifeste. | `home.data.ts` ancien. | Moyen. | Non. | `refactor/home-assets` | Revoir avec audit assets. |
| `public/images/editorial/ARC_IMAGE-3_ACCUEIL.webp` | assets, accueil | Ajouter asset editorial. | Homepage/Storyblok. | Faible a moyen. | Non. | `refactor/home-assets` | Extraire si reference. |
| `public/images/editorial/ARC_MANIFESTO_1-1.webp` | assets, accueil | Ajouter asset manifeste. | Homepage/Storyblok. | Moyen: poids/usage. | Non. | `refactor/home-assets` | Extraire si reference. |
| `public/images/editorial/BR-ARC-ASS-WEB-SECTION-IMAGE-2-v1.0.webp` | assets, accueil | Ajouter asset section image. | Homepage/Storyblok. | Moyen: nom versionne. | Non. | `refactor/home-assets` | Revoir usage. |
| `public/images/editorial/ChatGPT Image 10 juil. 2026, 07_26_50.webp` | assets, accueil, fichiers a corriger | Remplacer une image immersive du fallback. | `home.story.ts`. | Moyen: nom avec espaces/date. | Non. | `refactor/home-assets` | Extraire si rendu valide, renommer en PR dediee. |
| `public/images/editorial/ChatGPT Image 10 juil. 2026, 10_32_33.webp` | assets, accueil, fichiers a corriger | Ajouter image editoriale potentiellement doublon. | Homepage. | Moyen: doublon possible. | Non. | `refactor/home-assets` | Revoir via hash. |
| `public/images/editorial/ChatGPT Image 10 juil. 2026, 10_45_38.webp` | assets, accueil | Ajouter image editoriale. | Homepage. | Moyen: usage non confirme. | Non. | `refactor/home-assets` | Revoir. |
| `public/images/editorial/ChatGPT Image 10 juil. 2026, 11_49_08.webp` | assets, accueil | Ajouter image editoriale. | Homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `public/images/editorial/ChatGPT Image 10 juil. 2026, 17_57_28.webp` | assets, accueil, Storyblok | Remplacer visuel Maisons ARCANE. | `home.story.ts`. | Moyen: rendu visible, nom invalide. | Non. | `refactor/home-assets` | Extraire si capture valide. |
| `public/images/editorial/ChatGPT Image 9 juil. 2026, 18_34_49.webp` | assets, accueil | Ajouter image editoriale. | Homepage. | Moyen: usage non confirme. | Non. | `refactor/home-assets` | Revoir. |
| `public/images/home/ChatGPT Image 10 juil. 2026, 18_06_14.webp` | assets, accueil, Storyblok | Remplacer image zone accueil. | `home.story.ts`. | Moyen: nom avec espaces/date. | Non. | `refactor/home-assets` | Extraire si rendu valide. |
| `public/images/home/ChatGPT Image 9 juil. 2026, 18_42_49.webp` | assets, accueil | Ajouter image home. | Homepage. | Moyen: doublon possible. | Non. | `refactor/home-assets` | Revoir. |
| `public/images/home/hero/ARC-hero-accueil-0001.webp` | assets, accueil, fichiers a supprimer | Supprimer ancien hero. | Ancienne homepage. | Haut: rollback/rendu. | Non. | `refactor/home-assets` | Supprimer seulement avec preuve. |
| `public/images/home/hero/ARC-hero-accueil-0002.webp` | assets, accueil, fichiers a supprimer | Supprimer ancien hero. | `home.data.ts` ancien. | Haut. | Non. | `refactor/home-assets` | Revoir avec captures. |
| `public/images/home/hero/ARC-hero-accueil.webp` | assets, accueil, fichiers a supprimer | Supprimer ancien hero. | Legacy references. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `public/images/home/hero/ARCANE_HOME PAGE_IMAGE 02_HERO.webp` | assets, accueil, fichiers a corriger | Ajouter hero. | Homepage. | Moyen: nom avec espaces. | Non. | `refactor/home-assets` | Revoir usage. |
| `public/images/home/hero/ARCANE_HOME PAGE_IMAGE 03_HERO.webp` | assets, accueil, fichiers a corriger | Ajouter hero. | Homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir usage. |
| `public/images/home/hero/BR-ARC-ASS-WEB-HERO-v1.2.webp` | assets, accueil | Ajouter hero versionne. | Homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir usage. |
| `public/images/home/hero/ChatGPT Image 10 juil. 2026, 08_16_47.webp` | assets, accueil, fichiers a corriger | Ajouter hero. | Homepage. | Moyen: nom avec espaces/date. | Non. | `refactor/home-assets` | Revoir usage. |
| `public/images/home/hero/ChatGPT Image 10 juil. 2026, 10_32_33.webp` | assets, accueil, Storyblok | Nouveau hero principal fallback. | `home.data.ts`. | Haut: LCP/rendu, nom. | Non. | `refactor/home-assets` | Extraire si visuel valide; renommer ulterieurement. |
| `public/images/home/hero/ChatGPT Image 9 juil. 2026, 18_08_41.png` | assets, accueil, fichiers inutiles | PNG lourd ajoute. | Homepage. | Haut: 1.8 Mo, doublon WebP probable. | Non. | `refactor/home-assets` | Supprimer si WebP equivalent confirme. |
| `public/images/home/hero/ChatGPT Image 9 juil. 2026, 18_08_41.webp` | assets, accueil | WebP equivalent possible du PNG. | Homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir via hash/dimensions. |
| `public/images/home/hero/ChatGPT Image 9 juil. 2026, 18_42_49.webp` | assets, accueil | Ajouter hero. | Homepage. | Moyen: usage non confirme. | Non. | `refactor/home-assets` | Revoir. |
| `scripts/commerce-cokain-recette.ts` | CO-KAIN, Gelato, Stripe, commerce | Ajouter recette Gelato/Stripe/reporting. | Gelato API, Stripe, fichiers POD. | Haut: monolithe, appels externes, chemin personnel. | Oui: chemin personnel et IDs possibles. | `refactor/cokain-gelato` | Extraire/refactoriser; dry-run par defaut; env obligatoires. |
| `src/app/(collaborateurs)/collaborateurs/_components/CollaboratorAccessGate.tsx` | portail collaborateurs, auth | Texte passe lecture seule a ecriture controlee. | Auth prototype, RDM. | Haut: confusion prod-ready. | Non. | `refactor/collaborator-auth` | Corriger: bannière prototype et lecture seule prod. |
| `src/app/(collaborateurs)/collaborateurs/documents/[id]/page.tsx` | portail collaborateurs, RDM, auth | Ajouter formulaire modification/upload RDM. | RDM service, RBAC, session. | Critique: ecriture via role prototype. | Potentiel chemins Drive visibles. | `refactor/collaborator-auth` + `refactor/rdm` | Extraire apres feature flag et auth serveur. |
| `src/app/(collaborateurs)/collaborateurs/layout.tsx` | portail collaborateurs | Texte footer lecture/ecriture. | Auth/RDM. | Haut: communication trompeuse. | Non. | `refactor/collaborator-auth` | Corriger. |
| `src/app/(collaborateurs)/collaborateurs/page.tsx` | portail collaborateurs, RDM | Ajoute resume registre et formulaire creation. | RDM, RBAC, session. | Critique. | Potentiel chemins/registres. | `refactor/collaborator-auth` + `refactor/rdm` | Extraire seulement avec ecriture desactivee en prod. |
| `src/app/(core)/core-studios/[service]/[productId]/page.tsx` | SEO, pages publiques | Ajouter canonical/OG produit Core. | `createMetadata`, core data. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(core)/core-studios/[service]/page.tsx` | SEO, pages publiques | Centraliser metadata service Core. | `createMetadata`, core services. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(core)/core-studios/page.tsx` | SEO, pages publiques | Centraliser metadata Core. | `createMetadata`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(core)/core-studios/panier/page.tsx` | SEO, pages privees | Ajouter noindex panier. | `noIndexRobots`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(production)/prod/[artist]/[productId]/page.tsx` | SEO, pages publiques | Ajouter canonical/OG produit BACKSPIN. | production products. | Moyen: artistes absents possibles. | Non. | `refactor/seo` | Corriger sitemap/donnees invalides. |
| `src/app/(production)/prod/[artist]/albums/page.tsx` | SEO | Metadata categorie albums. | storefront context. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(production)/prod/[artist]/drum-kits/page.tsx` | SEO | Metadata categorie drum kits. | storefront context. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(production)/prod/[artist]/loops/page.tsx` | SEO | Metadata categorie loops. | storefront context. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(production)/prod/[artist]/midi/page.tsx` | SEO | Metadata categorie MIDI. | storefront context. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(production)/prod/[artist]/page.tsx` | SEO | Metadata artiste. | production artists. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(production)/prod/[artist]/templates/page.tsx` | SEO | Metadata categorie templates. | storefront context. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(production)/prod/[artist]/tracks/page.tsx` | SEO | Metadata categorie tracks. | storefront context. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(production)/prod/page.tsx` | SEO | Centraliser metadata BACKSPIN. | `createMetadata`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(production)/prod/panier/page.tsx` | SEO, pages privees | Ajouter noindex panier. | `noIndexRobots`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(talents)/talents-agency/[division]/[productId]/page.tsx` | SEO | Metadata produit EKKO. | talents products. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(talents)/talents-agency/[division]/page.tsx` | SEO | Metadata division EKKO. | talent divisions. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(talents)/talents-agency/page.tsx` | SEO | Centraliser metadata EKKO. | `createMetadata`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(talents)/talents-agency/panier/page.tsx` | SEO, pages privees | Ajouter noindex panier. | `noIndexRobots`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(wear)/wear/[collection]/[productId]/page.tsx` | SEO, Wear | Metadata produit Wear. | wear products. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(wear)/wear/[collection]/page.tsx` | SEO, Wear | Metadata collection Wear. | wear collections. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(wear)/wear/checkout/page.tsx` | SEO, pages privees | Ajouter noindex checkout. | `noIndexRobots`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(wear)/wear/checkout/success/page.tsx` | SEO, pages privees | Ajouter noindex success. | `noIndexRobots`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(wear)/wear/page.tsx` | SEO, Wear, assets | Metadata Wear avec nouvelle image. | `createMetadata`, asset Wear. | Moyen: depend d'un asset a extraire. | Non. | `refactor/seo` + asset PR | Conserver si image existe; sinon image stable. |
| `src/app/(wear)/wear/panier/page.tsx` | SEO, pages privees | Ajouter noindex panier. | `noIndexRobots`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(zone21)/_components/home/HeroSection.tsx` | accueil, fichiers a supprimer | Supprimer ancienne section hero. | ancienne homepage. | Moyen: rollback/rendu. | Non. | `refactor/home-assets` | Supprimer seulement si non reference. |
| `src/app/(zone21)/_components/home/HomePageSections.tsx` | accueil, fichiers a supprimer | Supprimer ancienne composition homepage. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/Zone01Manifesto.tsx` | accueil, fichiers a supprimer | Supprimer ancienne section. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/Zone02Image.tsx` | accueil, fichiers a supprimer | Supprimer ancienne section image. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/Zone03Maisons.tsx` | accueil, fichiers a supprimer | Supprimer ancienne section maisons. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/Zone04Image.tsx` | accueil, fichiers a supprimer | Supprimer ancienne section image. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/Zone05About.tsx` | accueil, fichiers a supprimer | Supprimer ancienne section about. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/Zone06Image.tsx` | accueil, fichiers a supprimer | Supprimer ancienne section image. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/Zone07Contact.tsx` | accueil, fichiers a supprimer | Supprimer ancienne section contact. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/Zone08Image.tsx` | accueil, fichiers a supprimer | Supprimer ancienne section image. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/shared/EditorialManifesto.tsx` | accueil, fichiers a supprimer | Supprimer ancien composant. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/shared/Hero.tsx` | accueil, fichiers a supprimer | Supprimer ancien composant Hero. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/shared/ImmersiveImageSection.tsx` | accueil, fichiers a supprimer | Supprimer ancien composant image immersive. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/shared/MaisonGrid.tsx` | accueil, fichiers a supprimer | Supprimer ancien composant maisons. | ancienne homepage. | Moyen. | Non. | `refactor/home-assets` | Revoir. |
| `src/app/(zone21)/_components/home/shared/ManifestoOverlayContent.tsx` | accueil, Storyblok | Nouveau composant manifeste overlay. | `ManifestoBlock`. | Haut: rendu visible. | Non. | `refactor/home-assets` | Extraire uniquement avec captures. |
| `src/app/(zone21)/a-propos/page.tsx` | SEO | Centraliser metadata. | `createMetadata`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(zone21)/contact/page.tsx` | SEO | Centraliser metadata. | `createMetadata`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(zone21)/ecosysteme/page.tsx` | SEO | Centraliser metadata. | `createMetadata`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(zone21)/mentions-legales/page.tsx` | SEO | Centraliser metadata. | `createMetadata`. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/(zone21)/page.tsx` | SEO, accueil | Centraliser metadata homepage. | `createMetadata`, Storyblok. | Faible. | Non. | `refactor/seo` | Conserver partie SEO seulement. |
| `src/app/api/documents/[id]/download/route.ts` | API, RDM | Ajustement download RDM. | auth, RDM service. | Moyen: exposition fichier/erreur. | Potentiel chemins. | `refactor/rdm` | Revoir diff et tests roles. |
| `src/app/api/rdm/[id]/route.ts` | API, RDM, auth | Ajouter POST update/upload. | session prototype, RBAC, RDM service. | Critique. | Potentiel chemins et erreurs. | `refactor/rdm` | Corriger: feature flag, auth forte, erreurs generiques. |
| `src/app/api/rdm/route.ts` | API, RDM, auth | Ajouter POST create. | session prototype, RBAC, RDM service. | Critique. | Potentiel chemins et erreurs. | `refactor/rdm` | Corriger: write disabled par defaut. |
| `src/app/layout.tsx` | SEO | Utiliser siteConfig, retirer keywords. | siteConfig, JSON-LD. | Faible. | Non. | `refactor/seo` | Conserver. |
| `src/app/robots.ts` | SEO | Renforcer exclusions. | siteConfig. | Faible. | Non. | `refactor/seo` | Conserver/tester. |
| `src/app/sitemap.ts` | SEO | Enrichir sitemap et retirer faux lastModified. | donnees catalogues. | Moyen: routes invalides possibles. | Non. | `refactor/seo` | Conserver avec tests. |
| `src/components/seo/OrganizationJsonLd.tsx` | SEO | Centraliser JSON-LD. | siteConfig. | Faible: logo Z21 a confirmer. | Non. | `refactor/seo` | Conserver avec note marque. |
| `src/components/storyblok/Hero.tsx` | Storyblok, accueil | Permettre cadrage image via className. | `HeroBlok`, fallback. | Moyen: cadrage visible. | Non. | `refactor/home-assets` | Extraire avec captures. |
| `src/components/storyblok/ManifestoBlock.tsx` | Storyblok, accueil | Remplacer split par overlay. | `ManifestoOverlayContent`. | Haut: rendu visible. | Non. | `refactor/home-assets` | Extraire seulement si rendu valide. |
| `src/config/site.ts` | SEO | Centraliser configuration site. | layout, sitemap, robots. | Moyen: fallback dev a corriger. | Non. | `refactor/seo` | Extraire/corriger localhost dev. |
| `src/data/home.data.ts` | accueil, Storyblok | Changer images fallback homepage. | assets. | Moyen: rendu visible. | Non. | `refactor/home-assets` | Extraire apres capture. |
| `src/data/rdm.records.ts` | RDM | Remplacer registre statique par Drive. | RDM service. | Haut: depend Drive. | Non. | `refactor/rdm` | Extraire avec fallback/validation. |
| `src/data/storyblok/home.story.ts` | accueil, Storyblok | Modifier fallback et images. | assets, types. | Moyen. | Non. | `refactor/home-assets` | Extraire avec audit assets. |
| `src/data/wear.data.ts` | Wear, assets | Changer hero Wear. | asset Wear. | Moyen: rendu visible. | Non. | `refactor/home-assets` ou `refactor/cokain-gelato` | Revoir. |
| `src/lib/commerce/providers/gelato/client.ts` | Gelato, commerce | Corriger payload fichier Gelato. | Gelato API. | Moyen. | Non. | `refactor/cokain-gelato` | Extraire/tester. |
| `src/lib/commerce/wear/quote.ts` | commerce, Wear, Gelato | Refuser shipping sans prix. | Gelato quote. | Moyen. | Non. | `refactor/cokain-gelato` | Extraire/tester. |
| `src/lib/governance-policy.ts` | RDM, RBAC | Passer politique en ecriture Drive. | permissions, RDM. | Critique: `frontWriteAllowed=true`. | Non. | `refactor/rdm` | Corriger: false prod/prototype. |
| `src/lib/governance-service.ts` | RDM | Adapter validations aux nouveaux statuts/chemins. | RDM records/types. | Moyen: validations moins strictes. | Non. | `refactor/rdm` | Revoir. |
| `src/lib/governance-types.ts` | RDM | Source ZONE 21 HOLDING, writer mode Drive. | governance policy. | Moyen. | Non. | `refactor/rdm` | Corriger modes. |
| `src/lib/permissions.ts` | authentification, RBAC | Simplifier roles a lecteur/editeur/admin. | auth, RBAC, UI. | Haut. | Non. | `refactor/collaborator-auth` | Revoir modele roles. |
| `src/lib/rbac.ts` | RBAC, authentification | Adapter permissions. | permissions, API RDM. | Haut: ecriture par role prototype. | Non. | `refactor/collaborator-auth` | Corriger server-side + feature flag. |
| `src/lib/rdm-presenters.ts` | RDM, portail collaborateurs | Adapter libelles/statuts. | UI RDM. | Moyen. | Non. | `refactor/rdm` | Extraire avec tests visuels. |
| `src/lib/rdm-service.ts` | RDM, API | Lire/ecrire registre central, archive, upload. | fs/path, Drive, routes API. | Critique: atomicite, symlink, warning Turbopack. | Potentiel chemins systeme. | `refactor/rdm` | Refactoriser/securiser avant PR. |
| `src/lib/rdm-types.ts` | RDM | Nouveaux types/statuts/schema registry. | RDM service/UI/tests. | Moyen: migration statuts. | Non. | `refactor/rdm` | Extraire avec migration/validation. |
| `src/lib/seo/createMetadata.ts` | SEO | Helper metadata. | siteConfig. | Faible. | Non. | `refactor/seo` | Conserver/tester. |
| `src/lib/storyblok/types.ts` | Storyblok, accueil | Ajouter classNames hero. | Hero component. | Faible a moyen. | Non. | `refactor/home-assets` | Extraire si necessaire. |
| `src/tests/rdm.sync.test.ts` | tests, RDM | Adapter tests au registre Drive minimal. | RDM service. | Moyen: couverture insuffisante securite. | Non. | `refactor/rdm` | Etendre tests obligatoires. |

## Fichiers a ne pas extraire sans correction

- `scripts/commerce-cokain-recette.ts`: refactor obligatoire avant PR.
- `src/app/api/rdm/route.ts` et `src/app/api/rdm/[id]/route.ts`: ecriture a bloquer par defaut.
- `src/lib/governance-policy.ts`: `frontWriteAllowed=true` est incompatible avec le niveau de securite attendu.
- Assets `ChatGPT Image ...`: noms a corriger ou justifier; audit automatique requis.
- Suppressions d'assets historiques: preuve d'inutilisation requise.

## Commandes d'audit utilisees

```bash
git diff --name-status 52a3e9687564f623282ca3da5ccdb14aa5e47cb8..0c9165de9b6c7ed3557e9a1769487d617d663a4a
git diff --stat 52a3e9687564f623282ca3da5ccdb14aa5e47cb8..0c9165de9b6c7ed3557e9a1769487d617d663a4a
```

## Prochaine etape

Creer `refactor/seo` depuis `origin/main`, extraire uniquement les fichiers SEO utiles depuis la backup, corriger le fallback de `siteConfig`, ajouter les tests SEO minimaux, puis ouvrir une PR dediee.
