import { supabase } from '../supabase/supabase';
import { Alert } from 'react-native';
import uuid from 'react-native-uuid';

/* ────────────────────────────────────────────────────────────── */
/* 1.  Fetch the logged‑in user’s profile row + auth email        */
/* ────────────────────────────────────────────────────────────── */
export async function getCurrentUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(fields: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('🔁 Update fields:', fields);

  const { error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', user?.id);

  if (error) throw error;
}


/* ────────────────────────────────────────────────────────────── */
/* 2.  Upsert profile row (creates row if missing, updates if any)*/
/* ────────────────────────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────── */
/* Insert profile (fails if already exists)                       */
// Insert only once
// services/profile.ts

export const insertProfileOnce = async (data: {
  full_name?: string;
  designation?: string;
  company?: string;
  address?: string;
  mobile?: string;
  email?: string;
  website?: string;
  bio?: string;
}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id, // Ensure you have RLS enabled for authenticated users
      ...data,
    }, { onConflict: 'id' }); // 'id' must be primary key

  if (error) throw error;
};
// Upsert anytime (edit/update)
export const upsertProfile = async (
  values: Partial<{ full_name: string; designation: string; avatar_url: string }>
) => {
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (!user || authErr) throw authErr ?? new Error('Not signed in');

  const updates = {
    id: user.id,
    ...values,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').upsert(updates, { onConflict: 'id' });
  if (error) throw error;
};


/* ────────────────────────────────────────────────────────────── */
/* 3.  Upload avatar and return public URL                        */
/* ────────────────────────────────────────────────────────────── */
export const uploadAvatar = async (
  uri: string,
  mimeType = 'image/jpeg',
  originalName = 'avatar.jpg'
): Promise<string> => {
  const ext = originalName.split('.').pop() || 'jpg';
  const uniqueFileName = `${uuid.v4()}.${ext}`;

  const file = {
    uri,
    name: uniqueFileName,
    type: mimeType,
  };

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(uniqueFileName, file, {
      upsert: true,
      cacheControl: '3600',
      contentType: mimeType,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(uniqueFileName);

  if (!data?.publicUrl) throw new Error('Could not get public URL');

  return data.publicUrl.trim();
};
