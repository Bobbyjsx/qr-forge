import { z } from 'zod';

export const qrRouteSchema = z.object({
  url: z.string().url({ message: "Please provide a valid URL (e.g., https://google.com)" }),
  redirectType: z.enum(['301', '302', '307']),
  isActive: z.boolean().optional(),
  expiresAt: z.string().nullable().optional(),
  design: z.object({
    fgColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").optional(),
    bgColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").optional(),
    borderStyle: z.string().optional(),
    logoUrl: z.string().url().or(z.literal('')).nullable().optional(),
    logoPadding: z.number().min(0).max(100).optional(),
    // Advanced styling (Strictly aligned with qr-code-styling)
    dotType: z.enum(['square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded']).optional(),
    cornerType: z.enum(['square', 'dot', 'extra-rounded']).optional(),
    cornerDotType: z.enum(['square', 'dot']).optional(),
    margin: z.number().min(0).max(50).optional(),
  }).optional(),
});

export type QRRouteSchema = z.infer<typeof qrRouteSchema>;
