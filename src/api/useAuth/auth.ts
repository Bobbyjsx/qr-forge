"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signOutAction, getCurrentIdentityAction } from '@/api/actions/auth';
import { useRouter } from 'next/navigation';

/**
 * Hook to fetch current user identity.
 */
export function useGetCurrentIdentity() {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      return await getCurrentIdentityAction();
    }
  });
}

/**
 * Hook to execute node sign-out.
 */
export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await signOutAction();
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth-user'], null);
      router.refresh();
      router.push('/');
    }
  });
}
