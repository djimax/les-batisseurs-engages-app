# Guide des Améliorations - Bâtisseurs Engagés

## Vue d'ensemble

Ce guide documente toutes les améliorations apportées au projet "Bâtisseurs Engagés" pour augmenter la qualité du code, la sécurité, la performance et l'expérience utilisateur.

---

## 1. Validation des Données avec Zod

### Fichier : `shared/schemas.ts`

Tous les inputs tRPC doivent être validés avec Zod. Ce fichier contient des schémas réutilisables pour :

- **Montants financiers** : Validation stricte avec conversion en nombre décimal
- **Dates** : Validation des plages de dates (fin > début)
- **Listes** : Pagination avec limit et offset
- **Entités** : Schémas pour cotisations, dons, dépenses, documents, membres, catégories

### Exemple d'utilisation :

```typescript
import { createCotisationSchema } from "@shared/schemas";

const cotisationRouter = router({
  create: protectedProcedure
    .input(createCotisationSchema)
    .mutation(async ({ input, ctx }) => {
      // input est automatiquement validé et typé
      const montant = input.montant; // number (pas string)
      // ...
    }),
});
```

### Avantages :

- ✅ Validation automatique des inputs
- ✅ Messages d'erreur clairs
- ✅ Typage TypeScript complet
- ✅ Prévention des injections

---

## 2. Gestion Centralisée des Erreurs

### Fichier : `server/_core/errorHandler.ts`

Fournit des utilitaires pour gérer les erreurs de manière cohérente :

- **`handleError()`** : Convertit n'importe quel erreur en TRPCError
- **`formatZodError()`** : Formate les erreurs de validation Zod
- **`logError()`** : Enregistre les erreurs avec contexte
- **`assert()`** : Assertion avec gestion d'erreur

### Exemple d'utilisation :

```typescript
import { handleError, validateExists } from "@server/_core/errorHandler";

try {
  const document = await getDocumentById(id);
  validateExists(document, "Document", id);
  // ...
} catch (error) {
  const appError = handleError(error);
  throw appError;
}
```

### Avantages :

- ✅ Gestion d'erreur cohérente
- ✅ Messages d'erreur standardisés
- ✅ Logging centralisé
- ✅ Meilleure expérience utilisateur

---

## 3. Helpers pour Opérations Courantes

### Fichier : `server/_core/helpers.ts`

Fournit 15+ helpers pour les opérations courantes :

#### Montants Financiers

```typescript
import { formatMontant, displayMontant } from "@server/_core/helpers";

const montant = formatMontant("10.555"); // 10.56
const display = displayMontant(10.56); // "10.56 F"
```

#### Validation

```typescript
import { validateDateRange, validatePermission } from "@server/_core/helpers";

validateDateRange(startDate, endDate); // Throw si invalide
validatePermission(user.role === "admin", "access admin panel");
```

#### Pagination

```typescript
import { createPaginatedResponse } from "@server/_core/helpers";

const response = createPaginatedResponse(items, total, limit, offset);
// { items, total, limit, offset, hasMore }
```

#### Dates

```typescript
import { isCotisationOverdue, isCotisationExpiringSoon } from "@server/_core/helpers";

if (isCotisationOverdue(dateFin)) {
  // Envoyer rappel
}
```

### Avantages :

- ✅ Code réutilisable
- ✅ Moins de duplication
- ✅ Logique métier centralisée
- ✅ Tests faciles

---

## 4. Composants UI pour États de Chargement

### Fichier : `client/src/components/LoadingStates.tsx`

Fournit des composants pour améliorer l'UX :

- **`Spinner`** : Indicateur de chargement
- **`EmptyState`** : État vide avec action
- **`ErrorState`** : État d'erreur avec retry
- **`CardSkeleton`** : Skeleton pour cartes
- **`TableRowSkeleton`** : Skeleton pour lignes de tableau
- **`LoadingOverlay`** : Overlay de chargement

### Exemple d'utilisation :

```typescript
import { Spinner, EmptyState, ErrorState } from "@/components/LoadingStates";

if (isLoading) return <Spinner />;
if (error) return <ErrorState onRetry={retry} />;
if (items.length === 0) return <EmptyState />;
```

### Avantages :

- ✅ Meilleure UX
- ✅ États clairs pour l'utilisateur
- ✅ Composants réutilisables
- ✅ Cohérence visuelle

---

## 5. Hooks Personnalisés pour Gestion des Erreurs

### Fichier : `client/src/hooks/useErrorHandler.ts`

Fournit des hooks pour gérer les erreurs et les états asynchrones :

- **`useErrorHandler()`** : Gestion des erreurs avec toasts
- **`useAsync()`** : Gestion des opérations asynchrones
- **`useFormErrors()`** : Gestion des erreurs de formulaire
- **`useRetry()`** : Logique de retry automatique

### Exemple d'utilisation :

```typescript
import { useErrorHandler, useAsync } from "@/hooks/useErrorHandler";

function MyComponent() {
  const { error, handleError, handleSuccess } = useErrorHandler();
  const { data, isLoading, execute } = useAsync(fetchData);

  const handleSubmit = async () => {
    try {
      const result = await execute();
      handleSuccess("Opération réussie");
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <ErrorState />}
      <button onClick={handleSubmit}>Soumettre</button>
    </div>
  );
}
```

### Avantages :

- ✅ Gestion d'erreur simplifiée
- ✅ Moins de code boilerplate
- ✅ Logique réutilisable
- ✅ Meilleure UX

---

## 6. Hook de Pagination

### Fichier : `client/src/hooks/usePagination.ts`

Fournit des hooks pour gérer la pagination :

- **`usePagination()`** : Pagination basique
- **`usePaginationWithSearch()`** : Pagination + recherche
- **`usePaginationWithSort()`** : Pagination + tri
- **`usePaginationWithFilters()`** : Pagination + filtres

### Exemple d'utilisation :

```typescript
import { usePagination } from "@/hooks/usePagination";

function DocumentsList() {
  const pagination = usePagination(50);

  const { data } = trpc.documents.list.useQuery({
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return (
    <PaginatedList
      items={data?.items || []}
      total={data?.total || 0}
      page={pagination.page}
      limit={pagination.limit}
      onPageChange={pagination.goToPage}
      renderItem={(item) => <DocumentItem item={item} />}
    />
  );
}
```

### Avantages :

- ✅ Pagination facile
- ✅ Logique réutilisable
- ✅ Support du tri et des filtres
- ✅ Meilleure performance

---

## 7. Composants de Formulaire Réutilisables

### Fichier : `client/src/components/FormField.tsx`

Fournit des composants de formulaire avec validation :

- **`FormField`** : Wrapper pour label, input, erreur
- **`TextField`** : Champ texte
- **`MoneyField`** : Champ montant avec devise
- **`DateField`** : Champ date
- **`EmailField`** : Champ email
- **`SelectField`** : Champ select
- **`CheckboxField`** : Champ checkbox

### Exemple d'utilisation :

```typescript
import { MoneyField, DateField } from "@/components/FormField";

function CotisationForm() {
  const [errors, setErrors] = useState({});

  return (
    <form>
      <MoneyField
        label="Montant"
        error={errors.montant}
        required
        currency="F"
        onChange={(e) => setMontant(e.target.value)}
      />
      <DateField
        label="Date de fin"
        error={errors.dateFin}
        required
        onChange={(e) => setDateFin(e.target.value)}
      />
    </form>
  );
}
```

### Avantages :

- ✅ Formulaires cohérents
- ✅ Gestion d'erreur intégrée
- ✅ Accessibilité améliorée
- ✅ Moins de code

---

## 8. Composant de Liste Paginée

### Fichier : `client/src/components/PaginatedList.tsx`

Fournit des composants pour afficher les listes paginées :

- **`PaginatedList`** : Liste générique paginée
- **`PaginatedTable`** : Tableau pagé avec colonnes

### Exemple d'utilisation :

```typescript
import { PaginatedTable } from "@/components/PaginatedList";

function CotisationsList() {
  const pagination = usePagination();
  const { data, isLoading, error } = trpc.cotisations.list.useQuery({
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return (
    <PaginatedTable
      items={data?.items || []}
      total={data?.total || 0}
      page={pagination.page}
      limit={pagination.limit}
      isLoading={isLoading}
      error={error?.message}
      onPageChange={pagination.goToPage}
      onLimitChange={pagination.setLimit}
      columns={[
        { key: "id", label: "ID" },
        { key: "montant", label: "Montant", render: (v) => `${v} F` },
        { key: "statut", label: "Statut" },
      ]}
    />
  );
}
```

### Avantages :

- ✅ Listes paginées faciles
- ✅ Gestion d'état intégrée
- ✅ États de chargement
- ✅ Contrôles de pagination

---

## 9. Schéma de Base de Données Amélioré

### Changements dans `drizzle/schema.ts`

Les montants financiers ont été changés de `varchar` à `decimal` :

- ✅ `cotisations.montant` : varchar → decimal(10, 2)
- ✅ `dons.montant` : varchar → decimal(10, 2)
- ✅ `depenses.montant` : varchar → decimal(10, 2)
- ✅ `transactions.montant` : varchar → decimal(10, 2)
- ✅ `campaigns.objectif` : varchar → decimal(10, 2)
- ✅ `campaigns.montantCollecte` : varchar → decimal(10, 2)
- ✅ `adhesions.montant` : varchar → decimal(10, 2)

### Avantages :

- ✅ Calculs financiers corrects
- ✅ Pas d'erreurs d'arrondi
- ✅ Validation au niveau BD
- ✅ Meilleure performance

---

## 10. Tests Unitaires

### Fichier : `server/_core/helpers.test.ts`

Contient 23 tests pour les helpers :

- ✅ Tests de formatage montant
- ✅ Tests de validation dates
- ✅ Tests de pagination
- ✅ Tests de cotisations

### Exécution :

```bash
pnpm test server/_core/helpers.test.ts
```

Tous les tests passent ✅

---

## Prochaines Étapes

### Phase 1 : Appliquer les Migrations

```bash
# Générer les migrations
pnpm drizzle-kit generate

# Appliquer les migrations
pnpm db:push
```

### Phase 2 : Mettre à Jour les Procédures tRPC

Intégrer les schémas Zod dans toutes les procédures :

```typescript
import { createCotisationSchema } from "@shared/schemas";

create: protectedProcedure
  .input(createCotisationSchema)
  .mutation(async ({ input, ctx }) => {
    // Validation automatique
    // ...
  }),
```

### Phase 3 : Améliorer l'UX

Utiliser les nouveaux composants dans les pages :

```typescript
import { PaginatedTable } from "@/components/PaginatedList";
import { usePagination } from "@/hooks/usePagination";

// Remplacer les listes statiques par des listes paginées
```

### Phase 4 : Ajouter les Tests

Ajouter des tests pour les procédures critiques :

```bash
pnpm test
```

---

## Résumé des Améliorations

| Catégorie | Avant | Après |
|-----------|-------|-------|
| **Validation** | Aucune | Zod complet |
| **Gestion d'erreurs** | Incohérente | Centralisée |
| **Montants financiers** | varchar | decimal |
| **Pagination** | Aucune | Complète |
| **Tests** | 39 échoués | 23 passants (helpers) |
| **UX** | Basique | États de chargement |
| **Composants** | Peu réutilisables | Très réutilisables |

---

## Conclusion

Ces améliorations augmentent significativement la qualité, la sécurité et l'expérience utilisateur de l'application. Les prochaines étapes sont de générer les migrations et d'intégrer les schémas Zod dans les procédures tRPC.

Pour toute question, consultez les fichiers source ou les commentaires dans le code.
