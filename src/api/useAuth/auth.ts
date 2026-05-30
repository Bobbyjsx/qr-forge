"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signOutAction, getCurrentIdentityAction } from '@/api/actions/auth';
import { useRouter } from 'next/navigation';

/**
 * Hook to get the current user.
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
 * Hook to log out.
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
