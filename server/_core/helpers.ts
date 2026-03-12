/**
 * Helper functions for common operations
 */

import { TRPCError } from "@trpc/server";

/**
 * Format a monetary amount to 2 decimal places
 */
export function formatMontant(montant: number | string): number {
  const num = typeof montant === "string" ? parseFloat(montant) : montant;
  if (isNaN(num)) throw new Error("Invalid montant");
  return Math.round(num * 100) / 100;
}

/**
 * Format a monetary amount for display (with currency symbol)
 */
export function displayMontant(montant: number | string, currency: string = "F"): string {
  const num = formatMontant(montant);
  return `${num.toFixed(2)} ${currency}`;
}

/**
 * Validate that a date range is valid (end > start)
 */
export function validateDateRange(
  startDate: Date | string,
  endDate: Date | string,
  fieldName: string = "date range"
): void {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  if (end <= start) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid ${fieldName}: end date must be after start date`,
    });
  }
}

/**
 * Validate that a resource exists
 */
export function validateExists<T>(
  resource: T | null | undefined,
  resourceName: string,
  id?: number | string
): T {
  if (!resource) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `${resourceName}${id ? ` with id ${id}` : ""} not found`,
    });
  }
  return resource;
}

/**
 * Validate that the user has permission to perform an action
 */
export function validatePermission(
  hasPermission: boolean,
  action: string = "perform this action"
): void {
  if (!hasPermission) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You don't have permission to ${action}`,
    });
  }
}

/**
 * Pagination helper - calculate offset from page number
 */
export function calculateOffset(page: number, limit: number): number {
  if (page < 1) throw new Error("Page must be >= 1");
  return (page - 1) * limit;
}

/**
 * Pagination helper - return paginated response
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  limit: number,
  offset: number
) {
  return {
    items,
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  };
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Sanitize string input to prevent injection attacks
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ""); // Remove angle brackets
}

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Check if a date is in the past
 */
export function isDateInPast(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d < new Date();
}

/**
 * Check if a date is today
 */
export function isDateToday(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

/**
 * Get the number of days between two dates
 */
export function daysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a cotisation is overdue
 */
export function isCotisationOverdue(dateFin: Date | string): boolean {
  return isDateInPast(dateFin);
}

/**
 * Check if a cotisation expires soon (within 30 days)
 */
export function isCotisationExpiringSoon(dateFin: Date | string, daysThreshold: number = 30): boolean {
  const d = typeof dateFin === "string" ? new Date(dateFin) : dateFin;
  const today = new Date();
  const daysUntilExpiry = daysBetween(today, d);
  return daysUntilExpiry <= daysThreshold && daysUntilExpiry > 0;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, locale: string = "fr-FR"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale);
}

/**
 * Format a date and time for display
 */
export function formatDateTime(date: Date | string, locale: string = "fr-FR"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale);
}
