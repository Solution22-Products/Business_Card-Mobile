// services/activity.ts
import { supabase } from '../supabase/supabase';

export const getRecentActivity = async () => {
  const {
    data,
    error,
  } = await supabase
    .from('cards') // or `recent_activity` if you have a view
    .select(`
      id,
      full_name,
      card_type,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Failed to fetch recent activity:', error);
    throw error;
  }

  return data;
};
