/**
 * Centralized error handling for tRPC
 */

import { TRPCError } from "@trpc/server";
import { ZodError } from "zod";

/**
 * Format Zod validation errors into a readable message
 */
export function formatZodError(error: ZodError<any>): string {
  const errors = error.issues.map((err: any) => {
    const path = err.path.join(".");
    return `${path}: ${err.message}`;
  });
  return errors.join(", ");
}

/**
 * Convert any error to a TRPCError
 */
export function handleError(error: unknown): TRPCError {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return new TRPCError({
      code: "BAD_REQUEST",
      message: formatZodError(error),
    });
  }

  // Handle TRPC errors
  if (error instanceof TRPCError) {
    return error;
  }

  // Handle standard errors
  if (error instanceof Error) {
    // Database errors
    if ("code" in error && error.code === "ER_DUP_ENTRY") {
      return new TRPCError({
        code: "CONFLICT",
        message: "This record already exists",
      });
    }

    if ("code" in error && error.code === "ER_NO_REFERENCED_ROW") {
      return new TRPCError({
        code: "BAD_REQUEST",
        message: "Referenced record does not exist",
      });
    }

    // Generic error
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message || "An unexpected error occurred",
    });
  }

  // Unknown error
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  });
}

/**
 * Error response type
 */
export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown>
): ErrorResponse {
  return {
    code,
    message,
    ...(details && { details }),
  };
}

/**
 * Log error with context
 */
export function logError(
  error: unknown,
  context: {
    procedure?: string;
    userId?: number;
    action?: string;
  }
): void {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);

  console.error(
    `[${timestamp}] Error in ${context.procedure || "unknown procedure"} (user: ${context.userId || "anonymous"}, action: ${context.action || "unknown"}): ${errorMessage}`
  );

  // In production, you might want to send this to a logging service
  // e.g., Sentry, LogRocket, etc.
}

/**
 * Validate that a condition is true, throw error if not
 */
export function assert(
  condition: boolean,
  code: TRPCError["code"],
  message: string
): asserts condition {
  if (!condition) {
    throw new TRPCError({ code, message });
  }
}
