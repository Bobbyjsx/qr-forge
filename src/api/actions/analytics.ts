"use server";

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { QRManager } from '@/lib/core/qr-manager';
import { AnalyticsManager } from '@/lib/core/analytics-manager';
import { getServerError } from '@/lib/supabase/client';
import { QRAnalytics, QRRoute } from '@/types/resources';

/**
 * Fetches analytics for a specific asset using its management token.
 * Uses service role for guest access to support unguessable management links.
 */
export async function getAssetAnalyticsAction(token: string): Promise<{ route: QRRoute; analytics: QRAnalytics[] }> {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();

  const supabase = user ? authClient : createServiceRoleClient();
  const qrManager = new QRManager(supabase);
  const analyticsManager = new AnalyticsManager(supabase);

  try {
    const route = await qrManager.getRouteByToken(token, user?.id);
    const analytics = await analyticsManager.getAnalyticsByQrId(route.id);
    return { route, analytics };
  } catch (error) {
    throw new Error(getServerError(error));
  }
}

/**
 * Fetches global usage stats for the authenticated user.
 */
export async function getGlobalStatsAction(): Promise<{ totalScans: number }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  try {
    const { data, error } = await supabase
      .from("qr_analytics")
      .select("id", { count: 'exact' });
      // RLS policy "Owners can view analytics" handles the filtering

    if (error) throw new Error(getServerError(error));
    return { totalScans: data?.length || 0 };
  } catch (error) {
    throw new Error(getServerError(error));
  }
}
