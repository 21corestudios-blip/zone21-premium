# Passerelle Gelato — pilote CO-KAIN

## Périmètre

Le pilote couvre trois familles (T-shirt, hoodie et sweat col rond), trois
couleurs (noir, blanc et gris chiné) et trois régions de production :

- `EU` pour l'Europe ;
- `US-CA` pour les États-Unis et le Canada ;
- `OC` pour l'Australie et la Nouvelle-Zélande.

Les mappings du fichier `db/seeds/wear-provider-mappings.json` restent
inactifs tant que les références Gelato, les fichiers d'impression publics et
les échantillons physiques ne sont pas validés.

## Secrets

Configurer uniquement côté serveur :

```dotenv
GELATO_API_KEY=
GELATO_STORE_ID=
GELATO_API_BASE_URL=https://order.gelatoapis.com
GELATO_PRODUCT_API_BASE_URL=https://product.gelatoapis.com
```

La clé Gelato ne doit jamais être préfixée par `NEXT_PUBLIC_`, enregistrée dans
Git ou envoyée au navigateur.

## Fichiers CO-KAIN

Les masters validés sont les SVG V2 du dossier Drive CO-KAIN. Ils doivent être
publiés sur une URL HTTPS accessible par Gelato avant activation des mappings.
Le noir est utilisé sur textile blanc ou gris chiné ; le blanc sur textile
noir.

L'API v4 reçoit un tableau `files`, par exemple :

```json
[
  {
    "type": "front",
    "url": "https://zone-21.fr/print/co-kain/logo-principal-blanc-v2.svg"
  },
  {
    "type": "back",
    "url": "https://zone-21.fr/print/co-kain/monogramme-k-blanc-v2.svg"
  }
]
```

Les valeurs de `type` doivent correspondre exactement aux zones d'impression
du template Gelato retenu.

## Sélection régionale

1. Déterminer la région depuis le pays de livraison.
2. Charger uniquement les mappings actifs de cette région.
3. Écarter les produits incompatibles avec le pays, indisponibles ou sous le
   seuil de qualité.
4. Demander un devis Gelato réel.
5. Classer les produits restants selon le coût livré, le délai maximal et la
   production locale.
6. Conserver le mapping et la méthode de livraison sélectionnés dans la ligne
   de commande.

La qualité est un filtre obligatoire, pas une composante compensable du score.

## Activation

Pour chaque produit, région, taille et couleur :

1. renseigner le `productUid` et le variant Gelato ;
2. renseigner les `printFiles` HTTPS ;
3. vérifier la disponibilité régionale ;
4. exécuter un devis réel sur les trois destinations de référence ;
5. commander et valider les échantillons ;
6. passer `active` à `true` ;
7. charger les mappings dans la base.

## Contrôles

```bash
npm run test:gelato-bridge
npm run commerce:validate:wear-mappings
npm run commerce:wear:quote-check
npm run typecheck
npm run lint
```

Le contrôle des devis réels exige la clé Gelato et des mappings actifs. Les
tests unitaires n'utilisent aucun secret et ne créent aucune commande.
