"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAssetsListAction,
  getAssetAction,
  createAssetAction,
  updateAssetAction,
  deleteAssetAction
} from '@/api/actions/assets';
import { QRRouteSchema } from '@/lib/utils/schemas';
import { QRRoute, QRRouteWithAnalytics } from '@/types/resources';

/**
 * Hook to fetch all assets for the current user.
 */
export function useGetAssets() {
  return useQuery<QRRouteWithAnalytics[]>({
    queryKey: ['qr-routes'],
    queryFn: async () => {
      return await getAssetsListAction();
    }
  });
}

/**
 * Hook to fetch a single asset for the editor.
 */
export function useGetAsset(token: string | null | undefined) {
  return useQuery<QRRoute | null>({
    queryKey: ['edit-asset', token],
    queryFn: async () => {
      if (!token) return null;
      return await getAssetAction(token);
    },
    enabled: !!token
  });
}

/**
 * Hook to forge a new precision asset.
 */
export function useCreateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: QRRouteSchema) => {
      return await createAssetAction(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-routes'] });
    }
  });
}

/**
 * Hook to update an existing resolution node.
 */
export function useUpdateAsset(token: string | null | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<QRRouteSchema>) => {
      if (!token) throw new Error("No token provided");
      return await updateAssetAction(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['edit-asset', token] });
      queryClient.invalidateQueries({ queryKey: ['qr-asset-full', token] });
      queryClient.invalidateQueries({ queryKey: ['qr-routes'] });
    }
  });
}

/**
 * Hook to permanently decommission a resolution node.
 */
export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      return await deleteAssetAction(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qr-routes'] });
    }
  });
}
