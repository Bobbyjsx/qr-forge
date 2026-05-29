"use client";

import { useQuery } from '@tanstack/react-query';
import { getAssetAnalyticsAction } from '@/api/actions/analytics';
import { QRAnalytics, QRRoute } from '@/types/resources';

/**
 * Hook to fetch a single asset and its performance telemetry.
 */
export function useGetAssetWithAnalytics(token: string | null) {
  return useQuery<{ route: QRRoute; analytics: QRAnalytics[] }>({
    queryKey: ['qr-asset-full', token],
    queryFn: async () => {
      if (!token) throw new Error("Missing management token");
      return await getAssetAnalyticsAction(token);
    },
    enabled: !!token
  });
}
