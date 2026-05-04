# Go-live gap analysis

## Conclusion

Statut : valide sous conditions pour staging avance.

Statut go-live : non pret pour go-live.

## Pret

- Separation Storyblok / commerce maintenue.
- Persistance commerce presente.
- Webhook event store present.
- Idempotence Stripe et traitement interne presente.
- Replay webhook controle disponible.
- Refresh statut fournisseur disponible.
- Runbook LWS structure.
- `WEAR_ALLOW_ESTIMATED_QUOTES=false` documente pour staging/prod.

## Pret sous conditions

- Stripe Connect : pret a tester avec comptes connectes test reels.
- Checkout global : pret a tester avec vraies quotes Wear.
- Printify/Gelato : clients branches, mais validation provider reelle encore requise.
- LWS : runbook exploitable, mais validation sur instance cible encore requise.

## Blockers critiques

1. Mappings Wear reels absents.
   - Les mappings actifs ne peuvent pas etre inventes.
   - Les IDs Printify/Gelato doivent venir des comptes fournisseur.

2. Scenario Stripe Connect test non execute.
   - Il faut des cles Stripe test, comptes connectes et webhook HTTPS expose.

3. Commande fournisseur Wear reelle non confirmee.
   - Elle depend des mappings actifs, fichiers Gelato et produits Printify/Gelato publies/testables.

4. Validation LWS reelle non executee.
   - Le serveur cible, Passenger, HTTPS et webhook public doivent etre testes.

## Blockers importants

- Normalisation tracking provider a affiner apres premieres reponses reelles.
- Strategie de remboursement partiel a tester apres transferts.
- Monitoring logs LWS a confirmer.
- Rotation secrets et politique d'acces admin replay a formaliser.

## Ameliorable

- Dashboard support interne pour orders/webhooks/provider orders.
- Alerting sur `webhook_events.failed`.
- Rapport automatique de recette staging.

## Decision

- Pret pour staging avance : oui, sous conditions.
- Pret pour preproduction complete : non, tant que les mappings et la recette Stripe/provider ne sont pas prouves.
- Pret pour go-live : non.
