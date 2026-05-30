import { createBrowserClient } from '@supabase/ssr';
import { PostgrestError } from '@supabase/supabase-js';
import * as Sentry from "@sentry/nextjs";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Extracts a clean, human-readable error message from various error formats.
 * Handles Supabase errors, Zod validation objects, and standard JavaScript errors.
 */
export function getServerError(error: unknown): string {
  if (!error) return 'An unknown error occurred';

  // 1. Report to Sentry for technical telemetry
  // Only capture if it's not a common expected error like 'Unauthorized'
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (!errorMessage.includes('Unauthorized') && !errorMessage.includes('ASSET_NOT_FOUND')) {
    Sentry.captureException(error);
  }

  // 2. Handle case where error is a container object { error: ... }
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const innerError = (error as { error: unknown }).error;
    if (innerError && typeof innerError === 'object' && !('message' in innerError)) {
      return getServerError(innerError);
    }
  }

  // 2. Handle Zod .format() objects
  if (typeof error === 'object' && error !== null && !('message' in error)) {
    const zodError = error as Record<string, { _errors?: string[] } | string[]>;
    const messages: string[] = [];
    
    // Check for root level errors
    const rootErrors = (zodError as { _errors?: string[] })._errors;
    if (Array.isArray(rootErrors) && rootErrors.length > 0) {
      messages.push(...rootErrors);
    }

    // Check for field level errors
    Object.entries(zodError).forEach(([key, value]) => {
      if (key !== '_errors' && value && typeof value === 'object' && '_errors' in value) {
        const fieldErrors = (value as { _errors: string[] })._errors;
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          messages.push(`${key}: ${fieldErrors.join(', ')}`);
        }
      }
    });

    if (messages.length > 0) {
      return messages.join('; ');
    }
  }

  // 3. Handle Supabase PostgrestError
  const pgError = error as PostgrestError;
  if (pgError.message && typeof pgError.message === 'string') {
    return pgError.message;
  }

  // 4. Handle Standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // 5. Fallback for string errors or unknown types
  return typeof error === 'string' ? error : 'A technical error occurred in the forge pipeline';
}
