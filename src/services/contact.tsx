import { supabase } from '../supabase/supabase';

export const getContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select(
      `
      id,
      full_name,
      email,
      mobile,
      company,
      website,
      note,
      address,
      lead_form_header,
      lead_disclaimer,
      created_at,
      card:card_id (
        id,
        profile_url,
        full_name,
        designation,
        user_id
      )
      `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error.message);
    return [];
  }

  return data;
};
