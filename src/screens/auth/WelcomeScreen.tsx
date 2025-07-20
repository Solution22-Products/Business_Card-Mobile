import React, { useRef, useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import IMAGES from '../../constants';
import PrimaryButton from '../../components/button/primarybutton';
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';
import { useRoute } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const WelcomeScreen = () => {
  const sheetRef = useRef<RBSheet>(null);
  const [sheetType, setSheetType] = useState<'signup' | 'signin'>('signup');

  const route = useRoute();                                    // ← NEW
  // const sheetRef = useRef<RBSheet>(null);
  // const [sheetType, setSheetType] = useState<'signup' | 'signin'>('signup');

  const openSheet = (type: 'signup' | 'signin') => {
    setSheetType(type);
    sheetRef.current?.open();
  };

  const closeSheet = () => sheetRef.current?.close();

  /* ---------- AUTO‑OPEN WHEN route.params.autoOpen EXISTS ---------- */
  useEffect(() => {
    // @ts-ignore – if you don’t extend the type above
    const auto = route.params?.autoOpen as 'signup' | 'signin' | undefined;
    if (auto) openSheet(auto);
  }, [route.params]);


  // const openSheet = (type: 'signup' | 'signin') => {
  //   setSheetType(type);
  //   sheetRef.current?.open();
  // };

  // const closeSheet = () => sheetRef.current?.close();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0C53E9" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={IMAGES.Logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* White Card */}
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec semper
          condimentum risus nec tempus.
        </Text>

        <View style={styles.buttonRow}>
          <PrimaryButton
            title="Sign Up"
            onPress={() => openSheet('signup')}
            bgColor="#D8ECFF"
            width={142.5}
            height={51}
            radius={69}
            textStyle={{ color: '#040404' }}
          />
          <PrimaryButton
            title="Sign In"
            onPress={() => openSheet('signin')}
            bgColor="#0C53E9"
            textStyle={{ color: '#F5F5F5' }}
            width={142.5}
            height={51}
            radius={69}
          />
        </View>
      </View>

      {/* ─────────── BOTTOM SHEET ─────────── */}
      <RBSheet
        ref={sheetRef}
        height={sheetType === 'signup' ? SCREEN_HEIGHT : SCREEN_HEIGHT * 0.8}
        closeOnPressMask
        closeOnDragDown
        customModalProps={{
          animationType: 'slide',
        }}
        customStyles={{
          wrapper: styles.backdrop,
          container: styles.bottomSheet,
          draggableIcon: {
            backgroundColor: '#ccc',
            width: 60,
            height: 5,
            borderRadius: 2.5,
            alignSelf: 'center',
            marginTop: 8,
          },
        }}
      >
        <View style={styles.sheetHeader}>
          <TouchableOpacity onPress={closeSheet}>
            <Image source={IMAGES.Back} style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        {sheetType === 'signup' ? (
          // Full-height view — no ScrollView for SignUp
          <View style={{ flex: 1 }}>
            <SignupScreen closeSheet={closeSheet} />
          </View>
        ) : (
          // ScrollView for Sign In
          <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <LoginScreen closeSheet={closeSheet} />
          </ScrollView>
        )}
      </RBSheet>
    </View>
  );
};

export default WelcomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C53E9',
    justifyContent: 'flex-end',
  },
  logoContainer: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  logo: { width: 197, height: 100 },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: '40%',
  },
  welcomeText: { fontSize: 42, fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 14, color: '#555', marginVertical: 10 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },

  /* Bottom‑sheet */
  // backdrop: { backgroundColor: '#00000088' },
  bottomSheet: {
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  sheetHandle: { backgroundColor: '#ccc' },
  sheetTitle: { fontSize: 24, fontWeight: '600', marginBottom: 6 },
  sheetHeader: {
    marginTop: 10,
    marginBottom: 10, // reduce spacing
    alignItems: 'flex-start',
  },
  backIcon: {
    width: 40,
    height: 40,
    // tintColor: '#000', // if needed
  },
});
