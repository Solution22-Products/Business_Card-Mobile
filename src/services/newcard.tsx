import { supabase } from '../supabase/supabase';

// ✅ Define the payload type for safety
interface CardPayload {
  fullName?: string;
  designation?: string;
  company?: string;
  address?: string;
  mobile?: string;
  email?: string;
  website?: string;
  bio?: string;
  card_type: 'personal' | 'business';
  has_business_card: boolean;
  profile_url?: string | null;
  cover_url?: string | null;
  company_logo_url?: string | null;
  theme?: string;
  instagram_username?: string;
  facebook_username?: string;
  linkedin_username?: string;
  twitter_username?: string;
  whatsapp_number?: string;
}

// ✅ Create a new card
export async function createCard(formData: CardPayload) {
  console.log('📥 Inserting card with data:', formData);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('🔒 User not logged in');
    throw new Error('User not logged in.');
  }

  // ✅ Let Supabase default user_id = auth.uid() (if set in DB schema)
  const { data, error } = await supabase
    .from('cards')
    .insert([{ ...formData }])
    .select()
    .single();

  if (error) {
    console.error('🛑 Supabase insert error:', error);
    throw error;
  }

  console.log('✅ Supabase insert success:', data);
  return data;
}

// ✅ Get all cards for the logged-in user
export const getUserCards = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not logged in.');
  }

  const { data, error } = await supabase
    .from('cards')
    .select(`
      id,
      full_name,
      designation,
      share_id,
      company,
      email,
      address,
      mobile,
      website,
      bio,
      card_type,
      profile_url,
      cover_url,
      company_logo_url,
      has_business_card,
      theme,
      instagram_username,
      facebook_username,
      linkedin_username,
      twitter_username,
      whatsapp_number,
      created_at  
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }); // Optional: sort newest first

  console.log("📦 Supabase cards data:", data);

  if (error) {
    console.error('🛑 Failed to fetch cards:', error);
    throw error;
  }

  return data;
};



export const updateCardById = async (id: string, payload: any) => {
  const { data, error } = await supabase
    .from('cards')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};