"use server";

import { createClient } from '@/lib/supabase/server';
import { getServerError } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

/**
 * Signs out the current node/user.
 */
export async function signOutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(getServerError(error));
  return { success: true };
}

/**
 * Fetches current identity session.
 */
export async function getCurrentIdentityAction() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}
