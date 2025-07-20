
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fihpgtrzpjaedeynailw.supabase.co';
const SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpaHBndHJ6cGphZWRleW5haWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDY4MTQsImV4cCI6MjA2NzA4MjgxNH0.UdyC9cA6k9YqgBiKtRglYz0T1MD4sY74KSoOMipwBwg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

