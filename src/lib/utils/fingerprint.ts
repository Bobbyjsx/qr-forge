import { createHash } from 'crypto';

/**
 * Generates a privacy-preserving fingerprint for an anonymous user.
 * Combines IP, User Agent, and a server-side secret to ensure consistency 
 * without storing raw personally identifiable information (PII).
 */
export function generateGuestId(ip: string, userAgent: string): string {
  const salt = process.env.INTERNAL_SECURITY_SALT || 'qr-forge-protocol-v2';
  const rawId = `${ip}-${userAgent}-${salt}`;
  
  return createHash('sha256')
    .update(rawId)
    .digest('hex')
    .substring(0, 32);
}
