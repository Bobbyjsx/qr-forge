import { createBrowserClient } from '@supabase/ssr';
import { PostgrestError } from '@supabase/supabase-js';

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

  // 1. Handle case where error is a container object { error: ... }
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const innerError = (error as { error: unknown }).error;
    if (innerError && typeof innerError === 'object' && !('message' in innerError)) {
      return getServerError(innerError);
    }
  }

  // 2. Handle Zod .format() objects
  if (typeof error === 'object' && error !== null && !('message' in error)) {
    const zodError = error as Record<string, any>;
    const messages: string[] = [];
    
    // Check for root level errors
    if (Array.isArray(zodError._errors) && zodError._errors.length > 0) {
      messages.push(...zodError._errors);
    }

    // Check for field level errors
    Object.entries(zodError).forEach(([key, value]) => {
      if (key !== '_errors' && value?._errors && Array.isArray(value._errors) && value._errors.length > 0) {
        messages.push(`${key}: ${value._errors.join(', ')}`);
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
