# ETAPE 9A-10 — Writer documentaire unique

## Statut du document

Document de spécification fonctionnelle du futur writer documentaire unique ZONE 21.

Ce document ne déclenche aucune écriture documentaire, n'active aucun workflow technique et ne modifie aucun comportement applicatif. Il définit le futur composant serveur autorisé à écrire dans `ZONE21_DEV`.

## 1. Rôle du writer

Le writer documentaire est le futur composant serveur qui devra être :

- le seul composant autorisé à écrire dans `ZONE21_DEV` ;
- le point unique d'écriture ;
- appelé uniquement après validation complète du workflow ;
- responsable de la cohérence documentaire finale.

### Principe directeur

Le writer ne doit jamais être invoqué depuis le front. Il doit intervenir uniquement en fin de chaîne, une fois les validations métier, documentaires et techniques déjà acquises au niveau du workflow.

## 2. Responsabilités du writer

Le writer devra prendre en charge les responsabilités suivantes :

- génération du `DOCX` à partir du modèle ;
- génération du `PDF` ;
- contrôle du nom de fichier ;
- contrôle de la référence ;
- contrôle de la version ;
- contrôle du chemin ;
- création du fichier ;
- déplacement de l'ancienne version vers archive ;
- mise à jour du journal d'audit ;
- retour de statut vers le RDM.

### Interprétation

Le writer ne sera pas un simple mécanisme de copie de fichiers. Il devra garantir que la publication documentaire finale reste cohérente, traçable et physiquement confirmée dans `ZONE21_DEV`.

## 3. Entrées du writer

Le writer devra recevoir au minimum les éléments suivants :

- données du brouillon validé ;
- type documentaire ;
- référence ;
- version cible ;
- chemin cible ;
- utilisateur validateur ;
- décision de validation.

### Précondition

Ces entrées ne devront être transmises au writer qu'après validation complète du workflow et après vérification que le document fait partie du périmètre autorisé de la phase considérée.

## 4. Sorties du writer

Le writer devra produire ou signaler les sorties suivantes :

- `DOCX` créé ;
- `PDF` créé ;
- archive mise à jour ;
- statut final ;
- journal d'audit enrichi ;
- signal de rafraîchissement RDM.

### Principe de restitution

Les sorties du writer devront être assez précises pour permettre au portail et au RDM de savoir si la publication est réellement confirmée, bloquée ou à vérifier.

## 5. Contrôles obligatoires

Avant toute écriture, le writer devra exécuter les contrôles suivants :

- conformité nommage ;
- conformité version ;
- conformité chemin ;
- absence de conflit ;
- présence du modèle ;
- cohérence contenu.

### Portée des contrôles

Ces contrôles devront être bloquants. Le writer ne devra jamais tenter une écriture si l'un des prérequis documentaires ou techniques obligatoires n'est pas satisfait.

## 6. Cas d’échec

En cas d'échec, le writer devra respecter les règles suivantes :

- refus d'écriture si non conforme ;
- aucun fichier partiel ;
- journalisation obligatoire ;
- statut `bloqué` côté RDM.

### Principe de sécurité

Le writer devra échouer proprement. Aucun cas d'erreur ne devra laisser un état documentaire ambigu, partiellement écrit ou silencieusement incohérent.

## 7. Principe de relecture

Après écriture, le writer devra imposer :

- relecture physique de `ZONE21_DEV` après écriture ;
- validation finale uniquement après confirmation réelle.

### Conséquence

Le document ne devra pas être considéré comme officiellement disponible tant que le writer n'aura pas relu et confirmé :

- le `DOCX` ;
- le `PDF` s'il est requis ;
- le chemin cible ;
- la cohérence du nom et de la version.

## 8. Garde-fous

Les garde-fous suivants devront rester obligatoires :

- aucune écriture depuis le front ;
- aucune écriture directe Drive ;
- aucune écriture NAS ;
- aucune double source ;
- aucune validation sans contrôle physique.

### Portée

Le writer doit être la seule porte documentaire autorisée. Google Drive et le NAS restent des supports techniques, jamais des points d'écriture logique concurrents.

## 9. Position dans la chaîne de vérité

Le writer devra s'inscrire dans la chaîne de vérité suivante :

- workflow applicatif prépare ;
- validation complète du workflow ;
- writer documentaire écrit ;
- `ZONE21_DEV` fait foi ;
- RDM relit ;
- RDM expose.

### Conséquence de gouvernance

Le writer ne crée pas une nouvelle source de vérité. Il matérialise uniquement l'état documentaire validé dans la seule base officielle, puis laisse le RDM relire l'état réel.

## 10. Points à surveiller reportés

Les arbitrages suivants restent à trancher avant développement :

- confirmer le langage du writer : `Node`, `Python` ou autre ;
- définir l'emplacement technique du service ;
- choisir les bibliothèques `DOCX` ;
- choisir les outils de conversion `PDF` ;
- définir le mécanisme de lock et de concurrence ;
- définir la stratégie de reprise en cas d'échec ;
- définir la gestion des conflits de version.

## Principe directeur

Le writer documentaire unique doit être conçu comme un composant serveur central, strict, traçable et bloquant. Il ne devra jamais privilégier la commodité au détriment de la cohérence documentaire. Toute écriture future dans `ZONE21_DEV` devra passer exclusivement par lui.
