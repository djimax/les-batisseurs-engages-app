# Améliorations et Corrections du Projet "Bâtisseurs Engagés"

## Phase 1 : Corrections Critiques

### Schéma de Base de Données
- [x] Remplacer `varchar` par `decimal` pour les montants financiers
  - [x] cotisations.montant
  - [x] dons.montant
  - [x] depenses.montant
  - [x] transactions.montant
  - [x] campaigns.objectif
  - [x] campaigns.montantCollecte
  - [x] adhesions.montant

### Validation des Données
- [x] Créer des schémas Zod pour tous les inputs (shared/schemas.ts)
  - [x] Schémas financiers (montant, dates)
  - [x] Schémas cotisations
  - [x] Schémas dons
  - [x] Schémas dépenses
  - [x] Schémas documents
  - [x] Schémas membres
  - [x] Schémas catégories
  - [x] Schémas pagination

### Gestion des Erreurs
- [x] Créer un middleware de gestion des erreurs (server/_core/errorHandler.ts)
- [x] Créer des helpers pour les opérations courantes (server/_core/helpers.ts)
- [ ] Intégrer le middleware dans les procédures tRPC
- [ ] Ajouter la gestion des erreurs Zod dans toutes les procédures

### Tests
- [ ] Corriger les tests échoués (mocks pour la base de données)
- [ ] Ajouter des fixtures de test
- [ ] Augmenter la couverture de test pour les procédures financières

## Phase 2 : Améliorations Importantes

### Pagination
- [ ] Ajouter la pagination à toutes les procédures `list`
- [ ] Implémenter un helper de pagination réutilisable
- [ ] Retourner le nombre total d'éléments

### Permissions
- [ ] Implémenter les vérifications de permissions
- [ ] Créer un middleware pour les permissions
- [ ] Vérifier les permissions dans chaque procédure

### Logging et Audit
- [ ] Implémenter un logging cohérent
- [ ] Ajouter des logs pour toutes les actions sensibles
- [ ] Créer un audit trail complet

### Performance
- [ ] Ajouter des index sur les colonnes fréquemment filtrées
- [ ] Optimiser les requêtes avec des JOINs
- [ ] Implémenter un cache pour les données statiques

## Phase 3 : Améliorations Souhaitables

### Soft Delete
- [ ] Ajouter un champ `deletedAt` aux tables principales
- [ ] Filtrer les enregistrements supprimés par défaut
- [ ] Ajouter des procédures pour restaurer les données

### Transactions
- [ ] Utiliser les transactions Drizzle ORM pour les opérations multi-étapes
- [ ] Tester les rollbacks en cas d'erreur
- [ ] Créer des helpers pour les opérations complexes

### Validation des Relations
- [ ] Ajouter des vérifications d'existence avant les opérations
- [ ] Utiliser les contraintes de clés étrangères MySQL
- [ ] Créer des helpers de validation

### UX/UI
- [ ] Ajouter des états de chargement (spinners, skeletons)
- [ ] Afficher des messages d'erreur clairs
- [ ] Ajouter des toasts pour les actions
- [ ] Améliorer l'accessibilité WCAG

## Fichiers Créés

1. **shared/schemas.ts** - Schémas Zod pour la validation
2. **server/_core/helpers.ts** - Helpers pour les opérations courantes
3. **server/_core/errorHandler.ts** - Gestion centralisée des erreurs
4. **IMPROVEMENTS.md** - Ce fichier

## Prochaines Étapes

1. Générer les migrations Drizzle pour les changements de schéma
2. Appliquer les migrations à la base de données
3. Mettre à jour les procédures tRPC pour utiliser les schémas Zod
4. Corriger les tests échoués
5. Ajouter les tests manquants
6. Améliorer l'UX/UI

## Notes

- Les montants financiers doivent toujours être des nombres décimaux
- Les dates doivent être validées (fin > début)
- Toutes les opérations doivent être loggées
- Les permissions doivent être vérifiées pour chaque action
- Les tests doivent être isolés et ne pas dépendre de la base de données réelle
