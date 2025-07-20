// src/services/authservice.ts
import { supabase } from '../supabase/supabase';

// ✅ Signup - Sends email confirmation (no manual inserts needed)
import { showToast } from '../utils/toast';

export const signUp = async ({
  email,
  password,
  closeSheet,
}: {
  email: string;
  password: string;
  closeSheet?: () => void;
}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'onlycard://auth', // Deep link or web redirect
      },
    });

    if (error) {
      console.error('Signup error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    showToast('success', 'Verification email sent!', 'Check your inbox.');
    closeSheet?.();

    return {
      success: true,
    };
  } catch (e) {
    console.error('Signup exception:', e);
    return {
      success: false,
      error: 'Something went wrong',
    };
  }
};


// ✅ Login - Manually insert profile & users_meta after login
export const loginUser = async (rawEmail: string, rawPassword: string) => {
  const email = rawEmail.trim().toLowerCase(); // ← normalise
  const password = rawPassword.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Map ‘pending confirmation’ to a clearer message
  if (error?.status === 400 && error.message === 'Invalid login credentials') {
    return { success: false, error: 'EMAIL_NOT_CONFIRMED' };
  }

  if (error) return { success: false, error: error.message };

  const user = data.user;

  // …insert into profiles/users_meta as you already do
  return { success: true, user, session: data.session };
};

// ✅ Logout
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return error ? { success: false, error: error.message } : { success: true };
};

// ✅ Session retrieval
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  // console.log('3333333333333', data);
  if (error) return { success: false, error: error.message };
  return { success: true, session: data.session };
};
