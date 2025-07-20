import React,{useEffect} from 'react'
import { Linking } from 'react-native';
import { useNavigationContainerRef } from '@react-navigation/native';
import { supabase } from 'supabase/supabase';

function useSupabaseDeepLink(onAuth: () => void) {
  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;

      const { data, error } = await supabase.auth.exchangeCodeForSession(url);
      if (error) {
        console.error('Error exchanging code for session:', error.message);
      } else {
        onAuth(); // Navigate to Dashboard, etc.
      }
    };

    Linking.getInitialURL().then(handleDeepLink);
    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => sub.remove();
  }, [onAuth]);
}
