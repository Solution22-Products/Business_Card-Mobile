// AppNavigator.tsx
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import Drawertab from './drawertab';
import { supabase } from '../supabase/supabase';
import ThemeScreen from '../screens/newcardscreen';
import AboutStepScreen from '../screens/aboutscreen';
import LinkStepScreen from '../screens/linkscreen';
import LeadCaptureScreen from '../screens/leadcapture';
import AddInfoAndBioScreen from '../screens/addinfo';
import EmailScreen from '../screens/email';
import ContactDetailsScreen from '../screens/contactdetails';

export type RootStackParamList = {
  MainApp: undefined;
  WelcomeScreen: { autoOpen?: 'signup' | 'signin' } | undefined;
  Signup: undefined;
  LoginScreen: undefined;
  newcardscreen: undefined;
  aboutscreen: undefined;
  linkscreen: undefined;
  leadcapture: undefined;
  addinfo: undefined;
  email: undefined;
  editcard: undefined;
  contactdetails:undefined;
  // AuthCallback: undefined;        // 👉 NEW
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Restore session on cold start
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setIsLoggedIn(!!data.session?.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setIsLoggedIn(!!session?.user),
    );
    return () => subscription.unsubscribe();
  }, []);

  // While session is loading, you can return a splash component
  if (isLoggedIn === null) return null;

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isLoggedIn ? 'MainApp' : 'WelcomeScreen'}
    >
      <Stack.Screen name="MainApp" component={Drawertab} />
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="newcardscreen"
        component={ThemeScreen}
        options={{ title: 'Contact' }}
      />
      <Stack.Screen
        name="aboutscreen"
        component={AboutStepScreen}
        options={{ title: 'Contact' }}
      />
      <Stack.Screen
        name="linkscreen"
        component={LinkStepScreen}
        options={{ title: 'Contact' }}
      />
      <Stack.Screen
        name="leadcapture"
        component={LeadCaptureScreen}
        options={{ title: 'Contact' }}
      />
      <Stack.Screen
        name="addinfo"
        component={AddInfoAndBioScreen}
        options={{ title: 'Contact' }}
      />
      <Stack.Screen
        name="email"
        component={EmailScreen}
        options={{ title: 'Contact' }}
      />
      <Stack.Screen
        name="editcard"
        component={AddInfoAndBioScreen}
        options={{ title: 'Edit Card' }}
      />
        <Stack.Screen
        name="contactdetails"
        component={ContactDetailsScreen}
        options={{ title: 'Edit Card' }}
      />

      {/* <Stack.Screen name="AuthCallback"  component={AuthCallback} /> NEW */}
    </Stack.Navigator>
  );
}
