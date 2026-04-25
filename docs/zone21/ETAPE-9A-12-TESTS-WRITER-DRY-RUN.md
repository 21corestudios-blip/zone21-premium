# ETAPE 9A-12 — Tests writer GED dry-run

## Statut du document

Document de validation fonctionnelle du writer GED ZONE 21 en mode `dry-run`.

Cette étape ne déclenche aucune écriture documentaire réelle. Elle vérifie le comportement du writer simulé sur les cas métier critiques définis pour la phase 1.

## 1. Cas testés

Les cas suivants sont couverts :

- cas valide : entrée conforme ;
- domaine interdit : `FIN` ;
- objet non autorisé ;
- version invalide ;
- référence incohérente ;
- conflit de version simulé.

## 2. Résultats attendus

### Cas valide

- statut attendu : `ready`

### Domaine interdit

- statut attendu : `blocked`

### Objet non autorisé

- statut attendu : `blocked`

### Version invalide

- statut attendu : `invalid`

### Référence incohérente

- statut attendu : `invalid`

### Conflit simulé

- statut attendu : `blocked`

## 3. Vérification manuelle de la route

Route testée :

- `GET /api/ged/writer/dry-run`

Points à vérifier :

- réponse HTTP `200` ;
- présence du message `Writer en mode simulation — aucune écriture réelle autorisée` ;
- `enabled: false` ;
- simulation principale en `ready` ;
- scénario `FIN` en `blocked` ;
- scénario de conflit simulé en `blocked` ou `invalid`.

## 4. Exemple JSON attendu

Extrait attendu de la réponse :

```json
{
  "writer": {
    "enabled": false,
    "mode": "dry-run",
    "message": "Writer en mode simulation — aucune écriture réelle autorisée"
  },
  "simulation": {
    "status": "ready"
  }
}
```

Extrait attendu pour le domaine interdit :

```json
{
  "label": "Domaine interdit FIN",
  "result": {
    "status": "blocked"
  }
}
```

## 5. Limites actuelles

Les tests du dry-run ne couvrent pas encore :

- une génération réelle `DOCX` ;
- une conversion réelle `PDF` ;
- une écriture réelle dans `ZONE21_DEV` ;
- un verrouillage technique de concurrence ;
- une reprise réelle après échec ;
- une relecture physique post-écriture.

## 6. Conclusion

Le writer dry-run peut être validé fonctionnellement si les tests automatisés et la route `GET` confirment les statuts attendus sans produire aucun effet sur les fichiers réels.
