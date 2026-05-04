# Idempotency Strategy

## Principe

Toute écriture critique reçoit une clé stable.
Un replay ne doit jamais créer deux paiements, deux transferts ou deux commandes fournisseur.

## Stripe Checkout

Clé :

```txt
z21:checkout:{orderId}
```

Utilisée lors de `checkout.sessions.create`.

## Stripe Transfers

Clé :

```txt
z21:transfer:{orderId}:{brand}
```

Chaque transfert par brand est persisté dans `stripe_transfers`.
Si un transfert est déjà `transferred`, il n'est pas rejoué.

## Webhooks

Clé :

```txt
webhook:{provider}:{eventId}
```

Le webhook est persisté avant traitement.
Contrainte unique :

- `(provider, event_id)`
- `idempotency_key`

Statuts :

- `pending`
- `processing`
- `processed`
- `failed`
- `ignored`

## Commandes fournisseur Wear

Clé :

```txt
z21:provider-order:{orderId}:{productId}:{variantId}:{provider}
```

Si une commande fournisseur existe déjà en `submitted`, elle n'est pas recréée.

## Replays

Un replay webhook :

- retrouve l'événement existant ;
- retourne une réponse sans double effet ;
- laisse le statut consultable en DB.

Un replay manuel devra passer par un outil admin dédié.
Il ne doit pas contourner les clés d'idempotence.
