// App.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { supabase } from './src/supabase/supabase';
import AppNavigator from './src/navigation/appnavigator'

const linking = {
  prefixes: ['onlycard://'],
  config: { screens: { AuthCallback: 'auth' } }, // other paths if you need
};

export default function App() {
  const navRef = useNavigationContainerRef();

  useEffect(() => SplashScreen.hide(), []);

  // Deep‑link handler
  useEffect(() => {
    const handle = async (url: string | null) => {
      if (!url) return;
      const { error } = await supabase.auth.exchangeCodeForSession(url);
      if (error) console.warn('Deep‑link error:', error.message);
      else navRef.reset({ index: 0, routes: [{ name: 'MainApp' }] });
    };

    Linking.getInitialURL().then(handle);
    const sub = Linking.addEventListener('url', ({ url }) => handle(url));
    return () => sub.remove();
  }, [navRef]);

  return (
    <View style={styles.container}>
      <NavigationContainer ref={navRef} linking={linking}>
        <AppNavigator/>
      </NavigationContainer>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
