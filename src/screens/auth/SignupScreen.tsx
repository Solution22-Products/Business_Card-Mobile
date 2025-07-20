// src/screens/auth/SignupScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Linking,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import InputComponent from '../../components/input';
import PrimaryButton from '../../components/button/primarybutton';
import { AuthStackParamList } from '../../navigation/appnavigator';
import { showToast } from '../../utils/toast';
import {signUp } from '../../services/authservice';
import IMAGES from '../../constants';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
interface SignupScreenProps {
  closeSheet?: () => void; // NEW
}
const SignupScreen: React.FC<SignupScreenProps> = ({ closeSheet }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigateToLogin, setShouldNavigateToLogin] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  const isFormValid =
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword === password &&
    password.length >= 6 &&
    isChecked;

  useEffect(() => {
    if (shouldNavigateToLogin) {
      const timeout = setTimeout(() => {
        navigation.replace('LoginScreen');
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [shouldNavigateToLogin, navigation]);
  const handleSignup = async () => {
    setIsLoading(true);
    const result = await signUp(email, password);
    setIsLoading(false);
    console.log('Signup Result',result);
    if (result.success) {
      showToast('success', 'Verification email sent!', 'Check your inbox.');
      closeSheet?.();
      // setShouldNavigateToLogin(true);
    } else if (result.error === 'ALREADY_REGISTERED') {
      showToast('info', 'Already registered', 'Redirecting to login...');
      // setShouldNavigateToLogin(true);
    } else {
      showToast(
        'error',
        'Signup failed',
        result.error || 'Something went wrong',
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'transparent'} barStyle="dark-content" />
      <Text style={styles.title}>Create{'\n'}Account</Text>

      <InputComponent
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        showCheck={true}
      />
      <InputComponent
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <InputComponent
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {password && confirmPassword && password !== confirmPassword && (
        <Text style={styles.errorText}>Passwords do not match</Text>
      )}

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, isChecked && styles.checked]}
          onPress={() => setIsChecked(!isChecked)}
        >
          {isChecked && <Text style={styles.checkmark}>✔</Text>}
        </TouchableOpacity>

        <Text style={styles.checkboxText}>
          I agree to the{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('#')}>
            Terms & Conditions
          </Text>{' '}
          &{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('#')}>
            Privacy Policy
          </Text>
        </Text>
      </View>

      <PrimaryButton
        title="Sign Up"
        onPress={handleSignup}
        bgColor="#0057FF" // blue when active
        disabledBgColor="#E0E6F0" // grey while disabled
        disabled={!isFormValid || isLoading}
        loading={isLoading}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={IMAGES.Google} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Image source={IMAGES.Apple} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable
          onPress={() =>
            navigation.navigate('WelcomeScreen', { autoOpen: 'signin' })
          }
        >
          <Text style={styles.loginLink}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignupScreen;

// same styles as before
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  checkmark: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 18,
    alignSelf: 'center',
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 8,
    borderRadius: 3,
  },
  checked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  signupButton: {
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
  loginLink: {
    color: '#0057FF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});
