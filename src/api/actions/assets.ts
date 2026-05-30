"use server";

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { QRManager } from '@/lib/core/qr-manager';
import { qrRouteSchema, QRRouteSchema } from '@/lib/utils/schemas';
import { generateGuestId } from '@/lib/utils/fingerprint';
import { headers } from 'next/headers';
import { transformQRRoute } from '@/lib/utils/case-transform';
import { getServerError } from '@/lib/supabase/client';
import { QRRoute, QRRouteWithAnalytics } from '@/types/resources';

/**
 * Fetches the list of all assets for the authenticated user.
 * Uses the standard user client to enforce RLS.
 */
export async function getAssetsListAction(): Promise<QRRouteWithAnalytics[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  try {
    const { data, error } = await supabase
      .from("qr_routes")
      .select("*, qr_analytics(count)")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(getServerError(error));

    return (data as unknown[]).map((rawRoute) => {
      const route = rawRoute as Record<string, unknown> & { qr_analytics: { count: number }[] };
      const analyticsCount = route.qr_analytics?.[0]?.count || 0;
      return {
        ...(transformQRRoute(route) as Record<string, unknown>),
        analyticsCount,
      } as QRRouteWithAnalytics;
    });
  } catch (error) {
    throw new Error(getServerError(error));
  }
}

/**
 * Fetches a single asset's details by its private management token.
 * Uses service role for guest access, as guest tokens aren't natively supported by RLS.
 */
export async function getAssetAction(token: string): Promise<QRRoute> {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  const supabase = user ? authClient : createServiceRoleClient();
  const qrManager = new QRManager(supabase);

  try {
    return await qrManager.getRouteByToken(token, user?.id);
  } catch (error) {
    throw new Error(getServerError(error));
  }
}

/**
 * Creates a new QR asset.
 */
export async function createAssetAction(payload: QRRouteSchema): Promise<QRRoute> {
  const supabase = await createClient();
  const qrManager = new QRManager(supabase);
  const { data: { user } } = await supabase.auth.getUser();

  const validated = qrRouteSchema.safeParse(payload);
  if (!validated.success) throw new Error("Validation failed");

  let guestId: string | undefined;
  if (!user) {
    const headerList = await headers();
    const ip = headerList.get("x-real-ip") || headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const ua = headerList.get("user-agent") || "unknown";
    guestId = generateGuestId(ip, ua);
  }

  try {
    return await qrManager.createRoute(user?.id, {
      destinationUrl: validated.data.url,
      redirectType: validated.data.redirectType,
      design: validated.data.design,
      guestId,
      isActive: validated.data.isActive,
      expiresAt: validated.data.expiresAt,
    });
  } catch (error) {
    throw new Error(getServerError(error));
  }
}

/**
 * Updates an existing asset by its private management token.
 */
export async function updateAssetAction(token: string, payload: Partial<QRRouteSchema>): Promise<QRRoute> {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  const supabase = user ? authClient : createServiceRoleClient();
  const qrManager = new QRManager(supabase);

  try {
    return await qrManager.updateRouteByToken(token, {
      destinationUrl: payload.url,
      redirectType: payload.redirectType,
      design: payload.design,
      isActive: payload.isActive,
      expiresAt: payload.expiresAt,
    }, user?.id);
  } catch (error) {
    throw new Error(getServerError(error));
  }
}

/**
 * Deletes an existing asset by its private management token.
 */
export async function deleteAssetAction(token: string): Promise<{ success: boolean }> {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  const supabase = user ? authClient : createServiceRoleClient();
  const qrManager = new QRManager(supabase);

  try {
    await qrManager.deleteRouteByToken(token, user?.id);
    return { success: true };
  } catch (error) {
    throw new Error(getServerError(error));
  }
}
