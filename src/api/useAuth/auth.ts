"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signOutAction, getCurrentIdentityAction } from '@/api/actions/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

/**
 * Hook to get the current user with real-time sync.
 */
export function useGetCurrentIdentity() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      return await getCurrentIdentityAction();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        queryClient.setQueryData(['auth-user'], session?.user ?? null);
        queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return query;
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
