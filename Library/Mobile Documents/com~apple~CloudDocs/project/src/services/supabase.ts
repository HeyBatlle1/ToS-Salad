import { getSupabaseClient, signInWithEmailPassword, signOutSafely, getCurrentSession, signInWithMagicLink as clientSignInWithMagicLink } from '../../lib/supabase/client';

// Re-export the client for backward compatibility
export const supabase = getSupabaseClient();

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { session, error } = await signInWithEmailPassword({ email, password });
  if (error) throw error;
  return session?.user || null;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
};

export const signInWithMagicLink = async (email: string) => {
  const { error } = await clientSignInWithMagicLink({ email });
  if (error) throw error;
  return { success: true };
};

export const signOut = async () => {
  const { error } = await signOutSafely();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { session, error } = await getCurrentSession();
  if (error) throw error;
  return session?.user || null;
};
