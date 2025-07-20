import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { showToast } from '../../utils/toast';
import InputComponent from '../../components/input';
import PrimaryButton from '../../components/button/primarybutton';
import { loginUser } from '../../services/authservice';
import IMAGES from '../../constants';

type AuthStackParamList = {
  LoginScreen: undefined;
  Signup: undefined;
  HomeScreen: undefined;
  MainApp: undefined; // ✅ Add this
  Welcome: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'LoginScreen'
>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp>();

  // ✅ Form validation condition
  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    setIsLoading(true);
    const result = await loginUser(email, password);

    console.log(email, password, result, 'AAAAAAAAAAAAAAAAAAAA');
    setIsLoading(false);

    console.log('[LOGIN] result', result);

    if (result.success) {
      showToast('success', 'Logged in', 'Welcome back!');

      // Use reset so users can’t go “Back” to the login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }], // 👈 EXACT route name
      });
    } else if (result.error === 'EMAIL_NOT_CONFIRMED') {
      showToast(
        'error',
        'Please confirm your email',
        'Check your inbox for the verification link',
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
      <Text style={styles.title}>Welcome{'\n'}Back</Text>

      <InputComponent
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        // showCheck
      />

      <InputComponent
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <PrimaryButton
        title="Sign In"
        onPress={handleLogin}
        disabled={!isFormValid || isLoading}
        loading={isLoading}
        style={styles.loginButton}
        textStyle={{ color: '#FFFFFF' }}
      />

      {/* OR Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>

      {/* Social Icons */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={IMAGES.Google} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={IMAGES.Apple} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Pressable
          onPress={() =>
            navigation.navigate('WelcomeScreen', { autoOpen: 'signup' })
          }
        >
          <Text style={styles.signupLink}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginBottom: 24,
    lineHeight: 38,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 30,
    backgroundColor: '#0057FF',
    paddingVertical: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 8,
    color: '#555',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  socialBtn: {
    backgroundColor: '#f5f5f5',
    borderRadius: 32,
    padding: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#000',
  },
  signupLink: {
    color: '#0057FF',
    fontWeight: 'bold',
  },
});
