/**
 * Reusable paginated list component
 */

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Spinner, EmptyState, ErrorState } from "@/components/LoadingStates";
import { generatePageNumbers, getPaginationInfo } from "@/hooks/usePagination";

export interface PaginatedListProps<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  isLoading?: boolean;
  error?: string | null;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

/**
 * Paginated list component with built-in controls
 */
export function PaginatedList<T>({
  items,
  total,
  page,
  limit,
  isLoading = false,
  error = null,
  onPageChange,
  onLimitChange,
  renderItem,
  emptyMessage = "Aucun élément trouvé",
  errorMessage = "Une erreur s'est produite lors du chargement des données",
  onRetry,
}: PaginatedListProps<T>) {
  const totalPages = Math.ceil(total / limit);
  const pageNumbers = generatePageNumbers(page, totalPages);
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorState
          title="Erreur de chargement"
          description={errorMessage}
          action={onRetry ? { label: "Réessayer", onClick: onRetry } : undefined}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className="space-y-4">
      {/* Items */}
      <div className="space-y-2">{items.map((item, index) => renderItem(item, index))}</div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {getPaginationInfo(page, limit, total)}
          </span>
          {onLimitChange && (
            <>
              <span className="text-sm text-muted-foreground">|</span>
              <select
                value={limit}
                onChange={(e) => onLimitChange(parseInt(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="10">10 par page</option>
                <option value="25">25 par page</option>
                <option value="50">50 par page</option>
                <option value="100">100 par page</option>
              </select>
            </>
          )}
        </div>

        {/* Page Navigation */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {pageNumbers.map((pageNum, index) =>
            pageNum === "..." ? (
              <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum as number)}
              >
                {pageNum}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Table paginated list component
 */
export function PaginatedTable<T extends Record<string, any>>({
  items,
  total,
  page,
  limit,
  isLoading = false,
  error = null,
  onPageChange,
  onLimitChange,
  columns,
  emptyMessage = "Aucun élément trouvé",
  errorMessage = "Une erreur s'est produite lors du chargement des données",
  onRetry,
}: PaginatedListProps<T> & {
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => ReactNode;
  }>;
}) {
  const totalPages = Math.ceil(total / limit);
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  if (error) {
    return (
      <ErrorState
        title="Erreur de chargement"
        description={errorMessage}
        action={onRetry ? { label: "Réessayer", onClick: onRetry } : undefined}
      />
    );
  }

  if (items.length === 0 && !isLoading) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-3 text-left text-sm font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <tr key={i} className="border-t">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              items.map((item, rowIndex) => (
                <tr key={rowIndex} className="border-t hover:bg-muted/50">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-sm">
                      {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {getPaginationInfo(page, limit, total)}
          </span>
          {onLimitChange && (
            <>
              <span className="text-sm text-muted-foreground">|</span>
              <select
                value={limit}
                onChange={(e) => onLimitChange(parseInt(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="10">10 par page</option>
                <option value="25">25 par page</option>
                <option value="50">50 par page</option>
                <option value="100">100 par page</option>
              </select>
            </>
          )}
        </div>

        {/* Page Navigation */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
